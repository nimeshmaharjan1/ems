import { decreaseCartItemQuantity, increaseCartItemQuantity, removeFromCart, updateCartItemQuantity } from '@/features/cart/cart.service';
import MainSharedLayout from '@/shared/layouts/main';
import { formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { useCartStore } from '@/store/user-cart';
import { setCookie } from 'cookies-next';
import { Trash2 } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { getServerSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import { ReactNode, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import axios from 'axios';
import { useRouter } from 'next/router';

const Checkout = () => {
  const { cartItems, setCartItems, getTotalDiscountedPrice, getTotalPrice, getItemTotalPrice, getItemTotalDiscountedPrice } =
    useCartStore();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateOrder = async () => {
    const payload = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item?.discountedPrice,
        hasOffer: item?.hasOffer,
      })),
      userId: session?.user?.id,
    };
    setIsLoading(true);
    try {
      await axios.post('/api/orders', payload);
      modalRef.current?.show();
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
      <div className="grid grid-cols-6 gap-x-6 gap-y-8">
        <motion.section
          layout
          className={classNames('col-span-6 lg:col-span-4', {
            'col-span-6': cartItems.length === 0,
          })}>
          <div className="shadow-lg card">
            <div className="card-body">
              <div className="card-title">Your Cart</div>
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
                                      onClick={() => decreaseCartItemQuantity(item.productId, cartItems, setCartItems)}>
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
                                        updateCartItemQuantity(item.productId, parseInt(e.target.value), cartItems, setCartItems);
                                      }}
                                      value={item.quantity}
                                    />
                                    <button
                                      className="rounded-r-full btn btn-primary btn-xs join-item"
                                      disabled={isLoading}
                                      onClick={() => increaseCartItemQuantity(item.productId, cartItems, setCartItems)}>
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {item.hasOffer ? (
                                <>
                                  <p className="mt-4 text-sm text-gray-400 line-through">
                                    रू {formatPrice(getItemTotalPrice(item.productId))}
                                  </p>
                                  <p className="my-2 font-medium">रू {formatPrice(getItemTotalDiscountedPrice(item.productId))}</p>
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
                                  removeFromCart(item.productId, cartItems, setCartItems);
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
          <div className="card shadow min-h-[244px]">
            <div className="card-body">
              <div className="card-title">Order Summary</div>
              {cartItems.find((item) => item.hasOffer) ? (
                <div className="flex flex-col gap-y-2">
                  <div className="flex justify-between mt-3">
                    <p className="max-w-[9rem] font-medium">Total</p>
                    <p className="font-medium">रू{formatPrice(getTotalPrice())}</p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="max-w-[9rem] font-medium">Discount</p>
                    <p className="font-medium">रू{formatPrice(getTotalPrice() - getTotalDiscountedPrice())}</p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="max-w-[9rem] font-medium">To Pay</p>
                    <p className="font-medium">रू{formatPrice(getTotalDiscountedPrice())}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between mt-3">
                  <p className="font-medium">To Pay</p>

                  <p className="font-medium">रू{formatPrice(getTotalPrice())}</p>
                </div>
              )}

              <button className="mt-4 btn btn-primary btn-block" onClick={handleCreateOrder} disabled={isLoading}>
                {isLoading && <span className="loading loading-infinity"></span>}
                Create Order
              </button>
            </div>
          </div>
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
