import { Router, Response } from 'express';
import mongoose from 'mongoose';
import {
  Studio,
  Service,
  Artist,
  Product,
  Academy,
  Media,
  Page,
  AuditLog,
} from '../models/index.js';
import {
  StudioSchema,
  ServiceSchema,
  ArtistSchema,
  ProductSchema,
  AcademySchema,
  MediaSchema,
  PageSchema,
  formatZodErrors,
} from '../validators/schemas.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const crudRouter = Router();
crudRouter.use(requireAuth);

const MODEL_MAP: Record<string, any> = {
  studios: Studio,
  services: Service,
  artists: Artist,
  products: Product,
  academy: Academy,
  media: Media,
  pages: Page,
};

const SCHEMA_MAP: Record<string, any> = {
  studios: StudioSchema,
  services: ServiceSchema,
  artists: ArtistSchema,
  products: ProductSchema,
  academy: AcademySchema,
  media: MediaSchema,
  pages: PageSchema,
};

function getModel(collection: string) {
  const model = MODEL_MAP[collection];
  if (!model) throw new Error(`Collection '${collection}' not found.`);
  return model;
}

function getRecordLabel(item: any): string {
  return item.name || item.title || item.slug || 'Untitled';
}

/**
 * GET /api/admin/:collection
 */
