import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatWhatsAppLink } from '@/utils/formatters';

import type {
  ContactMessage,
  ContactStatus,
} from '@/types/contact.types';

interface MessagesTableProps {
  messages: ContactMessage[];
  onStatusChange: (
    id: string,
    status: ContactStatus
  ) => void;
  onDelete: (id: string) => void;
}

const STATUS_VARIANT: Record<
  ContactStatus,
  'success' | 'warning' | 'neutral'
> = {
  new: 'warning',
  read: 'neutral',
  resolved: 'success',
};

export function MessagesTable({
  messages,
  onStatusChange,
  onDelete,
}: MessagesTableProps) {
  const { t } = useTranslation();

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
  };

  const renderActions = (msg: ContactMessage) => (
    <div
      className="
        flex
        items-center
        gap-1.5
        whitespace-nowrap
      "
      onClick={(event) => event.stopPropagation()}
    >
      {msg.phone.trim() && (
        <a
          href={formatWhatsAppLink(msg.phone)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-md bg-[#25D366] px-2.5 text-xs font-medium text-white transition hover:bg-[#1fb956] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        >
          {t('admin.messages.actions.whatsapp')}
        </a>
      )}

      {msg.status !== 'read' && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            onStatusChange(msg._id, 'read')
          }
          className="
            min-h-9
            shrink-0
            px-2.5
            text-xs
          "
        >
          {t('admin.messages.actions.markRead')}
        </Button>
      )}

      {msg.status !== 'resolved' && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            onStatusChange(msg._id, 'resolved')
          }
          className="
            min-h-9
            shrink-0
            px-2.5
            text-xs
          "
        >
          {t(
            'admin.messages.actions.markResolved'
          )}
        </Button>
      )}

      <Button
        size="sm"
        variant="danger"
        onClick={() => onDelete(msg._id)}
        className="
          min-h-9
          shrink-0
          px-2.5
          text-xs
        "
      >
        {t('admin.messages.actions.delete')}
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {messages.map((msg) => (
          <article
            key={msg._id}
            role="button"
            tabIndex={0}
            onClick={() => openMessage(msg)}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' ||
                event.key === ' '
              ) {
                event.preventDefault();
                openMessage(msg);
              }
            }}
            className="
              cursor-pointer
              rounded-xl
              border
              border-[var(--color-border)]
              bg-white
              p-4
              shadow-sm
              transition-colors
              hover:bg-[var(--color-sage-50)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--color-forest-700)]
              focus:ring-offset-2
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div className="min-w-0">
                <h2
                  className="
                    break-words
                    text-sm
                    font-semibold
                    text-[var(--color-ink-900)]
                  "
                >
                  {msg.name}
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[var(--color-ink-600)]
                  "
                  dir="ltr"
                >
                  {msg.phone}
                </p>
              </div>

              <Badge
                variant={STATUS_VARIANT[msg.status]}
              >
                {t(
                  `admin.messages.status.${msg.status}`
                )}
              </Badge>
            </div>

            <div
              className="
                mt-3
                rounded-lg
                border
                border-[var(--color-border)]
                bg-[var(--color-sage-50)]
                p-3
              "
            >
              <p
                className="
                  line-clamp-3
                  whitespace-pre-wrap
                  break-words
                  text-sm
                  leading-6
                  text-[var(--color-ink-700)]
                "
              >
                {msg.message}
              </p>
            </div>

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                border-t
                border-[var(--color-border)]
                pt-3
              "
            >
              <span
                className="
                  text-xs
                  text-[var(--color-ink-500)]
                "
                dir="ltr"
              >
                {formatDate(msg.createdAt)}
              </span>
            </div>

            <div
              className="mt-3"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {renderActions(msg)}
            </div>
          </article>
        ))}
      </div>

      {/* Desktop */}
      <div
        className="
          hidden
          w-full
          overflow-x-auto
          rounded-xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-sm
          md:block
        "
      >
        <table
          className="
            w-full
            min-w-[720px]
            table-fixed
            text-sm
          "
        >
          <thead
            className="
              bg-[var(--color-sage-100)]
              text-right
            "
          >
            <tr>
              <th
                className="
                  w-[14%]
                  whitespace-nowrap
                  px-3
                  py-3
                  font-medium
                  lg:px-4
                "
              >
                {t('admin.messages.table.name')}
              </th>

              <th
                className="
                  w-[13%]
                  whitespace-nowrap
                  px-3
                  py-3
                  font-medium
                  lg:px-4
                "
              >
                {t('admin.messages.table.phone')}
              </th>

              <th
                className="
                  w-[15%]
                  px-3
                  py-3
                  font-medium
                  lg:px-4
                "
              >
                {t('admin.messages.table.message')}
              </th>

              <th
                className="
                  w-[10%]
                  whitespace-nowrap
                  px-3
                  py-3
                  font-medium
                  lg:px-4
                "
              >
                {t('admin.messages.table.status')}
              </th>

              <th
                className="
                  w-[12%]
                  whitespace-nowrap
                  px-3
                  py-3
                  font-medium
                  lg:px-4
                "
              >
                {t('admin.messages.table.date')}
              </th>

              <th
                className="
                  w-[36%]
                  px-3
                  py-3
                  font-medium
                  lg:px-4
                "
              >
                {t('admin.messages.table.actions')}
              </th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg._id}
                role="button"
                tabIndex={0}
                onClick={() => openMessage(msg)}
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' ||
                    event.key === ' '
                  ) {
                    event.preventDefault();
                    openMessage(msg);
                  }
                }}
                className="
                  cursor-pointer
                  border-t
                  border-[var(--color-border)]
                  align-middle
                  transition-colors
                  hover:bg-[var(--color-sage-50)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-inset
                  focus:ring-[var(--color-forest-700)]
                "
              >
                <td
                  className="
                    px-3
                    py-3
                    lg:px-4
                  "
                >
                  <div
                    className="
                      truncate
                      font-medium
                      text-[var(--color-ink-900)]
                    "
                    title={msg.name}
                  >
                    {msg.name}
                  </div>
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-3
                    py-3
                    text-[var(--color-ink-700)]
                    lg:px-4
                  "
                  dir="ltr"
                >
                  {msg.phone}
                </td>

                <td
                  className="
                    px-3
                    py-3
                    lg:px-4
                  "
                >
                  <div
                    className="
                      max-w-[150px]
                      truncate
                      text-xs
                      text-[var(--color-ink-700)]
                    "
                    title={msg.message}
                  >
                    {msg.message}
                  </div>
                </td>

                <td
                  className="
                    px-3
                    py-3
                    lg:px-4
                  "
                >
                  <Badge
                    variant={STATUS_VARIANT[msg.status]}
                  >
                    {t(
                      `admin.messages.status.${msg.status}`
                    )}
                  </Badge>
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-3
                    py-3
                    text-xs
                    text-[var(--color-ink-600)]
                    lg:px-4
                  "
                  dir="ltr"
                >
                  {formatDate(msg.createdAt)}
                </td>

                <td
                  className="
                    px-3
                    py-3
                    lg:px-4
                  "
                >
                  {renderActions(msg)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full message modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={t('admin.messages.viewTitle')}
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div
              className="
                flex
                flex-col
                gap-3
                rounded-lg
                bg-[var(--color-sage-50)]
                p-4
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    break-words
                    text-sm
                    font-semibold
                    text-[var(--color-ink-900)]
                  "
                >
                  {selectedMessage.name}
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[var(--color-ink-600)]
                  "
                  dir="ltr"
                >
                  {selectedMessage.phone}
                </p>
              </div>

              <Badge
                variant={
                  STATUS_VARIANT[
                    selectedMessage.status
                  ]
                }
              >
                {t(
                  `admin.messages.status.${selectedMessage.status}`
                )}
              </Badge>
            </div>

            <div>
              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <p
                  className="
                    text-xs
                    font-medium
                    text-[var(--color-ink-500)]
                  "
                >
                  {t(
                    'admin.messages.table.message'
                  )}
                </p>

                <span
                  className="
                    text-xs
                    text-[var(--color-ink-500)]
                  "
                  dir="ltr"
                >
                  {formatDate(
                    selectedMessage.createdAt
                  )}
                </span>
              </div>

              <div
                className="
                  max-h-[60vh]
                  overflow-y-auto
                  rounded-lg
                  border
                  border-[var(--color-border)]
                  bg-white
                  p-4
                "
              >
                <p
                  className="
                    whitespace-pre-wrap
                    break-words
                    text-sm
                    leading-7
                    text-[var(--color-ink-800)]
                  "
                >
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}