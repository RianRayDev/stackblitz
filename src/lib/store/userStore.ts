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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from '../types';

// Initial users for development
const initialUsers: User[] = [
  {
    id: '1',
    username: 'webmaster',
    email: 'admin@snuli.com',
    password: 'admin123',
    role: 'webmaster',
    isActive: true,
    activationStatus: 'active',
    lastActive: new Date().toISOString(),
    isOnline: true,
    franchiseName: null,
    teammates: [],
    followers: [],
    following: [],
    permissions: {
      canEditProducts: true,
      canAddProducts: true,
      canDeleteProducts: true
    }
  }
];

interface UserState {
  users: User[];
  currentUser: User | null;
  isOffline: boolean;
  loadInitialData: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (username: string, updates: Partial<User>) => void;
  deleteUser: (username: string) => void;
  toggleUserStatus: (username: string) => void;
  updateUserActivity: (username: string, isOnline: boolean) => void;
  activateUser: (username: string) => void;
  setCurrentUser: (user: User | null) => void;
  setOfflineStatus: (status: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      currentUser: null,
      isOffline: false,

      loadInitialData: async () => {
        try {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as User[];
          
          if (users.length === 0) {
            // Initialize with default users if no users exist
            const initializedUsers = await Promise.all(
              initialUsers.map(async (user) => {
                const docRef = await addDoc(collection(db, 'users'), {
                  ...user,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });
                return { ...user, id: docRef.id };
              })
            );
            set({ users: initializedUsers });
          } else {
            set({ users });
          }
        } catch (error) {
          console.error('Error loading initial data:', error);
          // Fall back to initial users if Firebase fails
          if (get().users.length === 0) {
            set({ users: initialUsers });
          }
        }
      },

      addUser: async (user) => {
        try {
          const docRef = await addDoc(collection(db, 'users'), {
            ...user,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          set(state => ({
            users: [...state.users, { ...user, id: docRef.id }]
          }));
        } catch (error) {
          console.error('Error adding user:', error);
          throw error;
        }
      },

      updateUser: async (username, updates) => {
        try {
          const userQuery = query(collection(db, 'users'), where('username', '==', username));
          const userDocs = await getDocs(userQuery);
          
          if (!userDocs.empty) {
            const userDoc = userDocs.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), {
              ...updates,
              updatedAt: serverTimestamp()
            });
            
            set(state => ({
              users: state.users.map(user =>
                user.username === username ? { ...user, ...updates } : user
              )
            }));
          }
        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
      },

      deleteUser: async (username) => {
        try {
          const userQuery = query(collection(db, 'users'), where('username', '==', username));
          const userDocs = await getDocs(userQuery);
          
          if (!userDocs.empty) {
            const userDoc = userDocs.docs[0];
            await deleteDoc(doc(db, 'users', userDoc.id));
            
            set(state => ({
              users: state.users.filter(user => user.username !== username)
            }));
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      toggleUserStatus: async (username) => {
        const user = get().users.find(u => u.username === username);
        if (user) {
          try {
            const newStatus = !user.isActive;
            await updateDoc(doc(db, 'users', user.id), {
              isActive: newStatus,
              activationStatus: newStatus ? 'active' : 'inactive',
              updatedAt: serverTimestamp()
            });
            
            set(state => ({
              users: state.users.map(u => 
                u.username === username 
                  ? { ...u, isActive: newStatus, activationStatus: newStatus ? 'active' : 'inactive' }
                  : u
              )
            }));
          } catch (error) {
            console.error('Error toggling user status:', error);
            throw error;
          }
        }
      },

      updateUserActivity: async (username, isOnline) => {
        try {
          const userQuery = query(collection(db, 'users'), where('username', '==', username));
          const userDocs = await getDocs(userQuery);
          
          if (!userDocs.empty) {
            const userDoc = userDocs.docs[0];
            const lastActive = new Date().toISOString();
            
            await updateDoc(doc(db, 'users', userDoc.id), {
              isOnline,
              lastActive,
              updatedAt: serverTimestamp()
            });
            
            set(state => ({
              users: state.users.map(user =>
                user.username === username
                  ? { ...user, isOnline, lastActive }
                  : user
              )
            }));
          }
        } catch (error) {
          console.error('Error updating user activity:', error);
          throw error;
        }
      },

      activateUser: async (username) => {
        try {
          const userQuery = query(collection(db, 'users'), where('username', '==', username));
          const userDocs = await getDocs(userQuery);
          
          if (!userDocs.empty) {
            const userDoc = userDocs.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), {
              activationStatus: 'active',
              isActive: true,
              updatedAt: serverTimestamp()
            });
            
            set(state => ({
              users: state.users.map(user =>
                user.username === username
                  ? { ...user, activationStatus: 'active', isActive: true }
                  : user
              )
            }));
          }
        } catch (error) {
          console.error('Error activating user:', error);
          throw error;
        }
      },

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      setOfflineStatus: (status) => {
        set({ isOffline: status });
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser
      })
    }
  )
);