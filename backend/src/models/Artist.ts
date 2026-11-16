import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  slug: string;
  designation?: string;
  studioIds: mongoose.Types.ObjectId[];
  specialities: string[];
  experience?: string;
  profileImage?: string;
  bio?: string;
  displayOrder: number;
  isPublished: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    designation: { type: String, trim: true, maxlength: 80, default: '' },
    studioIds: [{ type: Schema.Types.ObjectId, ref: 'Studio', required: true }],
    specialities: { type: [String], default: [] },
    experience: { type: String, trim: true, maxlength: 120, default: '' },
    profileImage: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, maxlength: 1200, default: '' },
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Artist = mongoose.models.Artist || mongoose.model<IArtist>('Artist', ArtistSchema);

