import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Product } from '../types';

interface StoreState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setFeaturedProduct: (id: string) => Promise<void>;
  loadProducts: (franchiseId?: string) => Promise<void>;
  initializeProductListener: (franchiseId?: string) => void;
  cleanup: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      unsubscribe: null,

      initializeProductListener: (franchiseId?: string) => {
        try {
          if (get().unsubscribe) {
            get().unsubscribe();
          }

          let productsQuery = query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc'),
            limit(50)
          );

          if (franchiseId) {
            productsQuery = query(
              collection(db, 'products'),
              where('franchiseId', '==', franchiseId),
              orderBy('createdAt', 'desc'),
              limit(50)
            );
          }

          const unsubscribe = onSnapshot(
            productsQuery,
            {
              next: (snapshot) => {
                const products = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                })) as Product[];
                set({ products, error: null });
              },
              error: (error) => {
                console.error('Error in products listener:', error);
                set({ error: error.message });
              }
            }
          );

          set({ unsubscribe });
        } catch (error: any) {
          console.error('Error initializing product listener:', error);
          set({ error: error.message });
        }
      },

      loadProducts: async (franchiseId?: string) => {
        set({ isLoading: true, error: null });
        try {
          let productsQuery = query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc'),
            limit(50)
          );

          if (franchiseId) {
            productsQuery = query(
              collection(db, 'products'),
              where('franchiseId', '==', franchiseId),
              orderBy('createdAt', 'desc'),
              limit(50)
            );
          }

          const snapshot = await getDocs(productsQuery);
          const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];

          set({ products, isLoading: false });
        } catch (error: any) {
          console.error('Error loading products:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      addProduct: async (product) => {
        try {
          const docRef = await addDoc(collection(db, 'products'), {
            ...product,
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          
          const newProduct = {
            ...product,
            id: docRef.id,
            status: 'active'
          };

          set(state => ({
            products: [newProduct, ...state.products]
          }));

          return newProduct;
        } catch (error: any) {
          console.error('Error adding product:', error);
          set({ error: error.message });
          throw error;
        }
      },

      updateProduct: async (id, updates) => {
        try {
          const productRef = doc(db, 'products', id);
          await updateDoc(productRef, {
            ...updates,
            updatedAt: serverTimestamp()
          });

          set(state => ({
            products: state.products.map(product =>
              product.id === id ? { ...product, ...updates } : product
            )
          }));
        } catch (error: any) {
          console.error('Error updating product:', error);
          set({ error: error.message });
          throw error;
        }
      },

      deleteProduct: async (id) => {
        try {
          await deleteDoc(doc(db, 'products', id));
          set(state => ({
            products: state.products.filter(product => product.id !== id)
          }));
        } catch (error: any) {
          console.error('Error deleting product:', error);
          set({ error: error.message });
          throw error;
        }
      },

      setFeaturedProduct: async (id) => {
        try {
          const batch = writeBatch(db);
          
          const productsRef = collection(db, 'products');
          const productsSnapshot = await getDocs(productsRef);
          productsSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { 
              isFeatured: false,
              updatedAt: serverTimestamp()
            });
          });

          const productRef = doc(db, 'products', id);
          batch.update(productRef, { 
            isFeatured: true,
            updatedAt: serverTimestamp()
          });

          await batch.commit();

          set(state => ({
            products: state.products.map(product => ({
              ...product,
              isFeatured: product.id === id
            }))
          }));
        } catch (error: any) {
          console.error('Error setting featured product:', error);
          set({ error: error.message });
          throw error;
        }
      },

      cleanup: () => {
        const unsubscribe = get().unsubscribe;
        if (unsubscribe) {
          unsubscribe();
          set({ unsubscribe: null });
        }
      }
    }),
    {
      name: 'store-storage',
      partialize: (state) => ({
        products: state.products,
      }),
    }
  )
);