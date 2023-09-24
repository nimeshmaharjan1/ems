import FormControl from '@/shared/components/form-control';
import { useSession } from 'next-auth/react';
import React, { Dispatch, SetStateAction } from 'react';
import { ICheckoutDetails } from '../../../../pages/checkout';
import { PAYMENT_METHOD, SELECTED_WHOLESALE_OPTION, USER_ROLES } from '@prisma/client';
import classNames from 'classnames';
import { QrCode, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactInformation: React.FC<{
  checkoutDetails: ICheckoutDetails;
  setCheckoutDetails: Dispatch<SetStateAction<ICheckoutDetails>>;
  handleCreateOrder: () => void;
  isLoading: boolean;
}> = ({ checkoutDetails, setCheckoutDetails, handleCreateOrder, isLoading }) => {
  const { data: session } = useSession();
  return (
    <div className="shadow-lg card bg-base-200">
      <div className="card-body">
        <div className="card-title">Contact Information</div>
        <FormControl label="Full Name">
          <input type="text" value={session?.user?.name} disabled className="input input-bordered" />
        </FormControl>
        <FormControl label="Phone Number">
          <input type="text" value={session?.user?.phone_number} disabled className="input input-bordered" />
        </FormControl>
        <FormControl label="Additional Phone Number">
          <input
            type="text"
            value={checkoutDetails.additionalPhoneNumber}
            onChange={(e) => setCheckoutDetails((prev) => ({ ...prev, additionalPhoneNumber: e.target.value }))}
            className="input input-bordered"
          />
        </FormControl>
        {session?.user?.role === USER_ROLES.BUSINESS_CLIENT && (
          <>
            <div className="mt-1 form-control">
              <label className="gap-3 !justify-start cursor-pointer label">
                <input
                  type="checkbox"
                  checked={checkoutDetails.chosenAddress === 'shop-address'}
                  onChange={() => {
                    if (checkoutDetails.chosenAddress === 'shop-address') {
                      setCheckoutDetails((prev) => ({
                        ...prev,
                        chosenAddress: 'not-shop-address',
                      }));
                    } else {
                      setCheckoutDetails((prev) => ({
                        ...prev,
                        chosenAddress: 'shop-address',
                      }));
                    }
                  }}
                  className="checkbox"
                />
                <span className="label-text">Use Shop Address</span>
              </label>
            </div>
          </>
        )}
        {checkoutDetails.chosenAddress === 'not-shop-address' ? (
          <FormControl label="Delivery Address" errorMessage={checkoutDetails.isInvalid ? 'Delivery Address is required.' : ''}>
            <input
              type="text"
              value={checkoutDetails.deliveryAddress}
              onChange={(e) => {
                setCheckoutDetails((prev) => ({ ...prev, deliveryAddress: e.target.value, isInvalid: false }));
              }}
              className={classNames('input input-bordered', {
                'input-error': checkoutDetails.isInvalid,
              })}
            />
          </FormControl>
        ) : (
          <FormControl label="Shop Address">
            <input type="text" value={session?.user?.shopAddress} disabled className="input input-bordered" />
          </FormControl>
        )}
        {session?.user?.role === USER_ROLES.BUSINESS_CLIENT && (
          <section>
            <FormControl label="Wholesale Option">
              <select
                className="select select-bordered"
                onChange={(e) => {
                  setCheckoutDetails((prev) => ({
                    ...prev,
                    wholesaleOption: e.target.value as SELECTED_WHOLESALE_OPTION,
                  }));
                }}>
                <option value={SELECTED_WHOLESALE_OPTION.CASH}>Cash</option>
                <option value={SELECTED_WHOLESALE_OPTION.CREDIT}>Credit</option>
              </select>
            </FormControl>
          </section>
        )}

        <section className="flex flex-col mt-3 gap-x-2 gap-y-4 payment-method">
          <label htmlFor="Pl" className="label">
            Please select your desired payment method:
          </label>
          <motion.div
            whileTap={{ scale: 0.8 }}
            onClick={() => setCheckoutDetails((prev) => ({ ...prev, paymentMethod: PAYMENT_METHOD.COD }))}
            className={classNames('transition-all cursor-pointer card bg-base-300 group', {
              // 'border-primary border-2': checkoutDetails.paymentMethod === PAYMENT_METHOD.COD,
            })}>
            <div className="items-center justify-center card-body">
              <Truck
                className={classNames('transition-all group-hover:text-primary', {
                  'text-primary': checkoutDetails.paymentMethod === PAYMENT_METHOD.COD,
                })}
              />
              <p
                className={classNames('text-xs font-medium transition-all lg:text-sm group-hover:text-primary', {
                  'text-primary': checkoutDetails.paymentMethod === PAYMENT_METHOD.COD,
                })}>
                Cash On Delivery
              </p>
            </div>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.8 }}
            onClick={() => setCheckoutDetails((prev) => ({ ...prev, paymentMethod: PAYMENT_METHOD.FONEPAY }))}
            className={classNames('transition-all cursor-pointer card bg-base-300 group', {
              // 'border-primary border-2': checkoutDetails.paymentMethod === PAYMENT_METHOD.FONEPAY,
            })}>
            <div className="items-center justify-center card-body">
              <QrCode
                className={classNames('transition-all group-hover:text-primary', {
                  'text-primary': checkoutDetails.paymentMethod === PAYMENT_METHOD.FONEPAY,
                })}
              />
              <p
                className={classNames('text-xs font-medium transition-all lg:text-sm group-hover:text-primary', {
                  'text-primary': checkoutDetails.paymentMethod === PAYMENT_METHOD.FONEPAY,
                })}>
                Fonepay
              </p>
            </div>
          </motion.div>
        </section>
        <button className="mt-4 btn btn-primary btn-block" onClick={handleCreateOrder} disabled={isLoading}>
          {isLoading && <span className="loading loading-infinity"></span>}
          Place Order
        </button>
      </div>
    </div>
  );
};

export default ContactInformation;
