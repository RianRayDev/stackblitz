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
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from './types';

interface UserState {
  users: User[];
  currentUser: User | null;
  isOffline: boolean;
  loadInitialData: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (username: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (username: string) => Promise<void>;
  toggleUserStatus: (username: string) => Promise<void>;
  updateUserActivity: (username: string, isOnline: boolean) => Promise<void>;
  activateUser: (username: string) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  setOfflineStatus: (status: boolean) => Promise<void>;
  canManageProducts: (userId: string) => boolean;
  isFollowing: (userId: string, targetId: string) => boolean;
  isTeammate: (userId: string, targetId: string) => boolean;
  followUser: (userId: string, targetId: string) => void;
  unfollowUser: (userId: string, targetId: string) => void;
  teamUpUser: (userId: string, targetId: string) => void;
  unteamUser: (userId: string, targetId: string) => void;
}

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
  },
  {
    id: '2',
    username: 'franchise_main',
    email: 'franchise@snuli.com',
    password: 'franchise123',
    role: 'distributing_franchise',
    isActive: true,
    activationStatus: 'active',
    lastActive: new Date().toISOString(),
    franchiseName: 'Main Franchise',
    teammates: [],
    followers: [],
    following: [],
    permissions: {
      canEditProducts: false,
      canAddProducts: false,
      canDeleteProducts: false
    }
  },
  {
    id: '3',
    username: 'customer',
    email: 'customer@snuli.com',
    password: 'customer123',
    role: 'customer',
    isActive: true,
    activationStatus: 'active',
    lastActive: new Date().toISOString(),
    isOnline: false,
    teammates: [],
    followers: [],
    following: [],
    permissions: {
      canEditProducts: false,
      canAddProducts: false,
      canDeleteProducts: false
    }
  }
];

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err: any) {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support persistence');
  }
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
          console.error('Error loading users:', error);
          // Fall back to initial users if Firebase fails
          if (get().users.length === 0) {
            set({ users: initialUsers });
          }
          set({ isOffline: true });
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
          await get().updateUser(username, { 
            isActive: !user.isActive,
            activationStatus: user.isActive ? 'inactive' : 'active'
          });
        }
      },

      updateUserActivity: async (username, isOnline) => {
        try {
          const userQuery = query(collection(db, 'users'), where('username', '==', username));
          const userDocs = await getDocs(userQuery);
          
          if (!userDocs.empty) {
            const userDoc = userDocs.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), {
              isOnline,
              lastActive: new Date().toISOString(),
              updatedAt: serverTimestamp()
            });
            
            set(state => ({
              users: state.users.map(user =>
                user.username === username
                  ? { ...user, isOnline, lastActive: new Date().toISOString() }
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

      setCurrentUser: (user) => set({ currentUser: user }),

      setOfflineStatus: async (status) => {
        set({ isOffline: status });
      },

      canManageProducts: (userId) => {
        const user = get().users.find(u => u.id === userId);
        if (!user) return false;
        
        return user.role === 'webmaster' || (
          user.permissions.canEditProducts ||
          user.permissions.canAddProducts ||
          user.permissions.canDeleteProducts
        );
      },

      isFollowing: (userId, targetId) => {
        const user = get().users.find(u => u.id === userId);
        return user?.following?.includes(targetId) || false;
      },

      isTeammate: (userId, targetId) => {
        const user = get().users.find(u => u.id === userId);
        return user?.teammates?.includes(targetId) || false;
      },

      followUser: (userId, targetId) => {
        set(state => ({
          users: state.users.map(user => {
            if (user.id === userId) {
              return {
                ...user,
                following: [...(user.following || []), targetId]
              };
            }
            if (user.id === targetId) {
              return {
                ...user,
                followers: [...(user.followers || []), userId]
              };
            }
            return user;
          })
        }));
      },

      unfollowUser: (userId, targetId) => {
        set(state => ({
          users: state.users.map(user => {
            if (user.id === userId) {
              return {
                ...user,
                following: user.following?.filter(id => id !== targetId) || []
              };
            }
            if (user.id === targetId) {
              return {
                ...user,
                followers: user.followers?.filter(id => id !== userId) || []
              };
            }
            return user;
          })
        }));
      },

      teamUpUser: (userId, targetId) => {
        set(state => ({
          users: state.users.map(user => {
            if (user.id === userId || user.id === targetId) {
              return {
                ...user,
                teammates: [...(user.teammates || []), user.id === userId ? targetId : userId]
              };
            }
            return user;
          })
        }));
      },

      unteamUser: (userId, targetId) => {
        set(state => ({
          users: state.users.map(user => {
            if (user.id === userId || user.id === targetId) {
              return {
                ...user,
                teammates: user.teammates?.filter(id => id !== (user.id === userId ? targetId : userId)) || []
              };
            }
            return user;
          })
        }));
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
      }),
    }
  )
);