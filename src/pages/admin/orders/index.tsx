import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import Pagination from '@/shared/components/pagination';
import { PaginatedOrders } from '@/shared/interfaces/order.interface';
import { formatDateWithTime, formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
    const response = await axios.get(`/api/orders?page=${currentPage}&limit=${limit}`);
    return response.data;
  });
  const totalPages = ordersData?.totalPages;
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const markAsPaidModalRef = useRef<HTMLDialogElement>(null);
  const { mutate, isLoading: isHasBeenPaidLoading } = useMutation(
    async (args: ChangePaidStatus) => {
      const response = await axios.patch(`/api/orders/${args.orderId}`, {
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
  const changePaidStatus = (args: ChangePaidStatus) => {
    mutate(args);
  };
  if (!isMounted) return null;
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-2xl">Orders</h2>
      </div>
      <section className="overflow-x-auto">
        {isLoading ? (
          <table className="flex h-96 items-center justify-center">
            <button className="btn btn-ghost disabled">
              <span className="loading loading-spinner"></span>
            </button>
          </table>
        ) : (
          <table className="table table-sm w-full">
            <thead>
              <tr>
                <th className="border !border-base-300">Ordered By</th>
                <th className="border !border-base-300">Phone Number</th>
                <th className="border !border-base-300">Total</th>
                <th className="border !border-base-300">Ordered At</th>
                <th className="border !border-base-300">Paid Status</th>
                <th className="border !border-base-300">Paid At</th>
                <th className="border !border-base-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.orders.map((order) => {
                return (
                  <tr key={order.id}>
                    <td className="border !border-base-300">{order.user.name}</td>
                    <td className="border !border-base-300">{order.user?.phone_number}</td>
                    <td className="border !border-base-300">&#8377; {formatPrice(order.totalPrice)}</td>
                    <td className="border !border-base-300">{formatDateWithTime(order.createdAt)}</td>
                    <td className="border !border-base-300 text-center">
                      {order.hasBeenPaid ? (
                        <div className="badge badge-sm badge-success">Paid</div>
                      ) : (
                        <div className="badge badge-sm badge-warning">Not Paid</div>
                      )}
                    </td>
                    <td className="border !border-base-300 text-center">{order?.paidAt ? formatDateWithTime(order.paidAt) : '-'}</td>
                    <td className="border !border-base-300 text-center">
                      {isHasBeenPaidLoading ? (
                        <button className="btn btn-xs btn-outline">
                          <span className="loading loading-spinner loading-xs"></span>
                        </button>
                      ) : (
                        <>
                          {order.hasBeenPaid ? (
                            <button
                              className="btn btn-warning btn-xs btn-outline  gap-1"
                              onClick={() => changePaidStatus({ hasBeenPaid: false, orderId: order.id })}>
                              <RxCross1></RxCross1> Mark as Unpaid
                            </button>
                          ) : (
                            <button
                              className="btn btn-success btn-xs btn-outline  gap-1"
                              onClick={() => changePaidStatus({ hasBeenPaid: true, orderId: order.id })}>
                              <AiOutlineCheck></AiOutlineCheck> Mark as Paid
                            </button>
                          )}
                        </>
                      )}

                      <button className="btn btn-error btn-xs btn-outline ml-2 gap-1">
                        <BsTrash></BsTrash>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {/* <dialog ref={markAsPaidModalRef} className="modal shadow-lg modal-bottom sm:modal-middle">
          <section className="modal-box">
            <h3 className="font-bold text-lg">Order Payment</h3>
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
      <div className="mt-8 flex justify-end place-self-end">
        {totalPages !== undefined && <Pagination {...{ currentPage, setCurrentPage, totalPages }}></Pagination>}
      </div>
    </>
  );
};

export default Orders;
Orders.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Orders">{page}</AdminDashboardLayout>;
};
