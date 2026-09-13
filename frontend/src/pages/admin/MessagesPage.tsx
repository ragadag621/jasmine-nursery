import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { useFetch } from "@/hooks/useFetch"

import {
  fetchContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from "@/api/contact.api"

import type { ContactStatus } from "@/types/contact.types"

import { MessagesTable } from "@/components/admin/MessagesTable"

import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorState } from "@/components/ui/ErrorState"

import { useToast } from "@/context/ToastContext"
import { setPageMeta } from "@/utils/seo"

const STATUS_VALUES: Array<ContactStatus | undefined> = [
  undefined,
  "new",
  "read",
  "resolved",
]

export default function MessagesPage() {
  const { t } = useTranslation()

  const [statusFilter, setStatusFilter] = useState<ContactStatus | undefined>(
    undefined,
  )

  const { showToast } = useToast()

  useEffect(() => {
    setPageMeta(t("admin.messages.pageTitle"), undefined)
  }, [t])

  const { data, status, error, refetch } = useFetch(
    () =>
      fetchContactMessages({
        status: statusFilter,
        limit: 50,
      }),
    [statusFilter],
  )

  const handleStatusChange = async (id: string, newStatus: ContactStatus) => {
    try {
      await updateContactStatus(id, newStatus)

      showToast(t("admin.messages.statusUpdateSuccess"), "success")

      refetch()
    } catch {
      showToast(t("admin.messages.statusUpdateError"), "error")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.messages.deleteConfirmation"))) {
      return
    }

    try {
      await deleteContactMessage(id)

      showToast(t("admin.messages.deleteSuccess"), "success")

      refetch()
    } catch {
      showToast(t("admin.messages.deleteError"), "error")
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-5">
        <h1
          className="
            font-display
            text-xl
            leading-tight
            text-[var(--color-forest-800)]
            sm:text-2xl
          "
        >
          {t("admin.messages.pageTitle")}
        </h1>
      </div>

      <div
        className="
          mb-3
          flex
          w-full
          gap-0.5
          overflow-x-auto
          pb-1
          [-webkit-overflow-scrolling:touch]
          sm:m-4
          sm:gap-4 
        "
      >
        {STATUS_VALUES.map((statusValue) => {
          const isActive = statusFilter === statusValue

          return (
            <button
              key={statusValue ?? "all"}
              type="button"
              onClick={() => setStatusFilter(statusValue)}
              className={`
                min-h-9
                shrink-0
                rounded-full
                px-3
                text-xs
                font-medium
                transition-colors
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--color-forest-700)]
                focus:ring-offset-1
                sm:min-h-10
                sm:m-2
                sm:text-sm
                ${
                  isActive
                    ? "bg-[var(--color-forest-700)] text-white"
                    : "bg-[var(--color-sage-100)] text-[var(--color-ink-600)] hover:bg-[var(--color-sage-200)]"
                }
              `}
            >
              {statusValue
                ? t(`admin.messages.status.${statusValue}`)
                : t("admin.messages.tabs.all")}
            </button>
          )
        })}
      </div>

      {status === "loading" && (
        <Skeleton
          className="
            h-56
            w-full
            rounded-xl
            sm:h-64
          "
        />
      )}

      {status === "error" && (
        <ErrorState message={error ?? undefined} onRetry={refetch} />
      )}

      {status === "success" && (data?.messages.length ?? 0) === 0 && (
        <EmptyState title={t("admin.messages.emptyTitle")} />
      )}

      {status === "success" && data && data.messages.length > 0 && (
        <MessagesTable
          messages={data.messages}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
