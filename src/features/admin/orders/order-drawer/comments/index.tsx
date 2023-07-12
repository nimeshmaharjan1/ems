import Pagination from '@/shared/components/pagination';
import { ICommentsData } from '@/shared/interfaces/comments.interface';
import { Order } from '@/shared/interfaces/order.interface';
import { formatDateWithTime } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useQueryClient, useQuery } from 'react-query';

const OrderComments: React.FC<{
  useFormMethods: UseFormReturn<{
    comment: string;
  }>;
  order: Order;
}> = ({ useFormMethods, order }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormMethods;

  const [isPostingComment, setIsPostingComment] = useState(false);
  const addComment: SubmitHandler<{ comment: string }> = async ({ comment }) => {
    setIsPostingComment(true);
    try {
      const response = await axios.post('/api/admin/orders/comments', {
        comment,
        orderId: order.id,
        userId: session?.user?.id,
      });
      useFormMethods.reset();
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
  } = useQuery<ICommentsData, Error>(['fetchComments', currentPage, limit, order.id], async () => {
    const response = await axios.get(`/api/admin/orders/comments/${order.id}?page=${currentPage}&limit=${limit}`);
    return response.data;
  });
  return (
    <>
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
          <button disabled={isPostingComment} className="btn btn-sm btn-secondary" onClick={handleSubmit(addComment)}>
            {isPostingComment && <span className="loading loading-sm"></span>}
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
            <section className="flex items-center mb-4 gap-x-3 first:mt-3 last:mb-0" key={comment.id}>
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
                <span>{comment.comment}</span>
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
    </>
  );
};

export default OrderComments;
