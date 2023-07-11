import AdminDashboardLayout from '@/features/admin/layouts/main';
import { SETTING_TAB } from '@/features/admin/settings/types';
import { NextPageWithLayout } from '@/pages/_app';
import FormControl from '@/shared/components/form-control';
import { PrismaClient } from '@prisma/client';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const settings = await prisma.settings.findFirst();
    return {
      props: {
        settings,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};

const Settings: NextPageWithLayout<{ settings: any }> = ({ settings }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <section className="grid grid-cols-6 gap-x-4 gap-y-3">
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Store Address">
          <input type="text" className="input input-bordered" />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Contact Number">
          <input type="text" className="input input-bordered" />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Tiktok">
          <input type="text" className="input input-bordered" />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Facebook">
          <input type="text" className="input input-bordered" />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Delivery Charge">
          <input type="text" className="input input-bordered" />
        </FormControl>
      </div>
      <div className="col-span-6 mt-3">
        <button className="btn btn-primary">Save Settings</button>
      </div>
    </section>
  );
};

export default Settings;

Settings.getLayout = (page) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
