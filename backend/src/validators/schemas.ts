import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const pageSlugRegex = /^(\/|[a-z0-9]+(-[a-z0-9]+)*)$/;
const whatsappRegex = /^\d{8,15}$/;

export const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  password: z.string().min(8, 'Use at least 8 characters.'),
});

export const StudioSchema = z.object({
  name: z.string().min(1, 'Required.').max(60, 'Keep this under 60 characters.').trim(),
  slug: z.string().min(1, 'Required.').regex(slugRegex, 'Lowercase letters, numbers and hyphens only.').trim().toLowerCase(),
  shortDescription: z.string().max(120, 'Keep this under 120 characters.').optional().default(''),
  description: z.string().max(1500, 'Keep this under 1500 characters.').optional().default(''),
  coverImage: z.string().optional().default(''),
  bannerImage: z.string().optional().default(''),
  servicesImage: z.string().optional().default(''),
  servicesVideo: z.string().optional().default(''),
  displayOrder: z.coerce.number().min(0, 'Must be 0 or more.').default(0),
  isPublished: z.boolean().default(false),
  accentColor: z.string().optional().default(''),
  themeHue: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

export const ServiceSubTypeSchema = z.object({
  name: z.string().min(1, 'Type name is required.').max(100, 'Keep under 100 characters.').trim(),
  description: z.string().max(600, 'Keep under 600 characters.').optional().default(''),
  duration: z.string().optional().default(''),
  price: z.union([z.number(), z.string()]).optional().nullable(),
  image: z.string().optional().default(''),
});

export const ServiceSchema = z.object({
  studioId: z.string().min(1, 'Studio selection is required. Services are always created under a studio.'),
  category: z.string().max(80, 'Keep this under 80 characters.').optional().default(''),
  name: z.string().min(1, 'Required.').max(80, 'Keep this under 80 characters.').trim(),
  slug: z.string().min(1, 'Required.').regex(slugRegex, 'Lowercase letters, numbers and hyphens only.').trim().toLowerCase(),
  description: z.string().max(1000, 'Keep this under 1000 characters.').optional().default(''),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  price: z.union([z.number(), z.string()]).optional().nullable(),
  benefits: z.array(z.string()).default([]),
  subTypes: z.array(ServiceSubTypeSchema).default([]),
  displayOrder: z.coerce.number().min(0, 'Must be 0 or more.').default(0),
  isPublished: z.boolean().default(false),
  notes: z.string().optional().default(''),
});

export const ArtistSchema = z.object({
  name: z.string().min(1, 'Required.').max(80, 'Keep this under 80 characters.').trim(),
  slug: z.string().min(1, 'Required.').regex(slugRegex, 'Lowercase letters, numbers and hyphens only.').trim().toLowerCase(),
  designation: z.string().max(80, 'Keep this under 80 characters.').optional().default(''),
  studioIds: z.array(z.string()).min(1, 'Assign at least one studio.'),
  specialities: z.array(z.string()).default([]),
  experience: z.string().max(120, 'Keep this under 120 characters.').optional().default(''),
  profileImage: z.string().optional().default(''),
  bio: z.string().max(1200, 'Keep this under 1200 characters.').optional().default(''),
  displayOrder: z.coerce.number().min(0, 'Must be 0 or more.').default(0),
  isPublished: z.boolean().default(false),
  notes: z.string().optional().default(''),
});

export const ProductSchema = z
  .object({
    name: z.string().min(1, 'Required.').max(100, 'Keep this under 100 characters.').trim(),
    slug: z.string().min(1, 'Required.').regex(slugRegex, 'Lowercase letters, numbers and hyphens only.').trim().toLowerCase(),
    category: z.string().max(60, 'Keep this under 60 characters.').optional().default(''),
    price: z.coerce.number({ invalid_type_error: 'Enter a number.' }).min(0, 'Must be 0 or more.'),
    stockStatus: z.enum(['In stock', 'Low stock', 'Out of stock']),
    stockQuantity: z.coerce.number().min(0, 'Must be 0 or more.').nullable().optional(),
    images: z.array(z.string()).default([]),
    description: z.string().max(1200, 'Keep this under 1200 characters.').optional().default(''),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(false),
    notes: z.string().optional().default(''),
  })
  .refine(
    (data) => {
      if (data.stockStatus === 'Out of stock' && data.stockQuantity && data.stockQuantity > 0) {
        return false;
      }
      return true;
    },
    {
      message: 'Set the quantity to 0 when out of stock, or change the status.',
      path: ['stockStatus'],
    }
  );

export const AcademySchema = z.object({
  name: z.string().min(1, 'Required.').max(120, 'Keep this under 120 characters.').trim(),
  slug: z.string().min(1, 'Required.').regex(slugRegex, 'Lowercase letters, numbers and hyphens only.').trim().toLowerCase(),
  studio: z.string().max(80).optional().default('Hair'),
  description: z.string().max(3000, 'Keep this under 3000 characters.').optional().default(''),
  duration: z.string().max(60).optional().default('4 weeks'),
  level: z.string().max(60).optional().default('Beginner'),
  schedule: z.string().max(100).optional().default('Monthly intake'),
  fee: z.string().max(100).optional().default('On enquiry'),
  learn: z.preprocess(
    (v) => (typeof v === 'string' ? v.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean) : v || []),
    z.array(z.string()).default([])
  ),
  includes: z.preprocess(
    (v) => (typeof v === 'string' ? v.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean) : v || []),
    z.array(z.string()).default([])
  ),
  bannerImage: z.string().optional().default(''),
  tone: z.enum(['black', 'red']).optional().default('black'),
  displayOrder: z.coerce.number().min(0).default(0),
  facilities: z.preprocess(
    (v) => (typeof v === 'string' ? v.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean) : v || []),
    z.array(z.string()).default([])
  ),
  highlights: z.preprocess(
    (v) => (typeof v === 'string' ? v.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean) : v || []),
    z.array(z.string()).default([])
  ),
  address: z.string().max(250).optional().default(''),
  contact: z.string().max(150).optional().default(''),
  isPublished: z.boolean().default(false),
  notes: z.string().optional().default(''),
});

