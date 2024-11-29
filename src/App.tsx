import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useUserStore } from '@/lib/store';
import { HomePage } from '@/components/home/HomePage';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { WebmasterDashboard } from '@/components/dashboard/WebmasterDashboard';
import { StoreDashboard } from '@/components/dashboard/StoreDashboard';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { StoreManagement } from '@/components/dashboard/store/StoreManagement';
import { StoreLayout } from '@/components/store/StoreLayout';
import { StorePage } from '@/components/store/StorePage';
import { ProductPage } from '@/components/store/ProductPage';
import { SocialFeedPage } from '@/components/social/SocialFeedPage';
import { NetworkPage } from '@/components/social/NetworkPage';
import { PopularFeed } from '@/components/social/PopularFeed';
import { ProfilePage } from '@/components/social/ProfilePage';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const { loadInitialData } = useUserStore();

  useEffect(() => {
    loadInitialData().catch(console.error);
  }, [loadInitialData]);

  if (!isAuthenticated) {
    return (
      <>
        <HomePage />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Routes>
        {/* Store Routes - No DashboardLayout */}
        <Route path="/:franchiseName/store" element={<StoreLayout />}>
          <Route index element={<StorePage />} />
          <Route path="product/:productId" element={<ProductPage />} />
        </Route>

        {/* Dashboard Routes - With DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          {user?.role === 'webmaster' ? (
            <>
              <Route index element={<DashboardHome />} />
              <Route path="dashboard/users" element={<WebmasterDashboard />} />
              <Route path="dashboard/store" element={<StoreManagement />} />
              <Route path="dashboard/social" element={<SocialFeedPage />} />
              <Route path="dashboard/social/network" element={<NetworkPage />} />
              <Route path="dashboard/social/popular/now" element={<PopularFeed timeFilter="now" />} />
              <Route path="dashboard/social/popular/today" element={<PopularFeed timeFilter="today" />} />
              <Route path="dashboard/social/popular/all" element={<PopularFeed timeFilter="all" />} />
              <Route path="dashboard/social/profile" element={<ProfilePage />} />
              <Route path="dashboard/social/profile/:username" element={<ProfilePage />} />
            </>
          ) : user?.role === 'distributing_franchise' ? (
            <>
              <Route index element={<StoreDashboard />} />
              <Route path="dashboard/store" element={<StoreManagement />} />
              <Route path="dashboard/social" element={<SocialFeedPage />} />
              <Route path="dashboard/social/network" element={<NetworkPage />} />
              <Route path="dashboard/social/popular/now" element={<PopularFeed timeFilter="now" />} />
              <Route path="dashboard/social/popular/today" element={<PopularFeed timeFilter="today" />} />
              <Route path="dashboard/social/popular/all" element={<PopularFeed timeFilter="all" />} />
              <Route path="dashboard/social/profile" element={<ProfilePage />} />
              <Route path="dashboard/social/profile/:username" element={<ProfilePage />} />
            </>
          ) : user?.role === 'customer' ? (
            <>
              <Route index element={<CustomerDashboard />} />
              <Route path="dashboard/store" element={<StorePage />} />
              <Route path="dashboard/social" element={<SocialFeedPage />} />
              <Route path="dashboard/social/profile" element={<ProfilePage />} />
              <Route path="dashboard/social/profile/:username" element={<ProfilePage />} />
            </>
          ) : null}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}