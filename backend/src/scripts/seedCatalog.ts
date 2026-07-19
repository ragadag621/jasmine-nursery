import { connectDB, disconnectDB } from '../config/db';
import { Category, Plant, Gallery, Testimonial, Offer, SiteContent } from '../models';

/**
 * Seeds realistic-but-placeholder catalog data so the public site has
 * something meaningful to render during development, without ever
 * inventing real business facts (per project rules — all images point at
 * local /placeholders/ files, not real nursery photos; all copy is
 * clearly generic/placeholder where the real business content isn't
 * confirmed).
 *
 * Safe to re-run: it clears and re-creates only the collections this
 * script owns (Category/Plant/Gallery/Testimonial/Offer), never touches
 * User or Contact. Run with: npm run seed:catalog
 */

const PLACEHOLDER_PLANT_IMG = { url: '/placeholders/plant-placeholder.svg', publicId: 'placeholder', order: 0 };
const PLACEHOLDER_GALLERY_IMG = { url: '/placeholders/gallery-placeholder.svg', publicId: 'placeholder', order: 0 };
const PLACEHOLDER_CATEGORY_IMG = { url: '/placeholders/gallery-placeholder.svg', publicId: 'placeholder' };

async function seedCatalog(): Promise<void> {
  await connectDB();

  console.log('[seed] Clearing existing catalog collections...');
  await Promise.all([
    Category.deleteMany({}),
    Plant.deleteMany({}),
    Gallery.deleteMany({}),
    Testimonial.deleteMany({}),
    Offer.deleteMany({}),
  ]);

  console.log('[seed] Creating categories...');
  const categories = await Category.insertMany([
    {
      name: { he: 'צמחי בית', ar: 'نباتات داخلية' },
      slug: 'indoor-plants',
      description: { he: '[טקסט זמני] צמחים המתאימים לגידול בתוך הבית', ar: '[نص مؤقت] نباتات مناسبة للنمو داخل المنزل' },
      image: PLACEHOLDER_CATEGORY_IMG,
    },
    {
      name: { he: 'צמחי חוץ', ar: 'نباتات خارجية' },
      slug: 'outdoor-plants',
      description: { he: '[טקסט זמני] צמחים לגינה ולחצר', ar: '[نص مؤقت] نباتات للحديقة والفناء' },
      image: PLACEHOLDER_CATEGORY_IMG,
    },
    {
      name: { he: 'פרחים', ar: 'زهور' },
      slug: 'flowers',
      description: { he: '[טקסט זמני] מגוון פרחים עונתיים', ar: '[نص مؤقت] تشكيلة من الزهور الموسمية' },
      image: PLACEHOLDER_CATEGORY_IMG,
    },
    {
      name: { he: 'עצים', ar: 'أشجار' },
      slug: 'trees',
      description: { he: '[טקסט זמני] עצי נוי ופרי', ar: '[نص مؤقت] أشجار الزينة والفاكهة' },
      image: PLACEHOLDER_CATEGORY_IMG,
    },
    {
      name: { he: 'קקטוסים וצמחי בר', ar: 'صبار ونباتات عصارية' },
      slug: 'cactus',
      description: { he: '[טקסט זמני] קקטוסים וסוקולנטים', ar: '[نص مؤقت] صبار ونباتات عصارية' },
      image: PLACEHOLDER_CATEGORY_IMG,
    },
    {
      name: { he: 'עציצים ואביזרים', ar: 'أصص وإكسسوارات' },
      slug: 'pots-accessories',
      description: { he: '[טקסט זמני] עציצים בכל הגדלים והסגנונות', ar: '[نص مؤقت] أصص بجميع الأحجام والأنماط' },
      image: PLACEHOLDER_CATEGORY_IMG,
    },
  ]);

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  console.log('[seed] Creating plants...');
  await Plant.insertMany([
    {
      name: { he: 'מונסטרה דליציוזה', ar: 'مونستيرا ديليسيوسا' },
      scientificName: 'Monstera deliciosa',
      slug: 'monstera-deliciosa',
      description: {
        he: '[טקסט זמני] צמח בית פופולרי עם עלים גדולים ומחוררים',
        ar: '[نص مؤقت] نبات منزلي شهير بأوراقه الكبيرة المثقوبة',
      },
      category: categoryBySlug['indoor-plants'],
      price: 89,
      availability: 'in_stock',
      images: [PLACEHOLDER_PLANT_IMG],
      care: { water: 'medium', sunlight: 'partial_shade' },
      featured: true,
    },
    {
      name: { he: 'פיקוס לירטה', ar: 'فيكus ليراتا' },
      scientificName: 'Ficus lyrata',
      slug: 'ficus-lyrata',
      description: {
        he: '[טקסט זמני] עץ נוי פנימי עם עלים גדולים בצורת כינור',
        ar: '[نص مؤقت] شجرة زينة داخلية بأوراق كبيرة على شكل كمان',
      },
      category: categoryBySlug['indoor-plants'],
      price: 120,
      availability: 'in_stock',
      images: [PLACEHOLDER_PLANT_IMG],
      care: { water: 'medium', sunlight: 'full_sun' },
      featured: true,
    },
    {
      name: { he: 'זית נוי', ar: 'زيتون الزينة' },
      scientificName: 'Olea europaea',
      slug: 'ornamental-olive',
      description: {
        he: '[טקסט זמני] עץ זית נוי מתאים לגינה ולמרפסת',
        ar: '[نص مؤقت] شجرة زيتون زينة مناسبة للحديقة والشرفة',
      },
      category: categoryBySlug['trees'],
      price: 150,
      availability: 'in_stock',
      images: [PLACEHOLDER_PLANT_IMG],
      care: { water: 'low', sunlight: 'full_sun' },
      featured: true,
    },
    {
      name: { he: 'קקטוס אצטק', ar: 'صبار أزتيك' },
      scientificName: 'Echinocactus grusonii',
      slug: 'golden-barrel-cactus',
      description: {
        he: '[טקסט זמני] קקטוס עגול קלאסי, קל לתחזוקה',
        ar: '[نص مؤقت] صبار كروي كلاسيكي، سهل العناية',
      },
      category: categoryBySlug['cactus'],
      price: 45,
      availability: 'in_stock',
      images: [PLACEHOLDER_PLANT_IMG],
      care: { water: 'low', sunlight: 'full_sun' },
      featured: false,
    },
    {
      name: { he: 'ורד גינה', ar: 'وردة الحديقة' },
      scientificName: 'Rosa',
      slug: 'garden-rose',
      description: {
        he: '[טקסט זמני] שיח ורדים פורח במגוון צבעים',
        ar: '[نص مؤقت] شجيرة ورد مزهرة بألوان متعددة',
      },
      category: categoryBySlug['flowers'],
      price: 35,
      availability: 'low_stock',
      images: [PLACEHOLDER_PLANT_IMG],
      care: { water: 'medium', sunlight: 'full_sun' },
      featured: false,
    },
    {
      name: { he: 'עציץ קרמיקה עגול', ar: 'أصيص سيراميك دائري' },
      slug: 'ceramic-round-pot',
      description: {
        he: '[טקסט זמני] עציץ קרמיקה איכותי במגוון גדלים',
        ar: '[نص مؤقت] أصيص سيراميك عالي الجودة بأحجام متعددة',
      },
      category: categoryBySlug['pots-accessories'],
      price: 60,
      availability: 'in_stock',
      images: [PLACEHOLDER_PLANT_IMG],
      care: { water: 'low', sunlight: 'full_shade' },
      featured: false,
    },
  ]);

  console.log('[seed] Creating gallery items...');
  await Gallery.insertMany([
    {
      title: { he: 'המשתלה שלנו', ar: 'مشتلنا' },
      images: [PLACEHOLDER_GALLERY_IMG],
      category: 'nursery',
    },
    {
      title: { he: 'מגוון עציצים', ar: 'تشكيلة الأصص' },
      images: [PLACEHOLDER_GALLERY_IMG],
      category: 'nursery',
    },
    {
      title: { he: 'עיצוב גינות', ar: 'تصميم الحدائق' },
      images: [PLACEHOLDER_GALLERY_IMG],
      category: 'before-after',
    },
  ]);

  console.log('[seed] Creating testimonials...');
  await Testimonial.insertMany([
    {
      customerName: '[שם לקוח - זמני]',
      rating: 5,
      text: {
        he: '[טקסט זמני] מגוון עצום של צמחים ושירות מעולה!',
        ar: '[نص مؤقت] تشكيلة رائعة من النباتات وخدمة ممتازة!',
      },
      isVisible: true,
    },
    {
      customerName: '[שם לקוח - זמני]',
      rating: 5,
      text: {
        he: '[טקסט זמני] הצוות עוזר ומקצועי, ממליץ בחום',
        ar: '[نص مؤقت] الطاقم متعاون ومحترف، أنصح به بشدة',
      },
      isVisible: true,
    },
  ]);

  console.log('[seed] Ensuring site content singleton exists...');
  await SiteContent.getSingleton();

  console.log('[seed] Catalog seed complete.');
  await disconnectDB();
  process.exit(0);
}

seedCatalog().catch((err) => {
  console.error('[seed] Failed to seed catalog:', err);
  process.exit(1);
});
