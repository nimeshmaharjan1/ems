import { getOrderItems, getUserOrders } from "@/features/admin/services/orders";
import FormControl from "@/shared/components/form-control";
import StyledReactSelect from "@/shared/components/styled-react-select";
import MainSharedLayout from "@/shared/layouts/main";
import { Toast, showToast } from "@/shared/utils/toast.util";
import axios from "axios";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NextPageWithLayout } from "../_app";
import { authOptions } from "../api/auth/[...nextauth]";
import { useQuery } from "react-query";

interface IDefaultValues {
  description: string;
  order:
    | {
        label: string;
        value: string;
      }
    | undefined;
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
    handleSubmit,
    reset,
  } = useForm<IDefaultValues>({
    defaultValues: {
      description: "",
      order: undefined,
      faultyItems: [],
    },
  });

  const { data: settings } = useQuery(["getSettings"], async () => {
    const response = await axios.get(`/api/settings`);
    return response.data?.settings;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit: SubmitHandler<IDefaultValues> = async (values) => {
    setIsSubmitting(true);
    const payload = {
      description: values.description,
      orderId: values.order?.value,
      faultyItems: values.faultyItems.map((item) => ({
        orderItemId: item.value,
      })),
      userId: user_id,
    };
    try {
      const res = await axios.post("/api/raise-issue", payload);
      showToast(Toast.success, res.data?.message);
      reset();
    } catch (error: any) {
      console.error(error);
      showToast(Toast.error, error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadOrders = async (
    searchValue: string,
    loadedData: any,
    { page }: any
  ) => {
    try {
      const response = await getUserOrders({ page, user_id });
      let filteredOptions: any;
      if (!searchValue) {
        filteredOptions = response.orders;
      } else {
        filteredOptions = response.orders.filter((option: any) =>
          option.orderNumber.toLowerCase().includes(searchValue.toLowerCase())
        );
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

  const loadOrderItems = async (
    searchValue: string,
    loadedData: any,
    { page }: any
  ) => {
    try {
      const response = await getOrderItems({
        page,
        orderNumber: watch("order")!.label,
      });
      let filteredItems: any;
      if (!searchValue) {
        filteredItems = response.data[0].items;
      } else {
        filteredItems = response.data[0].items.filter((option: any) =>
          option.title.toLowerCase().includes(searchValue.toLowerCase())
        );
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
    <div className="lg:mt-12">
      <h2 className="font-bold text-2xl mb-3">Raise Issue</h2>
      <section>
        <FormControl
          label="Select the order that you wish to raise the issue for
        "
          errorMessage={errors?.order?.message}
        >
          <Controller
            control={control}
            name="order"
            rules={{
              required: "Order is required.",
            }}
            render={({
              field: { onChange, value, name, ref },
              fieldState: { error },
            }) => (
              <>
                <StyledReactSelect
                  isDisabled={isSubmitting}
                  onChange={onChange}
                  noOptionsMessage={(input) => {
                    if (input) return <>Could not find {input}</>;
                    return <>No orders registered yet</>;
                  }}
                  onMenuOpen={() => {
                    setValue("order", {
                      label: "",
                      value: "",
                    });
                  }}
                  name={name}
                  isRequired={error ? true : false}
                  value={value}
                  loadOptions={loadOrders}
                  isMulti={false}
                  placeholder="Select order number..."
                  isClearable
                ></StyledReactSelect>
              </>
            )}
          ></Controller>
        </FormControl>
      </section>
      {watch("order") && watch("order")?.label && (
        <section className="mt-4">
          <FormControl
            label="Select the faulty products associated to the order"
            errorMessage={errors?.faultyItems?.message}
          >
            <Controller
              control={control}
              name="faultyItems"
              rules={{
                required: "Faulty item is required.",
              }}
              render={({
                field: { onChange, value, name, ref },
                fieldState: { error },
              }) => (
                <>
                  <StyledReactSelect
                    isDisabled={isSubmitting}
                    isRequired={error ? true : false}
                    onChange={onChange}
                    name={name}
                    value={value}
                    defaultValue={[]}
                    loadOptions={loadOrderItems}
                    isMulti
                    placeholder="Select product/s..."
                    isClearable
                  ></StyledReactSelect>
                </>
              )}
            ></Controller>
          </FormControl>
        </section>
      )}
      <section className="mt-4">
        <FormControl
          errorMessage={errors?.description?.message}
          label="Please explain us your issue briefly"
        >
          <textarea
            disabled={isSubmitting}
            {...register("description", {
              required: "Description is required.",
            })}
            className={classNames("textarea textarea-bordered", {
              "textarea-error": errors?.description,
            })}
            placeholder="Type here..."
          ></textarea>
        </FormControl>
      </section>
      <section className="mt-8 flex gap-x-4">
        <Link href="/products" passHref>
          <button disabled={isSubmitting} className="btn-ghost btn">
            Cancel
          </button>
        </Link>
        <button
          disabled={isSubmitting}
          className="btn-primary btn"
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting && <span className="loading loading-spinner"></span>}
          Submit your issue
        </button>
      </section>
      <section className="mt-8">
        <p className="text-lg">
          Or you can contact our support on {settings?.contactNumber}
        </p>
      </section>
    </div>
  );
};

export default RaiseIssue;

RaiseIssue.getLayout = (page) => (
  <MainSharedLayout
    metaData={{
      title: "Raise Issue",
      description:
        "Raise an issue related to your order from Eshan Mahadev Enterprises Private Limited.",
    }}
  >
    {page}
  </MainSharedLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: true,
        destination: "/api/auth/signin",
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
