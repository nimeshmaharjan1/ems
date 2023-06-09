import { create } from 'zustand';

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  image: string;
  slug: string;
};

type Store = {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  getTotalPrice: () => number;
};

export const useCartStore = create<Store>((set, get) => ({
  cartItems: [],
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
  getTotalPrice: () => {
    return get().cartItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
  },
}));
