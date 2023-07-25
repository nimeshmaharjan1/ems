import React from 'react';
import { NextPageWithLayout } from '../_app';
import BusinessClientDashboardLayout from '@/features/business-client/layout';

const BusinessClientDashboard: NextPageWithLayout = () => {
  return <>BusinessClientDashboard</>;
};

export default BusinessClientDashboard;

BusinessClientDashboard.getLayout = (page) => <BusinessClientDashboardLayout>{page}</BusinessClientDashboardLayout>;
