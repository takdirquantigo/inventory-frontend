import { useState } from 'react';
import { DataTable } from '@/components/common/data-table';
import columns from './components/Column';
import { Button } from '@/components/ui/button';

export default function Customer() {
  const [columnVisibility, setColumnVisibility] = useState({
    index: true,
    name: true,
    total_purchase: true,
    total_paid: true,
    total_due: true,
    twelve_kg: true,
    twentyfive_kg: true,
    thirtythree_kg: true,
    thirtyfive_kg: true,
    fourtyfive_kg: true,
    others_kg: true,
    actions: true,
  });

  return (
    <div>
      {/* Column visibility toggle */}
      <div className="flex gap-2 mb-4">
        {Object.keys(columnVisibility).map(key => (
          <Button
            key={key}
            size="sm"
            variant={columnVisibility[key] ? 'default' : 'outline'}
            onClick={() =>
              setColumnVisibility(prev => ({ ...prev, [key]: !prev[key] }))
            }
          >
            {key}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns({ setSingleData: () => {}, constHandelDelete: () => {} })}
        data={data?.data?.customers?.data ?? []}
        page={page}
        setPage={setPage}
        columnVisibility={columnVisibility}
      />
    </div>
  );
}
