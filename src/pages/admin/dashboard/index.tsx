import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import RevenueChart from '@/features/admin/dashboard/revenue-chart';
import HeaderCard from '@/features/admin/dashboard/header-card';
import { CircleDollarSign } from 'lucide-react';
import { formatPrice } from '@/shared/utils/helper.util';

const AdminDashboard: NextPageWithLayout = () => {
  return (
    <>
      <section className="grid grid-cols-6 gap-x-3 mb-4">
        <div className="col-span-2">
          <HeaderCard Icon={CircleDollarSign} title="Revenue" data={formatPrice(1234567)}></HeaderCard>
        </div>
        <div className="col-span-2">
          <HeaderCard Icon={CircleDollarSign} title="Revenue" data={'1234567'}></HeaderCard>
        </div>
        <div className="col-span-2">
          <HeaderCard Icon={CircleDollarSign} title="Revenue" data={'1234567'}></HeaderCard>
        </div>
      </section>
      <RevenueChart></RevenueChart>
    </>
  );
};

export default AdminDashboard;
AdminDashboard.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Dashboard">{page}</AdminDashboardLayout>;
};
