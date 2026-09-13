import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import {
  formatPrice,
  formatAvailability,
} from '@/utils/formatters';

import type { Plant } from '@/types/plant.types';

interface PlantTableProps {
  plants: Plant[];
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PlantTable({
  plants,
  onToggleVisibility,
  onDelete,
}: PlantTableProps) {
  const { t, i18n } = useTranslation();

  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <>
      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {plants.map((plant) => (
          <article
            key={plant._id}
            className="
              overflow-hidden
              rounded-xl
              border
              border-[var(--color-border)]
              bg-[var(--color-cream-50)]
              shadow-[var(--shadow-soft)]
            "
          >
            {/* Main information */}
            <div className="flex gap-3 p-4">
              <img
                src={
                  plant.images[0]?.url ||
                  '/placeholders/plant-placeholder.svg'
                }
                alt={plant.name[key]}
                loading="lazy"
                className="
                  h-20
                  w-20
                  shrink-0
                  rounded-lg
                  object-cover
                  sm:h-24
                  sm:w-24
                "
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="
                      min-w-0
                      font-display
                      text-base
                      font-medium
                      leading-snug
                      text-[var(--color-forest-800)]
                    "
                  >
                    {plant.name[key]}
                  </h3>

                  <Badge
                    variant={
                      plant.isHidden
                        ? 'neutral'
                        : 'success'
                    }
                  >
                    {plant.isHidden
                      ? t('admin.plants.table.hidden')
                      : t('admin.plants.table.visible')}
                  </Badge>
                </div>

                <p
                  dir="ltr"
                  className="
                    mt-2
                    text-base
                    font-medium
                    text-[var(--color-forest-700)]
                  "
                >
                  {formatPrice(plant.price)}
                </p>

                <p
                  className="
                    mt-1.5
                    text-xs
                    text-[var(--color-ink-600)]
                  "
                >
                  {formatAvailability(plant.availability)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div
              className="
                grid
                grid-cols-1
                gap-2
                border-t
                border-[var(--color-border)]
                bg-[var(--color-sage-100)]/40
                p-3
                sm:grid-cols-3
              "
            >
              <Link
                to={`/admin/plants/${plant._id}/edit`}
                className="w-full"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  {t('admin.plants.table.edit')}
                </Button>
              </Link>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  onToggleVisibility(plant._id)
                }
                className="w-full"
              >
                {plant.isHidden
                  ? t('admin.plants.table.show')
                  : t('admin.plants.table.hide')}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() =>
                  onDelete(plant._id)
                }
                className="w-full"
              >
                {t('admin.plants.table.delete')}
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop */}
      <div
        className="
          hidden
          overflow-x-auto
          rounded-xl
          border
          border-[var(--color-border)]
          bg-[var(--color-cream-50)]
          shadow-[var(--shadow-soft)]
          md:block
        "
      >
        <table
          className="
            w-full
            min-w-[680px]
            text-sm
          "
        >
          <thead
            className="
              bg-[var(--color-sage-100)]
              text-start
              text-[var(--color-forest-800)]
            "
          >
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-start font-medium"
              >
                {t('admin.plants.table.image')}
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-start font-medium"
              >
                {t('admin.plants.table.name')}
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-start font-medium"
              >
                {t('admin.plants.table.price')}
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-start font-medium"
              >
                {t('admin.plants.table.availability')}
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-start font-medium"
              >
                {t('admin.plants.table.status')}
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-start font-medium"
              >
                {t('admin.plants.table.actions')}
              </th>
            </tr>
          </thead>

          <tbody>
            {plants.map((plant) => (
              <tr
                key={plant._id}
                className="
                  border-t
                  border-[var(--color-border)]
                  text-[var(--color-ink-900)]
                  transition-colors
                  hover:bg-[var(--color-sage-100)]/40
                "
              >
                <td className="px-4 py-3">
                  <img
                    src={
                      plant.images[0]?.url ||
                      '/placeholders/plant-placeholder.svg'
                    }
                    alt={plant.name[key]}
                    loading="lazy"
                    className="
                      h-10
                      w-10
                      rounded-md
                      object-cover
                    "
                  />
                </td>

                <td className="px-4 py-3">
                  <span className="font-medium">
                    {plant.name[key]}
                  </span>
                </td>

                <td
                  dir="ltr"
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                  "
                >
                  {formatPrice(plant.price)}
                </td>

                <td className="px-4 py-3">
                  {formatAvailability(
                    plant.availability
                  )}
                </td>

                <td className="px-4 py-3">
                  <Badge
                    variant={
                      plant.isHidden
                        ? 'neutral'
                        : 'success'
                    }
                  >
                    {plant.isHidden
                      ? t(
                          'admin.plants.table.hidden'
                        )
                      : t(
                          'admin.plants.table.visible'
                        )}
                  </Badge>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/plants/${plant._id}/edit`}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                      >
                        {t(
                          'admin.plants.table.edit'
                        )}
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onToggleVisibility(
                          plant._id
                        )
                      }
                    >
                      {plant.isHidden
                        ? t(
                            'admin.plants.table.show'
                          )
                        : t(
                            'admin.plants.table.hide'
                          )}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        onDelete(plant._id)
                      }
                    >
                      {t(
                        'admin.plants.table.delete'
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
