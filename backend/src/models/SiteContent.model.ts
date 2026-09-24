import { Schema, model, Document, Model } from 'mongoose';
import { LocalizedText, localizedTextSchema, ImageRef, imageRefSchema } from './subSchemas';

export interface IOpeningHour {
  day: string;
  open: string;
  close: string;
}

const openingHourSchema = new Schema<IOpeningHour>(
  {
    day: { type: String, required: true },
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  { _id: false }
);

export interface ISiteContent {
  singletonKey?: string;
  siteName: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroImage?: ImageRef;
  logo?: ImageRef;
  aboutText: LocalizedText;
  phone: string;
  whatsapp: string;
  address: string;
  openingHours: IOpeningHour[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  googleRating: number;
  googleReviewCount: number;
  mapEmbedUrl?: string;
}

export interface ISiteContentDocument extends ISiteContent, Document {}

interface ISiteContentModel extends Model<ISiteContentDocument> {
  getSingleton(): Promise<ISiteContentDocument>;
}

/**
 * SiteContent is intentionally a SINGLETON collection — exactly one document
 * ever exists, per the approved architecture (avoids unnecessary complexity
 * for a single-location nursery). `getSingleton()` is the only way this
 * document should be read/created; controllers never call `SiteContent.find`.
 */
const siteContentSchema = new Schema<ISiteContentDocument>(
  {
    singletonKey: {
      type: String,
      unique: true,
      default: 'main',
      select: false,
    },
    siteName: {
      type: localizedTextSchema,
      required: true,
      default: { he: 'משתלת אליאסמין', ar: 'مشتل الياسمين' },
    },
    heroTitle: { type: localizedTextSchema, required: true },
    heroSubtitle: { type: localizedTextSchema, required: true },
    heroImage: { type: imageRefSchema, required: false },
    logo: { type: imageRefSchema, required: false },
    aboutText: { type: localizedTextSchema, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    address: { type: String, required: true },
    openingHours: { type: [openingHourSchema], default: [] },
    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      tiktok: { type: String },
    },
    googleRating: { type: Number, min: 0, max: 5, default: 0 },
    googleReviewCount: { type: Number, min: 0, default: 0 },
    mapEmbedUrl: { type: String },
  },
  { timestamps: true }
);

siteContentSchema.statics.getSingleton = async function (): Promise<ISiteContentDocument> {
  const defaults = {
    singletonKey: 'main',
    heroTitle: { he: 'משתלת אליאסמין', ar: 'مشتل الياسمين' },
    siteName: { he: 'משתלת אליאסמין', ar: 'مشتل الياسمين' },
    heroSubtitle: {
      he: '[טקסט זמני] מגוון עצום של צמחים, פרחים ועצים',
      ar: '[نص مؤقت] مجموعة واسعة من النباتات والزهور والأشجار',
    },
    aboutText: {
      he: '[טקסט זמני — יוחלף בתוכן אמיתי על ידי הלקוח]',
      ar: '[نص مؤقت — سيتم استبداله بمحتوى حقيقي من العميل]',
    },
    phone: '054-664-3896',
    whatsapp: '972546643896',
    address: "ג'ת, ישראל [כתובת מדויקת תתעדכן]",
    openingHours: [],
    socialLinks: {},
    googleRating: 4.6,
    googleReviewCount: 225,
  };

  const existing = await this.findOne();

  if (existing) {
    if (!existing.siteName) {
      existing.siteName = defaults.siteName;
      await existing.save();
    }

    return existing;
  }

  try {
    return await this.findOneAndUpdate(
      { singletonKey: 'main' },
      { $setOnInsert: defaults },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      const concurrentDocument = await this.findOne();

      if (concurrentDocument) {
        return concurrentDocument;
      }
    }

    throw error;
  }
};

export const SiteContent = model<ISiteContentDocument, ISiteContentModel>(
  'SiteContent',
  siteContentSchema
);
