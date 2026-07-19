import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ContactMessage, ContactStatus } from '@/types/contact.types';

interface MessagesTableProps {
  messages: ContactMessage[];
  onStatusChange: (id: string, status: ContactStatus) => void;
  onDelete: (id: string) => void;
}

const STATUS_VARIANT: Record<ContactStatus, 'success' | 'warning' | 'neutral'> = {
  new: 'warning',
  read: 'neutral',
  resolved: 'success',
};

const STATUS_LABEL: Record<ContactStatus, string> = {
  new: 'חדש',
  read: 'נקרא',
  resolved: 'טופל',
};

export function MessagesTable({ messages, onStatusChange, onDelete }: MessagesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-sage-200)]">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-[var(--color-sage-100)] text-right">
          <tr>
            <th className="px-4 py-3 font-medium">שם</th>
            <th className="px-4 py-3 font-medium">טלפון</th>
            <th className="px-4 py-3 font-medium">הודעה</th>
            <th className="px-4 py-3 font-medium">סטטוס</th>
            <th className="px-4 py-3 font-medium">תאריך</th>
            <th className="px-4 py-3 font-medium">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg._id} className="border-t border-[var(--color-sage-200)] align-top">
              <td className="px-4 py-3">{msg.name}</td>
              <td className="px-4 py-3" dir="ltr">
                {msg.phone}
              </td>
              <td className="max-w-xs px-4 py-3">
                <p className="line-clamp-2">{msg.message}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[msg.status]}>{STATUS_LABEL[msg.status]}</Badge>
              </td>
              <td className="px-4 py-3 text-xs text-[var(--color-ink-600)]">
                {new Date(msg.createdAt).toLocaleDateString('he-IL')}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {msg.status !== 'read' && (
                    <Button size="sm" variant="secondary" onClick={() => onStatusChange(msg._id, 'read')}>
                      סמן כנקרא
                    </Button>
                  )}
                  {msg.status !== 'resolved' && (
                    <Button size="sm" variant="secondary" onClick={() => onStatusChange(msg._id, 'resolved')}>
                      סמן כטופל
                    </Button>
                  )}
                  <Button size="sm" variant="danger" onClick={() => onDelete(msg._id)}>
                    מחיקה
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
