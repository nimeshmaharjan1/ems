import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]';
import { NextPageWithLayout } from '../_app';
import MainSharedLayout from '@/shared/layouts/main';
import FormControl from '@/shared/components/form-control';
import { PrismaClient } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import StyledReactSelect from '@/shared/components/styled-react-select';
import { getAllProducts } from '@/features/admin/services/products/products.service';
import { getOrderItems, getUserOrders } from '@/features/admin/services/orders';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface IDefaultValues {
  description: string;
  order: {
    label: string;
    value: string;
  };
  faultyItems: {
    label: string;
    value: string;
  }[];
}

const RaiseIssue: NextPageWithLayout<{ user_id: string }> = ({ user_id }) => {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IDefaultValues>({
    defaultValues: {
      description: '',
      order: {
        label: '',
        value: '',
      },
      faultyItems: [],
    },
  });
  console.log(watch());
  const loadOrders = async (searchValue: string, loadedData: any, { page }: any) => {
    try {
      const response = await getUserOrders({ page, user_id });
      let filteredOptions: any;
      if (!searchValue) {
        filteredOptions = response.orders;
      } else {
        filteredOptions = response.orders.filter((option: any) => option.orderNumber.toLowerCase().includes(searchValue.toLowerCase()));
      }
      return {
        options: filteredOptions.map((option: any) => {
          return {
            value: option.id,
            label: option.orderNumber,
          };
        }),
        hasMore: response.page < response.totalPages ? true : false,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadOrderItems = async (searchValue: string, loadedData: any, { page }: any) => {
    try {
      const response = await getOrderItems({ page, orderNumber: watch('order').label });
      console.log({ response });
      let filteredItems: any;
      if (!searchValue) {
        filteredItems = response.data[0].items;
        console.log({ filteredItems });
      } else {
        filteredItems = response.data[0].items.filter((option: any) => option.title.toLowerCase().includes(searchValue.toLowerCase()));
      }
      return {
        options: filteredItems.map((option: any) => {
          return {
            value: option.id,
            label: option.product.title,
          };
        }),
        hasMore: response.page < response.totalPages ? true : false,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  return (
    <>
      <h2 className="font-bold text-2xl mb-3">Raise Issue</h2>
      <section>
        <label htmlFor="Orders" className="label">
          Select the order that you wish to raise the issue for
        </label>
        <Controller
          control={control}
          name="order"
          render={({ field: { onChange, value, name, ref }, fieldState: { error } }) => (
            <>
              <StyledReactSelect
                onChange={onChange}
                onMenuOpen={() => {
                  setValue('order', {
                    label: '',
                    value: '',
                  });
                }}
                name={name}
                value={value}
                loadOptions={loadOrders}
                isMulti={false}
                placeholder="Select order number..."
                isClearable></StyledReactSelect>
            </>
          )}></Controller>
      </section>
      {watch('order').label && (
        <section className="mt-4">
          <label htmlFor="Products" className="label">
            Select the faulty products associated to the order
          </label>
          <Controller
            control={control}
            name="faultyItems"
            render={({ field: { onChange, value, name, ref }, fieldState: { error } }) => (
              <>
                <StyledReactSelect
                  onChange={onChange}
                  name={name}
                  value={value}
                  defaultValue={[]}
                  loadOptions={loadOrderItems}
                  isMulti
                  placeholder="Select product/s..."
                  isClearable></StyledReactSelect>
              </>
            )}></Controller>
        </section>
      )}
      <section className="mt-4">
        <FormControl label="Please explain us your issue briefly">
          <textarea
            {...register('description', {
              required: 'Description is required.',
            })}
            className="textarea textarea-bordered"
            placeholder="Type here..."></textarea>
        </FormControl>
      </section>
      <section className="mt-8 flex gap-x-4">
        <Link href="/products" passHref>
          <button className="btn-ghost btn">Cancel</button>
        </Link>
        <button className="btn-primary btn">Submit your issue</button>
      </section>
    </>
  );
};

export default RaiseIssue;

RaiseIssue.getLayout = (page) => (
  <MainSharedLayout
    metaData={{
      title: 'Raise Issue',
      description: 'Raise an issue related to your order from Eshan Mahadev Enterprises Private Limited.',
    }}>
    {page}
  </MainSharedLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: true,
        destination: '/api/auth/signin',
      },
      props: {},
    };
  }

  return {
    props: {
      user_id: session.user?.id,
    },
  };
};
