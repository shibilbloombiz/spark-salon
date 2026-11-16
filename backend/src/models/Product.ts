import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category?: string;
  price: number;
  stockStatus: 'In stock' | 'Low stock' | 'Out of stock';
  stockQuantity?: number | null;
  images: string[];
  description?: string;
  isFeatured: boolean;
  isPublished: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, trim: true, maxlength: 60, default: '' },
    price: { type: Number, required: true, min: 0 },
    stockStatus: {
      type: String,
      enum: ['In stock', 'Low stock', 'Out of stock'],
      default: 'In stock',
      required: true,
    },
    stockQuantity: { type: Number, default: null, min: 0 },
    images: { type: [String], default: [] },
    description: { type: String, trim: true, maxlength: 1200, default: '' },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

