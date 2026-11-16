import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  publicId?: string; // local file key: category/filename
  relatedType?: 'studios' | 'services' | 'artists' | 'products' | 'academy' | 'gallery' | 'pages' | null;
  relatedId?: mongoose.Types.ObjectId | null;
  fileSize?: number;
  mimeType?: string;
  originalName?: string;
  displayOrder: number;
  isPublished: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image', required: true },
    mediaUrl: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, trim: true, default: '' },
    publicId: { type: String, trim: true, default: '' },
    relatedType: {
      type: String,
      enum: ['studios', 'services', 'artists', 'products', 'academy', 'gallery', 'pages', null],
      default: null,
      index: true,
    },
    relatedId: { type: Schema.Types.ObjectId, default: null, index: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, trim: true, default: '' },
    originalName: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: true },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
