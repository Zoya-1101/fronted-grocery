import { create } from 'zustand';
import client from '../api/client';

export const useSubscriptionStore = create((set) => ({
  products: [],
  mySubs: [],
  fetchProducts: async () => {
    const res = await client.get('/products?isSubscribable=true');
    set({ products: res.data });
  },
  fetchMySubs: async () => {
    const res = await client.get('/subscriptions/my');
    set({ mySubs: res.data });
  }
}));