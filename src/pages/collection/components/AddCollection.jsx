import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save, CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import API from '@/config/config';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/common/modal';
import InputField from '@/components/form/InputField';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const animatedComponents = makeAnimated();

export default function AddCollection({
  openModal,
  setOpenModal,
  title,
  singleData,
  setSingleData,
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      date: new Date(), // Default today
    },
  });

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [details, setDetails] = useState(null);

  const date = watch('date');

  useEffect(() => {
    if (!date) {
      setValue('date', new Date());
    }
  }, [date, setValue]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get('api/customers/all-customers');
        const responseData = response.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setCustomer(responseData);
      } catch (err) {
        toast.error('Failed to fetch customers');
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!selectedCustomer) return;

    const fetchDetails = async () => {
      try {
        const response = await API.get(`api/sales/details/${selectedCustomer?.value}`);
        setDetails(response.data);
      } catch (err) {
        toast.error('Failed to fetch customer details');
      }
    };
    fetchDetails();
  }, [selectedCustomer]);

  const onSubmit = async (data) => {
    if (!data.pay) {
      toast.error('Pay is required');
      return;
    }
    if (!selectedCustomer) {
      toast.error('Customer is required');
      return;
    }
    if (!data.date) {
      toast.error('Date is required');
      return;
    }
    if(details?.totalDue && data.pay > details.totalDue) {
      toast.error('Pay cannot be greater than total due');
      return;
    }

    data.customer = selectedCustomer.value;
    data.date = data.date ? format(data.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');


    await toast.promise(
      API.post('/api/sales/collection', data),
      {
        loading: 'Saving...',
        success: 'Customer saved successfully!',
        error: (error) => error.response?.data?.message || 'Something went wrong',
      }
    );

    queryClient.invalidateQueries({ queryKey: ['collection'] });
    reset();
    setSingleData(null);
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      title={title ?? ''}
      onClose={() => setSingleData(null)}
      className="lg:min-w-1/4 min-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Customer Select */}
        <div className="mt-4">
          <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            options={customer}
            onChange={(val) => setSelectedCustomer(val)}
            value={selectedCustomer}
          />
        </div>

        {/* Pay Input */}
        <div className="mt-4">
          <InputField
            id="pay"
            type="number"
            className="bg-white"
            label="Pay"
            register={register}
            error={errors.pay}
          />
        </div>

        {/* Date Picker */}
        <div className="mt-4 w-full">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="justify-start text-left font-normal w-full"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(new Date(date), 'dd-MM-yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : new Date()}
                onSelect={(val) => setValue('date', val)}
                initialFocus
                className="rounded-md border shadow-md w-full"
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>

        {/* Customer details */}
        {details && (
          <div className="mt-4">
            <p>Total Due: {details?.totalDue} TK</p>
          </div>
        )}


        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary-light cursor-pointer font-semibold w-full"
        >
          <Save className="mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Modal>
  );
}
