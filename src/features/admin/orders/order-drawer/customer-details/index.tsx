import { Order } from '@/shared/interfaces/order.interface';
import React from 'react';

const OrderCustomerDetails: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <>
      {' '}
      <div className="card-body !flex-grow-0">
        <p className="!text-lg card-title">Customer Details</p>
        <p className="mt-3">
          <span className="font-semibold">Name: </span>
          {order.user.name}
        </p>
        <p className="mt-3">
          <span className="font-semibold">Email: </span>
          {order.user.email}
        </p>
        <p className="mt-3">
          <span className="font-semibold">Phone: </span>
          {order.user.phone_number}
        </p>
        {order?.additionalPhoneNumber && (
          <p className="mt-3">
            <span className="font-semibold">Additional Phone: </span>
            {order.additionalPhoneNumber}
          </p>
        )}
        <p className="mt-3">
          <span className="font-semibold">Address: </span>
          {order.customerAddress}
        </p>
      </div>
    </>
  );
};

export default OrderCustomerDetails;
