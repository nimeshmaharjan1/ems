import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import RevenueChart from '@/features/admin/dashboard/revenue-chart';
import HeaderCard from '@/features/admin/dashboard/header-card';
import { CircleDollarSign, Layers, Truck } from 'lucide-react';
import { formatPrice } from '@/shared/utils/helper.util';
import { useQuery } from 'react-query';
import axios from 'axios';
import { IRevenueData, ITopSellingProduct } from '@/shared/interfaces/dashboard.interface';

const AdminDashboard: NextPageWithLayout = () => {
  const { data: revenueData, isLoading: isRevenueLoading } = useQuery<IRevenueData>('fetchRevenueData', async () => {
    const res = await axios.get('/api/admin/analytics/revenue');
    return res.data;
  });
  const { data: topSellingProducts, isLoading: isTopSellingProductLoading } = useQuery<ITopSellingProduct[]>(
    'fetchTopSellingProducts',
    async () => {
      const res = await axios.get('/api/admin/analytics/top-selling-products');
      return res.data;
    }
  );
  const { data: orderData, isLoading: isOrderDataLoading } = useQuery<{
    averageOrderValue: number;
    numberOfOrders: 3;
  }>('fetchOrderData', async () => {
    const res = await axios.get('/api/admin/analytics/average-order-value');
    return res.data;
  });

  const totalRevenue = (revenueData && revenueData.revenueData.reduce((acc, data) => acc + data.revenue, 0)) || 0;

  return (
    <>
      <section className="grid grid-cols-6 gap-x-3 mb-4">
        <div className="col-span-2">
          <HeaderCard
            isLoading={isRevenueLoading}
            Icon={CircleDollarSign}
            title="Revenue"
            data={`रू ${formatPrice(totalRevenue)}`}></HeaderCard>
        </div>
        <div className="col-span-2">
          <HeaderCard isLoading={isOrderDataLoading} Icon={Truck} title="Orders" data={orderData?.numberOfOrders}></HeaderCard>
        </div>
        <div className="col-span-2">
          {orderData && (
            <HeaderCard
              isLoading={isOrderDataLoading}
              Icon={Layers}
              title="Average Order Value"
              data={`रू ${formatPrice(orderData.averageOrderValue)}`}></HeaderCard>
          )}
        </div>
      </section>
      <RevenueChart revenueData={revenueData?.revenueData!}></RevenueChart>
      <section className="top-selling-products card mt-6 bg-base-200">
        <div className="card-body">
          <div className="card-title mb-3">Top Selling Products</div>
          <div className="overflow-x-auto">
            <table className="table table-zebra-zebra">
              {/* head */}
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Sold Value</th>
                  <th>Sold Quantity</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {topSellingProducts?.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>रू {formatPrice(product.soldValue)}</td>
                    <td>{product.soldQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
AdminDashboard.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Dashboard">{page}</AdminDashboardLayout>;
};
