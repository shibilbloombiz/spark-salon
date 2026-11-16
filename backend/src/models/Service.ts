import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceSubType {
  name: string;
  description?: string;
  duration?: string;
  price?: number | string;
  image?: string;
}

export interface IService extends Document {
  studioId: mongoose.Types.ObjectId;
  category?: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  videoUrl?: string;
  duration?: string;
  price?: number | string;
  benefits?: string[];
  subTypes?: IServiceSubType[];
  displayOrder: number;
  isPublished: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSubTypeSchema = new Schema<IServiceSubType>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 600, default: '' },
    duration: { type: String, trim: true, default: '' },
    price: { type: Schema.Types.Mixed, default: null },
    image: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const ServiceSchema = new Schema<IService>(
  {
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    category: { type: String, trim: true, maxlength: 80, default: '' },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    images: { type: [String], default: [] },
    videoUrl: { type: String, trim: true, default: '' },
    duration: { type: String, trim: true, default: '' },
    price: { type: Schema.Types.Mixed, default: null },
    benefits: { type: [String], default: [] },
    subTypes: { type: [ServiceSubTypeSchema], default: [] },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

