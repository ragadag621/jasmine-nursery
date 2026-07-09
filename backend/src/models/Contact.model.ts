import { Schema, model, Document } from 'mongoose';

export type ContactStatus = 'new' | 'read' | 'resolved';

export interface IContact {
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: ContactStatus;
}

export interface IContactDocument extends IContact, Document {}

const contactSchema = new Schema<IContactDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

contactSchema.index({ status: 1, createdAt: -1 });

export const Contact = model<IContactDocument>('Contact', contactSchema);
