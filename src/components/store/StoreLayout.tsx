import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function StoreLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  // If accessed from dashboard, return just the content without store header/footer
  if (isDashboard) {
    return <Outlet />;
  }

  // For store pages, use store-specific header/footer
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}