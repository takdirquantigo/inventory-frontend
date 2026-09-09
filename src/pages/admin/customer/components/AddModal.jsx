import React from 'react';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as LucideIcons from "lucide-react";
import { Button } from '@/components/ui/button';
import API from '@/config/config';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/common/modal';
import InputField from '@/components/form/InputField';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';


export default function AddModal({
  openModal,
  setOpenModal,
  title,
  singleData,
  setSingleData,
  onSuccess,
}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      password: '123456',
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    const res = await toast.promise(
      API.post('/api/customers', data),
      {
        loading: 'Saving...',
        success: (response) => {
          const loginId = response?.data?.customer_login_id;
          return loginId
            ? `Customer saved. Portal ID: ${loginId} (share this with the customer).`
            : 'Customer saved successfully!';
        },
        error: (error) => error.response?.data?.error || error.response?.data?.message || 'Something went wrong',
      }
    );

    queryClient.invalidateQueries({ queryKey: ['customer'] });
    onSuccess?.(res?.data);
    reset();
    setSingleData?.(null);
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      title={title ?? ''}
      onClose={() => setSingleData?.(null)}
      className="lg:min-w-1/4 min-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mt-4">
          <InputField
            label="Customer Name"
            id="name"
            type="text"
            placeholder="name"
            register={register}
            error={errors.name}
            validation={{ required: "Customer Name is required" }}
          />
        </div>

        <div className="mt-4">
          <InputField
            label="Phone"
            id="phone"
            type="number"
            placeholder="phone"
            register={register}
            error={errors.phone}
           
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="address" className="mb-2">Address</Label>
          <Textarea
           {...register('address')}
           error={errors.address}
          />
        </div>
        <div className="mt-4">
          <InputField
            label="Portal password"
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            register={register}
            validation={{ required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } }}
            error={errors.password}
          />
          <p className="text-xs text-muted-foreground mt-1">
            A unique 6-digit customer ID is created automatically for portal login.
          </p>
        </div>



        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary-light cursor-pointer font-semibold w-full"
        >
          <Save className="mr-2" /> {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Modal>
  );
}