import FormControl from '@/shared/components/form-control';
import { useSession } from 'next-auth/react';
import React, { Dispatch, SetStateAction } from 'react';
import { IAddressDetails } from '../../../../pages/checkout';
import { USER_ROLES } from '@prisma/client';
import classNames from 'classnames';

const ContactInformation: React.FC<{ addressDetails: IAddressDetails; setAddressDetails: Dispatch<SetStateAction<IAddressDetails>> }> = ({
  addressDetails,
  setAddressDetails,
}) => {
  const { data: session } = useSession();
  return (
    <div className="mb-4 shadow card">
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
            value={addressDetails.additionalPhoneNumber}
            onChange={(e) => setAddressDetails((prev) => ({ ...prev, additionalPhoneNumber: e.target.value }))}
            className="input input-bordered"
          />
        </FormControl>
        {session?.user?.role === USER_ROLES.BUSINESS_CLIENT && (
          <>
            <div className="mt-1 form-control">
              <label className="gap-3 !justify-start cursor-pointer label">
                <input
                  type="checkbox"
                  checked={addressDetails.chosenAddress === 'shop-address'}
                  onChange={() => {
                    if (addressDetails.chosenAddress === 'shop-address') {
                      setAddressDetails((prev) => ({
                        ...prev,
                        chosenAddress: 'not-shop-address',
                      }));
                    } else {
                      setAddressDetails((prev) => ({
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
        {addressDetails.chosenAddress === 'not-shop-address' ? (
          <FormControl label="Delivery Address" errorMessage={addressDetails.isInvalid ? 'Delivery Address is required.' : ''}>
            <input
              type="text"
              value={addressDetails.deliveryAddress}
              onChange={(e) => {
                setAddressDetails((prev) => ({ ...prev, deliveryAddress: e.target.value, isInvalid: false }));
              }}
              className={classNames('input input-bordered', {
                'input-error': addressDetails.isInvalid,
              })}
            />
          </FormControl>
        ) : (
          <FormControl label="Shop Address">
            <input type="text" value={session?.user?.shopAddress} disabled className="input input-bordered" />
          </FormControl>
        )}
      </div>
    </div>
  );
};

export default ContactInformation;
