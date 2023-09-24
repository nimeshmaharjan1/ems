import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/user-cart';
import { formatPrice } from '@/shared/utils/helper.util';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { ICheckoutDetails } from '@/pages/checkout';
import { SELECTED_WHOLESALE_OPTION, USER_ROLES } from '@prisma/client';
const OrderSummary = ({
  modalRef,
  isLoading,
  setIsLoading,
  handleCreateOrder,
  checkoutDetails,
  setCheckoutDetails,
  deliveryCharge,
}: {
  modalRef: any;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  handleCreateOrder: () => void;
  checkoutDetails: ICheckoutDetails;
  setCheckoutDetails: Dispatch<SetStateAction<ICheckoutDetails>>;
  deliveryCharge: number;
}) => {
  const { data: session } = useSession();
  const { cartItems, getTotalCrossedPrice, getTotalPrice, getTotalWholesaleCashPrice, getTotalWholesaleCreditPrice } = useCartStore();
  return (
    <div className="card mb-4 shadow-lg min-h-[244px] bg-base-200">
      <div className="card-body">
        <div className="card-title">Order Summary</div>
        {session?.user?.role === USER_ROLES.BUSINESS_CLIENT ? (
          <>
            <div className="flex justify-between mt-3">
              <p className="font-medium">Sub Total</p>
              <div className="flex items-end">
                <p className="font-medium">
                  रू{' '}
                  {checkoutDetails.wholesaleOption === SELECTED_WHOLESALE_OPTION.CASH
                    ? formatPrice(getTotalWholesaleCashPrice() - 0.13 * getTotalWholesaleCashPrice())
                    : formatPrice(getTotalWholesaleCreditPrice() - 0.13 * getTotalWholesaleCreditPrice())}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-medium">VAT</p>
              <div className="flex items-end">
                <p className="font-medium">13%</p>
              </div>
            </div>
            {/* <div className="flex justify-between mt-3">
              <p className="font-medium ">Delivery Charge</p>
              <div className="flex items-end">
                <p className="font-medium">रू {formatPrice(deliveryCharge)}</p>
              </div>
            </div> */}
            <div className="flex justify-between mt-3">
              <p className="font-medium">To Pay</p>
              <div className="flex items-end">
                {checkoutDetails.wholesaleOption === SELECTED_WHOLESALE_OPTION.CASH ? (
                  <p className="font-medium">रू{formatPrice(getTotalWholesaleCashPrice())}</p>
                ) : (
                  <p className="font-medium">
                    रू
                    {formatPrice(getTotalWholesaleCreditPrice())}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {cartItems.find((item) => item.hasOffer) ? (
              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between mt-3">
                  <p className="max-w-[9rem] font-medium">Total</p>
                  <p className="font-medium">रू{formatPrice(getTotalCrossedPrice())}</p>
                </div>
                {session?.user?.role !== USER_ROLES.BUSINESS_CLIENT && (
                  <div className="flex justify-between mt-3">
                    <p className="max-w-[9rem] font-medium">Discount</p>
                    <p className="font-medium">रू{formatPrice(getTotalCrossedPrice() - getTotalPrice())}</p>
                  </div>
                )}
                <div className="flex justify-between mt-3">
                  <p className="max-w-[9rem] font-medium">Delivery Charge</p>
                  <p className="font-medium">रू{formatPrice(deliveryCharge)}</p>
                </div>
                <div className="flex justify-between mt-3">
                  <p className="max-w-[9rem] font-medium">VAT</p>
                  <p className="font-medium">13%</p>
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
          </>
        )}

        {/* <button className="mt-4 btn btn-primary btn-block" onClick={handleCreateOrder} disabled={isLoading}>
          {isLoading && <span className="loading loading-infinity"></span>}
          Place Order
        </button> */}
      </div>
    </div>
  );
};

export default OrderSummary;
