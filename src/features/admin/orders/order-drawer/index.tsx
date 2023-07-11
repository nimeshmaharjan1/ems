import Drawer from '@/shared/components/drawer';
import Pagination from '@/shared/components/pagination';
import { ICommentsData } from '@/shared/interfaces/comments.interface';
import { Order } from '@/shared/interfaces/order.interface';
import { formatDateWithTime, formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Comment, ORDER_STATUS, PAYMENT_STATUS, SELECTED_WHOLESALE_OPTION } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import OrderComments from './comments';
import OrderCustomerDetails from './customer-details';
import DrawerOrderSummary from './drawer-order-summary';
import PartiallyPaid from './partially-paid';

const OrderDrawer: React.FC<{ order: Order; isDrawerOpen: boolean; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }> = ({
  order,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const useFormMethods = useForm({
    defaultValues: {
      comment: '',
    },
  });
  console.log({ order });

  return (
    <>
      <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
        <header className="flex items-center justify-between">
          <p className="text-xl font-bold">#{order.orderNumber}</p>
          <button className="btn btn-sm btn-ghost" onClick={() => setIsDrawerOpen(false)}>
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
              'badge-accent': order.paymentStatus === PAYMENT_STATUS.Partial,
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
        {order.selectedWholesaleOption && (
          <p className="mt-4 text-sm">
            <span className="font-semibold">Selected Wholesale Option:</span> {order.selectedWholesaleOption}
          </p>
        )}
        {order.selectedWholesaleOption && order.paymentStatus !== PAYMENT_STATUS.Paid && (
          <section className="mt-2 mb-6 partially-paid-section">
            <PartiallyPaid {...{ order, setIsDrawerOpen }}></PartiallyPaid>
          </section>
        )}
        <section className="grid grid-cols-6 gap-3 mt-4">
          <div className="col-span-4 card bg-base-200">
            <DrawerOrderSummary order={order}></DrawerOrderSummary>
          </div>
          <div className="col-span-2 card bg-base-200">
            <OrderCustomerDetails order={order}></OrderCustomerDetails>
          </div>
        </section>

        <section className="mt-6 comment-section">
          <OrderComments {...{ useFormMethods, order }}></OrderComments>
        </section>
      </Drawer>
    </>
  );
};

export default OrderDrawer;
