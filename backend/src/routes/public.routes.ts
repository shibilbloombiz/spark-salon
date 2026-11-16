import { Router, Request, Response } from 'express';
import {
  Studio,
  Service,
  Artist,
  Product,
  Academy,
  Media,
  Page,
  Settings,
} from '../models/index.js';

export const publicRouter = Router();

/**
 * GET /api/studios
 * Return all published studios
 */
publicRouter.get('/studios', async (_req: Request, res: Response): Promise<void> => {
  try {
    const studios = await Studio.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, count: studios.length, data: studios });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studios/:slug
 * Return a single studio with its published services, artists, and media
 */
publicRouter.get('/studios/:slug', async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  try {
    const studio = (await Studio.findOne({ slug, isPublished: true }).lean()) as any;
    if (!studio) {
      res.status(404).json({ error: `Studio '${slug}' not found or not published.` });
      return;
    }

    // Fetch related published services
    const rawServices = (await Service.find({ studioId: studio._id, isPublished: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean()) as any[];

    // Also resolve any published Media items linked directly to these services
    const serviceIds = rawServices.map((sv) => sv._id);
    const serviceMedia = serviceIds.length
      ? ((await Media.find({
          relatedType: 'services',
          relatedId: { $in: serviceIds },
          isPublished: true,
        })
          .sort({ displayOrder: 1, createdAt: 1 })
          .lean()) as any[])
      : [];

    const mediaByServiceId = new Map<string, any[]>();
    for (const m of serviceMedia) {
      const k = String(m.relatedId);
      if (!mediaByServiceId.has(k)) mediaByServiceId.set(k, []);
      mediaByServiceId.get(k)!.push(m);
    }

    const services = rawServices.map((sv) => {
      const linked = mediaByServiceId.get(String(sv._id)) || [];
      const linkedVideo = linked.find((m) => m.mediaType === 'video')?.mediaUrl || '';
      const linkedImage =
        linked.find((m) => m.mediaType === 'image')?.mediaUrl ||
        linked.find((m) => m.thumbnailUrl)?.thumbnailUrl ||
        '';
      return {
        ...sv,
        videoUrl: sv.videoUrl || linkedVideo || '',
        images: Array.isArray(sv.images) && sv.images.length > 0 ? sv.images : linkedImage ? [linkedImage] : [],
      };
    });

    // Fetch related published artists
    const artists = await Artist.find({ studioIds: studio._id, isPublished: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    // Fetch related published studio media
    const media = await Media.find({
      relatedType: 'studios',
      relatedId: studio._id,
      isPublished: true,
    })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      studio,
      services,
      artists,
      media,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studios/:studioSlug/services
 */
publicRouter.get('/studios/:studioSlug/services', async (req: Request, res: Response): Promise<void> => {
  const { studioSlug } = req.params;
  try {
    const studio = await Studio.findOne({ slug: studioSlug, isPublished: true });
    if (!studio) {
      res.status(404).json({ error: `Studio '${studioSlug}' not found.` });
      return;
    }

    const services = await Service.find({ studioId: studio._id, isPublished: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    res.json({ success: true, count: services.length, data: services });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/services
 */
publicRouter.get('/services', async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isPublished: true })
      .populate('studioId', 'name slug')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, count: services.length, data: services });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/artists
 */
publicRouter.get('/artists', async (_req: Request, res: Response): Promise<void> => {
  try {
    const artists = await Artist.find({ isPublished: true })
      .populate('studioIds', 'name slug')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, count: artists.length, data: artists });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/artists/:slug
 */
publicRouter.get('/artists/:slug', async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  try {
    const artist = await Artist.findOne({ slug, isPublished: true })
      .populate('studioIds', 'name slug')
      .lean();
    if (!artist) {
      res.status(404).json({ error: `Artist '${slug}' not found.` });
      return;
    }
    res.json({ success: true, data: artist });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/products
 */
publicRouter.get('/products', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured } = req.query;
    const filter: any = { isPublished: true };

    if (category && category !== 'all' && typeof category === 'string') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const products = await Product.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();

    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/products/:slug
 */
publicRouter.get('/products/:slug', async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug, isPublished: true }).lean();
    if (!product) {
      res.status(404).json({ error: `Product '${slug}' not found.` });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/academy
 * Return all published academy courses
 */
publicRouter.get('/academy', async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Academy.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({
      success: true,
      count: courses.length,
      data: courses,
      courses,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/academy/:slug
 * Return a specific published academy course
 */
publicRouter.get('/academy/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawSlug = req.params.slug;
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '').toLowerCase();
    const course = await Academy.findOne({
      slug,
      isPublished: true,
    }).lean();
    if (!course) {
      res.status(404).json({ error: 'Academy course not found.' });
      return;
    }
    res.json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/media
 */
publicRouter.get('/media', async (req: Request, res: Response): Promise<void> => {
  try {
    const { relatedType, relatedId } = req.query;
    const filter: any = { isPublished: true };

    if (relatedType && typeof relatedType === 'string') {
      filter.relatedType = relatedType;
    }
    if (relatedId && typeof relatedId === 'string') {
      filter.relatedId = relatedId;
    }

    const media = await Media.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    res.json({ success: true, count: media.length, data: media });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pages/:slug
 */
publicRouter.get('/pages/:slug', async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  try {
    const page = await Page.findOne({ slug, isPublished: true }).lean();
    if (!page) {
      res.status(404).json({ error: `Page '${slug}' not found.` });
      return;
    }
    res.json({ success: true, data: page });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/settings
 */
publicRouter.get('/settings', async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = (await Settings.create({
        siteName: 'Byju Spark Saloon International',
        logoUrl: '',
        phone: '+91 8543097899',
        whatsappNumber: '918543097899',
        email: 'byjuspark@gmail.com',
        address: 'Mavoor Rd, Kottooli, Kozhikode, Kerala 673016',
        openingHours: 'Mon - Sun, 09am - 09 pm',
        instagram: 'https://instagram.com/byjuspark',
        facebook: 'https://facebook.com/byjuspark',
        youtube: 'https://youtube.com/@byjuspark',
      })).toObject();
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
