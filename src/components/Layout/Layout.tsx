import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep text-foreground font-body">
      <div className="noise-overlay" />
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-500/5 dark:bg-primary-400/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <Header />
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
};
