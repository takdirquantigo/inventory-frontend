import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import columnsDef from './components/Column';
import { DataTable } from '@/components/common/data-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/config/config';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useDebounce } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function Inactive() {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [parPage, setParPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['inactive', page, debouncedSearch],
    queryFn: async () => {
      const response = await API.get(`api/customers/inactive`, {
        params: {
          page,
          per_page: parPage,
          start_date: fromDate,
          end_date: toDate,
        },
      });
      return response.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className='w-full'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-semibold'>{t('inactive.title')}</h2>
            <p className='text-sm text-muted-foreground'>{t('inactive.subtitle')}</p>
          </div>
        </div>
        <div className='flex gap-2 items-center mt-4'>
         
          <Input
            type='date'
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              if (!toDate) setToDate(e.target.value); // auto-fill toDate if empty
            }}
          />
          <span>→</span>
          <Input
            type='date'
            value={toDate}
            min={fromDate} // ensure toDate is not earlier than fromDate
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button onClick={() => refetch()} variant='default' className='ml-2'>
            {t('common.apply')}
          </Button>
          <Button
            onClick={() => {
              setFromDate('');
              setToDate('');
              refetch();
            }}
            variant='outline'>
            {t('common.clear')}
          </Button>
        </div>
        <div className='py-6'>
          <div className='overflow-hidden rounded-md'>
            <DataTable columns={columnsDef({ t })} data={data?.data?.data ?? []} links={data?.data?.links ?? []} setPage={setPage} page={page} isLoading={isLoading} isError={isError} error={error} searchTerm={searchTerm} setSearchTerm={setSearchTerm} isShowSearch={false} />
          </div>
        </div>
      </div>
    </>
  );
}
