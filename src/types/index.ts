
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rental_price: number;
  type: 'sale' | 'rent';
  image: string;
  brand: string;
  specs: {
    processor: string;
    memory: string;
    storage: string;
    display: string;
    graphics: string;
  };
  available: boolean;
  featured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  kycVerified: boolean;
  addresses: Address[];
  profilePic?: string;
  phone?: string;
  emailVerified?: boolean;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface Transaction {
  id: string;
  userId: string;
  products: {
    product: Product;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  type: 'sale' | 'rent';
  rentDuration?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  productIds?: string[];
  userIds?: string[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  productIds: string[];
  validFrom: string;
  validTo: string;
  isActive: boolean;
  bannerImage?: string;
}
