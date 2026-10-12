import InputField from '@/components/form/InputField';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import API from '@/config/config';
import { useQueryClient } from '@tanstack/react-query';
import { DialogContent } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

export default function EditModal({ data }) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const queryClient = useQueryClient();

  // Pre-fill form when singleData changes
  useEffect(() => {
    if (data) {
      setValue('id', data.id);
      setValue('name', data.name || '');
      setValue('phone', data.phone || '');
      setValue('address', data.address || '');
      setValue('password', '');
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    await toast.promise(
      API.post('/api/customers', formData),
      {
        loading: t('toast.saving'),
        success: (res) => {
          const loginId = res?.data?.customer_login_id;
          return loginId
            ? t('customers.updatedWithId', { id: loginId })
            : t('customers.updated');
        },
        error: (error) => error.response?.data?.error || error.response?.data?.message || t('toast.somethingWrong'),
      }
    );

    queryClient.invalidateQueries({ queryKey: ['customer'] });
    reset();
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden ID field */}
        <input type="hidden" {...register('id')} />

        {/* Customer Name */}
        <div className="mt-4">
          <InputField
            label={t('customers.name')}
            id="name"
            type="text"
            placeholder={t('customers.enterName')}
            register={register}
            error={errors.name}
            validation={{ required: t('customers.nameRequired') }}
          />
        </div>

        {/* Phone */}
        <div className="mt-4">
          <InputField
            label={t('common.phone')}
            id="phone"
            type="number"
            placeholder={t('customers.enterPhone')}
            register={register}
            error={errors.phone}
          />
        </div>

        {/* Address */}
        <div className="mt-4">
          <InputField
            label={t('common.address')}
            id="address"
            type="text"
            placeholder={t('customers.enterAddress')}
            register={register}
            error={errors.address}
          />
        </div>

        {data?.customer_login_id && (
          <p className="text-sm text-muted-foreground">
            {t('customers.portalIdLabel')}{' '}
            <span className="font-mono font-semibold text-foreground">{data.customer_login_id}</span>
          </p>
        )}

        <div className="mt-4">
          <InputField
            label={t('customers.newPassword')}
            id="password"
            type="password"
            placeholder={t('customers.leaveBlank')}
            register={register}
            validation={{
              validate: (v) => !v || String(v).length >= 6 || t('validation.min6'),
            }}
            error={errors.password}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary-light cursor-pointer font-semibold w-full"
        >
          <Save className="mr-2" /> {isSubmitting ? t('common.submitting') : t('customers.saveChanges')}
        </Button>
      </form>
    </DialogContent>
  );
}
