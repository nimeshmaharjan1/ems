import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import AdminDashboardLayout from '@/features/admin/layouts/main';

const AdminDashboard: NextPageWithLayout = () => {
  return <div>Dashboard</div>;
};

export default AdminDashboard;
AdminDashboard.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Dashboard">{page}</AdminDashboardLayout>;
};