export const MediaSchema = z.object({
  title: z.string().min(1, 'Required.').max(120, 'Keep this under 120 characters.').trim(),
  mediaType: z.enum(['image', 'video']),
  mediaUrl: z.string().min(1, 'Media URL is required.').trim(),
  thumbnailUrl: z.string().optional().default(''),
  publicId: z.string().optional().default(''),
  relatedType: z.enum(['studios', 'services', 'artists', 'products', 'academy', 'gallery']).nullable().optional(),
  relatedId: z.string().nullable().optional(),
  displayOrder: z.coerce.number().min(0, 'Must be 0 or more.').default(0),
  isPublished: z.boolean().default(false),
  notes: z.string().optional().default(''),
});

export const PageSchema = z.object({
  title: z.string().min(1, 'Required.').max(100, 'Keep this under 100 characters.').trim(),
  slug: z.string().min(1, 'Required.').regex(pageSlugRegex, 'Lowercase letters, numbers and hyphens. Use / for the home page.').trim().toLowerCase(),
  sections: z.string().optional().default(''),
  seoTitle: z.string().max(80, 'Keep this under 80 characters.').optional().default(''),
  seoDescription: z.string().max(200, 'Keep this under 200 characters.').optional().default(''),
  isPublished: z.boolean().default(false),
  notes: z.string().optional().default(''),
});

export const SettingsSchema = z.object({
  siteName: z.string().min(1, 'Required.').max(100, 'Keep this under 100 characters.').trim(),
  logoUrl: z.string().optional().default(''),
  phone: z.string().min(6, 'Enter a valid phone number.').max(25).trim(),
  whatsappNumber: z.string().regex(whatsappRegex, 'Digits only, including country code (8 to 15 digits).').trim(),
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  address: z.string().min(1, 'Required.').max(400, 'Keep this under 400 characters.').trim(),
  openingHours: z.string().max(400, 'Keep this under 400 characters.').optional().default(''),
  instagram: z.string().optional().default(''),
  facebook: z.string().optional().default(''),
  youtube: z.string().optional().default(''),
});

export function formatZodErrors(err: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  err.errors.forEach((issue) => {
    const key = issue.path[0] ? String(issue.path[0]) : '_general';
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  });
  return errors;
}

