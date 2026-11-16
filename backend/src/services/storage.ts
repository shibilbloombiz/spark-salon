import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import sharp from 'sharp';
import { Media } from '../models/Media.js';
import { Studio } from '../models/Studio.js';
import { Service } from '../models/Service.js';
import { Artist } from '../models/Artist.js';
import { Product } from '../models/Product.js';
import { Academy } from '../models/Academy.js';
import { Settings } from '../models/Settings.js';

// Dedicated persistent uploads directory on local disk
export const UPLOADS_ROOT = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), 'uploads');

export const ALLOWED_CATEGORIES = [
  'studios',
  'services',
  'artists',
  'products',
  'academy',
  'gallery',
  'pages',
  'general',
] as const;

export type UploadCategory = (typeof ALLOWED_CATEGORIES)[number];

const CATEGORY_ALIASES: Record<string, UploadCategory> = {
  studio: 'studios',
  studios: 'studios',
  service: 'services',
  services: 'services',
  artist: 'artists',
  artists: 'artists',
  product: 'products',
  products: 'products',
  academy: 'academy',
  gallery: 'gallery',
  media: 'gallery',
  'media-thumbs': 'gallery',
  branding: 'pages',
  page: 'pages',
  pages: 'pages',
  general: 'general',
};

/**
 * Normalizes input category to an approved subfolder name
 */
export function sanitizeCategory(category?: string): UploadCategory {
  if (!category) return 'general';
  const clean = category.toLowerCase().trim();
  if (CATEGORY_ALIASES[clean]) {
    return CATEGORY_ALIASES[clean];
  }
  return 'general';
}

/**
 * Ensures root upload folder and all category subfolders exist
 */
export function ensureUploadDirsExist(): void {
  if (!fs.existsSync(UPLOADS_ROOT)) {
    fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
  }
  for (const cat of ALLOWED_CATEGORIES) {
    const dir = path.join(UPLOADS_ROOT, cat);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Initialise directory structure on module load
ensureUploadDirsExist();

export interface DetectedType {
  mime: string;
  ext: string;
  isImage: boolean;
  isVideo: boolean;
}

/**
 * Inspects file magic bytes (binary file signatures) to prevent file spoofing.
 * Does not trust the client-provided Content-Type header.
 */
export function detectMagicBytes(buffer: Buffer): DetectedType | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg', isImage: true, isVideo: false };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: 'image/png', ext: 'png', isImage: true, isVideo: false };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: 'image/webp', ext: 'webp', isImage: true, isVideo: false };
  }

  // AVIF: ... ftypavif / ftypavis
  if (buffer.length >= 16) {
    const ftyp = buffer.toString('latin1', 4, 12);
    if (
      ftyp.includes('ftyp') &&
      (ftyp.includes('avif') ||
        ftyp.includes('avis') ||
        buffer.toString('latin1', 8, 16).includes('avif'))
    ) {
      return { mime: 'image/avif', ext: 'avif', isImage: true, isVideo: false };
    }
  }

  // QuickTime MOV: ftypqt   or classic QuickTime atoms (moov, mdat, wide, free, skip)
  if (buffer.length >= 12) {
    const ftypBrand = buffer.toString('latin1', 4, 12);
    if (ftypBrand.includes('qt  ')) {
      return { mime: 'video/quicktime', ext: 'mov', isImage: false, isVideo: true };
    }
    const atom = buffer.toString('latin1', 4, 8);
    if (['moov', 'mdat', 'wide', 'free', 'skip'].includes(atom)) {
      return { mime: 'video/quicktime', ext: 'mov', isImage: false, isVideo: true };
    }
  }

  // MP4 / M4V / ISOM
  if (buffer.length >= 12) {
    const brand = buffer.toString('latin1', 4, 12);
    if (brand.includes('ftyp')) {
      return { mime: 'video/mp4', ext: 'mp4', isImage: false, isVideo: true };
    }
  }

  // WebM: 1A 45 DF A3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return { mime: 'video/webm', ext: 'webm', isImage: false, isVideo: true };
  }

  return null;
}

/**
 * Multer disk storage engine saving directly to backend/uploads/<category>
 */
const diskStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const category = sanitizeCategory(req.body.category as string);
    const dest = path.join(UPLOADS_ROOT, category);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const originalExt = path.extname(file.originalname).toLowerCase();
    const rawBase = path.basename(file.originalname, originalExt);
    const safeBase =
      rawBase
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48) || 'upload';

    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(6).toString('hex');
    const finalFilename = `${safeBase}-${timestamp}-${randomHex}${originalExt}`;
    cb(null, finalFilename);
  },
});

/**
 * Multer middleware with format filtering and maximum size bounds
 */
export const uploadMiddleware = multer({
  storage: diskStorage,
  limits: {
    // Upper boundary at 250MB for video; images strictly capped to 15MB in validation
    fileSize: 250 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm', '.mov'];
    if (!allowedExts.includes(ext)) {
      return cb(
        new Error(
          `Unsupported file extension '${ext}'. Allowed formats: JPG, PNG, WebP, AVIF, MP4, WebM, MOV.`
        )
      );
    }
    cb(null, true);
  },
});

export interface UploadResult {
  id?: string;
  url: string;
  key: string;
  mediaType: 'image' | 'video';
  mimeType: string;
  size: number;
  originalName: string;
  category: UploadCategory;
}

/**
 * Validates uploaded disk file against genuine magic bytes, size limits, and image decodability.
 * Registers file into MongoDB Media collection.
 */
