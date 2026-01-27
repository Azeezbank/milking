"use client";

import { AdminNavBar } from "../adminBar/navbar/navbar";
import { AdminSidebar } from "../adminBar/sidebar/sidebar";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import Footer from "../footer/footer";
import { useRouter } from "next/navigation";
import api from "@/app/components/services/api";


export const Layout = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/api/v1/protected");
            } catch (err: any) {
                router.push("/"); // redirect if not authenticated
            }
        };

        checkAuth();
    }, []);

    // Check admin protected route
    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                await api.get("/api/v1/admin/protected");
            } catch (err: any) {
                router.push("/"); // redirect if not authenticated
            }
        };

        checkAdminAuth();
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