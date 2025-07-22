// src/utils/guestStorage.ts

export const loadGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem("guest_cart") || "[]");
  } catch {
    return [];
  }
};

export const saveGuestCart = (items: any[]) => {
  localStorage.setItem("guest_cart", JSON.stringify(items));
};

export const loadGuestWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
  } catch {
    return [];
  }
};

export const saveGuestWishlist = (ids: number[]) => {
  localStorage.setItem("guest_wishlist", JSON.stringify(ids));
};
