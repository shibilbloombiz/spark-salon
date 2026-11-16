import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  uploadMiddleware,
  verifyAndFinalizeUpload,
  findFileReferences,
  deleteUploadedFile,
  ALLOWED_CATEGORIES,
} from '../services/storage.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Media } from '../models/Media.js';

export const uploadRouter = Router();
uploadRouter.use(requireAuth);

/**
 * Helper error wrapper for Multer upload handlers
 */
function handleMulterError(err: any, _req: AuthRequest, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File exceeds maximum size limit (15 MB for images, 250 MB for videos).',
      });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}

/**
 * POST /api/admin/uploads
 * Single file upload (images up to 15MB, videos up to 250MB)
 */
uploadRouter.post(
  '/',
  (req: AuthRequest, res: Response, next: NextFunction) => {
    uploadMiddleware.single('file')(req, res, (err: any) => {
      handleMulterError(err, req, res, next);
    });
  },
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file provided in the upload request.' });
        return;
      }

      const result = await verifyAndFinalizeUpload(
        req.file,
        req.body.category as string,
        req.body.title as string
      );

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Upload processing error:', error);
      res.status(400).json({ error: error.message || 'File upload failed.' });
    }
  }
);

/**
 * POST /api/admin/uploads/multi
 * Multiple files upload (up to 15 items per batch)
 */
uploadRouter.post(
  '/multi',
  (req: AuthRequest, res: Response, next: NextFunction) => {
    uploadMiddleware.array('files', 15)(req, res, (err: any) => {
      handleMulterError(err, req, res, next);
    });
  },
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ error: 'No files provided for multi-upload.' });
        return;
      }

      const category = (req.body.category as string) || 'gallery';
      const results = [];

      for (const file of files) {
        const item = await verifyAndFinalizeUpload(file, category);
        results.push(item);
      }

      res.status(201).json({
        success: true,
        count: results.length,
        files: results,
      });
    } catch (error: any) {
      console.error('Multi-upload processing error:', error);
      res.status(400).json({ error: error.message || 'Multi-upload failed.' });
    }
  }
);

/**
 * GET /api/admin/uploads/check-ref
 * Checks if a file URL is actively referenced in any website collection
 */
uploadRouter.get('/check-ref', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const url = req.query.url as string;
    if (!url) {
      res.status(400).json({ error: 'Query parameter "url" is required.' });
      return;
    }

    const references = await findFileReferences(url);
    res.json({
      success: true,
      inUse: references.length > 0,
      count: references.length,
      references,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/uploads
 * Safely removes file from local disk and Media collection.
 * Blocks deletion if file is referenced in Studio, Service, Artist, Product, Academy, or Settings,
 * unless force: true is explicitly provided.
 */
uploadRouter.delete('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { url, force } = req.body;
    if (!url) {
      res.status(400).json({ error: 'Field "url" is required for file deletion.' });
      return;
    }

    const result = await deleteUploadedFile(url, Boolean(force));
    if (!result.success && result.inUse) {
      res.status(409).json({
        success: false,
        error: 'File is currently in use across website content.',
        inUse: true,
        references: result.references,
      });
      return;
    }

    res.json({
      success: true,
      message: 'File successfully removed from server storage.',
    });
  } catch (error: any) {
    console.error('Delete upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/admin/uploads
 * Lists uploaded media items from database with category filtering and search
 */
uploadRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '24', 10)));
    const category = req.query.category as string;
    const search = req.query.search as string;

    const filter: Record<string, any> = {};
    if (category && ALLOWED_CATEGORIES.includes(category as any)) {
      filter.relatedType = category;
    }
    if (search) {
      filter.title = new RegExp(search, 'i');
    }

    const total = await Media.countDocuments(filter);
    const items = await Media.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
