import { create } from 'zustand';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface FranchiseStats {
  totalFranchises: number;
  activeFranchises: number;
  onlineFranchises: number;
  pendingFranchises: number;
}

interface FranchiseStatsState {
  stats: FranchiseStats;
  lastRefresh: string | null;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const initialStats: FranchiseStats = {
  totalFranchises: 0,
  activeFranchises: 0,
  onlineFranchises: 0,
  pendingFranchises: 0,
};

export const useFranchiseStats = create<FranchiseStatsState>((set) => ({
  stats: initialStats,
  lastRefresh: null,
  isLoading: false,
  error: null,

  refreshStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const franchisesQuery = query(
        collection(db, 'users'),
        where('role', '==', 'distributing_franchise')
      );

      const snapshot = await getDocs(franchisesQuery);
      const franchises = snapshot.docs.map(doc => doc.data());

      const stats: FranchiseStats = {
        totalFranchises: franchises.length,
        activeFranchises: franchises.filter(f => f.isActive).length,
        onlineFranchises: franchises.filter(f => f.isOnline).length,
        pendingFranchises: franchises.filter(f => f.activationStatus === 'pending').length,
      };

      set({
        stats,
        lastRefresh: new Date().toISOString(),
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Error fetching franchise stats:', error);
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
}));