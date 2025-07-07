import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BASE_URL } from "@/routes";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  // Add other cart item properties as needed
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  fetchCartCount: () => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/count`, {
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cart count: ${response.status}`);
      }

      const data = await response.json();
      setCartCount(data.count);
    } catch (error) {
      console.error("Failed to fetch cart count", error);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ productId, quantity })
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.status}`);
      }

      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`Failed to remove from cart: ${response.status}`);
      }

      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error(`Failed to update cart item: ${response.status}`);
      }

      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      console.error("Failed to update cart item", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/clear`, {
        method: 'POST',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`Failed to clear cart: ${response.status}`);
      }

      setCartItems([]);
      setCartCount(0);
    } catch (error) {
      console.error("Failed to clear cart", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateCartItem,
      fetchCart,
      fetchCartCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
