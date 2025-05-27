import { User } from '../types';
import axios from 'axios';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@laptoplelo.in',
    role: 'admin',
    kycVerified: true,
    addresses: [
      {
        id: '1',
        street: '123 Admin Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        isDefault: true,
      },
      {
        id: '2',
        street: '456 Office Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: false,
      }
    ],
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    kycVerified: true,
    addresses: [
      {
        id: '3',
        street: '789 User Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        isDefault: true,
      }
    ],
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    kycVerified: false,
    addresses: [
      {
        id: '4',
        street: '321 Home Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        isDefault: true,
      }
    ],
  },
];

// export const BASE_URL = 'http://localhost:8001'; // FastAPI base URL


// export const users = async (): Promise<User[]> => {
//   const res = await axios.get<User[]>(`${BASE_URL}/users/login`);
//   //console.log("Raw fetched data:", res.data);
//   //console.log("Is array:", Array.isArray(res.data)); 
//   return res.data;
// };