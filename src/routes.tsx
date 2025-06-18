export const BASE_URL = "http://localhost:8001"; // or use import.meta.env.VITE_API_URL if using .env


const apiRoutes = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    logout: `${BASE_URL}/auth/logout`,
   
  },
  users: {
    getAll: `${BASE_URL}/users`,
    getById: (id) => `${BASE_URL}/users/${id}`,
    update: (id) => `${BASE_URL}/users/${id}`,
    delete: (id) => `${BASE_URL}/users/${id}`,
  },
  products: {
    getAll: `${BASE_URL}/products`,
    getById: (id) => `${BASE_URL}/products/${id}`,
    create: `${BASE_URL}/products`,
    update: (id) => `${BASE_URL}/products/${id}`,
    delete: (id) => `${BASE_URL}/products/${id}`,
  },
};



export const endpoints = {
  changePassword: `${BASE_URL}/users/change-password`,
};

export default apiRoutes;
