import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  serverTimestamp,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Purchase } from '../types';

interface CustomerState {
  purchases: Purchase[];
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  loadPurchases: (userId: string) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => Promise<void>;
  setOfflineMode: (offline: boolean) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      purchases: [],
      isLoading: false,
      error: null,
      isOffline: false,

      setOfflineMode: async (offline: boolean) => {
        try {
          if (offline) {
            await disableNetwork(db);
          } else {
            await enableNetwork(db);
          }
          set({ isOffline: offline });
        } catch (error: any) {
          console.error('Error setting offline mode:', error);
          set({ error: error.message });
        }
      },

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

          set({ purchases, isLoading: false, error: null });
        } catch (error: any) {
          console.error('Error loading purchases:', error);
          
          // Handle specific Firebase errors
          if (error.code === 'failed-precondition') {
            // Try to load in offline mode
            await get().setOfflineMode(true);
            return get().loadPurchases(userId);
          }
          
          set({ 
            error: 'Failed to load purchases. Please try again later.', 
            isLoading: false,
            purchases: [] // Reset purchases on error
          });
        }
      },

      addPurchase: async (purchase) => {
        try {
          const docRef = await addDoc(collection(db, 'purchases'), {
            ...purchase,
            purchaseDate: serverTimestamp()
          });

          // Add the new purchase to the local state immediately
          set(state => ({
            purchases: [{
              id: docRef.id,
              ...purchase,
              purchaseDate: new Date()
            }, ...state.purchases],
            error: null
          }));

        } catch (error: any) {
          console.error('Error adding purchase:', error);
          set({ error: 'Failed to add purchase. Please try again.' });
          throw error;
        }
      }
    }),
    {
      name: 'customer-store',
      partialize: (state) => ({
        purchases: state.purchases,
      }),
    }
  )
);