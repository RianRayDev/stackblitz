import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from '@/lib/store';
import type { User } from '@/lib/store';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

const verifyCredentials = (identifier: string, password: string) => {
  const userStore = useUserStore.getState();
  const user = userStore.users.find(u => 
    (u.email === identifier || u.username === identifier) && 
    u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Your account has been deactivated. Please contact the administrator.');
  }

  if (user.activationStatus === 'pending') {
    userStore.activateUser(user.username);
  }

  userStore.updateUserActivity(user.username, true);
  userStore.setCurrentUser(user);
  
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (identifier: string, password: string, rememberMe = false) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const user = verifyCredentials(identifier, password);
          set({ user, isAuthenticated: true });
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        const userStore = useUserStore.getState();
        const currentUser = userStore.users.find(u => u.email === useAuth.getState().user?.email);
        if (currentUser) {
          userStore.updateUserActivity(currentUser.username, false);
          userStore.setCurrentUser(null);
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        ...(state.isAuthenticated ? { user: state.user, isAuthenticated: true } : {}),
      }),
    }
  )
);