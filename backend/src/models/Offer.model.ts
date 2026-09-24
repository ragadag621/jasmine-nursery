import { Schema, model, Document, Types } from 'mongoose';
import {
  LocalizedText,
  localizedTextSchema,
  ImageRef,
  imageRefSchema,
} from './subSchemas';

export interface IOffer {
  title: LocalizedText;
  description: LocalizedText;
  image?: ImageRef;

  /**
   * Selected plants make this a group/fixed-price offer.
   * An empty array represents a general/global offer.
   */
  plants: Types.ObjectId[];

  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface IOfferDocument extends IOffer, Document {}

const offerSchema = new Schema<IOfferDocument>(
  {
    title: {
      type: localizedTextSchema,
      required: true,
    },

    description: {
      type: localizedTextSchema,
      required: true,
    },

    image: {
      type: imageRefSchema,
      required: false,
    },

    plants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
      },
    ],

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

offerSchema.index({ isActive: 1 });

export const Offer = model<IOfferDocument>('Offer', offerSchema);