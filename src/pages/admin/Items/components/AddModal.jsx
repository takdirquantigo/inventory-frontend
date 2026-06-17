import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import API from '@/config/config';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/common/modal';
import InputField from '@/components/form/InputField';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

function toCylinderFlag(value) {
  return value === 1 || value === true || value === '1' || value === 'true';
}

export default function AddModal({ openModal, setOpenModal, title, singleData, setSingleData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isCylinder, setIsCylinder] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = Boolean(singleData?.id);

  useEffect(() => {
    if (singleData?.id) {
      reset({
        name: singleData.name ?? '',
        price: singleData.price ?? '',
        description: singleData.description ?? '',
      });
      setIsCylinder(toCylinderFlag(singleData.is_cylinder));
    } else {
      reset({ name: '', price: '', description: '' });
      setIsCylinder(false);
    }
  }, [singleData, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('description', data.description ?? '');
    formData.append('is_cylinder', isCylinder ? '1' : '0');
    if (data.picture?.[0]) {
      formData.append('image', data.picture[0]);
    }

    if (!isEdit && !data.picture?.[0]) {
      toast.error('Picture is required for new items');
      return;
    }

    // PHP does not parse multipart FormData on PUT; spoof method via POST
    let request;
    if (isEdit) {
      formData.append('_method', 'PUT');
      request = API.post(`/api/items/${singleData.id}`, formData);
    } else {
      request = API.post('/api/items', formData);
    }

    await toast.promise(request, {
      loading: 'Saving...',
      success: isEdit ? 'Item updated successfully!' : 'Item saved successfully!',
      error: (error) => error.response?.data?.message || 'Something went wrong',
    });

    queryClient.invalidateQueries({ queryKey: ['items'] });
    reset();
    setSingleData(null);
    setOpenModal(false);
  };

  return (
    <Modal open={openModal} onOpenChange={setOpenModal} title={title ?? ''} onClose={() => setSingleData(null)} className='lg:min-w-1/4 min-w-md'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='mt-4'>
          <InputField label='Items Name' id='name' type='text' placeholder='name' register={register} error={errors.name} validation={{ required: 'Name is required' }} />
        </div>

        <div className='mt-4'>
          <InputField label='Price' id='price' type='number' placeholder='price' register={register} validation={{ required: 'Price is required' }} error={errors.price} />
        </div>
        <div className='mt-4'>
          <Label htmlFor='address'>Description</Label>
          <Textarea className='mt-2' {...register('description')} />
        </div>
        <div className='flex items-center space-x-2'>
          <Switch checked={isCylinder} onCheckedChange={setIsCylinder} id='is-cylinder' />
          <Label htmlFor='is-cylinder'>Is Cylinder?</Label>
        </div>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <InputField label={isEdit ? 'Picture (optional)' : 'Picture'} id='picture' type='file' placeholder='picture' register={register} error={errors.picture} />
        </div>

        <Button type='submit' disabled={isSubmitting} className='btn btn-primary-light cursor-pointer font-semibold w-full'>
          <Save className='mr-2' /> {isSubmitting ? 'Submitting...' : isEdit ? 'Update' : 'Submit'}
        </Button>
      </form>
    </Modal>
  );
}
