import { Toast, showToast } from '@/shared/utils/toast.util';
import { CartItem } from '@/store/user-cart';
type SetCartItems = (cartItems: CartItem[]) => void;

export const addToCart = (item: CartItem, cartItems: CartItem[], setCartItems: SetCartItems) => {
  // Check if the item already exists in the cart
  const existingItem = cartItems.find((cartItem) => cartItem.productId === item.productId);
  console.log(existingItem);
  if (existingItem && existingItem.quantity >= item.maxQuantity) {
    showToast(Toast.warning, 'Exceeded available quantity.');
    return;
  }
  if (existingItem) {
    // If the item already exists, update its quantity
    const updatedCartItems = cartItems.map((cartItem) =>
      cartItem.productId === item.productId ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  } else {
    // If the item doesn't exist, add it to the cart
    const updatedCartItems = [...cartItems, item];

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  }
  showToast(Toast.success, 'Successfully added to the cart.');
};

export const removeFromCart = (productId: string, cartItems: CartItem[], setCartItems: SetCartItems) => {
  const updatedCartItems = cartItems.filter((cartItem) => cartItem.productId !== productId);
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  setCartItems(updatedCartItems);
};

export const updateCartItemQuantity = (productId: string, quantity: number, cartItems: CartItem[], setCartItems: SetCartItems) => {
  const updatedCartItems = cartItems.map((cartItem) => (cartItem.productId === productId ? { ...cartItem, quantity } : cartItem));
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  setCartItems(updatedCartItems);
};

export const increaseCartItemQuantity = (productId: string, cartItems: CartItem[], setCartItems: SetCartItems) => {
  const updatedCartItems = cartItems.map((cartItem) =>
    cartItem.productId === productId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
  );
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  setCartItems(updatedCartItems);
};

export const decreaseCartItemQuantity = (productId: string, cartItems: CartItem[], setCartItems: SetCartItems) => {
  const updatedCartItems = cartItems.map((cartItem) =>
    cartItem.productId === productId ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) } : cartItem
  );
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  setCartItems(updatedCartItems);
};
