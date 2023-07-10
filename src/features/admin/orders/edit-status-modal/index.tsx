import { Order } from '@/shared/interfaces/order.interface';
import { ORDER_STATUS, PAYMENT_STATUS } from '@prisma/client';
import { Dispatch, SetStateAction, forwardRef, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { changeOrderStatus } from '../../services/orders';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { AxiosError } from 'axios';

type EditOrderStatusModalProps = {
  order: Order;
  setSelectedOrder: Dispatch<SetStateAction<Order | undefined>>;
};

const EditOrderStatusModal = forwardRef<HTMLDialogElement, EditOrderStatusModalProps>(({ order, setSelectedOrder }, ref) => {
  const [status, setStatus] = useState<undefined | ORDER_STATUS>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<undefined | PAYMENT_STATUS>(undefined);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(changeOrderStatus, {
    onSuccess: (data) => {
      showToast(Toast.success, data.message);
      queryClient.invalidateQueries(['fetchOrders']);
      (ref as any).current?.close();
    },
    onError: (error: any) => {
      showToast(Toast.error, error?.response?.data.message);
    },
  });
  const resetValues = () => {
    setSelectedOrder(undefined);
  };

  useEffect(() => {
    setStatus(order.status);
    setPaymentStatus(order.paymentStatus);
  }, [order.status, order.paymentStatus]);

  return (
    <dialog ref={ref} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="text-lg font-medium">Change Status [#{order.orderNumber}]</h3>
        <p className="py-4">
          Current Status: {order.status} & {order.paymentStatus}
        </p>
        <section className="form-control">
          <label htmlFor="Order Status" className="label">
            Order Status
          </label>
          <select
            value={status}
            disabled={isLoading}
            onChange={(e) => setStatus(e.target.value as ORDER_STATUS)}
            className="w-full select select-bordered">
            {Object.entries(ORDER_STATUS).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </section>
        <section className="mt-3 form-control">
          <label htmlFor="Order Status" className="label">
            Payment Status
          </label>
          <select
            disabled={isLoading}
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PAYMENT_STATUS)}
            className="w-full select select-bordered">
            {Object.entries(PAYMENT_STATUS).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </section>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button
            disabled={isLoading}
            type="button"
            onClick={() => {
              resetValues();
              (ref as any).current?.close();
            }}
            className="btn">
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              if (paymentStatus && status) {
                mutate({ paymentStatus, status, orderId: order.id });
              }
            }}
            disabled={isLoading}
            className="btn btn-primary">
            {isLoading && <span className="loading loading-spinner"></span>}
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
});

export default EditOrderStatusModal;

EditOrderStatusModal.displayName = 'Profile Modal';
