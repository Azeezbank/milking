"use client";

import { NavBar } from "../navbar/page";
import { Sidebar } from "../sidebar/page";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import Footer from "../footer/footer";
import axios from "axios";
import { useRouter } from "next/navigation";


export const Layout = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('https://milkingapi.onrender.com/api/v1/protected', { withCredentials: true });
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
            <NavBar isMenu={isMenu} setIsMenu={setIsMenu} />
            <div className="absolute top-0">
                <Sidebar isMenu={isMenu} setIsMenu={setIsMenu} />
            </div>

            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;