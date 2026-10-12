import { Button } from '@/components/ui/button';
import { ArrowUpDown, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const money = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return '—';
  return `${n.toLocaleString()} TK`;
};

const columns = ({ t } = {}) => [
  {
    id: 'select',
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'customer_name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('common.customer')}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('customer_name')}</div>,
  },
  {
    accessorKey: 'phone',
    header: () => <div>{t('common.phone')}</div>,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('phone') || '—'}</div>,
  },
  {
    accessorKey: 'total_price',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('dueCustomers.totalBilled')}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => money(row.getValue('total_price')),
  },
  {
    accessorKey: 'total_pay',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('dueCustomers.totalPaid')}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => money(row.getValue('total_pay')),
  },
  {
    accessorKey: 'outstanding_due',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('dueCustomers.outstanding')}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-semibold text-amber-700">{money(row.getValue('outstanding_due'))}</span>,
  },
  {
    id: 'actions',
    header: () => <div>{t('common.actions')}</div>,
    cell: ({ row }) => (
      <ToggleGroup variant="outline" type="single">
        <Link to={`/admin/customer/${row.original.customer_id}`}>
          <ToggleGroupItem className="cursor-pointer" value="details" aria-label={t('customers.detailsAria')}>
            <Settings2 width={20} height={20} />
          </ToggleGroupItem>
        </Link>
      </ToggleGroup>
    ),
  },
];

export default columns;
