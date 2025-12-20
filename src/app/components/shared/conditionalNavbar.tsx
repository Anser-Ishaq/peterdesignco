'use client';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const hideNavbarRoutes = ['/home','/login', '/register', '/forgot-password', '/verify-otp', '/reset-password','/modeling'];
  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    pathname.startsWith(route)
  );
  if (shouldHideNavbar) {
    return null;
  }
  return <Navbar />;
}