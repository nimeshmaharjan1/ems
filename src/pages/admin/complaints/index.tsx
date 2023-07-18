import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import Drawer from '@/shared/components/drawer';
import Pagination from '@/shared/components/pagination';
import { IComplaint, IPaginatedComplaints } from '@/shared/interfaces/complaints.interface';
import { formatDateWithTime } from '@/shared/utils/helper.util';
import { COMPLAINT_STATUS, PRODUCT_STATUS } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import { Trash } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { useQuery } from 'react-query';
import ComplaintDrawer from './complaint-drawer';

const Complaints: NextPageWithLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: complaintData,
    isError,
    isLoading,
  } = useQuery<IPaginatedComplaints, Error>(['fetchComplaints', currentPage], async () => {
    return (await axios.get('/api/admin/complaints')).data;
  });
  const totalPages = complaintData?.totalPages;
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaint | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      {isError ? (
        <h2 className="text-error">Something went wrong while trying to get the complaints.</h2>
      ) : (
        <>
          <section className="flex justify-between mb-5">
            <h2 className="text-2xl font-semibold">Complaints</h2>
            {/* <button className="btn btn-primary btn-sm">Create Order</button> */}
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
                    <th className="">Issued By</th>
                    <th className="">Order Number</th>
                    <th className="">Status</th>
                    <th className="">Created At</th>
                    <th className="">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaintData?.complaints?.length === 0 && (
                    <h2 className="p-2 text-warning">No complaints have been listed at this moment.</h2>
                  )}
                  {complaintData &&
                    complaintData.complaints.length > 0 &&
                    complaintData?.complaints.map((complaint, index) => {
                      return (
                        <tr
                          key={complaint.id}
                          onClick={(e) => {
                            setSelectedComplaint(complaint);
                            setIsDrawerOpen(true);
                          }}>
                          <td>{index + 1}</td>
                          <td>{complaint.user.name || complaint.user.email}</td>
                          <td className="">{complaint.order.orderNumber}</td>
                          <td
                            className="cursor-pointer"
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   setSelectedOrder(complaint);
                            //   edit_order_status_modal_ref.current?.show();
                            // }}
                          >
                            <div
                              className={classNames('badge badge-sm', {
                                'badge-warning': complaint.status === COMPLAINT_STATUS.Pending,
                                'badge-info': complaint.status === COMPLAINT_STATUS.InProgress,
                                'badge-success': complaint.status === COMPLAINT_STATUS.Resolved,
                              })}>
                              {complaint.status}
                            </div>
                          </td>

                          <td className="">{formatDateWithTime(complaint.createdAt)}</td>
                          <td>
                            <button
                              className="gap-1 ml-2 btn group btn-error btn-xs btn-outline"
                              //   onClick={(e) => {
                              //     e.stopPropagation();
                              //     mutateDeleteOrder({ orderId: complaint.id });
                              //   }}
                            >
                              {/* {isComplaintDeleting ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <Trash size={12} className="group-hover:text-white"></Trash>
                                )} */}
                              <Trash size={12} className="group-hover:text-white"></Trash>
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
            {totalPages !== undefined && <Pagination {...{ currentPage, setCurrentPage, totalPages }}></Pagination>}
          </div>
          {selectedComplaint && <ComplaintDrawer complaint={selectedComplaint} {...{ isDrawerOpen, setIsDrawerOpen }}></ComplaintDrawer>}
        </>
      )}
    </>
  );
};

export default Complaints;
Complaints.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
