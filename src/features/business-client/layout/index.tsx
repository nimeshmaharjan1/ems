import React from 'react';
import BusinessClientLayoutHeader from './header';
import BusinessLgAside from './lg-aside';

const BusinessClientDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <BusinessLgAside></BusinessLgAside>
      <section className="flex-1">
        <BusinessClientLayoutHeader></BusinessClientLayoutHeader>
        <main className="p-4 py-6">{children}</main>
      </section>
    </div>
  );
};

export default BusinessClientDashboardLayout;
