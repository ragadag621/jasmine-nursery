import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { useFetch } from "@/hooks/useFetch"

import { fetchSiteContent, updateSiteContent } from "@/api/content.api"

import {
  fetchAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/api/testimonials.api"

import {
  fetchOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  buildOfferFormData,
} from "@/api/offers.api"

import type { OfferFormValues } from "@/components/admin/OfferForm"
import { OfferForm } from "@/components/admin/OfferForm"
import { TestimonialForm } from "@/components/admin/TestimonialForm"

import { Input, Textarea } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorState } from "@/components/ui/ErrorState"
import { ImageDropzone } from "@/components/admin/ImageDropzone"

import { useToast } from "@/context/ToastContext"
import { setPageMeta } from "@/utils/seo"

import type { Offer, SiteContent, Testimonial } from "@/types/content.types"

interface TestimonialFormValues {
  customerName: string
  rating: number
  text: {
    he: string
    ar: string
  }
  isVisible: boolean
}

type Tab = "homepage" | "offers" | "testimonials"

type Language = "he" | "ar"

interface OpeningHourForm {
  day: string
  open: string
  close: string
}

interface HomepageForm {
  heroTitleHe: string
  heroTitleAr: string
  heroSubtitleHe: string
  heroSubtitleAr: string

  aboutTextHe: string
  aboutTextAr: string

  phone: string
  whatsapp: string
  address: string

  openingHours: OpeningHourForm[]

  instagram: string
  facebook: string
  tiktok: string

  googleRating: string
  googleReviewCount: string

  mapEmbedUrl: string
}

const DEFAULT_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

function createDefaultOpeningHours(): OpeningHourForm[] {
  return DEFAULT_DAYS.map((day) => ({
    day,
    open: "",
    close: "",
  }))
}

function buildHomepageForm(content: SiteContent): HomepageForm {
  return {
    heroTitleHe: content.heroTitle.he,
    heroTitleAr: content.heroTitle.ar,

    heroSubtitleHe: content.heroSubtitle.he,
    heroSubtitleAr: content.heroSubtitle.ar,

    aboutTextHe: content.aboutText.he,
    aboutTextAr: content.aboutText.ar,

    phone: content.phone,
    whatsapp: content.whatsapp,
    address: content.address,

    openingHours:
      content.openingHours?.length > 0
        ? content.openingHours.map((item) => ({
            day: item.day,
            open: item.open,
            close: item.close,
          }))
        : createDefaultOpeningHours(),

    instagram: content.socialLinks?.instagram ?? "",

    facebook: content.socialLinks?.facebook ?? "",

    tiktok: content.socialLinks?.tiktok ?? "",

    googleRating: String(content.googleRating ?? ""),

    googleReviewCount: String(content.googleReviewCount ?? ""),

    mapEmbedUrl: content.mapEmbedUrl ?? "",
  }
}

export default function ContentManagerPage() {
  const { t, i18n } = useTranslation()

  const [activeTab, setActiveTab] = useState<Tab>("homepage")

  const language: Language = i18n.language.startsWith("ar") ? "ar" : "he"

  const tabs = useMemo(
    () => [
      {
        value: "homepage" as const,
        label: t("admin.content.tabs.homepage"),
      },
      {
        value: "offers" as const,
        label: t("admin.content.tabs.offers"),
      },
      {
        value: "testimonials" as const,
        label: t("admin.content.tabs.testimonials"),
      },
    ],
    [t],
  )

  useEffect(() => {
    setPageMeta(t("admin.content.pageTitle"), undefined)
  }, [t])

  return (
    <div className="w-full min-w-0">
      {/* Page Header */}
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
          {t("admin.content.pageTitle")}
        </h1>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-[var(--color-ink-500)]
            sm:text-sm
          "
        >
          {t("admin.content.pageDescription")}
        </p>
      </div>

      {/* Tabs */}
      <div
        className="
          mb-4
          overflow-x-auto
          rounded-xl
          border
          border-[var(--color-border)]
          bg-[var(--color-sage-50)]
          p-1
          sm:mb-5
        "
      >
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`
                  min-h-9
                  rounded-lg
                  px-3
                  text-xs
                  font-medium
                  transition-colors
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--color-forest-700)]
                  focus:ring-offset-1
                  sm:min-h-10
                  sm:px-4
                  sm:text-sm
                  ${
                    isActive
                      ? "bg-white text-[var(--color-forest-800)] shadow-sm"
                      : "text-[var(--color-ink-600)] hover:bg-white/70"
                  }
                `}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === "homepage" && <HomepageTab />}

      {activeTab === "offers" && <OffersTab language={language} />}

      {activeTab === "testimonials" && <TestimonialsTab language={language} />}
    </div>
  )
}

