import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export default function ColumnVisibilityDropdown({ table }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left mb-4">
      {/* Dropdown button */}
      <Button onClick={() => setOpen(!open)}>
        Columns <span className="ml-1">▼</span>
      </Button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white border z-50">
          <div className="py-2 px-3">
            {table.getAllLeafColumns().map((column) => (
              <label key={column.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <Checkbox
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                />
                <span className="text-sm">{column.id}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
