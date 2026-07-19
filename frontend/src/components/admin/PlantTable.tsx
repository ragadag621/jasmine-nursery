import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatAvailability } from '@/utils/formatters';
import type { Plant } from '@/types/plant.types';

interface PlantTableProps {
  plants: Plant[];
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PlantTable({ plants, onToggleVisibility, onDelete }: PlantTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-sage-200)]">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-[var(--color-sage-100)] text-right">
          <tr>
            <th className="px-4 py-3 font-medium">תמונה</th>
            <th className="px-4 py-3 font-medium">שם</th>
            <th className="px-4 py-3 font-medium">מחיר</th>
            <th className="px-4 py-3 font-medium">זמינות</th>
            <th className="px-4 py-3 font-medium">סטטוס</th>
            <th className="px-4 py-3 font-medium">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => (
            <tr key={plant._id} className="border-t border-[var(--color-sage-200)]">
              <td className="px-4 py-3">
                <img
                  src={plant.images[0]?.url || '/placeholders/plant-placeholder.svg'}
                  alt=""
                  className="h-10 w-10 rounded-md object-cover"
                />
              </td>
              <td className="px-4 py-3">{plant.name.he}</td>
              <td className="px-4 py-3">{formatPrice(plant.price)}</td>
              <td className="px-4 py-3">{formatAvailability(plant.availability)}</td>
              <td className="px-4 py-3">
                <Badge variant={plant.isHidden ? 'neutral' : 'success'}>
                  {plant.isHidden ? 'מוסתר' : 'גלוי'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link to={`/admin/plants/${plant._id}/edit`}>
                    <Button size="sm" variant="outline">
                      עריכה
                    </Button>
                  </Link>
                  <Button size="sm" variant="secondary" onClick={() => onToggleVisibility(plant._id)}>
                    {plant.isHidden ? 'הצג' : 'הסתר'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(plant._id)}>
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
