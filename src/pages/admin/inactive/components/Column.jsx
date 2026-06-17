import { Button } from '@/components/ui/button';
import { ArrowUpDown, SquarePen, Trash, Settings2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const columns = ({ setSingleData, constHandelDelete, setOpenModal }) => [
  {
    accessorKey: 'name',
    header: () => <div className=''>Name</div>,
    cell: ({ row }) => <div className=''>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'todal_buy',
    header: ({ column }) => (
     <div> Buy</div>
    ),
    cell: ({ row }) => {
      let data = row.getValue('todal_buy') ?? 0;
      return <div>{data} TK</div>;
    },
  },
  {
    accessorKey: 'total_pay',
    header: ({ column }) => (
      <div> Pay</div>
    ),
    cell: ({ row }) => <div>{row.getValue('total_pay')} TK</div>,
  },
  {
    accessorKey: 'due',
    header: ({ column }) => (
      <div> Due</div>
    ),
    cell: ({ row }) => <div>{row.getValue('due')} TK</div>,
  },

  {
    id: 'actions',
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      const [data, setData] = useState(null);
      return (
        <div>
          <ToggleGroup variant='outline' type='single'>
            <Link to={`/admin/customer/${row.original.id}`}>
              <ToggleGroupItem className='cursor-pointer' value='settings' aria-label='Customer details'>
                <Settings2 width={20} height={20} />
              </ToggleGroupItem>
            </Link>
          </ToggleGroup>
        </div>
      );
    },
  },
];

export default columns;
