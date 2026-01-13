'use client';
import React, { useState, useEffect, useRef } from 'react';
import CustomDrawer from './customDrawer';
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    
    const showDrawer = () => {
        setOpen(true);
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const baseNavLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Careers', path: '/careers' },
        { name: 'Team', path: '/team' },
        { name: 'Shop', path: '/shop' },
        { name: 'Modeling', path: '/modeling' },
    ];

    // Add Dashboard link for authenticated users with User role
    const navLinks = isAuthenticated && user?.role === 'User' 
        ? [...baseNavLinks, { name: 'Dashboard', path: '/dashboard' }]
        : baseNavLinks;

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <div className='fixed top-0 flex items-center justify-center z-50 w-full'>
                <div className='mx-auto px-4 flex justify-between items-center w-full py-5 bg-white/30 backdrop-blur-sm'>
                    <div>
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={277}
                            height={101}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <ul className='hidden lg:flex gap-6 text-lg font-medium text-primary'>
                            {navLinks.map((link) => (
                                <li
                                    key={link.path}
                                    className='relative cursor-pointer group'
                                    onClick={() => router.push(link.path)}
                                >
                                    {link.name}
                                    {/* Active underline */}
                                    <span
                                        className={`absolute left-0 bottom-0 h-px bg-primary transition-all duration-300 ${
                                            isActive(link.path) ? 'w-full' : 'w-0'
                                        }`}
                                    ></span>
                                    {/* Hover underline */}
                                    <span
                                        className={`absolute left-0 bottom-0 h-px bg-primary transition-all duration-300 ${
                                            isActive(link.path) ? 'w-0' : 'w-0 group-hover:w-full'
                                        }`}
                                    ></span>
                                </li>
                            ))}
                        </ul>

                        {/* User menu for desktop - only show for authenticated users */}
                        {isAuthenticated && user && (
                            <div className="hidden lg:flex items-center gap-2 ml-4 relative" ref={userMenuRef}>
                                <div 
                                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-primary">{user.name}</span>
                                    <svg 
                                        className={`w-4 h-4 text-primary transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Dropdown menu */}
                                {userMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                router.push('/dashboard');
                                                setUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/dashboard/profile');
                                                setUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Profile
                                        </button>
                                        <hr className="my-1" />
                                        <button
                                            onClick={() => {
                                                logout();
                                                setUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Login/Register buttons for non-authenticated users on desktop */}
                        {!isAuthenticated && (
                            <div className="hidden lg:flex items-center gap-3 ml-4">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-4 py-2 text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                >
                                    Register
                                </button>
                            </div>
                        )}

                        {/* Mobile hamburger menu */}
                        <Image
                            className='lg:hidden cursor-pointer'
                            src="/hamburger.png"
                            alt="Menu"
                            width={40}
                            height={40}
                            onClick={showDrawer}
                        />
                    </div>
                </div>
            </div>
            <CustomDrawer open={open} setOpen={setOpen} navLinks={navLinks} />
        </>
    );
};

export default Navbar;