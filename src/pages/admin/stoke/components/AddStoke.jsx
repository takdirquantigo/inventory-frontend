import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

export default function AddStoke() {
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

      const payload = {
        ...data,
        date: formattedDate,
        is_package: isPackage,
      };

      await toast.promise(
        API.post('/api/products', payload),
        {
          loading: 'Saving...',
          success: (res) => {
            toast.success('Stock saved successfully!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            reset();
            navigate('/admin/stoke');
          },
          error: (err) => {
            toast.error(err.response?.data?.message || 'Something went wrong');
          },
        }
      );

      queryClient.invalidateQueries({ queryKey: ['products'] });
      reset();

    } catch (err) {

    }
  };

  const date = watch('date');

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Add Stoke</CardTitle>
        <CardDescription>Add new stock entry</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          <InputField id='five_kg' type='number' className='bg-white' label='5 KG' register={register} error={errors.five_kg} />
          <InputField id='twelve_kg' type='number' className='bg-white' label='12 KG' register={register} error={errors.twelve_kg} />
          <InputField id='twentyfive_kg' type='number' className='bg-white' label='25 KG' register={register} error={errors.twentyfive_kg} />
          <InputField id='thirtythree_kg' type='number' className='bg-white' label='33 KG' register={register} error={errors.thirtythree_kg} />
          <InputField id='thirtyfive_kg' type='number' className='bg-white' label='35 KG' register={register} error={errors.thirtyfive_kg} />
          <InputField id='fourtyfive_kg' type='number' className='bg-white' label='45 KG' register={register} error={errors.fourtyfive_kg} />
          {/* <InputField id='others_kg' type='number' className='bg-white' label='Others KG' register={register} error={errors.others_kg} /> */}

          <InputField id='empty_five_kg' type='number' className='bg-white' label='Empty 5 KG' register={register} error={errors.empty_five_kg} />
          <InputField id='empty_twelve_kg' type='number' className='bg-white' label='Empty 12 KG' register={register} error={errors.empty_twelve_kg} />
          <InputField id='empty_twentyfive_kg' type='number' className='bg-white' label='Empty 25 KG' register={register} error={errors.empty_twentyfive_kg} />
          <InputField id='empty_thirtythree_kg' type='number' className='bg-white' label='Empty 33 KG' register={register} error={errors.empty_thirtythree_kg} />
          <InputField id='empty_thirtyfive_kg' type='number' className='bg-white' label='Empty 35 KG' register={register} error={errors.empty_thirtyfive_kg} />
          <InputField id='empty_fourtyfive_kg' type='number' className='bg-white' label='Empty 45 KG' register={register} error={errors.empty_fourtyfive_kg} />
          {/* <InputField id='empty_others_kg' type='number' className='bg-white' label='Empty Others KG' register={register} error={errors.empty_others_kg} /> */}

          <InputField id='price' type='number' className='bg-white' label='Price' register={register} error={errors.price} />

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start text-left font-normal w-full"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "dd-MM-yyyy")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(val) => {
                    setSelectedDate(val);
                    setValue("date", val); 
                  }}
                  initialFocus
                  className="rounded-md border shadow-md w-full"
                  dayClassName={(day) => {
                    if (
                      selectedDate &&
                      format(day, "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd")
                    ) {
                      return "bg-blue-500 text-white rounded-full";
                    }
                    return "";
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className='text-sm text-red-500'>{errors.date.message}</p>}
          </div>

          <div className='flex gap-2 items-center'>
            <Label>Is Package?</Label>

            <div>
              <Switch checked={isPackage} onCheckedChange={setIsPackage} className='data-[state=unchecked]:bg-red-500 data-[state=checked]:bg-green-500' />
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex justify-end'>
          <Button type='submit' disabled={isSubmitting} className='flex items-center gap-2'>
            <Save className='w-4 h-4' /> Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
