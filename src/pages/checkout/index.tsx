import OrderSummary from '@/features/checkout/components/order-summary';
import MainSharedLayout from '@/shared/layouts/main';
import { formatPrice } from '@/shared/utils/helper.util';
import { showToast, Toast } from '@/shared/utils/toast.util';
import { useCartStore } from '@/store/user-cart';
import { PAYMENT_METHOD, PrismaClient, SELECTED_WHOLESALE_OPTION, Settings, USER_ROLES } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession, Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ContactInformation from '../../features/checkout/components/contact-information';
import { authOptions } from '../api/auth/[...nextauth]';
import { NextPageWithLayout } from '../_app';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const prisma = new PrismaClient();

  const session = (await getServerSession(ctx.req, ctx.res, authOptions)) as any;
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: true,
      },
    };
  }
  const settings = await prisma.settings.findFirst();
  return {
    props: {
      settings: JSON.parse(JSON.stringify(settings)),
    },
  };
};

export interface ICheckoutDetails {
  deliveryAddress: string;
  additionalPhoneNumber: string;
  chosenAddress: 'shop-address' | 'not-shop-address';
  isInvalid: boolean;
  wholesaleOption?: SELECTED_WHOLESALE_OPTION;
  paymentMethod: PAYMENT_METHOD;
}

