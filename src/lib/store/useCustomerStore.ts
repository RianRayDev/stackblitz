import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Purchase } from './types';

interface CustomerState {
  purchases: Purchase[];
  isLoading: boolean;
  error: string | null;
  loadPurchases: (userId: string) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      purchases: [],
      isLoading: false,
      error: null,

      loadPurchases: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const purchasesQuery = query(
            collection(db, 'purchases'),
            where('userId', '==', userId),
            orderBy('purchaseDate', 'desc')
          );

          const snapshot = await getDocs(purchasesQuery);
          const purchases = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Purchase[];

          set({ purchases, isLoading: false });
        } catch (error: any) {
          console.error('Error loading purchases:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      addPurchase: async (purchase) => {
        try {
          await addDoc(collection(db, 'purchases'), {
            ...purchase,
            purchaseDate: serverTimestamp()
          });

          // Reload purchases after adding new one
          await set.getState().loadPurchases(purchase.userId);
        } catch (error: any) {
          console.error('Error adding purchase:', error);
          set({ error: error.message });
          throw error;
        }
      }
    }),
    {
      name: 'customer-store'
    }
  )
);