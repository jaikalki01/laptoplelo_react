import { Transaction } from '../types';
import { products } from './products';

export const transactions: Transaction[] = [
  {
    id: '1',
    userId: '2',
    products: [
      {
        product: products[0],
        quantity: 1,
      }
    ],
    total: 89999,
    status: 'completed',
    date: '2024-04-15',
    type: 'sale',
  },
  {
    id: '2',
    userId: '2',
    products: [
      {
        product: products[2],
        quantity: 1,
      }
    ],
    total: 5999,
    status: 'completed',
    date: '2024-04-14',
    type: 'rent',
    rentDuration: 30,
  },
  {
    id: '3',
    userId: '3',
    products: [
      {
        product: products[1],
        quantity: 1,
      }
    ],
    total: 179999,
    status: 'pending',
    date: '2024-04-16',
    type: 'sale',
  },
  {
    id: '4',
    userId: '3',
    products: [
      {
        product: products[3],
        quantity: 1,
      }
    ],
    total: 6499,
    status: 'completed',
    date: '2024-04-13',
    type: 'rent',
    rentDuration: 60,
  },
];
