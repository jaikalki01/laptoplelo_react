import axios, { AxiosError, AxiosResponse } from 'axios';
import { BASE_URL } from '@/routes';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// FastAPI specific error handling
export const handleFastAPIError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 400:
        return data?.detail || 'Bad request. Please check your input.';
      case 401:
        return 'Invalid credentials. Please try again.';
      case 403:
        return 'Access denied. You do not have permission for this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        // FastAPI validation error
        if (data?.detail && Array.isArray(data.detail)) {
          const errors = data.detail.map((err: any) => err.msg).join(', ');
          return `Validation error: ${errors}`;
        }
        return data?.detail || 'Validation error.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          return 'Cannot connect to server. Please check your connection.';
        }
        return data?.detail || 'An unexpected error occurred.';
    }
  }
  return 'An unexpected error occurred.';
};

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/users/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    kyc_verified?: boolean;
  }) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/auth');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// Products API functions
export const productsAPI = {
  getAll: async (params?: { 
    skip?: number; 
    limit?: number; 
    search?: string; 
    category?: string;
    type?: string;
  }) => {
    try {
      const response = await api.get('/products', { params });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Products API Error:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData: FormData) => {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, productData: FormData) => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Cart API functions
export const cartAPI = {
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  add: async (cartItem: {
    product_id: number;
    quantity: number;
    rental_duration?: number;
    type: string;
    price: number;
  }) => {
    const response = await api.post('/cart', cartItem);
    return response.data;
  },

  update: async (cartItem: {
    product_id: number;
    quantity: number;
    rental_duration?: number;
    type: string;
  }) => {
    const response = await api.post('/cart', cartItem);
    return response.data;
  },

  remove: async (cartItem: {
    product_id: number;
    type: string;
  }) => {
    const response = await api.post('/cart/remove', cartItem);
    return response.data;
  },

  getCount: async () => {
    const response = await api.get('/cart/count');
    return response.data;
  },
};

// Wishlist API functions
export const wishlistAPI = {
  get: async () => {
    const response = await api.get('/wishlist/wishlist');
    return response.data;
  },

  add: async (productId: string) => {
    const response = await api.post(`/wishlist/wishlist/${productId}`);
    return response.data;
  },

  remove: async (productId: string) => {
    const response = await api.delete(`/wishlist/wishlist/${productId}`);
    return response.data;
  },

  getCount: async () => {
    const response = await api.get('/wishlist/count');
    return response.data;
  },
};

// Users API functions
export const usersAPI = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    search_term?: string;
    role?: string;
    kyc_status?: string;
  }) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Address management
  getAddresses: async (userId: string) => {
    const response = await api.get(`/users/${userId}/addresses`);
    return response.data;
  },

  addAddress: async (userId: string, addressData: any) => {
    const response = await api.post(`/users/${userId}/addresses`, addressData);
    return response.data;
  },

  updateAddress: async (addressId: string, addressData: any) => {
    const response = await api.put(`/users/addresses/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (userId: string, addressId: string) => {
    const response = await api.delete(`/users/${userId}/addresses/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (userId: string, addressId: string) => {
    const response = await api.patch(`/users/${userId}/addresses/${addressId}/set_default`);
    return response.data;
  },
};

// Coupons API functions
export const couponsAPI = {
  getAll: async () => {
    const response = await api.get('/coupon');
    return response.data;
  },

  create: async (couponData: {
    code: string;
    discount_type: string;
    discount_value: number;
    min_cart_value: number;
  }) => {
    const response = await api.post('/coupon', couponData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/coupon/${id}`);
    return response.data;
  },

  activate: async (id: string) => {
    const response = await api.patch(`/coupon/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await api.patch(`/coupon/${id}/deactivate`);
    return response.data;
  },

  validate: async (code: string, total: number) => {
    const response = await api.get(`/coupon/${code}`, {
      params: { total }
    });
    return response.data;
  },
};

// Dashboard API functions
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },
};

// Contact API functions
export const contactAPI = {
  submit: async (contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/contact');
    return response.data;
  },
};

export default api; 