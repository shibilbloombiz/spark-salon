import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademy extends Document {
  name: string;
  slug: string;
  studio: string;
  description?: string;
  duration?: string;
  level?: string;
  schedule?: string;
  fee?: string;
  learn: string[];
  includes: string[];
  bannerImage?: string;
  tone: 'black' | 'red';
  displayOrder: number;
  isPublished: boolean;
  notes?: string;
  // Legacy / facility fields for backward compatibility
  facilities?: string[];
  highlights?: string[];
  address?: string;
  contact?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AcademySchema = new Schema<IAcademy>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    studio: { type: String, trim: true, default: 'Hair', maxlength: 80 },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    duration: { type: String, trim: true, default: '4 weeks', maxlength: 60 },
    level: { type: String, trim: true, default: 'Beginner', maxlength: 60 },
    schedule: { type: String, trim: true, default: 'Monthly intake', maxlength: 100 },
    fee: { type: String, trim: true, default: 'On enquiry', maxlength: 100 },
    learn: { type: [String], default: [] },
    includes: { type: [String], default: [] },
    bannerImage: { type: String, trim: true, default: '' },
    tone: { type: String, enum: ['black', 'red'], default: 'black' },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: '' },
    // Backward compatibility fields
    facilities: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    address: { type: String, trim: true, default: '' },
    contact: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Academy = mongoose.models.Academy || mongoose.model<IAcademy>('Academy', AcademySchema);
