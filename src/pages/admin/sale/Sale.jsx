import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import columns from './components/Column';
import { DataTable } from '@/components/common/data-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/config/config';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const getTodayBangladeshYmd = () => {
  const bdDate = new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
    }),
  );
  const year = bdDate.getFullYear();
  const month = String(bdDate.getMonth() + 1).padStart(2, '0');
  const day = String(bdDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Sale() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [parPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [fromDate, setFromDate] = useState(() => getTodayBangladeshYmd());
  const [toDate, setToDate] = useState(() => getTodayBangladeshYmd());
  const [saleTab, setSaleTab] = useState('retail');
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fromDate, toDate, saleTab]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sales', 'list', page, debouncedSearch, fromDate, toDate, saleTab],
    queryFn: async () => {
      const params = {
        page,
        per_page: parPage,
        search: debouncedSearch,
        start_date: fromDate,
        end_date: toDate,
      };

      if (saleTab === 'packagesale') {
        params.is_package = 1;
      } else {
        params.whole_sale = saleTab === 'wholesale' ? 1 : 0;
        params.is_package = 0;
      }

      const response = await API.put(`api/sales`, { params });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });

  const constHandelDelete = async (id) => {
    const result = await Swal.fire({
      title: t('confirm.title'),
      text: t('confirm.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('confirm.yesDelete'),
      cancelButtonText: t('common.cancel'),
    });

    if (!result.isConfirmed) return;

    try {
      await toast.promise(API.delete(`/api/sales/${id}`), {
        loading: t('confirm.deleting'),
        success: (res) => res?.data?.message || t('confirm.deleted'),
        error: (err) =>
          err?.response?.data?.message || err?.message || t('confirm.somethingWrong'),
      });

      queryClient.invalidateQueries({ queryKey: ['sales'] });
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>{t('sales.title')}</h2>
          <p className='text-sm text-muted-foreground'>{t('sales.subtitle')}</p>
        </div>
        <Link to='/admin/sale/add'>
          <Button className='cursor-pointer'>{t('sales.add')}</Button>
        </Link>
      </div>

      <Tabs
        value={saleTab}
        onValueChange={(v) => {
          setSaleTab(v);
          setPage(1);
        }}
        className='w-full'>
        <TabsList className='grid w-full max-w-lg grid-cols-3 sm:w-fit'>
          <TabsTrigger value='retail'>{t('sales.retail')}</TabsTrigger>
          <TabsTrigger value='wholesale'>{t('sales.wholesale')}</TabsTrigger>
          <TabsTrigger value='packagesale'>{t('sales.packageSale')}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='flex flex-col gap-4 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end'>
        <div className='flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-44'>
          <label className='text-xs font-medium text-muted-foreground' htmlFor='sale-from'>
            {t('common.fromBd')}
          </label>
          <Input
            id='sale-from'
            type='date'
            value={fromDate}
            className='bg-background'
            onChange={(e) => {
              setFromDate(e.target.value);
              if (!toDate) setToDate(e.target.value);
            }}
          />
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-44'>
          <label className='text-xs font-medium text-muted-foreground' htmlFor='sale-to'>
            {t('common.to')}
          </label>
          <Input
            id='sale-to'
            type='date'
            value={toDate}
            min={fromDate || undefined}
            className='bg-background'
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <Button
          type='button'
          variant='outline'
          className='shrink-0'
          onClick={() => {
            const today = getTodayBangladeshYmd();
            setFromDate(today);
            setToDate(today);
          }}>
          {t('common.today')}
        </Button>
      </div>

      <div className='overflow-hidden rounded-xl'>
        <DataTable
          columns={columns({ t, constHandelDelete })}
          data={data?.data?.data ?? []}
          links={data?.data?.links ?? []}
          setPage={setPage}
          page={page}
          isLoading={isLoading}
          isError={isError}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
}
