import { decreaseCartItemQuantity, increaseCartItemQuantity, updateCartItemQuantity } from '@/features/cart/cart.service';
import MainSharedLayout from '@/shared/layouts/main';
import ViewAllLayout from '@/shared/layouts/view-all';
import { formatPrice } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { useCartStore } from '@/store/user-cart';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode } from 'react';

const Checkout = () => {
  const { cartItems, setCartItems, getTotalPrice, getItemTotalPrice } = useCartStore();
  return (
    <div className="grid grid-cols-6 gap-x-6">
      <section className="col-span-4">
        <div className="bg-base-200 card shadow">
          <div className="card-body">
            <div className="card-title">Your Cart</div>
            <ul className="flex flex-col divide-y divide-gray-300">
              {cartItems.map((item) => (
                <li key={item.productId} className="py-6 flex items-center gap-x-6">
                  <div className="relative flex-shrink-0 object-cover w-20 h-20 dark:border-transparent rounded outline-none sm:w-24 sm:h-24 dark:bg-gray-500">
                    <Image src={item.image} alt={item.slug} fill></Image>
                  </div>
                  <p className="font-medium">{item.slug}</p>
                  <p className="font-medium">&#8377;{formatPrice(item.price)}</p>
                  <div className="join">
                    <button
                      className="btn btn-secondary btn-sm join-item rounded-l-full"
                      onClick={() => decreaseCartItemQuantity(item.productId, cartItems, setCartItems)}>
                      -
                    </button>
                    <input
                      className="input w-24 input-bordered outline-none input-sm text-center !bg-base-200 join-item"
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
                      className="btn btn-secondary btn-sm join-item rounded-r-full"
                      onClick={() => increaseCartItemQuantity(item.productId, cartItems, setCartItems)}>
                      +
                    </button>
                  </div>
                  <p className="font-medium">&#8377;{formatPrice(getItemTotalPrice(item.productId))}</p>
                  <Trash2 strokeWidth="1px" className="hover:text-red-400 cursor-pointer transition-all"></Trash2>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="col-span-2">
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
      </section>
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
