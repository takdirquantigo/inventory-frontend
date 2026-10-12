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
import { useTranslation } from 'react-i18next';

function toCylinderFlag(value) {
  return value === 1 || value === true || value === '1' || value === 'true';
}

export default function AddModal({ openModal, setOpenModal, title, singleData, setSingleData }) {
  const { t } = useTranslation();
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
      toast.error(t('items.pictureRequired'));
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
      loading: t('toast.saving'),
      success: isEdit ? t('items.updated') : t('items.saved'),
      error: (error) => error.response?.data?.message || t('toast.somethingWrong'),
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
          <InputField label={t('items.name')} id='name' type='text' placeholder={t('customers.namePlaceholder')} register={register} error={errors.name} validation={{ required: t('items.nameRequired') }} />
        </div>

        <div className='mt-4'>
          <InputField label={t('common.price')} id='price' type='number' placeholder={t('common.price')} register={register} validation={{ required: t('items.priceRequired') }} error={errors.price} />
        </div>
        <div className='mt-4'>
          <Label htmlFor='address'>{t('common.description')}</Label>
          <Textarea className='mt-2' {...register('description')} />
        </div>
        <div className='flex items-center space-x-2'>
          <Switch checked={isCylinder} onCheckedChange={setIsCylinder} id='is-cylinder' />
          <Label htmlFor='is-cylinder'>{t('items.isCylinder')}</Label>
        </div>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <InputField label={isEdit ? t('items.pictureOptional') : t('items.picture')} id='picture' type='file' placeholder='picture' register={register} error={errors.picture} />
        </div>

        <Button type='submit' disabled={isSubmitting} className='btn btn-primary-light cursor-pointer font-semibold w-full'>
          <Save className='mr-2' /> {isSubmitting ? t('common.submitting') : isEdit ? t('common.update') : t('common.submit')}
        </Button>
      </form>
    </Modal>
  );
}
