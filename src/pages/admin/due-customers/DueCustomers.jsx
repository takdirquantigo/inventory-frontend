import { DataTable } from '@/components/common/data-table';
import API from '@/config/config';
import { useDebounce } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import columnsDef from './components/Column';
import cylinderColumnsDef from './components/CylinderColumn';
import { useTranslation } from 'react-i18next';

const SIZE_KEYS = ['five_kg', 'twelve_kg', 'twentyfive_kg', 'thirtythree_kg', 'thirtyfive_kg', 'fourtyfive_kg', 'others_kg'];
const SIZE_I18N = {
  five_kg: 'cylinders.5kg',
  twelve_kg: 'cylinders.12kg',
  twentyfive_kg: 'cylinders.25kg',
  thirtythree_kg: 'cylinders.33kg',
  thirtyfive_kg: 'cylinders.35kg',
  fourtyfive_kg: 'cylinders.45kg',
  others_kg: 'cylinders.others',
};

const money = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return '—';
  return `${n.toLocaleString()} TK`;
};

export default function DueCustomers() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('bill');
  const [page, setPage] = useState(1);
  const [parPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const isBillDue = tab === 'bill';

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tab]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['due-customers', tab, page, parPage, debouncedSearch],
    queryFn: async () => {
      const url = isBillDue ? 'api/customers/due-balances' : 'api/customers/cylinder-dues';
      const res = await API.get(url, {
        params: {
          page,
          per_page: parPage,
          search: debouncedSearch || undefined,
        },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });

  const paginator = data?.data;
  const rows = paginator?.data ?? [];
  const links = paginator?.links ?? [];
  const summary = data?.summary;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t('dueCustomers.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {isBillDue ? t('dueCustomers.billDesc') : t('dueCustomers.cylinderDesc')}
          </p>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v);
          setPage(1);
        }}
        className="mt-4 w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 sm:w-fit">
          <TabsTrigger value="bill">{t('dueCustomers.billDue')}</TabsTrigger>
          <TabsTrigger value="cylinder">{t('dueCustomers.cylinderDue')}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isBillDue ? t('dueCustomers.outstandingList') : t('dueCustomers.cylindersOutstanding')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isBillDue ? (
              <p className="text-2xl font-semibold text-amber-700">{money(summary?.filtered_outstanding)}</p>
            ) : (
              <p className="text-2xl font-semibold text-amber-700">
                {summary?.filtered_outstanding_cylinders ?? '—'}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dueCustomers.customersWithDue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{summary?.customers_with_due_count ?? '—'}</p>
          </CardContent>
        </Card>
      </div>

      {!isBillDue && summary?.due_by_size && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZE_KEYS.map((key) => {
            const n = Number(summary.due_by_size[key]) || 0;
            if (n <= 0) return null;
            return (
              <span
                key={key}
                className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800"
              >
                {t(SIZE_I18N[key])}: {n}
              </span>
            );
          })}
        </div>
      )}

      <div className="py-6">
        <div className="overflow-hidden rounded-md">
          <DataTable
            columns={isBillDue ? columnsDef({ t }) : cylinderColumnsDef({ t })}
            data={rows}
            links={links}
            setPage={setPage}
            page={page}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isShowSearch
          />
        </div>
      </div>
    </div>
  );
}
