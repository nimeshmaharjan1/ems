import Drawer from '@/shared/components/drawer';
import { IComplaint } from '@/shared/interfaces/complaints.interface';
import { COMPLAINT_STATUS } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';

const ComplaintDrawer: React.FC<{ complaint: IComplaint; isDrawerOpen: boolean; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }> = ({
  complaint,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  console.log(complaint);
  return (
    <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Complaint Order #{complaint.order.orderNumber}</p>
        <button className="btn btn-sm btn-ghost" onClick={() => setIsDrawerOpen(false)}>
          <ArrowRight size={18}></ArrowRight>
        </button>
      </div>
      <section className="mt-4">
        <p className="font-medium">Issued By: {complaint.user.name || complaint.user.email}</p>
      </section>
      <section className="flex gap-x-6 items-center mt-4">
        Status:
        <select defaultValue={complaint.status} className="select select-bordered select-sm">
          <option value={COMPLAINT_STATUS.Pending}>Pending</option>
          <option value={COMPLAINT_STATUS.InProgress}>In Progress</option>
          <option value={COMPLAINT_STATUS.Resolved}>Resolved</option>
        </select>
      </section>
      <section className="faulty-items-section mt-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <p className="card-title">Faulty Items</p>
            <section className="flex flex-col w-full py-6 mt-2 border-t border-b gap-y-6 cart-item-section">
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
    </Drawer>
  );
};

export default ComplaintDrawer;
