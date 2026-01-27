"use client";

import { NavBar } from "../navbar/page";
import { Sidebar } from "../sidebar/page";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import Footer from "../footer/footer";
import { useRouter } from "next/navigation";
import api from "@/app/components/services/api";


export const Layout = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

 useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/"); // redirect if no token
        return;
      }

      try {
        const res = await api.get("/api/v1/protected"); // token sent automatically
        if (res.status === 200) {
          console.log("Authenticated");
        }
      } catch (err: any) {
        console.log("Not authenticated", err);
        // Remove invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/"); // redirect to login
      }
    };

    checkAuth();
  }, [router]);

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