import React from 'react';
import { Header } from '../shared/navigation/Header';
import { Footer } from '../shared/navigation/Footer';

interface GuestLayoutProps {
  children: React.ReactNode;
}

/**
 * GuestLayout - Reusable layout wrapper for guest-facing pages
 * Eliminates duplication of Header/Footer wrapper in route definitions
 */
export const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
