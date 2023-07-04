import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import SettingCategory from '@/features/admin/categories';

const AdminCategories: NextPageWithLayout = () => {
  return (
    <div>
      <section className="flex justify-between heading-section">
        <h3 className="mb-6 text-2xl font-semibold">Category</h3>
      </section>
      <SettingCategory></SettingCategory>
    </div>
  );
};

export default AdminCategories;
AdminCategories.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Dashboard">{page}</AdminDashboardLayout>;
};
