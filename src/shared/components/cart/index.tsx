import { removeFromCart } from '@/features/cart/cart.service';
import { formatPrice, rupees } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { useCartStore } from '@/store/user-cart';
import { Trash2 } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const Cart = () => {
  const { cartItems, setCartItems, getTotalPrice } = useCartStore();
  const { status } = useSession();
  const router = useRouter();
  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId, cartItems, setCartItems);
  };
  return (
    <div className="mr-4 dropdown dropdown-hover dropdown-end">
      <label tabIndex={0} className="relative transition-all cursor-pointer hover:text-amber-500">
        <ShoppingCart />
        <div className="badge badge-primary rounded-full p-2 badge-xs absolute -top-2 -right-2.5">
          <span className="text-[8px]">{cartItems.length > 9 ? '9+' : cartItems.length}</span>
        </div>
      </label>
      <div tabIndex={0} className="dropdown-content w-52 md:w-[30rem] z-20 card mt-2 shadow-2xl bg-base-200 ">
        <div className="card-body ">
          <h3 className="card-title">Your Cart</h3>
          {cartItems.length === 0 && (
            <>
              <div className="flex items-center justify-center mt-2">
                <Image src={'/images/empty-cart.png'} alt="empty cart" width={100} height={100}></Image>
              </div>
              <p className="pr-5 mt-3 text-lg font-bold text-center">Your cart is empty.</p>
              <p className="text-lg text-center">Looks like you have not added anything to your cart.</p>
            </>
          )}
          {cartItems.length > 0 && (
            <>
              <ul className="block space-y-4 md:hidden">
                {cartItems.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4">
                    <div className="relative object-cover w-16 h-10 rounded">
                      <Image src={item.image} alt={item.slug} fill />
                    </div>

                    <div>
                      <h3 className="text-sm">{item.slug}</h3>
                      <dl className="mt-1.5 space-y-px text-[11px] text-gray-600"> {item.quantity}</dl>
                      <dl className="mt-1.5 space-y-px text-[11px] text-gray-600">रू {formatPrice(item.price)}</dl>
                    </div>
                  </li>
                ))}
              </ul>
              <ul className="flex-col hidden divide-y divide-gray-700 md:flex">
                {cartItems.map((cartItem) => (
                  <li key={cartItem.productId} className="flex flex-col py-2 md:py-4 lg:py-6 sm:flex-row sm:justify-between">
                    <div className="flex w-full sm:space-x-4">
                      <div className="relative flex-shrink-0 hidden w-20 h-20 rounded outline-none md:block dark:border-transparent sm:w-32 sm:h-[7rem] dark:bg-gray-500 aspect-video">
                        <Image src={cartItem.image} alt={cartItem.slug} fill></Image>
                      </div>
                      <div className="flex flex-col justify-between w-full pb-4">
                        <div className="flex flex-col w-full pb-2 gap-y-3 md:gap-y-0 md:flex-row md:justify-between md:space-x-2">
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium leading-snug md:text-[1rem] sm:pr-8">
                              {cartItem.slug} <span className="text-primary font-[600]">x {cartItem.quantity}</span>
                            </h3>
                            {/* <p className="text-sm dark:text-gray-400">Classic</p> */}
                          </div>
                          <div className="md:text-right">
                            <p className="text-sm font-medium md:text-[1rem]">रू{formatPrice(cartItem.price)}</p>
                            {/* <p className="text-sm line-through dark:text-gray-600">75.50€</p> */}
                          </div>
                        </div>
                        <section className="flex justify-between w-full">
                          <div className="flex text-sm divide-x" onClick={() => handleRemoveFromCart(cartItem.productId)}>
                            <button type="button" className="transition-all hover:text-error">
                              <Trash2 strokeWidth={'1px'}></Trash2>
                            </button>
                            {/* <button type="button" className="flex items-center px-2 py-1 space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                        <path d="M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578.491-.492.533.533L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019ZM437.4,244.313,256.571,425.146,75.738,244.313a96,96,0,0,1,0-135.764l6.911-6.91a96,96,0,0,1,135.713-.051l38.093,38.787,38.274-38.736a96,96,0,0,1,135.765,0l6.91,6.909A96.11,96.11,0,0,1,437.4,244.313Z"></path>
                      </svg>
                      <span>Add to favorites</span>
                    </button> */}
                          </div>
                        </section>
                      </div>
                    </div>
                  </li>
                ))}
                {/* <li className="flex flex-col py-6 sm:flex-row sm:justify-between">
              <div className="flex w-full space-x-2 sm:space-x-4">
                <img
                  className="flex-shrink-0 object-cover w-20 h-20 rounded outline-none dark:border-transparent sm:w-32 sm:h-32 dark:bg-gray-500"
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format&amp;fit=crop&amp;w=1350&amp;q=80"
                  alt="Polaroid camera"
                />
                <div className="flex flex-col justify-between w-full pb-4">
                  <div className="flex justify-between w-full pb-2 space-x-2">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold leading-snug sm:pr-8">Polaroid camera</h3>
                      <p className="text-sm dark:text-gray-400">Classic</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">59.99€</p>
                      <p className="text-sm line-through dark:text-gray-600">75.50€</p>
                    </div>
                  </div>
                  <div className="flex text-sm divide-x">
                    <button type="button" className="transition-all hover:text-error">
                      <Trash2 strokeWidth={'1px'}></Trash2>
                    </button>
                   <button type="button" className="flex items-center px-2 py-1 space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                        <path d="M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578.491-.492.533.533L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019ZM437.4,244.313,256.571,425.146,75.738,244.313a96,96,0,0,1,0-135.764l6.911-6.91a96,96,0,0,1,135.713-.051l38.093,38.787,38.274-38.736a96,96,0,0,1,135.765,0l6.91,6.909A96.11,96.11,0,0,1,437.4,244.313Z"></path>
                      </svg>
                      <span>Add to favorites</span>
                    </button> 
                  </div>
                </div>
              </div>
            </li> */}
              </ul>
              <div className="hidden space-y-1 text-right md:block">
                <p>
                  Total amount: <span className="font-semibold">रू{formatPrice(getTotalPrice())}</span>
                </p>
                <p className="text-sm dark:text-gray-400">Not including taxes and shipping costs</p>
              </div>
              {/* <div className="flex justify-end space-x-4"> */}
              {/* <Link href="/checkout"> */}
              <button
                onClick={() => {
                  if (status === 'unauthenticated') {
                    showToast(Toast.warning, 'You must be logged in.');
                    router.push('/api/auth/signin');
                  } else {
                    router.push('/checkout');
                  }
                }}
                type="button"
                className="mt-3 btn btn-primary btn-block">
                Checkout
              </button>
              {/* </Link> */}
              {/* </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
