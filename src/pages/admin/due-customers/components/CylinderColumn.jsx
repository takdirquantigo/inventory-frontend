import { Button } from '@/components/ui/button';
import { ArrowUpDown, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const SIZE_KEYS = [
  { key: 'five_kg', i18n: 'cylinders.5kg' },
  { key: 'twelve_kg', i18n: 'cylinders.12kg' },
  { key: 'twentyfive_kg', i18n: 'cylinders.25kg' },
  { key: 'thirtythree_kg', i18n: 'cylinders.33kg' },
  { key: 'thirtyfive_kg', i18n: 'cylinders.35kg' },
  { key: 'fourtyfive_kg', i18n: 'cylinders.45kg' },
];

const dueCell = (row, key) => {
  const due = Number(row.original?.due?.[key]) || 0;
  const purchased = Number(row.original?.purchased?.[key]) || 0;
  const returned = Number(row.original?.returned?.[key]) || 0;

  return (
    <div className="text-center">
      <div className={due > 0 ? 'font-semibold text-amber-700' : 'text-muted-foreground'}>{due}</div>
      <div className="text-[11px] text-muted-foreground">
        {purchased} / {returned}
      </div>
    </div>
  );
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
  ...SIZE_KEYS.map(({ key, i18n }) => ({
    id: key,
    header: () => (
      <div className="text-center">
        <div>{t(i18n)}</div>
        <div className="text-[10px] font-normal text-muted-foreground">{t('dueCustomers.dueBoughtEmpty')}</div>
      </div>
    ),
    cell: ({ row }) => dueCell(row, key),
  })),
  {
    accessorKey: 'total_cylinder_due',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {t('customers.totalDue')}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-semibold text-amber-700">{row.getValue('total_cylinder_due')}</span>
    ),
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
