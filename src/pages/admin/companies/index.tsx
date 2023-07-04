import SettingCompany from '@/features/admin/companies';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactNode } from 'react';

const AdminCompanies: NextPageWithLayout = () => {
  return (
    <div>
      <section className="flex justify-between heading-section">
        <h3 className="mb-6 text-2xl font-semibold">Company</h3>
      </section>
      <SettingCompany></SettingCompany>
    </div>
  );
};

export default AdminCompanies;
AdminCompanies.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Dashboard">{page}</AdminDashboardLayout>;
};
