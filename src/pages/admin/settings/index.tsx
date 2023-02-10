import AdminDashboardLayout from '@/features/admin/layouts/main';
import { SETTING_TAB } from '@/features/admin/settings/types';
import { NextPageWithLayout } from '@/pages/_app';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import SettingCategory from './categories';
import SettingCompany from './companies';

const Settings: NextPageWithLayout = () => {
  const [selectedTab, setSelectedTab] = useState<SETTING_TAB>(SETTING_TAB.CATEGORY);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <div className="tabs">
        {Object.values(SETTING_TAB).map((tab) => {
          return (
            <a
              className={classNames('tab tab-bordered', {
                'tab-active': tab === selectedTab,
              })}
              onClick={() => setSelectedTab(tab)}
              key={tab}
            >
              {tab}
            </a>
          );
        })}
      </div>
      <section className="mt-3">{selectedTab === SETTING_TAB.CATEGORY && <SettingCategory></SettingCategory>}</section>
      <section className="mt-3">{selectedTab === SETTING_TAB.COMPANY && <SettingCompany></SettingCompany>}</section>
    </>
  );
};

export default Settings;

Settings.getLayout = (page) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
