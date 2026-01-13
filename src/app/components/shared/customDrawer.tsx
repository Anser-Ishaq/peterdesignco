'use client';
import React, { useState } from 'react';
import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

type NavLink = {
    name: string;
    path: string;
};

type CustomDrawerProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    navLinks: NavLink[];
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({ open, setOpen, navLinks }: CustomDrawerProps) => {
    const [placement, setPlacement] = useState<DrawerProps['placement']>('left');
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    const onClose = () => {
        setOpen(false);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setOpen(false); // Close drawer after navigation
    };

    const handleLogout = () => {
        logout();
        setOpen(false);
    };

    return (
        <>
            <Drawer
                placement={placement}
                closable={{ placement: 'end' }}
                onClose={onClose}
                open={open}
                key={placement}
            >
                <div className="flex flex-col h-full">
                    {/* User info section for authenticated users */}
                    {isAuthenticated && user && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Welcome back,</p>
                            <p className="font-semibold text-primary">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role} Account</p>
                        </div>
                    )}

                    {/* Navigation links */}
                    <ul className='flex flex-col gap-6 text-lg font-medium text-primary flex-1'>
                        {navLinks.map((link) => (
                            <li 
                                key={link.path}
                                className='cursor-pointer hover:text-primary/80 transition-colors py-2 border-b border-gray-100 last:border-b-0'
                                onClick={() => handleNavigation(link.path)}
                            >
                                {link.name}
                            </li>
                        ))}
                    </ul>

                    {/* Authentication section */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-red-600 hover:text-red-800 transition-colors py-2 font-medium"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="w-full text-left text-primary hover:text-primary/80 transition-colors py-2 font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavigation('/register')}
                                    className="w-full text-left text-gray-600 hover:text-gray-800 transition-colors py-2"
                                >
                                    Register
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default CustomDrawer;