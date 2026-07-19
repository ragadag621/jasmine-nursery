import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { formatWhatsAppLink } from '@/utils/formatters';

export function WhatsAppButton() {
  const { data: content } = useFetch(fetchSiteContent, []);

  const phone = content?.whatsapp || content?.phone;
  if (!phone) return null;

  return (
    <a
      href={formatWhatsAppLink(phone, 'שלום, אשמח לקבל מידע נוסף')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלחו לנו הודעה בוואטסאפ"
      className="fixed bottom-5 left-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-forest-700)] text-2xl text-white shadow-lg transition-transform hover:scale-105"
    >
      💬
    </a>
  );
}
