import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Outlet, useLocation } from 'react-router-dom';

export function DashboardLayout() {
  const location = useLocation();
  const isStorePage = location.pathname.includes('/store') && !location.pathname.includes('/dashboard');
  const isSocialRoute = location.pathname.includes('/dashboard/social');

  // Don't render dashboard layout for store pages
  if (isStorePage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 container mx-auto px-4 sm:px-6 lg:px-8 ${isSocialRoute ? 'py-8 pb-24' : 'py-8'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}