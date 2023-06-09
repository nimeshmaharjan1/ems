import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import { formatDateWithTime, formatPrice, getDateWithWeekDay } from '@/shared/utils/helper.util';
import Link from 'next/link';
import { FaCogs } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import Pagination from '@/shared/components/pagination';
import { AiOutlineCheck } from 'react-icons/ai';

const Orders: NextPageWithLayout = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const {
    data: ordersData,
    isError,
    isLoading,
  } = useQuery<any, Error>(['fetchProducts', currentPage, limit], async () => {
    const response = await axios.get(`/api/orders?page=${currentPage}&limit=${limit}`);
    return response.data;
  });
  console.log(ordersData);
  const totalPages = ordersData?.totalPages;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
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
                      <button className="btn btn-success btn-xs btn-outline  gap-1">
                        <AiOutlineCheck></AiOutlineCheck> Has Paid
                      </button>
                      <button className="btn btn-error btn-xs btn-outline ml-2 gap-1">
                        <BsTrash></BsTrash> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
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
