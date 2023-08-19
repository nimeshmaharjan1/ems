import React from "react";
import { NextPageWithLayout } from "../_app";
import BusinessClientDashboardLayout from "@/features/business-client/layout";
import { ORDER_STATUS } from "@prisma/client";
import { useQuery } from "react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const BusinessClientDashboard: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { data } = useQuery("getBusinessClientMyOrders", async () => {
    return await axios.get("/api/business-client/my-orders", {
      params: {
        user_id: session?.user?.id,
      },
    });
  });
  console.log({ data });
  return (
    <>
      <section className="mb-6 flex justify-between">
        <select
          name="order-status"
          className="select select-sm select-bordered"
        >
          <option value="all">All</option>
          {Object.keys(ORDER_STATUS).map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="input input-bordered input-sm w-52 md:w-96"
          placeholder="Search your orders here..."
        />
      </section>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BusinessClientDashboard;

BusinessClientDashboard.getLayout = (page) => (
  <BusinessClientDashboardLayout>{page}</BusinessClientDashboardLayout>
);
