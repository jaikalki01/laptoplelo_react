export const BASE_URL = "http://127.0.0.1:8000";
// Or use import.meta.env.VITE_API_URL for env-based config

const apiRoutes = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    signup: `${BASE_URL}/users/signup`, // ✅ Signup endpoint
    logout: `${BASE_URL}/auth/logout`,
    password: `${BASE_URL}/users/change-password`,
  },

  users: {
    getAll: `${BASE_URL}/users`,
    getById: (id: string) => `${BASE_URL}/users/${id}`,
    update: (id: string) => `${BASE_URL}/users/${id}`,
    delete: (id: string) => `${BASE_URL}/users/${id}`,
  },
  products: {
    getAll: `${BASE_URL}/products`,
    getById: (id: string) => `${BASE_URL}/products/${id}`,
    create: `${BASE_URL}/products`,
    update: (id: string) => `${BASE_URL}/products/${id}`,
    delete: (id: string) => `${BASE_URL}/products/${id}`,
  },
  rentals: {
    getAll: `${BASE_URL}/rentals`,
    getById: (id: string) => `${BASE_URL}/rentals/${id}`,
    create: `${BASE_URL}/rentals`,
    update: (id: string) => `${BASE_URL}/rentals/${id}`,
    delete: (id: string) => `${BASE_URL}/rentals/${id}`,
    getByUser: (userId: string) => `${BASE_URL}/rentals/user/${userId}`,
    updateStatus: (id: string) => `${BASE_URL}/rentals/${id}/status`,
    getOverdue: `${BASE_URL}/rentals/overdue`,
    getActive: `${BASE_URL}/rentals/active`,
  },
};

export default apiRoutes;
