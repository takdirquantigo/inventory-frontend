import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store/Store';
import PrintButton from '@/components/PrintButton';


const columns = ({ constHandelDelete }) => [
  {
    id: 'customer',
    header: () => <div className='text-left font-bold'>Customer</div>,
    cell: ({ row }) => <div className='text-left font-medium'>{row.original.customer?.name || row.original.customer_name || 'N/A'}</div>,
  },
  {
    accessorKey: 'date',
    header: () => <div className='text-center font-bold'>Date</div>,
    cell: ({ row }) => <div className='text-center'>{row.getValue('date')}</div>,
  },
  // {
  //   accessorKey: 'five_kg',
  //   header: () => <div className='text-center font-bold'>5 KG</div>,
  //   cell: ({ row }) => {
  //     const filled = row.original.five_kg || 0;
  //     const empty = row.original.empty_five_kg || 0;
  //     const Package = row.original.is_package || 0;
  //     return (
  //       <div className='text-center'>
  //         {filled} / { Package && filled ? 'P' : empty}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: 'twelve_kg',
    header: () => <div className='text-center font-bold'>12 KG</div>,
    cell: ({ row }) => {
      const filled = row.original.twelve_kg || 0;
      const empty = row.original.empty_twelve_kg || 0;
      const Package = row.original.is_package || 0;
      return (
        <div className='text-center'>
          {filled} / { Package && filled>0 ? 'P' : empty}
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'twentyfive_kg',
  //   header: () => <div className='text-center font-bold'>25 KG</div>,
  //   cell: ({ row }) => {
  //     const filled = row.original.twentyfive_kg || 0;
  //     const empty = row.original.empty_twentyfive_kg || 0;
  //     const Package = row.original.is_package || 0;
  //     return (
  //       <div className='text-center'>
  //         {filled} / { Package && filled>0 ? 'P' : empty}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'thirtythree_kg',
  //   header: () => <div className='text-center font-bold'>33 KG</div>,
  //   cell: ({ row }) => {
  //     const filled = row.original.thirtythree_kg || 0;
  //     const empty = row.original.empty_thirtythree_kg || 0;
  //     const Package = row.original.is_package || 0;
  //     return (
  //       <div className='text-center'>
  //         {filled} / { Package && filled>0 ? 'P' : empty}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: 'thirtyfive_kg',
    header: () => <div className='text-center font-bold'>35 KG</div>,
    cell: ({ row }) => {
      const filled = row.original.thirtyfive_kg || 0;
      const empty = row.original.empty_thirtyfive_kg || 0;
      const Package = row.original.is_package || 0;
      return (
        <div className='text-center'>
          {filled} / { Package && filled>0 ? 'P' : empty}
        </div>
      );
    },
  },
  {
    accessorKey: 'fourtyfive_kg',
    header: () => <div className='text-center font-bold'>45 KG</div>,
    cell: ({ row }) => {
      const filled = row.original.fourtyfive_kg || 0;
      const empty = row.original.empty_fourtyfive_kg || 0;
      const Package = row.original.is_package || 0;
      return (
        <div className='text-center'>
          {filled} / { Package && filled>0 ? 'P' : empty}
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-center font-bold">Price</div>,
    cell: ({ row }) => {
      const price = Number(row.getValue('price')) || 0;
      const otherCost = Number(row.original.other_cost_amount) || 0;
  
      return (
        <div className="text-center">
          {price + otherCost}
        </div>
      );
    },
  },
  {
    accessorKey: 'pay',
    header: () => <div className='text-center font-bold'>Pay</div>,
    cell: ({ row }) => <div className='text-center'>{row.getValue('pay')} </div>,
  },
  {
    accessorKey: 'due',
    header: () => <div className='text-center font-bold'>Due</div>,
    cell: ({ row }) => <div className='text-center'>{row.getValue('due')} </div>,
  },

  {
    id: 'actions',
    header: () => <div className='text-center font-bold'>Actions</div>,
    cell: ({ row }) => {
      const { setSale } = useStore();
      const navigate = useNavigate();


      const handleEdit = (data) => {
        setSale(data);
        navigate(`/admin/sale/${data.id}`);
      };

      return (
        <div className='flex justify-center' >
          <ToggleGroup variant='outline' type='single'>
            <ToggleGroupItem className='cursor-pointer' value='delete' aria-label='Delete row' onClick={() => constHandelDelete(row.original.id)}>
              <Trash width={20} height={20} />
            </ToggleGroupItem>
            <ToggleGroupItem className='cursor-pointer' value='edit' aria-label='Edit row' onClick={() => handleEdit(row.original)}>
              <Edit width={20} height={20} />
            </ToggleGroupItem>
            <ToggleGroupItem className='cursor-pointer' value='print' aria-label='Print Invoice'>
             
              <div >
                <PrintButton
                  content={row?.original}
                />
              </div>

            </ToggleGroupItem>
          </ToggleGroup>

        </div>
      );
    },
  },
];

export default columns;