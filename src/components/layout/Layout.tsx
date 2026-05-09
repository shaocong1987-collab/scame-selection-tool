import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-industrial-gradient">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] text-[#111111]">
      <Header />
      <main className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
