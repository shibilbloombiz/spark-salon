import { Router, Response } from 'express';
import {
  Studio,
  Service,
  Artist,
  Product,
  Academy,
  Media,
  Page,
  Settings,
  AuditLog,
} from '../models/index.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

/**
 * GET /api/admin/dashboard
 */
dashboardRouter.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      studioTotal,
      studioPub,
      serviceTotal,
      servicePub,
      artistTotal,
      artistPub,
      productTotal,
      productPub,
      academyTotal,
      academyPub,
      mediaTotal,
      mediaPub,
      pageTotal,
      pagePub,
    ] = await Promise.all([
      Studio.countDocuments(),
      Studio.countDocuments({ isPublished: true }),
      Service.countDocuments(),
      Service.countDocuments({ isPublished: true }),
      Artist.countDocuments(),
      Artist.countDocuments({ isPublished: true }),
      Product.countDocuments(),
      Product.countDocuments({ isPublished: true }),
      Academy.countDocuments(),
      Academy.countDocuments({ isPublished: true }),
      Media.countDocuments(),
      Media.countDocuments({ isPublished: true }),
      Page.countDocuments(),
      Page.countDocuments({ isPublished: true }),
    ]);

    const stats = {
      studios: { total: studioTotal, published: studioPub, draft: studioTotal - studioPub },
      services: { total: serviceTotal, published: servicePub, draft: serviceTotal - servicePub },
      artists: { total: artistTotal, published: artistPub, draft: artistTotal - artistPub },
      products: { total: productTotal, published: productPub, draft: productTotal - productPub },
      academy: { total: academyTotal, published: academyPub, draft: academyTotal - academyPub },
      media: { total: mediaTotal, published: mediaPub, draft: mediaTotal - mediaPub },
      pages: { total: pageTotal, published: pagePub, draft: pageTotal - pagePub },
    };

    // Needs attention items
    const attention: Array<{ text: string; route: string }> = [];

    // Draft counts
    Object.entries(stats).forEach(([key, val]) => {
      if (val.draft > 0) {
        attention.push({
          text: `${val.draft} draft ${key} hidden from the website`,
          route: key,
        });
      }
    });

    // Published studios with no services
    const publishedStudios = await Studio.find({ isPublished: true }).select('_id name');
    const studioServicesCount = await Service.aggregate([
      { $group: { _id: '$studioId', count: { $sum: 1 } } },
    ]);
    const studioIdsWithServices = new Set(studioServicesCount.map((s) => s._id.toString()));
    const bareStudios = publishedStudios.filter((s) => !studioIdsWithServices.has(s._id.toString()));
    if (bareStudios.length > 0) {
      attention.push({
        text: `Published studios with no services: ${bareStudios.map((s) => s.name).join(', ')}`,
        route: 'services',
      });
    }

    // Published products out of stock
    const oosCount = await Product.countDocuments({
      isPublished: true,
      stockStatus: 'Out of stock',
    });
    if (oosCount > 0) {
      attention.push({
        text: `${oosCount} published product${oosCount > 1 ? 's are' : ' is'} out of stock`,
        route: 'products',
      });
    }

    // Unlinked media items ('gallery' = Landing Page Latest Works, 'pages' = global page media)
    const unlinkedMediaCount = await Media.countDocuments({
      relatedType: { $nin: ['gallery', 'pages'] },
      $or: [{ relatedType: null }, { relatedId: null }],
    });
    if (unlinkedMediaCount > 0) {
      attention.push({
        text: `${unlinkedMediaCount} media item${unlinkedMediaCount > 1 ? 's are' : ' is'} not linked to any content`,
        route: 'media',
      });
    }

    // Incomplete website settings
    const settings = await Settings.findOne();
    if (!settings) {
      attention.push({
        text: 'Website settings incomplete: site name, phone, WhatsApp number, email, address',
        route: 'settings',
      });
    } else {
      const requiredKeys = ['siteName', 'phone', 'whatsappNumber', 'email', 'address'];
      const missingKeys = requiredKeys.filter((k) => !(settings as any)[k]);
      if (missingKeys.length > 0) {
        attention.push({
          text: `Website settings incomplete: ${missingKeys.join(', ')}`,
          route: 'settings',
        });
      }
    }

    // Recent activity from AuditLog
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(12).lean();
    const recentActivity = recentLogs.map((log: any) => ({
      id: log._id.toString(),
      text: log.action,
      at: log.createdAt,
      user: log.userEmail,
    }));

    res.json({
      success: true,
      stats,
      attention,
      recentActivity,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

