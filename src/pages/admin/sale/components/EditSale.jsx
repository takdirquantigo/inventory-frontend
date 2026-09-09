import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save, CalendarIcon, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import API from '@/config/config';
import { useQueryClient } from '@tanstack/react-query';
import InputField from '@/components/form/InputField';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import useStore from '@/store/Store';
import { useNavigate } from 'react-router-dom';

const animatedComponents = makeAnimated();

export default function EditSale() {
  const { sale: data } = useStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const queryClient = useQueryClient();
  const [isPackage, setIsPackage] = useState(false);
  const [isWholeSale, setIsWholeSale] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const navigate = useNavigate();

  const fields = [
    // {label: '5 Kg', qty: 'five_kg', price: 'price_5_kg' },
    {label: '12 Kg', qty: 'twelve_kg', price: 'price_12_kg' },
    // {label: '25 Kg', qty: 'twentyfive_kg', price: 'price_25_kg' },
    // {label: '33 Kg', qty: 'thirtythree_kg', price: 'price_33_kg' },
    {label: '35 Kg', qty: 'thirtyfive_kg', price: 'price_35_kg' },
    {label: '45 Kg', qty: 'fourtyfive_kg', price: 'price_45_kg' },
  ];

  const watchedValues = watch(fields.flatMap((f) => [f.qty, f.price]));
  const pay = watch('pay') || 0;
  const totalPrice = watch('price') || 0;

  useEffect(() => {
    let total = 0;
    fields.forEach((f) => {
      const qty = Number(watch(f.qty)) || 0;
      const unitPrice = Number(watch(f.price)) || 0;
      total += qty * unitPrice;
    });
    if (watch('price') !== total) {
      setValue('price', total);
    }
  }, [watchedValues, setValue]);

  useEffect(() => {
    const due = (Number(totalPrice) || 0) - (Number(pay) || 0);
    setValue('due', due >= 0 ? due : 0);
  }, [pay, totalPrice, setValue]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await API.get('api/customers/all-customers');
      const responseData = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCustomer(responseData);

      if (data?.customer_id) {
        const selected = responseData.find((c) => c.value == data.customer_id);
        if (selected) setSelectedCustomer([selected]);
      }
    };
    fetchCustomers();
  }, [data]);

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        if (key in data && !['customer'].includes(key)) {
          setValue(key, data[key]);
        }
      });
      setIsPackage(data.is_package || false);
      setIsWholeSale(Boolean(data.whole_sale));
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
      const formattedDate = formData.date ? format(formData.date, 'yyyy-MM-dd') : null;
      const payload = {
        ...formData,
        date: formattedDate,
        is_package: isPackage,
        whole_sale: isWholeSale ? 1 : 0,
        customer: selectedCustomer,
        id: data.id,
      };

      await toast.promise(API.post('/api/sales/update', payload), {
        // or PUT if backend uses PUT
        loading: 'Updating...',
        success: () => {
          toast.success('Sale updated successfully!');
          queryClient.invalidateQueries({ queryKey: ['products'] });

          reset();
          navigate('/admin/sale');
        },
        error: (err) => {
          toast.error(err.response?.data?.message || 'Something went wrong');
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const date = watch('date');

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold'>Edit Sale</h2>
          <p className='text-sm text-muted-foreground'>Edit your Sale</p>
        </div>
        <Button onClick={() => navigate('/admin/sale')}>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button>
      </div>
      <Card className="mt-4" >
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6'>
              {fields.map((f, idx) => (
                <React.Fragment key={idx}>
                  <InputField id={f.qty} type='number' className='bg-white' label={f.label} register={register} error={errors[f.qty]} />
                  <InputField id={`empty_${f.qty}`} type='number' className='bg-white' label={`Empty ${f.label}`} register={register} error={errors[`empty_${f.qty}`]} />
                  <InputField id={f.price} type='number' className='bg-white' label={`Unit Price ${f.label}`} register={register} error={errors[f.price]} />
                </React.Fragment>
              ))}

              <InputField id='price' type='number' className='bg-gray-100' label='Total Price' register={register} error={errors.price} readOnly />
              <InputField id='pay' type='number' className='bg-white' label='Pay' register={register} error={errors.pay} />
              <InputField id='due' type='number' className='bg-gray-100' label='Due' register={register} error={errors.due} readOnly />
            </CardContent>

            <div className='mx-6 mt-6 flex flex-wrap items-center gap-x-8 gap-y-4'>
              <div className='flex flex-col gap-2 min-w-[200px]'>
                <label className='text-sm font-medium'>Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type='button' variant='outline' className='justify-start text-left font-normal w-full'>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {date ? format(new Date(date), 'dd-MM-yyyy') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='p-0'>
                    <Calendar mode='single' selected={date ? new Date(date) : null} onSelect={(val) => setValue('date', val)} initialFocus className='rounded-md border shadow-md w-full' />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className='text-sm text-red-500'>{errors.date.message}</p>}
              </div>

              <div className='flex gap-2 items-center'>
                <Label htmlFor='edit-sale-is-package'>Is Package?</Label>
                <Switch id='edit-sale-is-package' checked={isPackage} onCheckedChange={setIsPackage} />
              </div>

              <div className='flex gap-2 items-center'>
                <Label htmlFor='edit-sale-whole-sale'>Whole sale?</Label>
                <Switch id='edit-sale-whole-sale' checked={isWholeSale} onCheckedChange={setIsWholeSale} />
              </div>
            </div>

            <div className='mt-4 mx-6'>
              <Label className='mb-2'>Customer</Label>
              <Select closeMenuOnSelect={true} components={animatedComponents} isMulti={false} options={customer} value={selectedCustomer} onChange={(val) => setSelectedCustomer(val)} />
            </div>

            <CardFooter className='flex justify-end mt-4'>
              <Button type='submit' disabled={isSubmitting} className='flex items-center gap-2'>
                <Save className='w-4 h-4' /> Update
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
