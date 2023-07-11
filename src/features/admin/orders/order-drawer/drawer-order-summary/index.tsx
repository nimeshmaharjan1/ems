import { Order } from '@/shared/interfaces/order.interface';
import { formatPrice } from '@/shared/utils/helper.util';
import { PAYMENT_STATUS } from '@prisma/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const DrawerOrderSummary: React.FC<{ order: Order }> = ({ order }) => {
  const [partiallyPaidAmount, setPartiallyPaidAmount] = useState(order.partiallyPaidAmount);
  const [amountLeftToPay, setAmountLeftToPay] = useState(order.amountLeftToPay);

  useEffect(() => {
    setPartiallyPaidAmount(order.partiallyPaidAmount);
    setAmountLeftToPay(order.amountLeftToPay);
  }, [order]);
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
          <p className="flex justify-between mb-2 font-semibold text-[0.95rem]">
            <span>Delivery Charge</span>
            <span>रू {formatPrice(order.deliveryCharge)}</span>
          </p>
          <p className="flex justify-between mb-2 font-semibold text-[0.95rem]">
            <span>Total</span>
            <span>रू {formatPrice(order.totalPrice)}</span>
          </p>
          {order.selectedWholesaleOption && order.paymentStatus !== PAYMENT_STATUS.Paid && (
            <>
              <p className="flex justify-between mb-2 font-semibold text-[0.95rem]">
                <span>Partially Paid</span>
                <span>रू {formatPrice(partiallyPaidAmount)}</span>
              </p>
              <p className="flex justify-between  font-semibold text-[0.95rem]">
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
