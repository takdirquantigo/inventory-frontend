import { Settings2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Link } from 'react-router-dom';

const columns = ({ t }) => [
  {
    accessorKey: 'name',
    header: () => <div className=''>{t('common.name')}</div>,
    cell: ({ row }) => <div className=''>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'todal_buy',
    header: () => <div>{t('inactive.buy')}</div>,
    cell: ({ row }) => {
      let data = row.getValue('todal_buy') ?? 0;
      return <div>{data} {t('common.tk')}</div>;
    },
  },
  {
    accessorKey: 'total_pay',
    header: () => <div>{t('common.pay')}</div>,
    cell: ({ row }) => <div>{row.getValue('total_pay')} {t('common.tk')}</div>,
  },
  {
    accessorKey: 'due',
    header: () => <div>{t('common.due')}</div>,
    cell: ({ row }) => <div>{row.getValue('due')} {t('common.tk')}</div>,
  },
  {
    id: 'actions',
    header: () => <div>{t('common.actions')}</div>,
    cell: ({ row }) => (
      <div>
        <ToggleGroup variant='outline' type='single'>
          <Link to={`/admin/customer/${row.original.id}`}>
            <ToggleGroupItem className='cursor-pointer' value='settings' aria-label={t('customers.detailsAria')}>
              <Settings2 width={20} height={20} />
            </ToggleGroupItem>
          </Link>
        </ToggleGroup>
      </div>
    ),
  },
];

export default columns;
