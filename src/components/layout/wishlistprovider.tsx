// WishlistContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);
import { BASE_URL } from '@/routes';

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    try {
      const res = await fetch(`${BASE_URL}/wishlist/wishlist/count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setWishlistCount(data.total_wishlist_items);
    } catch (err) {
      console.error("Failed to fetch wishlist count", err);
    }
  };

  useEffect(() => {
    fetchWishlistCount();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistCount, fetchWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
