
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, CartItem, WishlistItem } from '../types';
import { products } from '../data/products';
import { users } from '../data/users';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../routes";

interface AppContextType {
  products: Product[];
  filteredProducts: Product[];
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => boolean;
  updateUserAddress: (addressId: string, isDefault: boolean) => void;
  updateUser: (userData: Partial<User>) => void; // Add this new method
  isAuthenticated: boolean;
  searchProducts: (query: string) => void;
  filterProductsByType: (type: 'all' | 'sale' | 'rent') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

useEffect(() => {
  const token = localStorage.getItem('token');

  // If token exists but user not set yet, verify with backend
  if (token && !user) {
    axios
      .get(`${BASE_URL}/users/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Token verification failed", err);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  }

  // Load cart/wishlist from storage
  const storedCart = localStorage.getItem('cart');
  const storedWishlist = localStorage.getItem('wishlist');

  if (storedCart) setCart(JSON.parse(storedCart));
  if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
}, []);


  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist([...wishlist, { product }]);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    } else {
      removeFromWishlist(product.id);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const login = async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
  
      const res = await axios.post(`${BASE_URL}/users/login`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      const { access_token } = res.data;
  
      const userRes = await axios.get(`${BASE_URL}/users/auth`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      const loggedInUser = userRes.data;
  
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  
      if (!loggedInUser) {
        throw new Error("User data not received");
      }
  
      setUser(loggedInUser); // <== Make sure this doesn't crash
      toast({
        title: "Login successful",
        description: `Welcome, ${loggedInUser.name || loggedInUser.email}`,
      });
  
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;``
    }
  };
  
  

const logout = () => {
  // ✅ Remove token from browser
  localStorage.removeItem('token');

  // ✅ Clear user state
  setUser(null);

  // ✅ Show toast message
  toast({
    title: "Logged out",
    description: "You have been successfully logged out.",
  });

  // (Optional) Redirect the user to login or homepage
  // navigate("/login"); // if using React Router
};


  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      // In a real app, this would be an API call
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  // Add the missing updateUser method
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      toast({
        title: "Updated successfully",
        description: "Your information has been updated.",
      });
    }
  };

  const updateUserPassword = (currentPassword: string, newPassword: string) => {
    // In a real app, this would be an API call with actual password verification
    if (currentPassword && newPassword) {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      return true;
    }
    
    toast({
      title: "Password update failed",
      description: "Please check your current password and try again.",
      variant: "destructive",
    });
    return false;
  };

  const updateUserAddress = (addressId: string, isDefault: boolean) => {
    if (user) {
      // In a real app, this would be an API call
      const updatedAddresses = user.addresses.map(address => ({
        ...address,
        isDefault: address.id === addressId ? isDefault : isDefault ? false : address.isDefault
      }));
      
      setUser({
        ...user,
        addresses: updatedAddresses
      });
      
      toast({
        title: "Address updated",
        description: isDefault ? "Default address has been updated." : "Address has been updated.",
      });
    }
  };

  const searchProducts = (query: string) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) || 
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredProducts(filtered);
  };

  const filterProductsByType = (type: 'all' | 'sale' | 'rent') => {
    if (type === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.type === type));
    }
  };

  return (
    <AppContext.Provider value={{
      products,
      filteredProducts,
      setFilteredProducts,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      user,
      login,
      logout,
      updateUserProfile,
      updateUser, // Add the new method to the context value
      updateUserPassword,
      updateUserAddress,
      isAuthenticated: !!user,
      searchProducts,
      filterProductsByType,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
