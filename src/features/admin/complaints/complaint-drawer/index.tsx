import Drawer from '@/shared/components/drawer';
import { IComplaint } from '@/shared/interfaces/complaints.interface';
import { formatDateWithTime } from '@/shared/utils/helper.util';
import { COMPLAINT_STATUS } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import ComplaintComments from './comments';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { useSession } from 'next-auth/react';

const ComplaintDrawer: React.FC<{ complaint: IComplaint; isDrawerOpen: boolean; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }> = ({
  complaint,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const { data: session } = useSession();
  const useFormMethods = useForm({
    defaultValues: {
      comment: '',
    },
  });
  const statusFormMethods = useForm<{ status: COMPLAINT_STATUS }>({
    defaultValues: {
      status: COMPLAINT_STATUS.Pending,
    },
  });

  useEffect(() => {
    statusFormMethods.setValue('status', complaint.status);
  }, [complaint.status]);

  const { isLoading: isStatusChanging, mutate } = useMutation(
    async (status: COMPLAINT_STATUS) => {
      const res = await axios.patch('/api/admin/complaints/change-status', {
        complaintId: complaint.id,
        status,
        userId: session?.user?.id,
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        showToast(Toast.success, data?.message);
      },
      onError: (error: any) => {
        showToast(Toast.error, error?.response?.data?.message);
      },
    }
  );

  const onStatusChange: SubmitHandler<{ status: COMPLAINT_STATUS }> = (values) => {
    mutate(values.status);
  };

  return (
    <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Complaint Order #{complaint.order.orderNumber}</p>
        <button className="btn btn-sm btn-ghost" onClick={() => setIsDrawerOpen(false)}>
          <ArrowRight size={18}></ArrowRight>
        </button>
      </div>
      <p className="mt-2 text-sm">{formatDateWithTime(complaint.createdAt)}</p>
      <section className="mt-4">
        <p className="font-medium">Issued By: {complaint.user.name || complaint.user.email}</p>
        <p className="font-medium mt-2">Phone Number: {complaint.user.phone_number}</p>
      </section>
      <section className="mt-3">
        <div className="flex gap-x-6 items-center ">
          Status:
          <select
            {...statusFormMethods.register('status', {
              onChange: () => {
                statusFormMethods.handleSubmit(onStatusChange)();
              },
            })}
            disabled={isStatusChanging}
            className="select select-bordered select-sm">
            <option value={COMPLAINT_STATUS.Pending}>Pending</option>
            <option value={COMPLAINT_STATUS.InProgress}>In Progress</option>
            <option value={COMPLAINT_STATUS.Resolved}>Resolved</option>
          </select>
          {isStatusChanging && <span className="loading loading-spinner"></span>}
        </div>
        {complaint.resolvedBy && (
          <p className="mt-3 font-medium text-success">Resolved By: {complaint.resolvedBy.name || complaint.resolvedBy.email}</p>
        )}
      </section>
      <section className="faulty-items-section mt-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <p className="card-title">Faulty Items</p>
            <section className="flex flex-col w-full py-6 mt-2 border-t border-b border-neutral gap-y-6 cart-item-section">
              {complaint.faultyItems.map((item) => (
                <div key={item.id} className="flex gap-x-3">
                  <Image src={item.orderItem.product.images[0]} alt="Item" width={80} className="rounded" height={80}></Image>
                  <section>
                    <p className="font-medium">{item.orderItem.product.title}</p>
                    {/* <div className="relative">
                <Image className="rounded" height={80} width={80} src={item.product.images[0]} alt={item.product.title}></Image>
                <span className="absolute !text-white badge badge-secondary badge-sm -top-1 -right-2">{item.quantity}</span>
              </div> */}
                    <p className="opacity-60 text-sm mt-1">{item.orderItem.product.modal}</p>
                  </section>
                </div>
              ))}
            </section>
          </div>
        </div>
      </section>
      <section className="description mt-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <div className="card-title">Description</div>
            <p>{complaint.description}</p>
          </div>
        </div>
      </section>
      <section className="comment-section mt-6">
        <ComplaintComments {...{ complaint, useFormMethods }}></ComplaintComments>
      </section>
    </Drawer>
  );
};

export default ComplaintDrawer;
