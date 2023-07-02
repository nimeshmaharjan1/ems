import MainSharedLayout from '@/shared/layouts/main';
import { formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { useCartStore } from '@/store/user-cart';
import axios from 'axios';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useRef, useState } from 'react';
import OrderSummary from './order-summary';
import ContactInformation from './contact-information';
import { useForm } from 'react-hook-form';

const Checkout = () => {
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
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const { register } = useForm({
    defaultValues: {},
  });
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
                            <Image src={item.image} className="md:shadow" alt={item.slug} width={300} height={300}></Image>
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
                              {item.hasOffer ? (
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
          <ContactInformation></ContactInformation>
          <OrderSummary {...{ isLoading, modalRef, setIsLoading }}></OrderSummary>
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
