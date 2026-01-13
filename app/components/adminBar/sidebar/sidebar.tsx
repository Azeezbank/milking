"use client";
import { Pointer, X, Users, Calendar, FileText, Bell, Activity, User2 } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isMenu: boolean;
  setIsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminSidebar = ({ isMenu, setIsMenu }: SidebarProps) => {
  return (
    <div
      className={`px-5 w-64 bg-gray-50 h-screen overflow-y-auto transition-transform duration-700 ease-in-out fixed ${
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
            <span className="font-semibold text-sm">Attendance</span>
          </div>
        </Link>

        <Link href="/admin/animals/create">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <User2 size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Register Milking animal</span>
          </div>
        </Link>

        <Link href="/admin/reports">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <FileText size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Reports & Analytics</span>
          </div>
        </Link>

        <Link href="/admin/notifications">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <Bell size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Notifications</span>
          </div>
        </Link>

        <Link href="/dashboard">
          <div className="flex items-center gap-2 py-3 px-2 rounded hover:bg-sky-100 cursor-pointer">
            <User2 size={15} className="text-sky-500" />
            <span className="font-semibold text-sm">Main Dashboard</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

