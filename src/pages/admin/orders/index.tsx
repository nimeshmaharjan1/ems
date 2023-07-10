import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import Pagination from '@/shared/components/pagination';
import { PaginatedOrders } from '@/shared/interfaces/order.interface';
import { formatDateWithTime, formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import EditOrderStatusModal from './edit-status-modal';
interface ChangePaidStatus {
  orderId: string;
  hasBeenPaid: boolean;
}
const Orders: NextPageWithLayout = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const {
    data: ordersData,
    isError,
    isLoading,
  } = useQuery<PaginatedOrders, Error>(['fetchProducts', currentPage, limit], async () => {
    const response = await axios.get(`/api/admin/orders?page=${currentPage}&limit=${limit}`);
    return response.data;
  });
  const totalPages = ordersData?.totalPages;
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const markAsPaidModalRef = useRef<HTMLDialogElement>(null);

  const { mutate: mutateHasBeenPaid, isLoading: isHasBeenPaidLoading } = useMutation(
    async (args: ChangePaidStatus) => {
      const response = await axios.patch(`/api/admin/orders/${args.orderId}`, {
        hasBeenPaid: args.hasBeenPaid,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        showToast(Toast.success, data?.message);
        queryClient.invalidateQueries({ queryKey: ['fetchProducts'] });
      },
      onError: (error: any) => {
        showToast(Toast.error, error?.response?.data?.message);
      },
    }
  );
  const { mutate: mutateDeleteOrder, isLoading: isOrderDeleting } = useMutation(
    async (args: { orderId: string }) => {
      const response = await axios.delete(`/api/admin/orders/${args.orderId}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        showToast(Toast.success, data?.message);
        queryClient.invalidateQueries({ queryKey: ['fetchProducts'] });
      },
      onError: (error: any) => {
        showToast(Toast.error, error?.response?.data?.message);
      },
    }
  );
  const changePaidStatus = (args: ChangePaidStatus) => {
    mutateHasBeenPaid(args);
  };

  const edit_order_status_modal_ref = useRef<HTMLDialogElement>(null);

  if (!isMounted) return null;
  return (
    <>
      {isError ? (
        <h2 className="text-error">Something went wrong while trying to get the orders.</h2>
      ) : (
        <>
          <section className="flex justify-end mb-4">
            <button className="btn btn-primary btn-sm">Create Order</button>
          </section>
          <section className="overflow-x-auto">
            {isLoading ? (
              <table className="flex items-center justify-center h-96">
                <button className="btn btn-ghost disabled">
                  <span className="loading loading-spinner"></span>
                </button>
              </table>
            ) : (
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>#</th>
                    <th className="">Customer Name</th>
                    <th className="">Quantity</th>
                    <th className="">Total Price</th>
                    <th className="">Payment Status</th>
                    <th className="">Payment Method</th>
                    <th className="">Status</th>
                    <th className="">Ordered At</th>
                    <th className="">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData?.orders?.length === 0 && <h2 className="p-2 text-warning">No orders have been listed at this moment.</h2>}
                  {ordersData &&
                    ordersData.orders.length > 0 &&
                    ordersData?.orders.map((order) => {
                      return (
                        <tr key={order.id}>
                          <td>{order.orderNumber}</td>
                          <td className="">{order.user.name}</td>
                          <td className="">{order.items.length}</td>
                          {/* <td className="">{order.user?.phone_number}</td> */}
                          <td className="">रू {formatPrice(order.totalPrice)}</td>

                          <td className="text-center">
                            {order.hasBeenPaid ? (
                              <div className="uppercase badge badge-sm badge-success">Paid</div>
                            ) : (
                              <div className="uppercase badge badge-sm badge-neutral">Unpaid</div>
                            )}
                          </td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <p className="badge badge-sm badge-neutral">{order.status}</p>
                          </td>
                          <td className="">{formatDateWithTime(order.createdAt)}</td>
                          <td>
                            {' '}
                            {/* {isHasBeenPaidLoading ? (
                                <button className="btn btn-xs btn-outline">
                                  <span className="loading loading-spinner loading-xs"></span>
                                </button>
                              ) : ( */}
                            {/* <>
                                {order.hasBeenPaid ? (
                                  <button
                                    disabled={isHasBeenPaidLoading}
                                    className="gap-1 btn btn-warning btn-xs btn-outline"
                                    onClick={() => changePaidStatus({ hasBeenPaid: false, orderId: order.id })}>
                                    <RxCross1></RxCross1> Mark as Unpaid
                                  </button>
                                ) : (
                                  <button
                                    disabled={isHasBeenPaidLoading}
                                    className="gap-1 btn btn-success btn-xs btn-outline"
                                    onClick={() => changePaidStatus({ hasBeenPaid: true, orderId: order.id })}>
                                    <AiOutlineCheck></AiOutlineCheck> Mark as Paid
                                  </button>
                                )}
                              </> */}
                            <button
                              className="gap-1 ml-2 btn btn-error btn-xs btn-outline"
                              onClick={() => mutateDeleteOrder({ orderId: order.id })}>
                              {isOrderDeleting ? <span className="loading loading-spinner loading-xs"></span> : <BsTrash></BsTrash>}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
            {/* <dialog ref={markAsPaidModalRef} className="shadow-lg modal modal-bottom sm:modal-middle">
          <section className="modal-box">
            <h3 className="text-lg font-bold">Order Payment</h3>
            <p className="py-4 font-medium">Mark this order as paid?</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => markAsPaidModalRef.current?.close()}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => change}>Mark as Paid</button>
            </div>
          </section>
        </dialog> */}
          </section>
          <div className="flex justify-end mt-8 place-self-end">
            {totalPages !== undefined && <Pagination {...{ currentPage, setCurrentPage, totalPages }}></Pagination>}
          </div>
          <EditOrderStatusModal ref={edit_order_status_modal_ref}></EditOrderStatusModal>
        </>
      )}
    </>
  );
};

export default Orders;
Orders.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Orders">{page}</AdminDashboardLayout>;
};
