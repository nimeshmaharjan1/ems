import Drawer from '@/shared/components/drawer';
import { Order } from '@/shared/interfaces/order.interface';
import { formatDateWithTime } from '@/shared/utils/helper.util';
import { ORDER_STATUS, PAYMENT_STATUS } from '@prisma/client';
import classNames from 'classnames';
import { ArrowRight } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

const OrderDrawer: React.FC<{ order: Order; isDrawerOpen: boolean; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }> = ({
  order,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  return (
    <>
      <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
        <header className="flex items-center justify-between">
          <p className="text-xl font-bold">#{order.orderNumber}</p>
          <button className="btn btn-sm btn-ghost">
            <ArrowRight size={18}></ArrowRight>
          </button>
        </header>
        <section className="flex gap-3 mt-2 date-section">
          <p className="text-xs">
            <span className="font-semibold">Created: </span>
            {formatDateWithTime(order.createdAt)}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Modified: </span>
            {formatDateWithTime(order.updatedAt)}
          </p>
        </section>
        <section className="flex items-center gap-3 mt-4 text-sm status-section">
          <p className="font-semibold">Status: </p>
          <span
            className={classNames('badge badge-sm', {
              'badge-neutral': order.paymentStatus === PAYMENT_STATUS.Unpaid,
              'badge-success': order.paymentStatus === PAYMENT_STATUS.Paid,
              'badge-error': order.paymentStatus === PAYMENT_STATUS.Refunded,
            })}>
            {order.paymentStatus}
          </span>{' '}
          &{' '}
          <span
            className={classNames('badge badge-sm', {
              'badge-neutral': order.status === ORDER_STATUS.Pending,
              'badge-warning': order.status === ORDER_STATUS.Processing,
              'badge-accent': order.status === ORDER_STATUS.Dispatched,
              'badge-success': order.status === ORDER_STATUS.Delivered,
              'badge-error': order.status === ORDER_STATUS.Cancelled || order.status === ORDER_STATUS.Returned,
            })}>
            {order.status}
          </span>
        </section>
        <p className="mt-4 text-sm">
          <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
        </p>
        <p className="mt-4 text-sm">
          <span className="font-semibold">Created By:</span> {order.user.name}
        </p>
        <section className="grid grid-cols-6 gap-3 mt-4">
          <div className="col-span-4 card bg-base-200">
            <div className="card-body">
              <p className="!text-lg card-title">Order Summary</p>
              <p className="mt-2">Cart Items</p>
            </div>
          </div>
          <div className="col-span-2 card bg-base-200">
            <div className="card-body">
              <p className="!text-lg card-title">Customer Details</p>
            </div>
          </div>
        </section>
      </Drawer>
    </>
  );
};

export default OrderDrawer;
