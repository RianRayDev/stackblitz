import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
          if (get().users.length === 0) {
            set({ users: initialUsers });
          }
        } catch (error) {
          console.error('Error loading initial data:', error);
          set({ users: initialUsers });
        }
      },

      addUser: (user) => {
        set((state) => ({
          users: [...state.users, user]
        }));
      },

      updateUser: (username, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.username === username ? { ...user, ...updates } : user
          )
        }));
      },

      deleteUser: (username) => {
        set((state) => ({
          users: state.users.filter((user) => user.username !== username)
        }));
      },

      toggleUserStatus: (username) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.username === username
              ? {
                  ...user,
                  isActive: !user.isActive,
                  activationStatus: user.isActive ? 'inactive' : 'active'
                }
              : user
          )
        }));
      },

      updateUserActivity: (username, isOnline) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.username === username
              ? {
                  ...user,
                  isOnline,
                  lastActive: new Date().toISOString()
                }
              : user
          )
        }));
      },

      activateUser: (username) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.username === username
              ? {
                  ...user,
                  activationStatus: 'active',
                  isActive: true
                }
              : user
          )
        }));
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