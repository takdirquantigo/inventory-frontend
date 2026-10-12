import { Button } from '@/components/ui/button';
import { useState } from 'react';
import columnsDef from './components/Column';
import AddModal from './components/AddModal';
import { DataTable } from '@/components/common/data-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/config/config';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useDebounce } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function Customer() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [page, setPage] = useState(1);
  const [parPage, setParPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['customer', page, debouncedSearch],
    queryFn: async () => {
      const response = await API.put(`api/customers`, {
        params: {
          page,
          per_page: parPage,
          search: debouncedSearch,
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
      text: t('customers.deleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('confirm.yesDelete'),
      cancelButtonText: t('common.cancel'),
    });

    if (!result.isConfirmed) return;

    try {
      await toast.promise(API.delete(`/api/customers/${id}`), {
        loading: t('confirm.deleting'),
        success: (res) => res?.data?.message || t('customers.deleted'),
        error: (err) =>
          err?.response?.data?.error || err?.response?.data?.message || t('confirm.somethingWrong'),
      });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    } catch (e) {
      console.error('Delete customer error:', e);
    }
  };

  return (
    <>
      <div className='w-full space-y-6'>
        <div className='flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/80 px-5 py-5 shadow-sm ring-1 ring-black/3 dark:ring-white/6 sm:flex-row sm:items-center sm:justify-between'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-semibold tracking-tight'>{t('customers.title')}</h2>
            <p className='text-sm text-muted-foreground'>{t('customers.subtitle')}</p>
          </div>
          <Button onClick={() => setOpenModal(true)} className='shrink-0'>
            {t('customers.add')}
          </Button>
        </div>

        <div className='overflow-hidden'>
          <div className='rounded-xl'>
            <DataTable
              columns={columnsDef({ t, setSingleData, constHandelDelete, setOpenModal })}
              data={data?.data?.customers?.data ?? []}
              links={data?.data?.customers?.links ?? []}
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
      </div>

      {openModal && (
        <AddModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          title={singleData?.id ? t('customers.editTitle') : t('customers.addTitle')}
          singleData={singleData}
          setSingleData={setSingleData}
        />
      )}
    </>
  );
}
