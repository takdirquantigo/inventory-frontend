import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import columns from './components/Column';
import { DataTable } from '@/components/common/data-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/config/config';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import AddCollection from './components/AddCollection';
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

export default function Collection() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [page, setPage] = useState(1);
  const [parPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [fromDate, setFromDate] = useState(() => getTodayBangladeshYmd());
  const [toDate, setToDate] = useState(() => getTodayBangladeshYmd());
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fromDate, toDate]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['collection', page, debouncedSearch, fromDate, toDate],
    queryFn: async () => {
      const response = await API.put(`api/sales/collectionList`, {
        params: {
          page,
          per_page: parPage,
          search: debouncedSearch,
          start_date: fromDate,
          end_date: toDate,
        },
      });
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
    await toast.promise(
      API.delete(`/api/sales/${id}`),
      {
        loading: t('confirm.deleting'),
        success: (res) =>
          res?.data?.message || t('confirm.deleted'),
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          t('confirm.somethingWrong'),
      }
    );

    queryClient.invalidateQueries({ queryKey: ['collection'] });

  } catch (error) {
    console.error('Delete failed:', error);
  }
};
  return (
    <>
      <div className='w-full space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-semibold'>{t('collection.title')}</h2>
            <p className='text-sm text-muted-foreground'>{t('collection.subtitle')}</p>
          </div>
          <Button onClick={() => setOpenModal(true)}>{t('collection.add')}</Button>
        </div>

        <div className='flex flex-col gap-4 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end'>
          <div className='flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-44'>
            <label className='text-xs font-medium text-muted-foreground' htmlFor='collection-from'>
              {t('common.fromBd')}
            </label>
            <Input
              id='collection-from'
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
            <label className='text-xs font-medium text-muted-foreground' htmlFor='collection-to'>
              {t('common.to')}
            </label>
            <Input
              id='collection-to'
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
              columns={columns({
                t,
                setSingleData,
                constHandelDelete,
                setOpenModal,
              })}
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

      {openModal && <AddCollection openModal={openModal} setOpenModal={setOpenModal} title={singleData?.id ? t('collection.editTitle') : t('collection.addTitle')} singleData={singleData} setSingleData={setSingleData} />}
    </>
  );
}
