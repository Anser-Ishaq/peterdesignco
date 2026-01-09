'use client';

import { usePathname } from 'next/navigation';
import Footer from "../components/shared/footer";
import Navbar from "../components/shared/navbar";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isModelingPage = pathname === '/modeling';

    return (
        <>
            {!isModelingPage && <Navbar />}
            {children}
            {!isModelingPage && <Footer />}
        </>
    );
}
