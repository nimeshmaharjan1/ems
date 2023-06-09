import { decreaseCartItemQuantity, increaseCartItemQuantity, removeFromCart, updateCartItemQuantity } from '@/features/cart/cart.service';
import MainSharedLayout from '@/shared/layouts/main';
import { formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { useCartStore } from '@/store/user-cart';
import { setCookie } from 'cookies-next';
import { Trash2 } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession({ req: context.req });
//   if (!session) {
//     setCookie('isFromCheckout', 'true', { req: context.req, res: context.res });
//     return {
//       redirect: {
//         permanent: true,
//         destination: '/api/auth/signin',
//       },
//       props: {},
//     };
//   }
//   return { props: {} };
// };

const Checkout = () => {
  const { cartItems, setCartItems, getTotalPrice, getItemTotalPrice } = useCartStore();
  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-8">
      <motion.section
        layout
        className={classNames('col-span-6 lg:col-span-4', {
          'col-span-6': cartItems.length === 0,
        })}>
        <div className="bg-base-200 card shadow">
          <div className="card-body">
            <div className="card-title">Your Cart</div>
            {cartItems.length === 0 ? (
              <>
                <>
                  <div className="flex items-center justify-center mt-2">
                    <Image src={'/images/empty-cart.png'} alt="empty cart" width={100} height={100}></Image>
                  </div>
                  <p className="text-center text-lg font-bold pr-5 mt-3">Your cart is empty.</p>
                  <p className="text-center text-lg">Looks like you have not added anything to your cart.</p>
                  <div className="text-center mt-3">
                    <button className="btn btn-primary">Go back to shopping</button>
                  </div>
                </>
              </>
            ) : (
              <>
                <ul className="flex flex-col divide-y divide-gray-300">
                  {cartItems.map((item) => (
                    <li key={item.productId} className="py-6 flex items-center gap-x-6 flex-wrap gap-y-6">
                      <div className="relative flex-shrink-0 object-cover w-20 h-20 dark:border-transparent rounded outline-none sm:w-24 sm:h-24 dark:bg-gray-500">
                        <Image src={item.image} alt={item.slug} fill></Image>
                      </div>
                      <div className="name flex flex-row lg:flex-col gap-2 ">
                        <p className="font-medium text-sm md:text-base opacity-60">Name</p>
                        <p className="font-medium text-sm md:text-base block md:hidden">
                          {item.slug.length > 20 ? `${item.slug.slice(0, 20)}...` : item.slug}
                        </p>
                        <p className="font-medium text-sm md:text-base hidden md:block">{item.slug}</p>
                      </div>
                      <div className="price flex gap-2 flex-row lg:flex-col">
                        <p className="font-medium text-sm md:text-base opacity-60">Price</p>

                        <p className="font-medium text-sm md:text-base">&#8377;{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex gap-2 quantity items-center lg:items-start flex-row lg:flex-col">
                        <p className="font-medium text-sm md:text-base opacity-60">Quantity</p>

                        <div className="join">
                          <button
                            className="btn btn-secondary btn-xs md:btn-sm join-item rounded-l-full"
                            onClick={() => decreaseCartItemQuantity(item.productId, cartItems, setCartItems)}>
                            -
                          </button>
                          <input
                            className="input w-24 input-bordered outline-none input-xs md:input-sm text-center !bg-base-200 join-item"
                            type="number"
                            onChange={(e) => {
                              if (parseInt(e.target.value) > item.maxQuantity) {
                                return showToast(Toast.warning, 'Exceeded available quantity.');
                              }
                              updateCartItemQuantity(item.productId, parseInt(e.target.value), cartItems, setCartItems);
                            }}
                            value={item.quantity}
                          />
                          <button
                            className="btn btn-secondary btn-xs md:btn-sm join-item rounded-r-full"
                            onClick={() => increaseCartItemQuantity(item.productId, cartItems, setCartItems)}>
                            +
                          </button>
                        </div>
                      </div>
                      <section className="flex flex-row lg:flex-col gap-2 total-price items-center">
                        <p className="font-medium text-sm md:text-base opacity-60 w-36 md:w-auto">Total Price</p>
                        <p className="font-medium text-sm md:text-base basis-full flex-1 md:basis-0">
                          &#8377;{formatPrice(getItemTotalPrice(item.productId))}
                        </p>
                      </section>
                      <button className="inline-flex lg:hidden btn btn-xs btn-error btn-outline">Remove</button>
                      <div className="hidden lg:block basis-full lg:basis-0">
                        <Trash2
                          onClick={() => removeFromCart(item.productId, cartItems, setCartItems)}
                          strokeWidth="1px"
                          className="hover:text-red-400 cursor-pointer transition-all"></Trash2>
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
        <div className="card shadow bg-base-200 min-h-[244px]">
          <div className="card-body">
            <div className="card-title">Order Summary</div>
            <div className="flex justify-between mt-3">
              <p className="font-medium">To Pay</p>

              <p className="font-medium">&#8377;{formatPrice(getTotalPrice())}</p>
            </div>
            <button className="btn btn-primary btn-block mt-4">Create Order</button>
          </div>
        </div>
      </motion.section>
    </div>
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