export async function verifyAndFinalizeUpload(
  file: Express.Multer.File,
  categoryInput?: string,
  customTitle?: string
): Promise<UploadResult> {
  const category = sanitizeCategory(categoryInput);
  const filePath = file.path;

  // Read initial 512 bytes for file signature inspection
  let sampleBuffer: Buffer;
  try {
    const fd = await fs.promises.open(filePath, 'r');
    sampleBuffer = Buffer.alloc(512);
    const { bytesRead } = await fd.read(sampleBuffer, 0, 512, 0);
    await fd.close();
    sampleBuffer = sampleBuffer.subarray(0, bytesRead);
  } catch (err: any) {
    if (fs.existsSync(filePath)) await fs.promises.unlink(filePath).catch(() => {});
    throw new Error(`Failed to read uploaded file on server: ${err.message}`);
  }

  const detected = detectMagicBytes(sampleBuffer);
  if (!detected) {
    if (fs.existsSync(filePath)) await fs.promises.unlink(filePath).catch(() => {});
    throw new Error(
      'Invalid file content or signature. File must be a valid JPG, PNG, WebP, AVIF, MP4, WebM, or MOV file.'
    );
  }

  // Size limit validation
  const IMAGE_MAX_SIZE = 15 * 1024 * 1024; // 15 MB
  const VIDEO_MAX_SIZE = 250 * 1024 * 1024; // 250 MB

  if (detected.isImage && file.size > IMAGE_MAX_SIZE) {
    if (fs.existsSync(filePath)) await fs.promises.unlink(filePath).catch(() => {});
    throw new Error(`Image file exceeds maximum limit of 15 MB (received ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
  }

  if (detected.isVideo && file.size > VIDEO_MAX_SIZE) {
    if (fs.existsSync(filePath)) await fs.promises.unlink(filePath).catch(() => {});
    throw new Error(`Video file exceeds maximum limit of 250 MB (received ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
  }

  // For image files, run Sharp metadata validation to ensure data is not corrupted
  if (detected.isImage) {
    try {
      await sharp(filePath).metadata();
    } catch (sharpErr: any) {
      if (fs.existsSync(filePath)) await fs.promises.unlink(filePath).catch(() => {});
      throw new Error(`Image could not be decoded: corrupted or invalid image file (${sharpErr.message}).`);
    }
  }

  // Public URL served by backend Express and proxied by Next.js
  const publicUrl = `/uploads/${category}/${file.filename}`;
  const storageKey = `${category}/${file.filename}`;

  return {
    url: publicUrl,
    key: storageKey,
    mediaType: detected.isVideo ? 'video' : 'image',
    mimeType: detected.mime,
    size: file.size,
    originalName: file.originalname,
    category,
  };
}

export interface FileReference {
  collection: 'studios' | 'services' | 'artists' | 'products' | 'academy' | 'settings';
  id: string;
  name: string;
  field: string;
}

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Scans all collections (Studios, Services, Artists, Products, Academy, Settings)
 * to verify if a media file is referenced anywhere before deletion.
 */
export async function findFileReferences(fileUrlOrPath: string): Promise<FileReference[]> {
  const cleanedUrl = fileUrlOrPath.replace(/^https?:\/\/[^\/]+/, '').trim();
  const baseFilename = path.basename(cleanedUrl);
  if (!baseFilename) return [];

  const filenameRegex = new RegExp(escapeRegex(baseFilename), 'i');
  const refs: FileReference[] = [];

  // 1. Studios (coverImage, bannerImage)
  const studios = await Studio.find({
    $or: [{ coverImage: filenameRegex }, { bannerImage: filenameRegex }],
  })
    .select('_id name coverImage bannerImage')
    .lean();

  for (const s of studios) {
    if (s.coverImage && s.coverImage.includes(baseFilename)) {
      refs.push({ collection: 'studios', id: String(s._id), name: s.name, field: 'coverImage' });
    }
    if (s.bannerImage && s.bannerImage.includes(baseFilename)) {
      refs.push({ collection: 'studios', id: String(s._id), name: s.name, field: 'bannerImage' });
    }
  }

  // 2. Services (images array)
  const services = await Service.find({
    images: { $elemMatch: { $regex: filenameRegex } },
  })
    .select('_id name images')
    .lean();

  for (const sv of services) {
    refs.push({ collection: 'services', id: String(sv._id), name: sv.name, field: 'images' });
  }

  // 3. Artists (profileImage, portfolio)
  const artists = await Artist.find({
    $or: [
      { profileImage: filenameRegex },
      { portfolio: { $elemMatch: { $regex: filenameRegex } } },
    ],
  })
    .select('_id name profileImage')
    .lean();

  for (const a of artists) {
    if (a.profileImage && a.profileImage.includes(baseFilename)) {
      refs.push({ collection: 'artists', id: String(a._id), name: a.name, field: 'profileImage' });
    }
  }

  // 4. Products (images array)
  const products = await Product.find({
    images: { $elemMatch: { $regex: filenameRegex } },
  })
    .select('_id name images')
    .lean();

  for (const p of products) {
    refs.push({ collection: 'products', id: String(p._id), name: p.name, field: 'images' });
  }

  // 5. Academy (bannerImage)
  const academies = await Academy.find({
    bannerImage: filenameRegex,
  })
    .select('_id name bannerImage')
    .lean();

  for (const ac of academies) {
    refs.push({ collection: 'academy', id: String(ac._id), name: ac.name, field: 'bannerImage' });
  }

  // 6. Settings (logoUrl)
  const settingsList = await Settings.find({
    logoUrl: filenameRegex,
  })
    .select('_id siteName logoUrl')
    .lean();

  for (const st of settingsList) {
    refs.push({ collection: 'settings', id: String(st._id), name: st.siteName || 'Site Settings', field: 'logoUrl' });
  }

  return refs;
}

/**
 * Safely unlinks a file from local disk and deletes its Media record,
 * enforcing directory boundary constraints and reference validation.
 */
export async function deleteUploadedFile(
  fileUrlOrKey: string,
  force = false
): Promise<{ success: boolean; inUse?: boolean; references?: FileReference[] }> {
  if (!fileUrlOrKey) {
    throw new Error('File URL or key is required for deletion.');
  }

  const references = await findFileReferences(fileUrlOrKey);
  if (references.length > 0 && !force) {
    return {
      success: false,
      inUse: true,
      references,
    };
  }

  // Strip host and prefix
  const cleaned = fileUrlOrKey
    .replace(/^https?:\/\/[^\/]+/, '')
    .replace(/^\/?uploads\/?/, '');

  const resolvedRoot = path.resolve(UPLOADS_ROOT);
  const targetPath = path.resolve(resolvedRoot, cleaned);

  // Security: Prevent path traversal outside UPLOADS_ROOT
  if (!targetPath.startsWith(resolvedRoot)) {
    throw new Error('Security Error: Path traversal attempt detected.');
  }

  if (fs.existsSync(targetPath)) {
    await fs.promises.unlink(targetPath);
  }

  // Remove corresponding Media database record
  const filename = path.basename(cleaned);
  await Media.deleteMany({
    $or: [
      { mediaUrl: fileUrlOrKey },
      { mediaUrl: `/uploads/${cleaned}` },
      { publicId: cleaned },
      { mediaUrl: new RegExp(escapeRegex(filename), 'i') },
    ],
  });

  return { success: true };
}
