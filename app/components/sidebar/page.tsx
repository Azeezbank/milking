"use client";
import { Pointer, X, Activity, CalendarCheck, ClipboardList, BarChart2, Bell, Clock, FileText, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import backendUrl from "@/app/config";
import axios from "axios";

interface Menu {
  isMenu: boolean;
  setIsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isMenu, setIsMenu }: Menu) => {
  const [isPermisible, setIsPermisible] = useState(false);

   // Fetch user info
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const res = await axios.get(`${backendUrl}/api/v1/admin/users/my/info`, { withCredentials: true });
          const user = res.data.user;
          if (user.role === "Team Leader" || user.role === "Deputy Team Leader" || user.role === "Operation Officer") {
            setIsPermisible(true)
          }
        } catch (err) {
          setIsPermisible(false)
        }
      };
      fetchUserInfo();
    }, []);

  return (
    <div
      className={`px-5 w-60 fixed z-5 left-0 top-0 bg-gray-50 h-screen overflow-y-auto transition-transform duration-700 ease-in-out shadow-lg ${
        isMenu ? "translate-x-0" : "-translate-x-60"
      }`}
    >
      <div>
        {/* Header */}
        <div className="py-6 flex justify-between items-center relative">
          <div className="flex gap-2 items-center">
            <Activity size={25} className="text-sky-500" />
            <h3 className="font-bold text-lg text-sky-500">Actions</h3>
          </div>
          <X
            size={20}
            className="text-sky-500 cursor-pointer absolute top-5 right-5 hover:text-red-500 transition"
            onClick={() => setIsMenu(false)}
          />
        </div>

        {/* Links */}
        <SidebarLink href="/dashboard" icon={<Pointer size={15} className="rotate-90" />} label="My Dashboard" />
        <SidebarLink href="/attendance" icon={<CalendarCheck size={15} />} label="My Attendance" />
        <div className={`${isPermisible ? 'block' : 'hidden'}`}><SidebarLink href="/milkrecord/manage" icon={<ClipboardList size={15} />} label="Manage Milk Records" /> </div>
        <SidebarLink href="/milkrecord/view" icon={<Activity size={15} />} label="View Milk Records" />
        <SidebarLink href="#" icon={<Clock size={15} />} label="My Overtime" />
        <SidebarLink href="#" icon={<BarChart2 size={15} />} label="Reports & Analytics" />
        <SidebarLink href="#" icon={<FileText size={15} className="rotate-90" />} label="Milk Records" />
        <SidebarLink href="/daysoff" icon={<CalendarClock size={15} className="rotate-90" />} label="My Off Schedule" />
        <SidebarLink href="#" icon={<Bell size={15} />} label="Notifications" />
      </div>
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <Link href={href}>
      <div className="border-b border-b-gray-300 py-3 px-2 flex gap-2 items-center cursor-pointer hover:bg-sky-100 hover:text-sky-600 rounded transition">
        {icon}
        <p className="font-semibold text-sm">{label}</p>
      </div>
    </Link>
  );
};

export default Sidebar;