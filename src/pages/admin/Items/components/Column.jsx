import { Button } from '@/components/ui/button';
import { ArrowUpDown, SquarePen, Trash, Settings2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '@/config/config';

const columns = ({ setSingleData, constHandelDelete, setOpenModal }) => [
  {
    id: 'select',
    header: () => <div className="text-center">Index</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <div className="">Name</div>,
    cell: ({ row }) => <div className="">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'price',
    header: () => <div className="">Price</div>,
    cell: ({ row }) => <div>{row.getValue('price')} TK</div>,
  },
  {
    accessorKey: 'type',
    header: () => <div className="">Type</div>,
    cell: ({ row }) => {
      const v = row?.original?.is_cylinder;
      const isCylinder = v === 1 || v === true || v === '1';
      return <div>{isCylinder ? 'Cylinder' : 'Accessories'}</div>;
    },
  },
  {
    accessorKey: 'image',
    header: () => <div className="">Image</div>,
    cell: ({ row }) => {
      const src = row?.original?.image;
      return (
        <div>
          {src ? <img className="h-20 w-20 object-cover" src={`${API_URL}/${src}`} alt="" /> : null}
        </div>
      );
    },
  },

  {
    id: 'actions',
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      return (
        <div>
          <ToggleGroup variant="outline" type="single">
            <ToggleGroupItem
              value="edit"
              aria-label="Edit item"
              onClick={() => {
                setSingleData(row.original);
                setOpenModal(true);
              }}
            >
              <SquarePen className="h-4 w-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              className="cursor-pointer"
              value="delete"
              aria-label="Delete item"
              onClick={() => constHandelDelete(row.original.id)}
            >
              <Trash width={20} height={20} />
            </ToggleGroupItem>

            <ToggleGroupItem className="cursor-pointer" value="settings" aria-label="Item details">
              <Link to={`/admin/customer/${row.original.id}`}>
                <Settings2 width={20} height={20} />
              </Link>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      );
    },
  },
];

export default columns;
