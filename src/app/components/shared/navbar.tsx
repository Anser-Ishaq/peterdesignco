'use client';
import React, { useState } from 'react';
import CustomDrawer from './customDrawer';
import Image from "next/image";

const Navbar = () => {
      const [open, setOpen] = useState(false);
      const showDrawer = () => {
    setOpen(true);
  };
    return (
        <>
            <div className='absolute flex items-center justify-center z-10 w-full'>
                <div className=' mx-auto px-4 flex justify-between items-center w-full py-5 bg-white/30 backdrop-blur-md'>
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
                            <li className='cursor-pointer'>Home</li>
                            <li className='cursor-pointer'>About</li>
                            <li className='cursor-pointer'>Contact</li>
                            <li className='cursor-pointer'>Careers</li>
                            <li className='cursor-pointer'>Team</li>
                            <li className='cursor-pointer'>Shop</li>
                            <li className='cursor-pointer'>Mdeling</li>
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