crudRouter.get('/:collection', async (req: AuthRequest, res: Response): Promise<void> => {
  const collection = req.params.collection as string;
  try {
    const Model = getModel(collection);
    const { q, status, studio, stock } = req.query;

    const filter: any = {};

    // Search query
    if (q && typeof q === 'string') {
      const regex = new RegExp(q.trim(), 'i');
      if (['studios', 'services', 'academy'].includes(collection)) {
        filter.$or = [{ name: regex }, { slug: regex }];
      } else if (collection === 'artists') {
        filter.$or = [{ name: regex }, { designation: regex }, { slug: regex }];
      } else if (collection === 'products') {
        filter.$or = [{ name: regex }, { category: regex }, { slug: regex }];
      } else if (collection === 'media') {
        filter.$or = [{ title: regex }];
      } else if (collection === 'pages') {
        filter.$or = [{ title: regex }, { slug: regex }];
      }
    }

    // Status filter
    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    }

    // Studio filter for services / artists
    if (studio && studio !== 'all' && typeof studio === 'string') {
      if (collection === 'services') {
        filter.studioId = new mongoose.Types.ObjectId(studio);
      } else if (collection === 'artists') {
        filter.studioIds = new mongoose.Types.ObjectId(studio);
      }
    }

    // Stock filter for products
    if (stock && stock !== 'all' && typeof stock === 'string') {
      filter.stockStatus = stock;
    }

    let query = Model.find(filter);

    // Populate relations
    if (collection === 'services') {
      query = query.populate('studioId', 'name slug');
    } else if (collection === 'artists') {
      query = query.populate('studioIds', 'name slug');
    }

    // Sort by displayOrder or name/title
    const sortField = ['studios', 'services', 'artists', 'media', 'academy'].includes(collection)
      ? { displayOrder: 1, createdAt: -1 }
      : { createdAt: -1 };

    const items = await query.sort(sortField).lean();

    res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/admin/:collection
 */
crudRouter.post('/:collection', async (req: AuthRequest, res: Response): Promise<void> => {
  const collection = req.params.collection as string;
  try {
    const Model = getModel(collection);
    const Schema = SCHEMA_MAP[collection];

    const result = Schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: formatZodErrors(result.error) });
      return;
    }

    const payload = result.data;

    // Check slug uniqueness if collection has slug
    if (payload.slug) {
      const existing = await Model.findOne({ slug: payload.slug });
      if (existing) {
        res.status(400).json({ errors: { slug: 'Another record already uses this slug.' } });
        return;
      }
    }

    // Auto-calculate displayOrder if not provided
    if ('displayOrder' in Model.schema.paths && (payload.displayOrder === undefined || payload.displayOrder === 0)) {
      const last = await Model.findOne().sort({ displayOrder: -1 }).select('displayOrder');
      payload.displayOrder = (last?.displayOrder || 0) + 1;
    }

    const doc = new Model(payload);
    await doc.save();

    const label = getRecordLabel(doc);
    await AuditLog.create({
      action: `Added ${collection.slice(0, -1)}: ${label}`,
      collectionName: collection,
      recordId: doc._id.toString(),
      recordLabel: label,
      userEmail: req.admin?.email || 'admin@sparksalon.com',
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error: any) {
    console.error(`Error creating ${collection}:`, error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/admin/:collection/:id
 */
crudRouter.get('/:collection/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const collection = req.params.collection as string;
  const id = req.params.id as string;
  try {
    const Model = getModel(collection);
    const item = await Model.findById(id).lean();
    if (!item) {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PATCH /api/admin/:collection/:id
 */
crudRouter.patch('/:collection/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const collection = req.params.collection as string;
  const id = req.params.id as string;
  try {
    const Model = getModel(collection);
    const Schema = SCHEMA_MAP[collection];

    const result = Schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: formatZodErrors(result.error) });
      return;
    }

    const payload = result.data;

    // Check slug uniqueness
    if (payload.slug) {
      const existing = await Model.findOne({ slug: payload.slug, _id: { $ne: id } });
      if (existing) {
        res.status(400).json({ errors: { slug: 'Another record already uses this slug.' } });
        return;
      }
    }

    const doc = await Model.findByIdAndUpdate(id, payload, { new: true });
    if (!doc) {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }

    const label = getRecordLabel(doc);
    await AuditLog.create({
      action: `Updated ${collection.slice(0, -1)}: ${label}`,
      collectionName: collection,
      recordId: doc._id.toString(),
      recordLabel: label,
      userEmail: req.admin?.email || 'admin@sparksalon.com',
    });

    res.json({ success: true, data: doc });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PATCH /api/admin/:collection/:id/publish
 */
crudRouter.patch('/:collection/:id/publish', async (req: AuthRequest, res: Response): Promise<void> => {
  const collection = req.params.collection as string;
  const id = req.params.id as string;
  try {
    const Model = getModel(collection);
    const doc = await Model.findById(id);
    if (!doc) {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }

    doc.isPublished = !doc.isPublished;
    await doc.save();

    const label = getRecordLabel(doc);
    const verb = doc.isPublished ? 'Published' : 'Unpublished';
    await AuditLog.create({
      action: `${verb} ${collection.slice(0, -1)}: ${label}`,
      collectionName: collection,
      recordId: doc._id.toString(),
      recordLabel: label,
      userEmail: req.admin?.email || 'admin@sparksalon.com',
    });

    res.json({ success: true, isPublished: doc.isPublished, data: doc });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/:collection/:id
 */
crudRouter.delete('/:collection/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const collection = req.params.collection as string;
  const id = req.params.id as string;
  try {
    const Model = getModel(collection);
    const doc = await Model.findById(id);
    if (!doc) {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }

    // Business Rule: Delete Guard for Studios
    if (collection === 'studios') {
      const serviceCount = await Service.countDocuments({ studioId: id });
      if (serviceCount > 0) {
        res.status(400).json({
          error: `Move or delete the ${serviceCount} service${serviceCount > 1 ? 's' : ''} under ${doc.name} first.`,
        });
        return;
      }
    }

    const label = getRecordLabel(doc);
    await Model.findByIdAndDelete(id);

    // Cascading cleanups
    if (collection === 'studios') {
      // Remove studio from artists
      await Artist.updateMany({ studioIds: id }, { $pull: { studioIds: id } });
    }

    // Clear media references
    await Media.updateMany({ relatedType: collection, relatedId: id }, { $set: { relatedId: null } });

    await AuditLog.create({
      action: `Deleted ${collection.slice(0, -1)}: ${label}`,
      collectionName: collection,
      recordId: id,
      recordLabel: label,
      userEmail: req.admin?.email || 'admin@sparksalon.com',
    });

    res.json({ success: true, message: `Deleted ${label}` });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

