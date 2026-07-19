import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent, updateSiteContent } from '@/api/content.api';
import {
  fetchAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/api/testimonials.api';
import { fetchOffers, createOffer, updateOffer, deleteOffer, buildOfferFormData } from '@/api/offers.api';
import type { OfferFormValues } from '@/components/admin/OfferForm';
import { OfferForm } from '@/components/admin/OfferForm';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';
import type { Offer, Testimonial } from '@/types/content.types';

type Tab = 'homepage' | 'offers' | 'testimonials';

export default function ContentManagerPage() {
  const [tab, setTab] = useState<Tab>('homepage');

  useEffect(() => {
    setPageMeta('ניהול תוכן האתר', undefined);
  }, []);

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl text-[var(--color-forest-800)]">ניהול תוכן האתר</h1>

      <div className="mb-6 flex gap-2 border-b border-[var(--color-sage-200)]">
        {(
          [
            { value: 'homepage', label: 'עמוד הבית' },
            { value: 'offers', label: 'מבצעים' },
            { value: 'testimonials', label: 'המלצות' },
          ] as { value: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.value
                ? 'border-[var(--color-forest-700)] text-[var(--color-forest-800)]'
                : 'border-transparent text-[var(--color-ink-600)] hover:text-[var(--color-forest-700)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'homepage' && <HomepageTab />}
      {tab === 'offers' && <OffersTab />}
      {tab === 'testimonials' && <TestimonialsTab />}
    </div>
  );
}

function HomepageTab() {
  const { data: content, status, refetch } = useFetch(fetchSiteContent, []);
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    heroTitleHe: '',
    heroTitleAr: '',
    heroSubtitleHe: '',
    heroSubtitleAr: '',
    aboutTextHe: '',
    aboutTextAr: '',
    phone: '',
    whatsapp: '',
    address: '',
    googleRating: '',
    googleReviewCount: '',
  });
  const [initialized, setInitialized] = useState(false);

  if (content && !initialized) {
    setForm({
      heroTitleHe: content.heroTitle.he,
      heroTitleAr: content.heroTitle.ar,
      heroSubtitleHe: content.heroSubtitle.he,
      heroSubtitleAr: content.heroSubtitle.ar,
      aboutTextHe: content.aboutText.he,
      aboutTextAr: content.aboutText.ar,
      phone: content.phone,
      whatsapp: content.whatsapp,
      address: content.address,
      googleRating: String(content.googleRating),
      googleReviewCount: String(content.googleReviewCount),
    });
    setInitialized(true);
  }

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('heroTitle', JSON.stringify({ he: form.heroTitleHe, ar: form.heroTitleAr }));
      formData.append('heroSubtitle', JSON.stringify({ he: form.heroSubtitleHe, ar: form.heroSubtitleAr }));
      formData.append('aboutText', JSON.stringify({ he: form.aboutTextHe, ar: form.aboutTextAr }));
      formData.append('phone', form.phone);
      formData.append('whatsapp', form.whatsapp);
      formData.append('address', form.address);
      formData.append('googleRating', form.googleRating);
      formData.append('googleReviewCount', form.googleReviewCount);
      await updateSiteContent(formData);
      showToast('התוכן עודכן בהצלחה', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'העדכון נכשל', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="כותרת ראשית (עברית)" value={form.heroTitleHe} onChange={(e) => setForm({ ...form, heroTitleHe: e.target.value })} />
        <Input label="כותרת ראשית (ערבית)" value={form.heroTitleAr} onChange={(e) => setForm({ ...form, heroTitleAr: e.target.value })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="כותרת משנה (עברית)" value={form.heroSubtitleHe} onChange={(e) => setForm({ ...form, heroSubtitleHe: e.target.value })} />
        <Input label="כותרת משנה (ערבית)" value={form.heroSubtitleAr} onChange={(e) => setForm({ ...form, heroSubtitleAr: e.target.value })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea label="טקסט אודות (עברית)" rows={3} value={form.aboutTextHe} onChange={(e) => setForm({ ...form, aboutTextHe: e.target.value })} />
        <Textarea label="טקסט אודות (ערבית)" rows={3} value={form.aboutTextAr} onChange={(e) => setForm({ ...form, aboutTextAr: e.target.value })} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="טלפון" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="וואטסאפ (עם קידומת מדינה)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
        <Input label="כתובת" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="דירוג גוגל" type="number" step="0.1" min="0" max="5" value={form.googleRating} onChange={(e) => setForm({ ...form, googleRating: e.target.value })} />
        <Input label="מספר ביקורות בגוגל" type="number" min="0" value={form.googleReviewCount} onChange={(e) => setForm({ ...form, googleReviewCount: e.target.value })} />
      </div>
      <Button onClick={handleSave} isLoading={isSubmitting} size="lg" className="self-start">
        שמירת שינויים
      </Button>
    </div>
  );
}

function OffersTab() {
  const { data: offers, status, refetch } = useFetch(() => fetchOffers(), []);
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (values: OfferFormValues, file: File | null) => {
    setIsSubmitting(true);
    try {
      await createOffer(buildOfferFormData(values, file));
      showToast('המבצע נוסף בהצלחה', 'success');
      setShowForm(false);
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'ההוספה נכשלה', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: OfferFormValues, file: File | null) => {
    if (!editingOffer) return;
    setIsSubmitting(true);
    try {
      await updateOffer(editingOffer._id, buildOfferFormData(values, file));
      showToast('המבצע עודכן בהצלחה', 'success');
      setEditingOffer(null);
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'העדכון נכשל', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את המבצע?')) return;
    try {
      await deleteOffer(id);
      showToast('המבצע נמחק', 'success');
      refetch();
    } catch {
      showToast('המחיקה נכשלה', 'error');
    }
  };

  if (status === 'loading') return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div>
      {!showForm && !editingOffer && (
        <Button onClick={() => setShowForm(true)} className="mb-6">
          + הוספת מבצע
        </Button>
      )}

      {showForm && (
        <Card className="mb-6 p-4">
          <OfferForm onSubmit={handleCreate} isSubmitting={isSubmitting} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {editingOffer && (
        <Card className="mb-6 p-4">
          <OfferForm
            initial={editingOffer}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            onCancel={() => setEditingOffer(null)}
          />
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {(offers ?? []).map((offer) => (
          <Card key={offer._id} className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <p className="font-medium text-[var(--color-forest-800)]">{offer.title.he}</p>
              <Badge variant={offer.isActive ? 'success' : 'neutral'}>
                {offer.isActive ? 'פעיל' : 'לא פעיל'}
              </Badge>
            </div>
            <p className="mb-3 text-sm text-[var(--color-ink-600)]">{offer.description.he}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditingOffer(offer)}>
                עריכה
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(offer._id)}>
                מחיקה
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const { data: testimonials, status, refetch } = useFetch(fetchAllTestimonials, []);
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (values: {
    customerName: string;
    rating: number;
    text: { he: string; ar: string };
    isVisible: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      await createTestimonial(values);
      showToast('ההמלצה נוספה בהצלחה', 'success');
      setShowForm(false);
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'ההוספה נכשלה', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: {
    customerName: string;
    rating: number;
    text: { he: string; ar: string };
    isVisible: boolean;
  }) => {
    if (!editingTestimonial) return;
    setIsSubmitting(true);
    try {
      await updateTestimonial(editingTestimonial._id, values);
      showToast('ההמלצה עודכנה בהצלחה', 'success');
      setEditingTestimonial(null);
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'העדכון נכשל', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את ההמלצה?')) return;
    try {
      await deleteTestimonial(id);
      showToast('ההמלצה נמחקה', 'success');
      refetch();
    } catch {
      showToast('המחיקה נכשלה', 'error');
    }
  };

  if (status === 'loading') return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div>
      {!showForm && !editingTestimonial && (
        <Button onClick={() => setShowForm(true)} className="mb-6">
          + הוספת המלצה
        </Button>
      )}

      {showForm && (
        <Card className="mb-6 p-4">
          <TestimonialForm onSubmit={handleCreate} isSubmitting={isSubmitting} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {editingTestimonial && (
        <Card className="mb-6 p-4">
          <TestimonialForm
            initial={editingTestimonial}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            onCancel={() => setEditingTestimonial(null)}
          />
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {(testimonials ?? []).map((t) => (
          <Card key={t._id} className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <p className="font-medium text-[var(--color-forest-800)]">{t.customerName}</p>
              <Badge variant={t.isVisible ? 'success' : 'neutral'}>
                {t.isVisible ? 'גלוי' : 'מוסתר'}
              </Badge>
            </div>
            <p className="mb-3 text-sm text-[var(--color-ink-600)]">{t.text.he}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditingTestimonial(t)}>
                עריכה
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(t._id)}>
                מחיקה
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
