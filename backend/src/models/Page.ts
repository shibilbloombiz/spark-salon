import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  title: string;
  slug: string;
  sections?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sections: { type: String, trim: true, default: '' },
    seoTitle: { type: String, trim: true, maxlength: 80, default: '' },
    seoDescription: { type: String, trim: true, maxlength: 200, default: '' },
    isPublished: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Page = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

