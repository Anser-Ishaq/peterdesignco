'use client';
import React, { useState } from 'react';
import CustomDrawer from './customDrawer';
import Image from "next/image";
import { useRouter } from 'next/navigation';
const Navbar = () => {
    const router = useRouter();
      const [open, setOpen] = useState(false);
      const showDrawer = () => {
    setOpen(true);
  };
    return (
        <>
            <div className='absolute flex items-center justify-center z-10 w-full'>
                <div className=' mx-auto px-4 flex justify-between items-center w-full py-5 bg-white/30 backdrop-blur-sm'>
                    <div>
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={277}
                            height={101}
                        />
                    </div>
                    <div>
                        <ul className='hidden lg:flex gap-10 text-lg font-medium text-primary'>
                            <li className='cursor-pointer' onClick={() => router.push('/')}>Home</li>
                            <li className='cursor-pointer' onClick={() => router.push('/about')}>About</li>
                            <li className='cursor-pointer' onClick={() => router.push('/contact')}>Contact</li>
                            <li className='cursor-pointer' onClick={() => router.push('/careers')}>Careers</li>
                            <li className='cursor-pointer' onClick={() => router.push('/team')}>Team</li>
                            <li className='cursor-pointer' onClick={() => router.push('/shop')}>Shop</li>
                            <li className='cursor-pointer' onClick={() => router.push('/modeling')}>Mdeling</li>
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