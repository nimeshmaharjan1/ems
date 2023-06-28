import AdminDashboardLayout from '@/features/admin/layouts/main';
import { SETTING_TAB } from '@/features/admin/settings/types';
import { NextPageWithLayout } from '@/pages/_app';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

const Settings: NextPageWithLayout = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return <>Settings</>;
};

export default Settings;

Settings.getLayout = (page) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
