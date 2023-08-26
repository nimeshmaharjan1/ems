import AdminDashboardLayout from "@/features/admin/layouts/main";
import {
  SettingsSchema,
  settingsSchema,
} from "@/features/admin/settings/schema";
import { updateSettings } from "@/features/admin/settings/settings.service";
import { SETTING_TAB } from "@/features/admin/settings/types";
import { NextPageWithLayout } from "@/pages/_app";
import FormControl from "@/shared/components/form-control";
import { Toast, showToast } from "@/shared/utils/toast.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrismaClient } from "@prisma/client";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
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
  } finally {
    await prisma.$disconnect();
  }
};

const Settings: NextPageWithLayout<{ settings: SettingsSchema }> = ({
  settings,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { register, handleSubmit } = useForm<SettingsSchema>({
    defaultValues: settings,
    resolver: zodResolver(settingsSchema),
  });
  const mutation = useMutation(updateSettings, {
    onSuccess: (response) => {
      showToast(Toast.success, response?.data?.message);
    },
    onError: (error: any) => {
      showToast(Toast.error, error?.response?.data?.message);
    },
  });
  const saveSettings: SubmitHandler<SettingsSchema> = (data) => {
    mutation.mutate(data);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(saveSettings)}
      className="grid grid-cols-6 gap-x-4 gap-y-3"
    >
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Store Address">
          <input
            {...register("storeAddress")}
            type="text"
            className="input input-bordered"
          />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Contact Number">
          <input
            {...register("contactNumber")}
            type="text"
            className="input input-bordered"
          />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Tiktok">
          <input
            {...register("tiktok")}
            type="text"
            className="input input-bordered"
          />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Facebook">
          <input
            {...register("facebook")}
            type="text"
            className="input input-bordered"
          />
        </FormControl>
      </div>
      <div className="col-span-6 md:col-span-3">
        <FormControl label="Delivery Charge">
          <input
            {...register("deliveryCharge")}
            type="text"
            className="input input-bordered"
          />
        </FormControl>
      </div>
      <div className="col-span-6 mt-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading && (
            <span className="loading loading-spinner"></span>
          )}
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default Settings;

Settings.getLayout = (page) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
