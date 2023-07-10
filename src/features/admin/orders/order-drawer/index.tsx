import Drawer from '@/shared/components/drawer';
import Pagination from '@/shared/components/pagination';
import { ICommentsData } from '@/shared/interfaces/comments.interface';
import { Order } from '@/shared/interfaces/order.interface';
import { formatDateWithTime, formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Comment, ORDER_STATUS, PAYMENT_STATUS } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';

const OrderDrawer: React.FC<{ order: Order; isDrawerOpen: boolean; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }> = ({
  order,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      comment: '',
    },
  });
  const { data: session } = useSession();
  const [isPostingComment, setIsPostingComment] = useState(false);
  const addComment: SubmitHandler<{ comment: string }> = async ({ comment }) => {
    setIsPostingComment(true);
    try {
      const response = await axios.post('/api/admin/orders/company', {
        comment,
        orderId: order.id,
        userId: session?.user?.id,
      });
      reset();
      queryClient.invalidateQueries('fetchComments');
      showToast(Toast.success, response.data?.message);
    } catch (error) {
      console.error(error);
      showToast(Toast.error, 'Something went wrong while trying to add the comment.');
    } finally {
      setIsPostingComment(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useQuery<ICommentsData, Error>(['fetchComments', currentPage, limit], async () => {
    const response = await axios.get(`/api/admin/orders/company?page=${currentPage}&limit=${limit}`);
    return response.data;
  });

  console.log({ comments });

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
              <p className="mt-3">Cart Items</p>
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
                <p className="flex justify-between mb-2">
                  <span>Delivery Charge</span>
                  <span>रू {formatPrice(order.deliveryCharge)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Total</span>
                  <span>रू {formatPrice(order.totalPrice)}</span>
                </p>
              </footer>
            </div>
          </div>
          <div className="col-span-2 card bg-base-200">
            <div className="card-body !flex-grow-0">
              <p className="!text-lg card-title">Customer Details</p>
              <p className="mt-3">
                <span className="font-semibold">Name: </span>
                {order.user.name}
              </p>
              <p className="mt-3">
                <span className="font-semibold">Email: </span>
                {order.user.email}
              </p>
              <p className="mt-3">
                <span className="font-semibold">Phone: </span>
                {order.user.phone_number}
              </p>
              {order?.additionalPhoneNumber && (
                <p className="mt-3">
                  <span className="font-semibold">Additional Phone: </span>
                  {order.additionalPhoneNumber}
                </p>
              )}
              <p className="mt-3">
                <span className="font-semibold">Address: </span>
                {order.customerAddress}
              </p>
            </div>
          </div>
        </section>
        <section className="mt-6 comment-section">
          <h4 className="font-semibold">Comments</h4>
          <div className="w-full form-control">
            <input
              disabled={isPostingComment}
              {...register('comment', {
                required: 'Comment is required.',
              })}
              type="text"
              className={classNames('mt-2 textarea', {
                'textarea-error': errors?.comment,
              })}
              placeholder="Write comment here..."
            />
            {errors?.comment?.message && <p className="mt-2 text-xs text-error">{errors?.comment?.message}</p>}
            <div className="mt-3">
              <button disabled={isPostingComment} className="btn btn-xs btn-primary" onClick={handleSubmit(addComment)}>
                {isPostingComment && <span className="loading loading-xs"></span>}
                Post Comment
              </button>
            </div>
          </div>
          <div className="p-2 mt-2 text-sm paginated-comments">
            {isCommentsError ? (
              <span className="text-error">Something went wrong while trying to get the comments.</span>
            ) : isCommentsLoading ? (
              <div className="flex items-center gap-3">
                <span className="loading loading-spinner"></span>
                <span>Loading comments...</span>
              </div>
            ) : (
              comments &&
              comments.data.map((comment) => (
                <section className="flex mb-4 gap-x-3 first:mt-3 last:mb-0" key={comment.id}>
                  <Image
                    width={50}
                    height={50}
                    className="rounded-full"
                    src={comment?.user?.image || '/icons/default-user.png'}
                    alt={comment.comment}></Image>
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-12">
                      <span className="font-semibold">{comment.user?.name}</span>
                      <span className="text-xs">{formatDateWithTime(comment.createdAt)}</span>
                    </div>
                    <span className="text-sm">{comment.comment}</span>
                  </div>
                </section>
              ))
            )}
          </div>
          <div className="flex justify-end mt-3 place-self-end">
            {comments?.totalPages !== undefined && (
              <Pagination {...{ currentPage, setCurrentPage }} totalPages={comments.totalPages}></Pagination>
            )}
          </div>
        </section>
      </Drawer>
    </>
  );
};

export default OrderDrawer;