/* =========================================================
   HOMEPAGE
========================================================= */

function HomepageTab() {
  const { t } = useTranslation()
  const { showToast } = useToast()

  const {
    data: content,
    status,
    error,
    refetch,
  } = useFetch(fetchSiteContent, [])

  const [form, setForm] = useState<HomepageForm | null>(null)

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!content) {
      return
    }

    setForm(buildHomepageForm(content))
  }, [content])

  const updateField = <K extends keyof HomepageForm>(
    field: K,
    value: HomepageForm[K],
  ) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        [field]: value,
      }
    })
  }

  const updateOpeningHour = (
    index: number,
    field: "open" | "close",
    value: string,
  ) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      const openingHours = [...current.openingHours]

      openingHours[index] = {
        ...openingHours[index],
        [field]: value,
      }

      return {
        ...current,
        openingHours,
      }
    })
  }

  const handleSave = async () => {
    if (!form) {
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      formData.append(
        "heroTitle",
        JSON.stringify({
          he: form.heroTitleHe,
          ar: form.heroTitleAr,
        }),
      )

      formData.append(
        "heroSubtitle",
        JSON.stringify({
          he: form.heroSubtitleHe,
          ar: form.heroSubtitleAr,
        }),
      )

      formData.append(
        "aboutText",
        JSON.stringify({
          he: form.aboutTextHe,
          ar: form.aboutTextAr,
        }),
      )

      formData.append("phone", form.phone)

      formData.append("whatsapp", form.whatsapp)

      formData.append("address", form.address)

      formData.append("openingHours", JSON.stringify(form.openingHours))

      formData.append(
        "socialLinks",
        JSON.stringify({
          instagram: form.instagram,
          facebook: form.facebook,
          tiktok: form.tiktok,
        }),
      )

      formData.append("googleRating", form.googleRating)

      formData.append("googleReviewCount", form.googleReviewCount)

      formData.append("mapEmbedUrl", form.mapEmbedUrl)

      if (heroImageFile) {
        formData.append("heroImage", heroImageFile)
      }

      await updateSiteContent(formData)

      showToast(t("admin.content.homepage.saveSuccess"), "success")

      setHeroImageFile(null)
      refetch()
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || t("admin.content.homepage.saveError"),
        "error",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || !form) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (status === "error") {
    return <ErrorState message={error ?? undefined} onRetry={refetch} />
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Hero */}
      <section
        className="
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-sm
        "
      >
        <SectionHeader title={t("admin.content.homepage.heroSection")} />

        <div className="space-y-4 p-3 sm:p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label={t("admin.content.homepage.heroTitleHe")}
              value={form.heroTitleHe}
              onChange={(event) =>
                updateField("heroTitleHe", event.target.value)
              }
              dir="rtl"
            />

            <Input
              label={t("admin.content.homepage.heroTitleAr")}
              value={form.heroTitleAr}
              onChange={(event) =>
                updateField("heroTitleAr", event.target.value)
              }
              dir="rtl"
            />

            <Input
              label={t("admin.content.homepage.heroSubtitleHe")}
              value={form.heroSubtitleHe}
              onChange={(event) =>
                updateField("heroSubtitleHe", event.target.value)
              }
              dir="rtl"
            />

            <Input
              label={t("admin.content.homepage.heroSubtitleAr")}
              value={form.heroSubtitleAr}
              onChange={(event) =>
                updateField("heroSubtitleAr", event.target.value)
              }
              dir="rtl"
            />
          </div>

          <div>
            <p
              className="
                mb-2
                text-xs
                font-medium
                text-[var(--color-ink-700)]
                sm:text-sm
              "
            >
              {t("admin.content.homepage.heroImage")}
            </p>

            <ImageDropzone
              multiple={false}
              onFilesSelected={(files) => setHeroImageFile(files[0] ?? null)}
              existingImages={
                content?.heroImage?.url
                  ? [
                      {
                        id: "hero",
                        url: content.heroImage.url,
                      },
                    ]
                  : []
              }
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section
        className="
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-sm
        "
      >
        <SectionHeader title={t("admin.content.homepage.aboutSection")} />

        <div className="grid gap-3 p-3 md:grid-cols-2 sm:p-4">
          <Textarea
            label={t("admin.content.homepage.aboutTextHe")}
            rows={4}
            value={form.aboutTextHe}
            onChange={(event) => updateField("aboutTextHe", event.target.value)}
            dir="rtl"
          />

          <Textarea
            label={t("admin.content.homepage.aboutTextAr")}
            rows={4}
            value={form.aboutTextAr}
            onChange={(event) => updateField("aboutTextAr", event.target.value)}
            dir="rtl"
          />
        </div>
      </section>

      {/* Contact */}
      <section
        className="
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-sm
        "
      >
        <SectionHeader title={t("admin.content.homepage.contactSection")} />

        <div className="grid gap-3 p-3 md:grid-cols-3 sm:p-4">
          <Input
            label={t("admin.content.homepage.phone")}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            dir="ltr"
          />

          <Input
            label={t("admin.content.homepage.whatsapp")}
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            dir="ltr"
          />

          <Input
            label={t("admin.content.homepage.address")}
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </div>
      </section>

      {/* Opening Hours */}
      <section
        className="
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-sm
        "
      >
        <SectionHeader
          title={t("admin.content.homepage.openingHoursSection")}
        />

        <div className="p-3 sm:p-4">
          <div className="overflow-x-auto">
            <div
              className="
                min-w-[520px]
                overflow-hidden
                rounded-lg
                border
                border-[var(--color-border)]
              "
            >
              <div
                className="
                  grid
                  grid-cols-[1.2fr_1fr_1fr]
                  border-b
                  border-[var(--color-border)]
                  bg-[var(--color-sage-50)]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-[var(--color-ink-600)]
                "
              >
                <span>{t("admin.content.homepage.day")}</span>

                <span>{t("admin.content.homepage.open")}</span>

                <span>{t("admin.content.homepage.close")}</span>
              </div>

              {form.openingHours.map((hour, index) => (
                <div
                  key={`${hour.day}-${index}`}
                  className="
                    grid
                    grid-cols-[1.2fr_1fr_1fr]
                    items-center
                    gap-2
                    border-b
                    border-[var(--color-border)]
                    px-3
                    py-2
                    last:border-b-0
                  "
                >
                  <span className="text-xs font-medium text-[var(--color-ink-800)] sm:text-sm">
                    {t(`admin.content.homepage.days.${hour.day}`)}
                  </span>

                  <TimeInput24
                    value={hour.open}
                    onChange={(value) =>
                      updateOpeningHour(index, "open", value)
                    }
                  />

                  <TimeInput24
                    value={hour.close}
                    onChange={(value) =>
                      updateOpeningHour(index, "close", value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section
        className="
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-sm
        "
      >
        <SectionHeader title={t("admin.content.homepage.socialSection")} />

        <div className="grid gap-3 p-3 md:grid-cols-3 sm:p-4">
          <Input
            label={t("admin.content.homepage.instagram")}
            value={form.instagram}
            onChange={(event) => updateField("instagram", event.target.value)}
            dir="ltr"
          />

          <Input
            label={t("admin.content.homepage.facebook")}
            value={form.facebook}
            onChange={(event) => updateField("facebook", event.target.value)}
            dir="ltr"
          />

          <Input
            label={t("admin.content.homepage.tiktok")}
            value={form.tiktok}
            onChange={(event) => updateField("tiktok", event.target.value)}
            dir="ltr"
          />
        </div>
      </section>

      {/* Google + Map */}
      <section
        className="
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-sm
        "
      >
        <SectionHeader title={t("admin.content.homepage.locationSection")} />

        <div className="space-y-3 p-3 sm:p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label={t("admin.content.homepage.googleRating")}
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.googleRating}
              onChange={(event) =>
                updateField("googleRating", event.target.value)
              }
              dir="ltr"
            />

            <Input
              label={t("admin.content.homepage.googleReviewCount")}
              type="number"
              min="0"
              value={form.googleReviewCount}
              onChange={(event) =>
                updateField("googleReviewCount", event.target.value)
              }
              dir="ltr"
            />
          </div>

          <Input
            label={t("admin.content.homepage.mapEmbedUrl")}
            value={form.mapEmbedUrl}
            onChange={(event) => updateField("mapEmbedUrl", event.target.value)}
            dir="ltr"
          />
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end pt-1">
        <Button
          onClick={handleSave}
          isLoading={isSubmitting}
          size="lg"
          className="w-full sm:w-auto"
        >
          {t("admin.content.homepage.save")}
        </Button>
      </div>
    </div>
  )
}

/* =========================================================
   OFFERS
========================================================= */

interface OffersTabProps {
  language: Language
}

function OffersTab({ language }: OffersTabProps) {
  const { t } = useTranslation()
  const { showToast } = useToast()

  const {
    data: offers,
    status,
    error,
    refetch,
  } = useFetch(() => fetchOffers(), [])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showForm, setShowForm] = useState(false)

  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)

  const handleCreate = async (values: OfferFormValues, file: File | null) => {
    setIsSubmitting(true)

    try {
      await createOffer(buildOfferFormData(values, file))

      showToast(t("admin.content.offers.createSuccess"), "success")

      setShowForm(false)
      refetch()
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || t("admin.content.offers.createError"),
        "error",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (values: OfferFormValues, file: File | null) => {
    if (!editingOffer) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateOffer(editingOffer._id, buildOfferFormData(values, file))

      showToast(t("admin.content.offers.updateSuccess"), "success")

      setEditingOffer(null)
      refetch()
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || t("admin.content.offers.updateError"),
        "error",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.content.offers.deleteConfirmation"))) {
      return
    }

    try {
      await deleteOffer(id)

      showToast(t("admin.content.offers.deleteSuccess"), "success")

      refetch()
    } catch {
      showToast(t("admin.content.offers.deleteError"), "error")
    }
  }

  if (status === "loading") {
    return <Skeleton className="h-56 w-full rounded-xl" />
  }

  if (status === "error") {
    return <ErrorState message={error ?? undefined} onRetry={refetch} />
  }

  return (
    <div>
      {!showForm && !editingOffer && (
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            {t("admin.content.offers.add")}
          </Button>
        </div>
      )}

      {showForm && (
        <Card className="mb-4 p-3 sm:p-4">
          <FormHeader title={t("admin.content.offers.addTitle")} />

          <OfferForm
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {editingOffer && (
        <Card className="mb-4 p-3 sm:p-4">
          <FormHeader title={t("admin.content.offers.editTitle")} />

          <OfferForm
            initial={editingOffer}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            onCancel={() => setEditingOffer(null)}
          />
        </Card>
      )}

      {(offers?.length ?? 0) === 0 && (
        <EmptyState
          title={t("admin.content.offers.emptyTitle")}
          description={t("admin.content.offers.emptyDescription")}
        />
      )}

      {offers && offers.length > 0 && (
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[var(--color-border)]
            bg-white
            shadow-sm
          "
        >
          {offers.map((offer) => {
            const title = offer.title[language]

            const description = offer.description[language]

            return (
              <div
                key={offer._id}
                className="
                  grid
                  gap-3
                  border-b
                  border-[var(--color-border)]
                  p-3
                  last:border-b-0
                  sm:grid-cols-[80px_1fr_auto]
                  sm:items-center
                  sm:p-4
                "
              >
                {offer.image?.url ? (
                  <img
                    src={offer.image.url}
                    alt={title}
                    className="
                      h-16
                      w-20
                      rounded-lg
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      h-16
                      w-20
                      rounded-lg
                      bg-[var(--color-sage-100)]
                    "
                  />
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words text-sm font-semibold text-[var(--color-forest-800)]">
                      {title}
                    </p>

                    <Badge variant={offer.isActive ? "success" : "neutral"}>
                      {offer.isActive
                        ? t("admin.content.offers.active")
                        : t("admin.content.offers.inactive")}
                    </Badge>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-ink-600)]">
                    {description}
                  </p>

                  {(offer.startDate || offer.endDate) && (
                    <p
                      className="mt-1 text-[11px] text-[var(--color-ink-500)]"
                      dir="ltr"
                    >
                      {offer.startDate
                        ? new Date(offer.startDate).toLocaleDateString("en-GB")
                        : "—"}

                      {" → "}

                      {offer.endDate
                        ? new Date(offer.endDate).toLocaleDateString("en-GB")
                        : "—"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingOffer(offer)}
                  >
                    {t("admin.content.offers.edit")}
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(offer._id)}
                  >
                    {t("admin.content.offers.delete")}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   TESTIMONIALS
========================================================= */

interface TestimonialsTabProps {
  language: Language
}

function TestimonialsTab({ language }: TestimonialsTabProps) {
  const { t } = useTranslation()
  const { showToast } = useToast()

  const {
    data: testimonials,
    status,
    error,
    refetch,
  } = useFetch(fetchAllTestimonials, [])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showForm, setShowForm] = useState(false)

  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null)

  const handleCreate = async (values: TestimonialFormValues) => {
    setIsSubmitting(true)

    try {
      await createTestimonial(values)

      showToast(t("admin.content.testimonials.createSuccess"), "success")

      setShowForm(false)
      refetch()
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          t("admin.content.testimonials.createError"),
        "error",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (values: TestimonialFormValues) => {
    if (!editingTestimonial) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateTestimonial(editingTestimonial._id, values)

      showToast(t("admin.content.testimonials.updateSuccess"), "success")

      setEditingTestimonial(null)
      refetch()
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          t("admin.content.testimonials.updateError"),
        "error",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.content.testimonials.deleteConfirmation"))) {
      return
    }

    try {
      await deleteTestimonial(id)

      showToast(t("admin.content.testimonials.deleteSuccess"), "success")

      refetch()
    } catch {
      showToast(t("admin.content.testimonials.deleteError"), "error")
    }
  }

  if (status === "loading") {
    return <Skeleton className="h-56 w-full rounded-xl" />
  }

  if (status === "error") {
    return <ErrorState message={error ?? undefined} onRetry={refetch} />
  }

  return (
    <div>
      {!showForm && !editingTestimonial && (
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            {t("admin.content.testimonials.add")}
          </Button>
        </div>
      )}

      {showForm && (
        <Card className="mb-4 p-3 sm:p-4">
          <FormHeader title={t("admin.content.testimonials.addTitle")} />

          <TestimonialForm
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {editingTestimonial && (
        <Card className="mb-4 p-3 sm:p-4">
          <FormHeader title={t("admin.content.testimonials.editTitle")} />

          <TestimonialForm
            initial={editingTestimonial}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            onCancel={() => setEditingTestimonial(null)}
          />
        </Card>
      )}

      {(testimonials?.length ?? 0) === 0 && (
        <EmptyState
          title={t("admin.content.testimonials.emptyTitle")}
          description={t("admin.content.testimonials.emptyDescription")}
        />
      )}

      {testimonials && testimonials.length > 0 && (
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[var(--color-border)]
            bg-white
            shadow-sm
          "
        >
          {testimonials.map((testimonial) => {
            const text = testimonial.text[language]

            return (
              <div
                key={testimonial._id}
                className="
                  grid
                  gap-3
                  border-b
                  border-[var(--color-border)]
                  p-3
                  last:border-b-0
                  sm:grid-cols-[1fr_auto]
                  sm:items-center
                  sm:p-4
                "
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words text-sm font-semibold text-[var(--color-forest-800)]">
                      {testimonial.customerName}
                    </p>

                    <Badge
                      variant={testimonial.isVisible ? "success" : "neutral"}
                    >
                      {testimonial.isVisible
                        ? t("admin.content.testimonials.visible")
                        : t("admin.content.testimonials.hidden")}
                    </Badge>
                  </div>

                  <div
                    className="
                      mt-1
                      text-xs
                      tracking-wide
                      text-[var(--color-forest-700)]
                    "
                    aria-label={t("admin.content.testimonials.ratingLabel")}
                  >
                    {"★".repeat(testimonial.rating)}
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-ink-600)]">
                    {text}
                  </p>

                  <p
                    className="mt-1 text-[11px] text-[var(--color-ink-400)]"
                    dir="ltr"
                  >
                    {new Date(testimonial.createdAt).toLocaleDateString(
                      "en-GB",
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTestimonial(testimonial)}
                  >
                    {t("admin.content.testimonials.edit")}
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(testimonial._id)}
                  >
                    {t("admin.content.testimonials.delete")}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   TIME INPUT - 24 HOUR
========================================================= */

interface TimeInput24Props {
  value: string
  onChange: (value: string) => void
}

function TimeInput24({ value, onChange }: TimeInput24Props) {
  const [hour = "", minute = ""] = value ? value.split(":") : []

  const hours = Array.from({ length: 24 }, (_, index) =>
    String(index).padStart(2, "0"),
  )

  const minutes = Array.from({ length: 60 }, (_, index) =>
    String(index).padStart(2, "0"),
  )

  const handleHourChange = (newHour: string) => {
    if (!newHour) {
      onChange("")
      return
    }

    onChange(`${newHour}:${minute || "00"}`)
  }

  const handleMinuteChange = (newMinute: string) => {
    if (!newMinute) {
      onChange("")
      return
    }

    onChange(`${hour || "00"}:${newMinute}`)
  }

  const selectClassName = `
    min-h-9
    w-full
    rounded-md
    border
    border-[var(--color-sage-300)]
    bg-white
    px-2
    text-sm
    text-[var(--color-ink-800)]
    outline-none
    focus:border-[var(--color-forest-600)]
    focus:ring-1
    focus:ring-[var(--color-forest-600)]
  `

  return (
    <div className="flex items-center gap-1" dir="ltr">
      <select
        value={hour}
        onChange={(event) => handleHourChange(event.target.value)}
        aria-label="Hour"
        className={selectClassName}
      >
        <option value="">--</option>

        {hours.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <span
        className="
          shrink-0
          text-sm
          font-medium
          text-[var(--color-ink-600)]
        "
      >
        :
      </span>

      <select
        value={minute}
        onChange={(event) => handleMinuteChange(event.target.value)}
        aria-label="Minute"
        className={selectClassName}
      >
        <option value="">--</option>

        {minutes.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}

/* =========================================================
   SMALL UI HELPERS
========================================================= */

interface SectionHeaderProps {
  title: string
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div
      className="
        border-b
        border-[var(--color-border)]
        bg-[var(--color-sage-50)]
        px-3
        py-2.5
        sm:px-4
      "
    >
      <h2
        className="
          font-display
          text-sm
          text-[var(--color-forest-800)]
          sm:text-base
        "
      >
        {title}
      </h2>
    </div>
  )
}

interface FormHeaderProps {
  title: string
}

function FormHeader({ title }: FormHeaderProps) {
  return (
    <div className="mb-4">
      <h2
        className="
          font-display
          text-base
          text-[var(--color-forest-800)]
          sm:text-lg
        "
      >
        {title}
      </h2>
    </div>
  )
}