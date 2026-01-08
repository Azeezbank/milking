"use client";

import { AdminNavBar } from "../adminBar/navbar/navbar";
import { AdminSidebar } from "../adminBar/sidebar/sidebar";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import Footer from "../footer/footer";
import { useRouter } from "next/navigation";
import axios from "axios";


export const Layout = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/protected', { withCredentials: true });
                if (res.status === 200) {
                    console.log('Authenticated');
                }
            } catch (err: any) {
                router.push('/');
            }
        };

        checkAuth();
    }, []);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/admin/protected', { withCredentials: true });
                if (res.status === 200) {
                    console.log('Authenticated');
                }
            } catch (err: any) {
                router.push('/');
            }
        };

        checkAuth();
    }, []);

    const [isMenu, setIsMenu] = useState(false);
    return (
        <div>
            {/* Navbar */}
            <AdminNavBar isMenu={isMenu} setIsMenu={setIsMenu} />
            <div className="absolute top-0">
                <AdminSidebar isMenu={isMenu} setIsMenu={setIsMenu} />
            </div>

            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;