import BusinessClientDashboardLayout from "@/features/business-client/layout";
import Pagination from "@/shared/components/pagination";
import { PaginatedOrders } from "@/shared/interfaces/order.interface";
import { formatPrice, rupees } from "@/shared/utils/helper.util";
import { ORDER_STATUS, PAYMENT_STATUS } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { NextPageWithLayout } from "../_app";

const BusinessClientDashboard: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const [selectedOrderStatus, setSelectedOrderStatus] = useState<
    ORDER_STATUS | "all"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: orderData,
    isError,
    isLoading,
  } = useQuery<PaginatedOrders>(
    ["getBusinessClientMyOrders", currentPage, selectedOrderStatus],
    async () => {
      const response = await axios.get("/api/business-client/my-orders", {
        params: {
          user_id: session?.user?.id,
          page: currentPage,
          order_status:
            selectedOrderStatus === "all" ? "" : selectedOrderStatus,
        },
      });
      return response.data;
    }
  );

  return (
    <>
      <section className="mb-8 flex justify-between">
        <select
          onChange={(e) =>
            setSelectedOrderStatus(e.target.value as ORDER_STATUS)
          }
          name="order-status"
          className="select select-bordered"
        >
          <option value="all">All</option>
          {Object.keys(ORDER_STATUS).map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>
        {/* <input type="text" className="input input-bordered  w-52 md:w-96" placeholder="Search your orders here..." /> */}
      </section>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th className="text-center">Payment Status</th>
              <th>Left To Pay</th>
              <th>Paid</th>
              <th>Total</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <tr>
                <td colSpan={9} className="text-error">
                  Something went wrong while trying to get your orders.
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={9} className="text-center">
                  <div className="flex justify-center h-72 items-center gap-x-2">
                    <span className="loading-spinner loading"></span> Loading...
                  </div>
                </td>
              </tr>
            ) : orderData?.orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-amber-500">
                  No data found.
                </td>
              </tr>
            ) : (
              orderData?.orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.user.name}</td>
                  <td>{order.items.length}</td>
                  <td>
                    {order.status === ORDER_STATUS.Cancelled ||
                    order.status === ORDER_STATUS.Returned ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md ring-1 ring-inset ring-green-600/20">
                        {order.status}
                      </span>
                    ) : order.status === ORDER_STATUS.Pending ||
                      order.status === ORDER_STATUS.Processing ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-md ring-1 ring-inset ring-green-600/20">
                        {order.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md ring-1 ring-inset ring-green-600/20">
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    {order.paymentStatus === PAYMENT_STATUS.Unpaid ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md ring-1 ring-inset ring-green-600/20">
                        {order.paymentStatus}
                      </span>
                    ) : order.paymentStatus === PAYMENT_STATUS.Partial ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-md ring-1 ring-inset ring-green-600/20">
                        {order.paymentStatus}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md ring-1 ring-inset ring-green-600/20">
                        {order.paymentStatus}
                      </span>
                    )}
                  </td>

                  <td>
                    {rupees} {formatPrice(order.partiallyPaidAmount)}
                  </td>
                  <td>
                    {rupees} {formatPrice(order.amountLeftToPay)}
                  </td>
                  <td>
                    {rupees} {formatPrice(order.totalPrice)}
                  </td>
                  <td>{order.selectedWholesaleOption}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-4 place-self-end">
          {orderData?.totalPages !== undefined && (
            <Pagination
              {...{ currentPage, setCurrentPage }}
              totalPages={orderData.totalPages}
            ></Pagination>
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessClientDashboard;

BusinessClientDashboard.getLayout = (page) => (
  <BusinessClientDashboardLayout>{page}</BusinessClientDashboardLayout>
);
