import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "@/routes";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCartCount(data.length); // Set count based on items
    } catch (error) {
      console.error("Failed to fetch cart count", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
