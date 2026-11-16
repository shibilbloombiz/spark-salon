import mongoose, { Schema, Document } from 'mongoose';

export interface IStudio extends Document {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  coverImage?: string;
  bannerImage?: string;
  servicesImage?: string;
  servicesVideo?: string;
  displayOrder: number;
  isPublished: boolean;
  accentColor?: string;
  themeHue?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudioSchema = new Schema<IStudio>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, trim: true, maxlength: 120, default: '' },
    description: { type: String, trim: true, maxlength: 1500, default: '' },
    coverImage: { type: String, trim: true, default: '' },
    bannerImage: { type: String, trim: true, default: '' },
    servicesImage: { type: String, trim: true, default: '' },
    servicesVideo: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    accentColor: { type: String, trim: true, default: '' },
    themeHue: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Studio = mongoose.models.Studio || mongoose.model<IStudio>('Studio', StudioSchema);

