import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import columnsDef from './components/Column';
import AddModal from './components/AddModal';
import { DataTable } from '@/components/common/data-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/config/config';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useDebounce } from '@/lib/utils';

export default function Items() {
  const [openModal, setOpenModal] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [page, setPage] = useState(1);
  const [parPage, setParPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['items', page, debouncedSearch],
    queryFn: async () => {
      const response = await API.get(`api/items`, {
        params: {
          page,
          per_page: parPage,
          search: debouncedSearch,
        },
      });
      return response.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const constHandelDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        toast.promise(
          API.delete(`/api/items/${id}`),
          {
            loading: 'Deleting...',
            success: (data) => data.message || 'Deleted successfully!',
            error: (error) => error.response.data.message,
          }
        );
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">CMS Management</h2>
            <p className="text-sm text-muted-foreground">Manage your Content</p>
          </div>
          <Button
            onClick={() => {
              setSingleData(null);
              setOpenModal(true);
            }}
          >
            Add Content
          </Button>
        </div>

        <div className="py-6">
 

          <div className="overflow-hidden rounded-md">
            <DataTable
              columns={columnsDef({ setSingleData, constHandelDelete, setOpenModal })}
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
          title={singleData?.id ? 'Edit Items' : 'Add Items'}
          singleData={singleData}
          setSingleData={setSingleData}
        />
      )}
    </>
  );
}
