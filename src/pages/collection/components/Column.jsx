import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Printer, SquarePen, Trash } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import EditCollection from './EditCollection';

const columns = ({ t, constHandelDelete }) => [
  {
    accessorKey: 'customer',
    header: () => <div className=''>{t('common.customer')}</div>,
    cell: ({ row }) => <div className=''>{row.original.customer?.name || row.original.customer_name || t('common.na')}</div>,
  },

  {
    accessorKey: 'pay',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('common.pay')} <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className='text-start'>{row.getValue('pay')} {t('common.tk')}</div>,
  },
  {
    accessorKey: 'date',
    header: () => <div className='text-center'>{t('common.date')}</div>,
    cell: ({ row }) => <div className='text-center'>{row.getValue('date')}</div>,
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>{t('common.actions')}</div>,
    cell: ({ row }) => {
      const [data, setData] = useState(null);
      return (
        <div className='flex justify-center items-center'>
          <ToggleGroup variant='outline' type='single'>
            <ToggleGroupItem className='cursor-pointer' value='delete' aria-label={t('sales.deleteAria')} onClick={() => constHandelDelete(row.original.id)}>
              <Trash width={20} height={20} />
            </ToggleGroupItem>

            <ToggleGroupItem value='edit' aria-label={t('sales.editAria')} onClick={() => setData(row?.original)}>
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    {' '}
                    <SquarePen width={20} height={20} />
                  </button>
                </DialogTrigger>
                {data && <EditCollection data={data} />}
              </Dialog>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      );
    },
  },
];

export default columns;
