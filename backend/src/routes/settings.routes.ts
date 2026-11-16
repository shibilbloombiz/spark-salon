import { Router, Response } from 'express';
import { Settings, AuditLog } from '../models/index.js';
import { SettingsSchema, formatZodErrors } from '../validators/schemas.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const settingsRouter = Router();
settingsRouter.use(requireAuth);

/**
 * GET /api/admin/settings
 */
settingsRouter.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
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
      });
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/admin/settings
 */
settingsRouter.put('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = SettingsSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: formatZodErrors(result.error) });
      return;
    }

    const payload = result.data;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(payload);
    } else {
      Object.assign(settings, payload);
    }
    await settings.save();

    await AuditLog.create({
      action: 'Website settings updated',
      collectionName: 'settings',
      recordId: settings._id.toString(),
      recordLabel: settings.siteName,
      userEmail: req.admin?.email || 'admin@sparksalon.com',
    });

    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

