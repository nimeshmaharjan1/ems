import { Order } from '@/shared/interfaces/order.interface';
import { formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { PAYMENT_STATUS } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import { ArrowRight, Settings } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

const DrawerOrderSummary: React.FC<{ order: Order }> = ({ order }) => {
  const [partiallyPaidAmount, setPartiallyPaidAmount] = useState(order.partiallyPaidAmount);
  const [amountLeftToPay, setAmountLeftToPay] = useState(order.amountLeftToPay);
  const queryClient = useQueryClient();
  useEffect(() => {
    setPartiallyPaidAmount(order.partiallyPaidAmount);
    setAmountLeftToPay(order.amountLeftToPay);
  }, [order]);

  const [editDeliveryCharge, setEditDeliveryCharge] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      deliveryCharge: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const changeDeliveryPrice: SubmitHandler<{ deliveryCharge: string }> = async ({ deliveryCharge }) => {
    setIsLoading(true);
    try {
      await axios.patch('/api/admin/orders/change-delivery-charge', {
        orderId: order.id,
        deliveryCharge: parseFloat(deliveryCharge),
      });
      showToast(Toast.success, 'Delivery charge updated.');
      queryClient.invalidateQueries('fetchOrders');
    } catch (error) {
      console.error(error);
      showToast(Toast.error, 'Something went wrong while trying to update the delivery charge updated.');
    } finally {
      setEditDeliveryCharge(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card-body">
        <p className="!text-lg card-title">Order Summary</p>
        <p className="mt-1">Cart Items</p>
        <section className="flex flex-col w-full py-6 mt-2 border-t border-b gap-y-6 cart-item-section">
          {order.items.map((item) => (
            <div className="flex items-center justify-between w-full gap-x-6" key={item.id}>
              <div className="relative">
                <Image className="rounded" height={80} width={80} src={item.product.images[0]} alt={item.product.title}></Image>
                <span className="absolute !text-white badge badge-secondary badge-sm -top-1 -right-2">{item.quantity}</span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  रू {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <div>
                <p>रू {formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </section>
        <footer className="mt-3">
          <p className="flex justify-between mb-3 font-semibold text-[0.95rem]">
            <span>Delivery Charge</span>
            <div className="flex items-center gap-3">
              {editDeliveryCharge ? (
                <>
                  <input
                    type="text"
                    disabled={isLoading}
                    className={classNames('input input-xs input-bordered', {
                      'input-error': errors?.deliveryCharge,
                    })}
                    placeholder="Type delivery price here..."
                    {...register('deliveryCharge', {
                      required: true,
                    })}
                  />
                  <button disabled={isLoading} className="btn btn-xs btn-outline" onClick={handleSubmit(changeDeliveryPrice)}>
                    <ArrowRight size={16}></ArrowRight>
                  </button>
                </>
              ) : (
                <>
                  <span>रू {formatPrice(order.deliveryCharge)}</span>
                  <Settings
                    strokeWidth={1.25}
                    className="transition-all hover:text-primary "
                    size={18}
                    onClick={() => setEditDeliveryCharge(true)}></Settings>
                </>
              )}
            </div>
          </p>
          <p className="flex justify-between mb-3 font-semibold text-[0.95rem]">
            <span>Total</span>
            <span>रू {formatPrice(order.totalPrice)}</span>
          </p>
          {order.selectedWholesaleOption && order.paymentStatus !== PAYMENT_STATUS.Paid && (
            <>
              <p className="flex justify-between mb-3 font-semibold text-[0.95rem]">
                <span>Partially Paid</span>
                <span>रू {formatPrice(partiallyPaidAmount)}</span>
              </p>
              <p className="flex justify-between font-semibold text-[0.95rem]">
                <span>Amount Left To Pay</span>
                <span>रू {formatPrice(amountLeftToPay)}</span>
              </p>
            </>
          )}
        </footer>
      </div>
    </>
  );
};

export default DrawerOrderSummary;