const Checkout: NextPageWithLayout<{ settings: Settings }> = ({ settings }) => {
  const {
    cartItems,
    setCartItems,
    getTotalCrossedPrice,
    getTotalPrice,
    getItemTotalPrice,
    getItemTotalDiscountedPrice,
    removeFromCart,
    decreaseCartItemQuantity,
    increaseCartItemQuantity,
    updateCartItemQuantity,
    getItemTotalWholesaleCashPrice,
    getItemTotalWholesaleCreditPrice,
  } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [checkoutDetails, setCheckoutDetails] = useState<ICheckoutDetails>({
    deliveryAddress: '',
    chosenAddress: 'not-shop-address',
    isInvalid: false,
    additionalPhoneNumber: '',
    wholesaleOption: SELECTED_WHOLESALE_OPTION.CASH,
    paymentMethod: PAYMENT_METHOD.COD,
  });
  const handleCreateOrder = async () => {
    if (checkoutDetails.chosenAddress === 'not-shop-address' && !checkoutDetails.deliveryAddress) {
      setCheckoutDetails((prev) => ({
        ...prev,
        isInvalid: true,
      }));
      return;
    }
    const payload = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price:
          session?.user?.role === USER_ROLES.BUSINESS_CLIENT
            ? checkoutDetails.wholesaleOption === 'CASH'
              ? item.wholesaleCashPrice
              : checkoutDetails.wholesaleOption === 'CREDIT'
                ? item.wholesaleCreditPrice
                : item.sellingPrice
            : item.sellingPrice,
      })),
      customerAddress: checkoutDetails.chosenAddress === 'shop-address' ? session?.user?.shopAddress : checkoutDetails.deliveryAddress,
      userId: session?.user?.id,
      additionalPhoneNumber: checkoutDetails.additionalPhoneNumber,
      selectedWholesaleOption: session?.user?.role === USER_ROLES.BUSINESS_CLIENT ? checkoutDetails.wholesaleOption : null,
      paymentMethod: checkoutDetails.paymentMethod,
    };
    setIsLoading(true);
    try {
      await axios.post('/api/orders', payload);
      if (checkoutDetails.paymentMethod === PAYMENT_METHOD.FONEPAY) {
        modalRef.current?.show();
      } else {
        localStorage.removeItem('cartItems');
        setCartItems([]);
        router.replace('/products');
      }
    } catch (error) {
      setIsLoading(false);
      showToast(Toast.error, 'Something went wrong while trying to create the order.');
      console.error(error);
    }
  };
  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      {/* Open the modal using ID.showModal() method */}

      <dialog ref={modalRef} id="payment_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">ESEWA Payment</h3>
          <Image className="my-6" src="/images/esewa.png" alt="payment qr code" width={500} height={200}></Image>
          <p className="text-sm font-medium leading-relaxed text-amber-400">
            NOTE: Please only close this <span className="font-bold">modal</span> only after the payment has been completed or after you
            have scanned the QR code. If you have any questions feel free to contact support{' '}
            <span className="font-bold">+977-9841444423</span>.
          </p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.removeItem('cartItems');
                setCartItems([]);
                modalRef.current?.close();
                router.replace('/products');
              }}>
              Go Back To Shopping
            </button>
          </div>
        </div>
      </dialog>
      <div className="flex gap-3 mb-5">
        <Link href="/products" passHref>
          <button className="btn btn-ghost btn-sm">
            <ArrowLeft />
          </button>
        </Link>
        <h2 className="text-2xl font-semibold">Checkout</h2>
      </div>
      <div className="grid grid-cols-6 gap-x-6 gap-y-8">
        <motion.section
          layout
          className={classNames('col-span-6 lg:col-span-4', {
            'col-span-6': cartItems.length === 0,
          })}>
          <div className="shadow-lg card bg-base-200">
            <div className="card-body">
              {/* <div className="card-title">Your Cart</div> */}
              {cartItems.length === 0 ? (
                <>
                  <>
                    <div className="flex items-center justify-center mt-2">
                      <Image src={'/images/empty-cart.png'} alt="empty cart" width={100} height={100}></Image>
                    </div>
                    <p className="pr-5 mt-3 text-lg font-bold text-center">Your cart is empty.</p>
                    <p className="text-lg text-center">Looks like you have not added anything to your cart.</p>
                    <div className="mt-3 text-center">
                      <button className="btn btn-primary">Go back to shopping</button>
                    </div>
                  </>
                </>
              ) : (
                <>
                  <ul className="flex flex-col divide-y divide-gray-300">
                    {cartItems.map((item) => (
                      <li key={item.productId} className="py-6">
                        <div className="grid items-center grid-cols-6 md:items-stretch gap-x-8">
                          <div className="col-span-2">
                            <Image src={item.image} className="rounded md:shadow" alt={item.slug} width={300} height={300}></Image>
                          </div>
                          <section className="flex flex-col justify-between col-span-4 py-2 gap-y-6 md:gap-y-0 product-detail">
                            <section className="upper-section">
                              <div className="flex flex-col gap-x-2 gap-y-4 md:items-center md:flex-row md:justify-between">
                                <h2 className="font-medium">{item.slug}</h2>
                                <div className="flex flex-row items-center gap-2 quantity lg:items-start lg:flex-col">
                                  <div className="join">
                                    <button
                                      disabled={isLoading}
                                      className="rounded-l-full btn btn-primary btn-xs join-item"
                                      onClick={() => decreaseCartItemQuantity(item.productId)}>
                                      -
                                    </button>
                                    <input
                                      className="input w-24 input-bordered outline-none input-xs text-center !bg-base-200 join-item"
                                      type="number"
                                      disabled={isLoading}
                                      onChange={(e) => {
                                        if (parseInt(e.target.value) > item.maxQuantity) {
                                          return showToast(Toast.warning, 'Exceeded available quantity.');
                                        }
                                        updateCartItemQuantity(item.productId, parseInt(e.target.value));
                                      }}
                                      value={item.quantity}
                                    />
                                    <button
                                      className="rounded-r-full btn btn-primary btn-xs join-item"
                                      disabled={isLoading}
                                      onClick={() => increaseCartItemQuantity(item.productId)}>
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {session?.user?.role === USER_ROLES.BUSINESS_CLIENT ? (
                                <p className="mt-4 font-medium">रू {formatPrice(getItemTotalWholesaleCashPrice(item.productId))}</p>
                              ) : item.hasOffer ? (
                                <>
                                  <p className="mt-4 text-sm text-gray-400 line-through">
                                    रू {formatPrice(getItemTotalDiscountedPrice(item.productId))}
                                  </p>
                                  <p className="my-2 font-medium">रू {formatPrice(getItemTotalPrice(item.productId))}</p>
                                </>
                              ) : (
                                <p className="mt-4 font-medium">रू {formatPrice(getItemTotalPrice(item.productId))}</p>
                              )}
                            </section>
                            <div>
                              <Trash2
                                onClick={() => {
                                  if (isLoading) {
                                    return;
                                  }
                                  removeFromCart(item.productId);
                                }}
                                strokeWidth="1px"
                                className="text-xs transition-all cursor-pointer md:text-base hover:text-red-400"></Trash2>
                            </div>
                          </section>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </motion.section>
        <motion.section layout className={`${cartItems.length === 0 ? 'opacity-0' : 'col-span-6 lg:col-span-2 opacity-100'}`}>
          <ContactInformation {...{ checkoutDetails, setCheckoutDetails }}></ContactInformation>
          <OrderSummary
            deliveryCharge={settings?.deliveryCharge!}
            {...{ isLoading, modalRef, setIsLoading, handleCreateOrder, checkoutDetails, setCheckoutDetails }}></OrderSummary>
        </motion.section>
      </div>
    </>
  );
};

export default Checkout;
Checkout.getLayout = (page: ReactNode) => {
  return (
    <MainSharedLayout
      metaData={{
        title: 'Checkout',
      }}>
      {page}
    </MainSharedLayout>
  );
};
