"use client";
import { Grip } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import backendUrl from "@/app/config";

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
                      const res = await axios.get(`${backendUrl}/api/v1/admin/users/my/info`, { withCredentials: true });
                      if (res.data.user.role === "Team Leader" || res.data.user.superRole === "Admin") {
                          setName(res.data.user.name);
                          setRole(res.data.user.role);
                      } else {
                      }
                  } catch (err: any) {
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
          <img
            src="https://www.sparkgist.com/wp-content/uploads/2022/05/CWAY-Group.jpeg"
            alt="logo"
            className="border border-red-900 rounded-full w-12 h-12"
          />
          <div className="flex flex-col">
            <h2 className="text-sky-500 font-bold">CWAY Admin Portal</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className="bg-red-500 w-2 h-2 rounded-full"></span>
              MILKING TEAM
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
