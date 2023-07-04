import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/user-cart';
import { formatPrice } from '@/shared/utils/helper.util';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { IAddressDetails } from '@/pages/checkout';
const OrderSummary = ({
  modalRef,
  isLoading,
  setIsLoading,
  handleCreateOrder,
  addressDetails,
  setAddressDetails,
  deliveryCharge,
}: {
  modalRef: any;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  handleCreateOrder: () => void;
  addressDetails: IAddressDetails;
  setAddressDetails: Dispatch<SetStateAction<IAddressDetails>>;
  deliveryCharge: number;
}) => {
  const { cartItems, getTotalCrossedPrice, getTotalPrice } = useCartStore();
  return (
    <div className="card shadow-lg min-h-[244px] mt-2">
      <div className="card-body">
        <div className="card-title">Order Summary</div>
        {cartItems.find((item) => item.hasOffer) ? (
          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between mt-3">
              <p className="max-w-[9rem] font-medium">Total</p>
              <p className="font-medium">रू{formatPrice(getTotalCrossedPrice())}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="max-w-[9rem] font-medium">Discount</p>
              <p className="font-medium">रू{formatPrice(getTotalCrossedPrice() - getTotalPrice())}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="max-w-[9rem] font-medium">Discount</p>
              <p className="font-medium">रू{formatPrice(deliveryCharge)}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="max-w-[9rem] font-medium">To Pay</p>
              <p className="font-medium">रू{formatPrice(getTotalPrice() + deliveryCharge)}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between mt-3">
              <p className="max-w-[9rem] font-medium">Discount</p>
              <p className="font-medium">रू{formatPrice(deliveryCharge)}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-medium">To Pay</p>

              <p className="font-medium">रू{formatPrice(getTotalPrice() + deliveryCharge)}</p>
            </div>
          </>
        )}

        <button className="mt-4 btn btn-primary btn-block" onClick={handleCreateOrder} disabled={isLoading}>
          {isLoading && <span className="loading loading-infinity"></span>}
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
