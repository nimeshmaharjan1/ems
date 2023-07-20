import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import RevenueChart from '@/features/admin/dashboard/revenue-chart';

const AdminDashboard: NextPageWithLayout = () => {
  return (
    <div>
      <RevenueChart></RevenueChart>
    </div>
  );
};

export default AdminDashboard;
AdminDashboard.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Dashboard">{page}</AdminDashboardLayout>;
};
