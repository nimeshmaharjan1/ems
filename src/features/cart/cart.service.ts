import { CartItem } from '@/store/user-cart';
type SetCartItems = (cartItems: CartItem[]) => void;

export const addToCart = (item: CartItem, cartItems: CartItem[], setCartItems: SetCartItems) => {
  // Check if the item already exists in the cart
  const existingItem = cartItems.find((cartItem) => cartItem.productId === item.productId);

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
};

export const removeFromCart = (productId: string, cartItems: CartItem[], setCartItems: SetCartItems) => {
  const updatedCartItems = cartItems.filter((cartItem) => cartItem.productId !== productId);
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  setCartItems(updatedCartItems);
};
