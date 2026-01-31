
"use client";
import { Pointer, X, Users, Calendar, FileText, Bell, Activity, User2, CalendarClock, Barcode, FileText as ReportsIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/app/components/services/api";

interface SidebarProps {
  isMenu: boolean;
  setIsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminSidebar = ({ isMenu, setIsMenu }: SidebarProps) => {
  const [isPermisible, setIsPermisible] = useState(false);
    // Fetch user info
  useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const res = await api.get("/api/v1/users/my/info");
      const user = res.data.user;

      // Check permission
      if (
        user.superRole === "Admin"
      ) {
        setIsPermisible(true);
      } else {
        setIsPermisible(false);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setIsPermisible(false); // fallback
    }
  };

  fetchUserInfo();
}, []);
  return (
    <div
      className={`px-5 z-10 w-64 bg-gray-50 h-screen overflow-y-auto transition-transform duration-700 ease-in-out fixed ${
        isMenu ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <div className="py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={25} className="text-sky-500" />
          <h3 className="font-bold text-lg text-sky-500">Admin Actions</h3>
        </div>
        <X
          size={20}
          className="text-sky-500 cursor-pointer"
          onClick={() => setIsMenu(false)}
        />
      </div>

      <nav className="flex flex-col mt-5 gap-2">
        <Link href="/admin/dashboard">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <Pointer size={15} className="rotate-90 text-sky-500" />
            <span className="font-semibold text-sm">Dashboard</span>
          </div>
        </Link>

        <Link href="/admin/users">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <Users size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Manage Users</span>
          </div>
        </Link>

        <Link href="/admin/attendance">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <Calendar size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Manage Attendance</span>
          </div>
        </Link>

        <Link href="/admin/animals/create">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <User2 size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Register Milking Animal</span>
          </div>
        </Link>
        
        <Link href="/admin/workoff">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <CalendarClock size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Manage Off Schedule</span>
          </div>
        </Link>

        {/* NEW: Manage Reports */}
        <Link href="/admin/report">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <ReportsIcon size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Manage Daily Reports</span>
          </div>
        </Link>

        <Link href="/admin/notifications">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <Bell size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Notifications</span>
          </div>
        </Link>

        <Link href="/dashboard">
          <div className="flex items-center bg-sky-500 text-white gap-2 py-3 px-2 rounded hover:bg-sky-600 cursor-pointer">
            <Barcode size={15} className="text-white" />
            <span className="font-semibold text-sm">Main Dashboard</span>
          </div>
        </Link>
        {isPermisible && (
        <Link href="/report/aigenerate">
          <div className="flex items-center text-white gap-2 py-3 px-2 rounded hover:bg-sky-600 cursor-pointer">
            <Barcode size={15} className="text-white" />
            <span className="font-semibold text-sm">Main Dashboard</span>
          </div>
        </Link>
        )}
      </nav>
    </div>
  );
};