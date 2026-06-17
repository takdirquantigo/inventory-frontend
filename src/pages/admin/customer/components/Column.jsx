import { Button } from '@/components/ui/button';
import { ArrowUpDown, SquarePen, Settings2, ShoppingCart, Phone, MapPin } from 'lucide-react';
import EditModal from './EditModal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function formatTk(value) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat('en-BD', { maximumFractionDigits: 2 }).format(n);
}

function SortHeader({ column, label }) {
  return (
    <Button
      variant='ghost'
      size='sm'
      className='-ml-3 h-9 gap-1.5 px-3 font-semibold text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      <span>{label}</span>
      <ArrowUpDown className='h-3.5 w-3.5 shrink-0 opacity-60' />
    </Button>
  );
}

const columns = ({ setSingleData, constHandelDelete, setOpenModal }) => [
  {
    accessorKey: 'name',
    header: () => <span className='pl-1'>Customer</span>,
    cell: ({ row }) => {
      const name = row.getValue('name') ?? '—';
      const phone = row.original?.phone ?? '';
      const address = row.original?.address ?? '';
      const initial = String(name).trim().charAt(0).toUpperCase() || '?';

      return (
        <div className='flex max-w-[280px] items-start gap-3 py-0.5'>
          <Avatar className='h-10 w-10 shrink-0 border border-border/60 shadow-sm ring-2 ring-background'>
            <AvatarFallback className='bg-linear-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary'>
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1 space-y-1'>
            <p className='truncate font-semibold leading-tight text-foreground'>{name}</p>
            <div className='flex items-start gap-1.5 text-xs text-muted-foreground'>
              <Phone className='mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70' aria-hidden />
              <span className='wrap-break-word'>{phone || 'No phone'}</span>
            </div>
            <div className='flex items-start gap-1.5 text-xs text-muted-foreground'>
              <MapPin className='mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70' aria-hidden />
              <span className='line-clamp-2 wrap-break-word'>{address || 'No address'}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'customer_login_id',
    header: () => <span className='text-center'>Login ID</span>,
    cell: ({ row }) => {
      const id = row.original?.customer_login_id;
      return (
        <div className='flex justify-center'>
          <span className='inline-flex rounded-md bg-muted/80 px-2.5 py-1 font-mono text-xs tabular-nums text-foreground ring-1 ring-border/50'>
            {id != null && id !== '' ? String(id) : '—'}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'total_purchase',
    header: ({ column }) => (
      <div className='text-right'>
        <SortHeader column={column} label='Total buy' />
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>
        <span className='font-medium text-foreground'>{formatTk(row.getValue('total_purchase'))}</span>
        <span className='ml-1 text-xs font-normal text-muted-foreground'>TK</span>
      </div>
    ),
  },
  {
    accessorKey: 'total_paid',
    header: ({ column }) => (
      <div className='text-right'>
        <SortHeader column={column} label='Total pay' />
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-right tabular-nums'>
        <span className='font-medium text-emerald-600 dark:text-emerald-400'>{formatTk(row.getValue('total_paid'))}</span>
        <span className='ml-1 text-xs font-normal text-muted-foreground'>TK</span>
      </div>
    ),
  },
  {
    accessorKey: 'total_due',
    header: ({ column }) => (
      <div className='text-right'>
        <SortHeader column={column} label='Total due' />
      </div>
    ),
    cell: ({ row }) => {
      const totalPurchase = Number(row.getValue('total_purchase')) || 0;
      const totalPaid = Number(row.getValue('total_paid')) || 0;
      const totalDue = totalPurchase - totalPaid;
      const isDue = totalDue > 0;

      return (
        <div className='flex justify-end'>
          <span
            className={cn(
              'inline-flex min-w-22 justify-end rounded-lg px-2.5 py-1 text-right text-sm font-semibold tabular-nums ring-1',
              isDue
                ? 'bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-400'
                : 'bg-muted/50 text-muted-foreground ring-border/50',
            )}>
            {formatTk(totalDue)}
            <span className='ml-1 text-xs font-normal opacity-80'>TK</span>
          </span>
        </div>
      );
    },
  },

  {
    id: 'actions',
    header: () => <span className='pr-1 text-center'>Actions</span>,
    cell: ({ row }) => (
      <div className='flex items-center justify-end gap-1'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon' className='h-9 w-9 text-muted-foreground hover:text-foreground' aria-label='Edit customer'>
              <SquarePen className='h-4 w-4' />
            </Button>
          </DialogTrigger>
          <EditModal data={row.original} />
        </Dialog>

        <Button variant='ghost' size='icon' className='h-9 w-9 text-muted-foreground hover:text-foreground' asChild>
          <Link to={`/admin/sale/add?customer_id=${row.original.id}`} aria-label='New sale for this customer'>
            <ShoppingCart className='h-4 w-4' />
          </Link>
        </Button>

        <Button variant='ghost' size='icon' className='h-9 w-9 text-muted-foreground hover:text-foreground' asChild>
          <Link to={`/admin/customer/${row.original.id}`} aria-label='Customer details'>
            <Settings2 className='h-4 w-4' />
          </Link>
        </Button>
      </div>
    ),
  },
];

export default columns;
