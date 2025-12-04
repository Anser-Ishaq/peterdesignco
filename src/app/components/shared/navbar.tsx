'use client';
import React, { useState } from 'react';
import CustomDrawer from './customDrawer';
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    
    const showDrawer = () => {
        setOpen(true);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Careers', path: '/careers' },
        { name: 'Team', path: '/team' },
        { name: 'Shop', path: '/shop' },
        { name: 'Modeling', path: '/modeling' },
    ];

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
                    <div>
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
                                        className={`absolute left-0 bottom-0 h-[1px] bg-primary transition-all duration-300 ${
                                            isActive(link.path) ? 'w-full' : 'w-0'
                                        }`}
                                    ></span>
                                    {/* Hover underline */}
                                    <span
                                        className={`absolute left-0 bottom-0 h-[1px] bg-primary transition-all duration-300 ${
                                            isActive(link.path) ? 'w-0' : 'w-0 group-hover:w-full'
                                        }`}
                                    ></span>
                                </li>
                            ))}
                        </ul>
                        <Image
                            className='lg:hidden cursor-pointer'
                            src="/hamburger.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            onClick={showDrawer}
                        />
                    </div>
                </div>
            </div>
            <CustomDrawer open={open} setOpen={setOpen}/>
        </>
    );
};

export default Navbar;