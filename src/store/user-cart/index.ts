import { Toast, showToast } from '@/shared/utils/toast.util';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  image: string;
  slug: string;
  maxQuantity: number;
  sellingPrice: number;
  hasOffer?: boolean;
  crossedPrice?: number;
  wholesaleCreditPrice?: number;
  wholesaleCashPrice?: number;
};

interface Store {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  getTotalPrice: () => number;
  getTotalCrossedPrice: () => number;
  getItemTotalPrice: (id: string) => number;
  getItemTotalDiscountedPrice: (id: string) => number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  decreaseCartItemQuantity: (productId: string) => void;
  increaseCartItemQuantity: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
}

export const useCartStore = create<Store>((set, get) => ({
  cartItems: [],
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
  getTotalPrice: () => {
    return get().cartItems.reduce((total: number, item: CartItem) => {
      return total + item.sellingPrice * item.quantity;
    }, 0);
  },
  getTotalCrossedPrice: () => {
    return get().cartItems.reduce((total: number, item: CartItem) => {
      if (item.hasOffer) {
        return total + item.crossedPrice! * item.quantity;
      }
      return total + item.sellingPrice * item.quantity;
    }, 0);
  },
  getItemTotalPrice: (id: string) => {
    const item = get().cartItems.find((cartItem: CartItem) => cartItem.productId === id);
    return item ? item.sellingPrice * item.quantity : 0;
  },
  getItemTotalDiscountedPrice: (id: string) => {
    const item = get().cartItems.find((cartItem: CartItem) => cartItem.productId === id);
    return item ? item.crossedPrice! * item.quantity : 0;
  },
  addToCart: (item) => {
    const existingItem = get().cartItems.find((cartItem) => cartItem.productId === item.productId);
    if (existingItem && existingItem.quantity >= item.maxQuantity) {
      showToast(Toast.warning, 'Exceeded available quantity.');
      return;
    }
    if (existingItem) {
      // If the item already exists, update its quantity
      const updatedCartItems = get().cartItems.map((cartItem) =>
        cartItem.productId === item.productId ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      set({ cartItems: updatedCartItems });
    } else {
      // If the item doesn't exist, add it to the cart
      const updatedCartItems = [...get().cartItems, item];

      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      set({ cartItems: updatedCartItems });
    }
    showToast(Toast.success, 'Successfully added to the cart.');
  },
  removeFromCart: (productId) => {
    const updatedCartItems = get().cartItems.filter((cartItem) => cartItem.productId !== productId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({ cartItems: updatedCartItems });
  },
  updateCartItemQuantity: (productId: string, quantity: number) => {
    const updatedCartItems = get().cartItems.map((cartItem) => (cartItem.productId === productId ? { ...cartItem, quantity } : cartItem));
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({ cartItems: updatedCartItems });
  },
  increaseCartItemQuantity: (productId) => {
    const updatedCartItems = get().cartItems.map((cartItem) =>
      cartItem.productId === productId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({ cartItems: updatedCartItems });
  },
  decreaseCartItemQuantity: (productId) => {
    const updatedCartItems = get().cartItems.map((cartItem) =>
      cartItem.productId === productId ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) } : cartItem
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    set({ cartItems: updatedCartItems });
  },
}));

// ts-tip: auto infer return type
export const useShallowCartStore = <T>(cb: (state: Store) => T) => useCartStore(cb, shallow);
