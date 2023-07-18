import { addPartialPayment } from '@/features/admin/services/orders';
import { Order } from '@/shared/interfaces/order.interface';
import { Toast, showToast } from '@/shared/utils/toast.util';
import classNames from 'classnames';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

const PartiallyPaid: React.FC<{ order: Order; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }> = ({ order, setIsDrawerOpen }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate, isError } = useMutation(addPartialPayment, {
    onSuccess: (data) => {
      showToast(Toast.success, data?.message);
      queryClient.invalidateQueries('fetchOrders');
      reset();
      setIsDrawerOpen(false);
    },
    onError: (error: any) => {
      if (error?.response?.data?.isInputError) {
        setError('partiallyPaidAmount', { type: 'required', message: error?.response?.data?.message });
      }
      showToast(Toast.error, error?.response?.data?.message);
    },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm({
    defaultValues: {
      partiallyPaidAmount: '',
    },
  });

  return (
    <>
      <div className="form-control">
        <label htmlFor="Partially Paid" className="label !text-sm">
          Partially Paid Amount
        </label>
        <input
          placeholder="Type the partially paid amount here..."
          disabled={isLoading}
          {...register('partiallyPaidAmount', {
            required: 'Partially paid amount is required.',
          })}
          type="text"
          className={classNames('input', {
            'input-error': errors?.partiallyPaidAmount,
          })}
        />
        {isError && <span className="mt-2 text-sm text-error">{errors?.partiallyPaidAmount?.message}</span>}
      </div>
      <div className="mt-4">
        <button
          className="btn btn-primary btn-sm"
          disabled={isLoading}
          onClick={handleSubmit((values) => {
            mutate({ orderId: order.id, partiallyPaidAmount: parseFloat(values.partiallyPaidAmount) });
          })}>
          {isLoading && <span className="loading loading-spinner loading-sm"></span>}
          Add Partial Payment
        </button>
      </div>
    </>
  );
};

export default PartiallyPaid;
