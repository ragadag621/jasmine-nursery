import { Schema, model, Document } from 'mongoose';
import { LocalizedText, localizedTextSchema } from './subSchemas';

export interface ITestimonial {
  customerName: string;
  rating: number;
  text: LocalizedText;
  isVisible: boolean;
}

export interface ITestimonialDocument extends ITestimonial, Document {}

const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    customerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: localizedTextSchema, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testimonialSchema.index({ isVisible: 1 });

export const Testimonial = model<ITestimonialDocument>('Testimonial', testimonialSchema);
