import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save, CalendarIcon, ArrowLeft, UserPlus } from 'lucide-react';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import AddModal from '@/pages/admin/customer/components/AddModal';
import { useTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const getTodayInBangladesh = () => {
  const bdDate = new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
    })
  );
  const year = bdDate.getFullYear();
  const month = String(bdDate.getMonth() + 1).padStart(2, '0');
  const day = String(bdDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseYmdToDate = (ymd) => {
  if (!ymd || typeof ymd !== 'string') return null;
  const [year, month, day] = ymd.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

export default function AddSale() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      date: getTodayInBangladesh(),
    },
  });

  const queryClient = useQueryClient();
  const [isPackage, setIsPackage] = useState(false);
  const [isWholeSale, setIsWholeSale] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customer, setCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // qty and price fields mapping
  const fields = [
    { qty: 'five_kg', price: 'price_5_kg' },
    { qty: 'twelve_kg', price: 'price_12_kg' },
    { qty: 'twentyfive_kg', price: 'price_25_kg' },
    { qty: 'thirtythree_kg', price: 'price_33_kg' },
    { qty: 'thirtyfive_kg', price: 'price_35_kg' },
    { qty: 'fourtyfive_kg', price: 'price_45_kg' },
  ];

  const watchedValues = watch(fields.flatMap((f) => [f.qty, f.price]));
  const pay = watch('pay') || 0;
  const totalPrice = watch('price') || 0;
  const otherCostAmount = watch('other_cost_amount') || 0;

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
    const total = (Number(totalPrice) || 0) + (Number(otherCostAmount) || 0);
    setValue('total', total);
  }, [totalPrice, otherCostAmount, setValue]);

  const fetchCustomers = useCallback(async () => {
    const response = await API.get('api/customers/all-customers');
    const responseData = response.data.data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setCustomer(responseData);
    return responseData;
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /** Pre-select customer when opened from customer list (?customer_id=) */
  useEffect(() => {
    const rawId = searchParams.get('customer_id');
    if (!rawId || !customer?.length) return;
    const id = Number(rawId);
    const clearParam = () =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('customer_id');
          return next;
        },
        { replace: true },
      );
    if (Number.isNaN(id)) {
      clearParam();
      return;
    }
    const match = customer.find((c) => Number(c.value) === id);
    if (match) {
      setSelectedCustomer(match);
    }
    clearParam();
  }, [customer, searchParams, setSearchParams]);

  const handleCustomerCreated = async (data) => {
    const options = await fetchCustomers();
    const created = data?.customer;
    if (!created?.id) return;
    const match = options.find((c) => Number(c.value) === Number(created.id));
    if (match) {
      setSelectedCustomer(match);
    } else {
      setSelectedCustomer({ value: created.id, label: created.name });
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        date: data.date || null,
        is_package: isPackage,
        whole_sale: isWholeSale ? 1 : 0,
        customer: selectedCustomer,
        five_kg: data.five_kg || 0,
        twentyfive_kg: data.twentyfive_kg || 0,
        thirtythree_kg: data.thirtythree_kg || 0,
      };
      if (!payload.date) {
        toast.error(t('sales.dateRequired'));
        return;
      }
      if (!payload.customer) {
        toast.error(t('sales.customerRequired'));
        return;
      }
      if (!payload.price) {
        toast.error(t('sales.totalPriceRequired'));
        return;
      }

      await toast.promise(API.post('/api/sales', payload), {
        loading: t('toast.saving'),
        success: () => {
          toast.success(t('sales.saved'));
          queryClient.invalidateQueries({ queryKey: ['sales'] });
          reset();
          setSelectedCustomer(null);
          setIsWholeSale(false);
          // navigate('/admin/stoke');
        },
        error: (err) => {
          toast.error(err.response?.data?.message || t('toast.somethingWrong'));
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const date = watch('date');
  const selectedDate = parseYmdToDate(date);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold'>{t('sales.addTitle')}</h2>
          <p className='text-sm text-muted-foreground'>{t('sales.addDesc')}</p>
        </div>
        <Button onClick={() => navigate('/admin/sale')}>
          <ArrowLeft className='mr-2 h-4 w-4' /> {t('common.back')}
        </Button>
      </div>
      <Card className="mt-4" >
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6'>
              {/* 5 KG */}
              {/* <InputField id='five_kg' type='number' className='bg-white' label='5 KG' register={register} error={errors.five_kg} />
              <InputField id='empty_five_kg' type='number' className='bg-white' label='Empty 5 KG' register={register} error={errors.empty_five_kg} />
              <InputField id='price_5_kg' type='number' className='bg-white' label='Unit Price 5 KG' register={register} error={errors.price_5_kg} /> */}

              {/* 12 KG */}
              <InputField id='twelve_kg' type='number' className='bg-white' label={t('cylinders.12kg')} register={register} error={errors.twelve_kg} />
              <InputField id='empty_twelve_kg' type='number' className='bg-white' label={t('cylinders.empty12kg')} register={register} error={errors.empty_twelve_kg} />
              <InputField id='price_12_kg' type='number' className='bg-white' label={t('sales.unitPrice', { size: t('cylinders.12kg') })} register={register} error={errors.price_12_kg} />

              {/* 25 KG */}
              {/* <InputField id='twentyfive_kg' type='number' className='bg-white' label='25 KG' register={register} error={errors.twentyfive_kg} />
              <InputField id='empty_twentyfive_kg' type='number' className='bg-white' label='Empty 25 KG' register={register} error={errors.empty_twentyfive_kg} />
              <InputField id='price_25_kg' type='number' className='bg-white' label='Unit Price 25 KG' register={register} error={errors.price_25_kg} /> */}

              {/* 33 KG */}
              {/* <InputField id='thirtythree_kg' type='number' className='bg-white' label='33 KG' register={register} error={errors.thirtythree_kg} />
              <InputField id='empty_thirtythree_kg' type='number' className='bg-white' label='Empty 33 KG' register={register} error={errors.empty_thirtythree_kg} />
              <InputField id='price_33_kg' type='number' className='bg-white' label='Unit Price 33 KG' register={register} error={errors.price_33_kg} /> */}

              {/* 35 KG */}
              <InputField id='thirtyfive_kg' type='number' className='bg-white' label={t('cylinders.35kg')} register={register} error={errors.thirtyfive_kg} />
              <InputField id='empty_thirtyfive_kg' type='number' className='bg-white' label={t('cylinders.empty35kg')} register={register} error={errors.empty_thirtyfive_kg} />
              <InputField id='price_35_kg' type='number' className='bg-white' label={t('sales.unitPrice', { size: t('cylinders.35kg') })} register={register} error={errors.price_35_kg} />

              {/* 45 KG */}
              <InputField id='fourtyfive_kg' type='number' className='bg-white' label={t('cylinders.45kg')} register={register} error={errors.fourtyfive_kg} />
              <InputField id='empty_fourtyfive_kg' type='number' className='bg-white' label={t('cylinders.empty45kg')} register={register} error={errors.empty_fourtyfive_kg} />
              <InputField id='price_45_kg' type='number' className='bg-white' label={t('sales.unitPrice', { size: t('cylinders.45kg') })} register={register} error={errors.price_45_kg} />

              {/* Total Price (ReadOnly) */}
              <InputField id='price' type='number' className='bg-gray-100' label={t('sales.totalPrice')} register={register} error={errors.price} readOnly />

              {/* Pay */}
              <InputField id='pay' type='number' className='bg-white' label={t('common.pay')} register={register} error={errors.pay} />

              {/* Due (ReadOnly) */}
              <InputField id='due' type='number' className='bg-gray-100' label={t('common.due')} register={register} error={errors.due} readOnly />

              {/* Other Cost */}
              <InputField id='other_cost_name' type='text' className='bg-white' label={t('sales.otherCostName')} register={register} error={errors.other_cost_name} />
              <InputField id='other_cost_amount' type='text' className='bg-white' label={t('sales.otherCostAmount')} register={register} error={errors.other_cost_amount} />
              <InputField id='total' type='number' className='bg-gray-100' label={t('common.total')} register={register} error={errors.total} readOnly />
            </CardContent>

            {/* Date & Package */}
            <div className='mx-6 flex flex-wrap items-center gap-x-8 gap-y-4'>
              <div className='flex flex-col gap-2 min-w-[200px]'>
                <label className='text-sm font-medium'>{t('common.date')}</label>
                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button type='button' variant='outline' className='justify-start text-left font-normal w-full'>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {selectedDate ? format(selectedDate, 'dd-MM-yyyy') : t('common.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='p-0'>
                    <Calendar
                      mode='single'
                      selected={selectedDate}
                      onSelect={(val) => {
                        setValue('date', val ? format(val, 'yyyy-MM-dd') : '');
                        setIsDatePopoverOpen(false);
                      }}
                      initialFocus
                      className='rounded-md border shadow-md w-full'
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className='text-sm text-red-500'>{errors.date.message}</p>}
              </div>

              <div className='flex gap-2 items-center'>
                <Label htmlFor='sale-is-package'>{t('common.isPackage')}</Label>
                <Switch id='sale-is-package' checked={isPackage} onCheckedChange={setIsPackage} />
              </div>

              <div className='flex gap-2 items-center'>
                <Label htmlFor='sale-whole-sale'>{t('common.wholeSale')}</Label>
                <Switch id='sale-whole-sale' checked={isWholeSale} onCheckedChange={setIsWholeSale} />
              </div>
            </div>

            {/* Customer Select */}
            <div className='mt-4 mx-6'>
              <Label className='mb-2'>{t('common.customer')}</Label>
              <Select
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={customer}
                value={selectedCustomer}
                onChange={(val) => setSelectedCustomer(val)}
                placeholder={t('common.selectCustomer')}
              />
            </div>

            <CardFooter className='flex justify-end gap-2 mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpenCustomerModal(true)}
                className='flex items-center gap-2'
              >
                <UserPlus className='w-4 h-4' /> {t('common.addNewCustomer')}
              </Button>
              <Button type='submit' disabled={isSubmitting} className='flex items-center gap-2'>
                <Save className='w-4 h-4' /> {t('common.save')}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {openCustomerModal && (
        <AddModal
          openModal={openCustomerModal}
          setOpenModal={setOpenCustomerModal}
          title={t('customers.addTitle')}
          onSuccess={handleCustomerCreated}
        />
      )}
    </div>
  );
}
