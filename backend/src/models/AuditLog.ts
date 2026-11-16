import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  collectionName: string;
  recordId?: string;
  recordLabel?: string;
  userEmail: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, trim: true },
    collectionName: { type: String, required: true, trim: true },
    recordId: { type: String, default: '' },
    recordLabel: { type: String, default: '' },
    userEmail: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

