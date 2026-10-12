import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import columns from './components/Column';
import AddModal from './components/AddStoke';
import { DataTable } from '@/components/common/data-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/config/config';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Stoke() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [page, setPage] = useState(1);
  const [parPage, setParPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', page, searchTerm],
    queryFn: async () => {
      const response = await API.put(`api/products`, {
        params: {
          page,
          per_page: parPage,
          search: searchTerm,
        },
      });
      return response.data;
    },
    keepPreviousData: true,
    
  });

  const constHandelDelete = (id) => {
    Swal.fire({
      title: t('confirm.title'),
      text: t('confirm.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('confirm.yesDelete'),
      cancelButtonText: t('common.cancel'),
    }).then((result) => {
      if (result.isConfirmed) {
        toast.promise(
          API.delete(`/api/products/${id}`),
          {
            loading: t('confirm.deleting'),
            success: (data) => data.message || t('confirm.deleted'),
            error: (error) => error.response.data.message,
          }
        );
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    });
  };
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{t('stock.title')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('stock.subtitle')}
            </p>
          </div>
          <Link to="/admin/stoke/add">
            <Button className="cursor-pointer">{t('stock.add')}</Button>
          </Link>
        </div>

        <div className="py-6">


          <div className="overflow-hidden rounded-md ">
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