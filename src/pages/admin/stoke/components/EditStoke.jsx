import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save, CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import API from '@/config/config';
import { useQueryClient } from '@tanstack/react-query';
import InputField from '@/components/form/InputField';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '@/store/Store';

export default function EditStoke() {
  const { product } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPackage, setIsPackage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      five_kg: '',
      twelve_kg: '',
      twentyfive_kg: '',
      thirtythree_kg: '',
      thirtyfive_kg: '',
      fourtyfive_kg: '',
      others_kg: '',
      empty_twelve_kg: '',
      empty_twentyfive_kg: '',
      empty_thirtythree_kg: '',
      empty_thirtyfive_kg: '',
      empty_fourtyfive_kg: '',
      empty_others_kg: '',
      price: '',
      date: null,
    },
  });

  const date = watch('date');

  // Sync product data when it's available
  useEffect(() => {
    if (product) {
      reset({
        five_kg: product.five_kg || '',
        twelve_kg: product.twelve_kg || '',
        twentyfive_kg: product.twentyfive_kg || '',
        thirtythree_kg: product.thirtythree_kg || '',
        thirtyfive_kg: product.thirtyfive_kg || '',
        fourtyfive_kg: product.fourtyfive_kg || '',
        others_kg: product.others_kg || '',
        empty_twelve_kg: product.empty_twelve_kg || '',
        empty_twentyfive_kg: product.empty_twentyfive_kg || '',
        empty_thirtythree_kg: product.empty_thirtythree_kg || '',
        empty_thirtyfive_kg: product.empty_thirtyfive_kg || '',
        empty_fourtyfive_kg: product.empty_fourtyfive_kg || '',
        empty_others_kg: product.empty_others_kg || '',
        price: product.price || '',
        date: product.date ? new Date(product.date) : null,
      });
      setIsPackage(!!product.is_package);
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      date: data.date ? format(data.date, 'yyyy-MM-dd') : null,
      is_package: isPackage,
    };

    await toast.promise(API.put(`/api/products/${id}`, payload), {
      loading: 'Updating...',
      success: (res) => {
        toast.success(res.data?.message || 'Stock updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        navigate('/admin/stoke');
      },
      error: (err) =>
        toast.error(err.response?.data?.message || 'Something went wrong'),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Stock</CardTitle>
        <CardDescription>Update stock entry</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <InputField className="bg-white" id="five_kg" type="number" label="5 KG" register={register} error={errors.five_kg} />
          <InputField className="bg-white" id="twelve_kg" type="number" label="12 KG" register={register} error={errors.twelve_kg} />
          <InputField className="bg-white" id="twentyfive_kg" type="number" label="25 KG" register={register} error={errors.twentyfive_kg} />
          <InputField className="bg-white" id="thirtythree_kg" type="number" label="33 KG" register={register} error={errors.thirtythree_kg} />
          <InputField className="bg-white" id="thirtyfive_kg" type="number" label="35 KG" register={register} error={errors.thirtyfive_kg} />
          <InputField className="bg-white" id="fourtyfive_kg" type="number" label="45 KG" register={register} error={errors.fourtyfive_kg} />
     
 
          <InputField className="bg-white" id="empty_five_kg" type="number" label="Empty 5 KG" register={register} error={errors.empty_five_kg} />
           <InputField className="bg-white" id="empty_twelve_kg" type="number" label="Empty 12 KG" register={register} error={errors.empty_twelve_kg} />
          <InputField className="bg-white" id="empty_twentyfive_kg" type="number" label="Empty 25 KG" register={register} error={errors.empty_twentyfive_kg} />
          <InputField className="bg-white" id="empty_thirtythree_kg" type="number" label="Empty 33 KG" register={register} error={errors.empty_thirtythree_kg} />
          <InputField className="bg-white" id="empty_thirtyfive_kg" type="number" label="Empty 35 KG" register={register} error={errors.empty_thirtyfive_kg} />
          <InputField className="bg-white" id="empty_fourtyfive_kg" type="number" label="Empty 45 KG" register={register} error={errors.empty_fourtyfive_kg} />

          <InputField className="bg-white" id="price" type="number" label="Price" register={register} error={errors.price} />

          {/* Date Picker */}
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="justify-start text-left font-normal w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(new Date(date), 'dd-MM-yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(val) => setValue('date', val)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>

          {/* Package Switch */}
          <div className="flex gap-2 items-center">
            <Label>Is Package?</Label>
            <Switch checked={isPackage} onCheckedChange={setIsPackage} className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"/>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Update
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
