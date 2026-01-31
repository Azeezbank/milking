"use client";
import { Grip } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import api from "@/app/components/services/api";


interface AdminNavProps {
  isMenu: boolean;
  setIsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminNavBar = ({ isMenu, setIsMenu }: AdminNavProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/v1/users/my/info");
        const user = res.data.user;

        if (user.role === "Team Leader" || user.superRole === "Admin") {
          setName(user.name);
          setRole(user.role);
        } else {
          // Optional: handle unauthorized role if needed
        }
      } catch (err: any) {
        console.error("Failed to fetch user info:", err);
        // Optional: redirect or show message
      }
    };

    checkAuth();
  }, []);

  const shortName = name.split(" ").slice(0, 2).join(" ");
  return (
    <header className="bg-gray-50 shadow-sm">
      <nav className="flex justify-between items-center px-5 py-3">
        {/* Logo & Portal Title */}
        <div className="flex gap-3 items-center">
          <div className="w-15 h-10 p-1 flex justify-center items-center">
          <img
            src="https://cdn.thenationonlineng.net/wp-content/uploads/2023/07/25040548/CWAY.png"
            alt="logo"
          />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-sky-500 font-bold">CWAY ADNIN PORTAL</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className="bg-red-500 w-2 h-2 rounded-full"></span>
              <span className="text-red-500">MILKING TEAM</span>
              <span className="bg-red-500 w-2 h-2 rounded-full"></span>
            </p>
          </div>
        </div>

        {/* Menu Toggle & Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenu(!isMenu)}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <Grip size={28} className="text-sky-500" />
          </button>

          {/* Admin Profile */}
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-700">{shortName}</span>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
      </nav>

      <span className="flex bg-red-500 w-full h-0.5"></span>
      <h3 className="bg-sky-500 text-white text-center text-lg py-2">
        Operation Management Portal
      </h3>
    </header>
  );
};
