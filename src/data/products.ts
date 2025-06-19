import { Product } from '../types';
import axios from 'axios';
import { BASE_URL } from '@/routes';

// export const products: Product[] = [
//   {
//     id: '1',
//     name: 'Dell XPS 13',
//     description: 'Ultra-thin and light laptop with stunning InfinityEdge display',
//     price: 89999,
//     rentalPrice: 4999,
//     type: 'sale',
//     image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'Dell',
//     specs: {
//       processor: 'Intel Core i7-1185G7',
//       memory: '16GB LPDDR4x',
//       storage: '512GB SSD',
//       display: '13.4" FHD+ (1920 x 1200)',
//       graphics: 'Intel Iris Xe Graphics',
//     },
//     available: true,
//     featured: true,
//   },
//   {
//     id: '2',
//     name: 'MacBook Pro 14"',
//     description: 'Powerful laptop with M1 Pro chip for professional use',
//     price: 179999,
//     rentalPrice: 8999,
//     type: 'sale',
//     image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'Apple',
//     specs: {
//       processor: 'Apple M1 Pro',
//       memory: '16GB Unified Memory',
//       storage: '512GB SSD',
//       display: '14" Liquid Retina XDR (3024 x 1964)',
//       graphics: '16-core GPU',
//     },
//     available: true,
//     featured: true,
//   },
//   {
//     id: '3',
//     name: 'Lenovo ThinkPad X1 Carbon',
//     description: 'Business laptop with robust security features',
//     price: 124999,
//     rentalPrice: 5999,
//     type: 'rent',
//     image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'Lenovo',
//     specs: {
//       processor: 'Intel Core i7-1165G7',
//       memory: '16GB LPDDR4x',
//       storage: '1TB SSD',
//       display: '14" FHD+ (1920 x 1200)',
//       graphics: 'Intel Iris Xe Graphics',
//     },
//     available: true,
//     featured: true,
//   },
//   {
//     id: '4',
//     name: 'HP Spectre x360',
//     description: 'Convertible 2-in-1 laptop with pen support',
//     price: 134999,
//     rentalPrice: 6499,
//     type: 'rent',
//     image: 'https://images.unsplash.com/photo-1544099858-75feeb57f01b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'HP',
//     specs: {
//       processor: 'Intel Core i7-1165G7',
//       memory: '16GB DDR4',
//       storage: '1TB SSD',
//       display: '13.3" 4K OLED',
//       graphics: 'Intel Iris Xe Graphics',
//     },
//     available: true,
//     featured: false,
//   },
//   {
//     id: '5',
//     name: 'ASUS ROG Zephyrus G14',
//     description: 'Powerful gaming laptop with AMD Ryzen processor',
//     price: 139999,
//     rentalPrice: 7999,
//     type: 'sale',
//     image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'ASUS',
//     specs: {
//       processor: 'AMD Ryzen 9 5900HS',
//       memory: '16GB DDR4',
//       storage: '1TB SSD',
//       display: '14" QHD 120Hz',
//       graphics: 'NVIDIA GeForce RTX 3060',
//     },
//     available: true,
//     featured: false,
//   },
//   {
//     id: '6',
//     name: 'Microsoft Surface Laptop 4',
//     description: 'Sleek and stylish laptop with great battery life',
//     price: 94999,
//     rentalPrice: 4499,
//     type: 'rent',
//     image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'Microsoft',
//     specs: {
//       processor: 'AMD Ryzen 5 4680U',
//       memory: '8GB LPDDR4x',
//       storage: '256GB SSD',
//       display: '13.5" PixelSense (2256 x 1504)',
//       graphics: 'AMD Radeon Graphics',
//     },
//     available: true,
//     featured: false,
//   },
//   {
//     id: '7',
//     name: 'Acer Swift 5',
//     description: 'Ultra-lightweight laptop with touchscreen display',
//     price: 79999,
//     rentalPrice: 3999,
//     type: 'sale',
//     image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'Acer',
//     specs: {
//       processor: 'Intel Core i7-1165G7',
//       memory: '16GB LPDDR4x',
//       storage: '512GB SSD',
//       display: '14" FHD IPS',
//       graphics: 'Intel Iris Xe Graphics',
//     },
//     available: true,
//     featured: false,
//   },
//   {
//     id: '8',
//     name: 'Razer Blade 15',
//     description: 'Premium gaming laptop with high refresh rate display',
//     price: 169999,
//     rentalPrice: 9999,
//     type: 'rent',
//     image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
//     brand: 'Razer',
//     specs: {
//       processor: 'Intel Core i7-10750H',
//       memory: '16GB DDR4',
//       storage: '1TB SSD',
//       display: '15.6" FHD 144Hz',
//       graphics: 'NVIDIA GeForce RTX 3070',
//     },
//     available: true,
//     featured: false,
//   },
// ];


// products.ts


export const products = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(`${BASE_URL}/products`);
  //console.log("Raw fetched data:", res.data);
  //console.log("Is array:", Array.isArray(res.data)); 
  return res.data;
};
