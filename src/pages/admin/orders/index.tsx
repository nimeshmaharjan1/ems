import AdminDashboardLayout from "@/features/admin/layouts/main";
import OrderDrawer from "@/features/admin/orders/order-drawer";
import { NextPageWithLayout } from "@/pages/_app";
import Pagination from "@/shared/components/pagination";
import { Order, PaginatedOrders } from "@/shared/interfaces/order.interface";
import { formatDateWithTime, formatPrice } from "@/shared/utils/helper.util";
import { Toast, showToast } from "@/shared/utils/toast.util";
import { ORDER_STATUS, PAYMENT_STATUS } from "@prisma/client";
import axios from "axios";
import classNames from "classnames";
import { Trash } from "lucide-react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import EditOrderStatusModal from "../../../features/admin/orders/edit-status-modal";
interface ChangePaidStatus {
  orderId: string;
  hasBeenPaid: boolean;
}
const Orders: NextPageWithLayout = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [selectedFilter, setSelectedFilter] = useState<"b2b" | "b2c">("b2b");
  const {
    data: ordersData,
    isError,
    isLoading,
  } = useQuery<PaginatedOrders, Error>(
    ["fetchOrders", currentPage, limit, selectedFilter],
    async () => {
      const response = await axios.get(
        `/api/admin/orders?page=${currentPage}&limit=${limit}&customer_type=${selectedFilter}`
      );
      return response.data;
    }
  );
  const totalPages = ordersData?.totalPages;
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const markAsPaidModalRef = useRef<HTMLDialogElement>(null);

  const { mutate: mutateHasBeenPaid, isLoading: isHasBeenPaidLoading } =
    useMutation(
      async (args: ChangePaidStatus) => {
        const response = await axios.patch(
          `/api/admin/orders/${args.orderId}`,
          {
            hasBeenPaid: args.hasBeenPaid,
          }
        );
        return response.data;
      },
      {
        onSuccess: (data) => {
          showToast(Toast.success, data?.message);
          queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
        },
        onError: (error: any) => {
          showToast(Toast.error, error?.response?.data?.message);
        },
      }
    );
  const { mutate: mutateDeleteOrder, isLoading: isOrderDeleting } = useMutation(
    async (args: { orderId: string }) => {
      const response = await axios.delete(`/api/admin/orders/${args.orderId}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        showToast(Toast.success, data?.message);
        queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
      },
      onError: (error: any) => {
        showToast(Toast.error, error?.response?.data?.message);
      },
    }
  );
  const changePaidStatus = (args: ChangePaidStatus) => {
    mutateHasBeenPaid(args);
  };

  const edit_order_status_modal_ref = useRef<HTMLDialogElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sendEmail = async () => {
    const res = await axios.post("/api/email", {
      name: "Nimesh",
      email: "maharjannimesh11@gmail.com",
    });
    console.log({ res });
  };

  if (!isMounted) return null;
  return (
    <>
      {isError ? (
        <h2 className="text-error">
          Something went wrong while trying to get the orders.
        </h2>
      ) : (
        <>
          <section className="flex justify-between mb-5">
            <h2 className="text-2xl font-semibold">Orders</h2>
            <button className="btn btn-primary btn-sm" onClick={sendEmail}>
              Create Order
            </button>
          </section>
          <section className="flex gap-3 mb-5">
            <button
              className={classNames("btn btn-sm", {
                "btn-primary": selectedFilter === "b2b",
                "btn-outline": selectedFilter !== "b2b",
              })}
              onClick={() => setSelectedFilter("b2b")}
            >
              B2B
            </button>
            <button
              className={classNames("btn btn-sm", {
                "btn-primary": selectedFilter === "b2c",
                "btn-outline": selectedFilter !== "b2c",
              })}
              onClick={() => setSelectedFilter("b2c")}
            >
              B2C
            </button>
          </section>
          <section className="overflow-x-auto">
            {isLoading ? (
              <table className="flex items-center justify-center h-96">
                <button className="btn btn-ghost disabled">
                  <span className="loading loading-spinner"></span>
                </button>
              </table>
            ) : (
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>#</th>
                    <th className="">Customer Name</th>
                    <th className="">Quantity</th>
                    <th className="">Total Price</th>
                    <th className="">Payment Status</th>
                    <th className="">Payment Method</th>
                    <th className="">Status</th>
                    <th className="">Ordered At</th>
                    <th className="">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData?.orders?.length === 0 && (
                    <h2 className="p-2 text-warning">
                      No orders have been listed at this moment.
                    </h2>
                  )}
                  {ordersData &&
                    ordersData.orders.length > 0 &&
                    ordersData?.orders.map((order) => {
                      return (
                        <tr
                          key={order.id}
                          onClick={(e) => {
                            setSelectedOrder(order);
                            setIsDrawerOpen(true);
                          }}
                        >
                          <td>{order.orderNumber}</td>
                          <td className="">{order.user.name}</td>
                          <td className="">{order.items.length}</td>
                          {/* <td className="">{order.user?.phone_number}</td> */}
                          <td className="">
                            रू {formatPrice(order.totalPrice)}
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                              edit_order_status_modal_ref.current?.show();
                            }}
                          >
                            <div
                              className={classNames("badge badge-sm", {
                                "badge-neutral":
                                  order.paymentStatus === PAYMENT_STATUS.Unpaid,
                                "badge-success":
                                  order.paymentStatus === PAYMENT_STATUS.Paid,
                                "badge-error":
                                  order.paymentStatus ===
                                  PAYMENT_STATUS.Refunded,
                                "badge-accent":
                                  order.paymentStatus ===
                                  PAYMENT_STATUS.Partial,
                              })}
                            >
                              {order.paymentStatus}
                            </div>
                          </td>
                          <td>{order.paymentMethod}</td>
                          <td
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                              edit_order_status_modal_ref.current?.show();
                            }}
                          >
                            <p
                              className={classNames("badge badge-sm", {
                                "badge-neutral":
                                  order.status === ORDER_STATUS.Pending,
                                "badge-warning":
                                  order.status === ORDER_STATUS.Processing,
                                "badge-accent":
                                  order.status === ORDER_STATUS.Dispatched,
                                "badge-success":
                                  order.status === ORDER_STATUS.Delivered,
                                "badge-error":
                                  order.status === ORDER_STATUS.Cancelled ||
                                  order.status === ORDER_STATUS.Returned,
                              })}
                            >
                              {order.status}
                            </p>
                          </td>
                          <td className="">
                            {formatDateWithTime(order.createdAt)}
                          </td>
                          <td>
                            <button
                              className="gap-1 ml-2 btn group btn-error btn-xs btn-outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                mutateDeleteOrder({ orderId: order.id });
                              }}
                            >
                              {isOrderDeleting ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <Trash
                                  size={12}
                                  className="group-hover:text-white"
                                ></Trash>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </section>
          <div className="flex justify-end mt-8 place-self-end">
            {totalPages !== undefined && (
              <Pagination
                {...{ currentPage, setCurrentPage, totalPages }}
              ></Pagination>
            )}
          </div>
          {selectedOrder && (
            <>
              <EditOrderStatusModal
                order={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                ref={edit_order_status_modal_ref}
              ></EditOrderStatusModal>
              <OrderDrawer
                order={selectedOrder}
                {...{ isDrawerOpen, setIsDrawerOpen }}
              ></OrderDrawer>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Orders;
Orders.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout title="Orders">{page}</AdminDashboardLayout>;
};
