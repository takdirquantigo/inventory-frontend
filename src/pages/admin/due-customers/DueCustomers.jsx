import { DataTable } from '@/components/common/data-table';
import API from '@/config/config';
import { useDebounce } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import columnsDef from './components/Column';

const money = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return '—';
  return `${n.toLocaleString()} TK`;
};

export default function DueCustomers() {
  const [page, setPage] = useState(1);
  const [parPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['due-customers', page, parPage, debouncedSearch],
    queryFn: async () => {
      const res = await API.get('api/customers/due-balances', {
        params: {
          page,
          per_page: parPage,
          search: debouncedSearch || undefined,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
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
          <h2 className="text-2xl font-semibold">Due customers</h2>
          <p className="text-sm text-muted-foreground">
            Customers whose total billed amount exceeds total paid (includes due-bill payments). Same basis as the customer portal balance.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding (this list)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-amber-700">{money(summary?.filtered_outstanding)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers with due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{summary?.customers_with_due_count ?? '—'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="py-6">
        <div className="overflow-hidden rounded-md">
          <DataTable
            columns={columnsDef()}
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
