// import { Pointer, X, Activity } from "lucide-react";
// import Link from "next/link";

// interface Menu {
//     isMenu: boolean;
//     setIsMenu: React.Dispatch<React.SetStateAction<boolean>>;
// }
// export const Sidebar = ({ isMenu, setIsMenu }: Menu) => {
//     return (
//         <div className={`px-5 w-60 bg-gray-50 h-screen overflow-y-auto transition-transform duration-700 ease-in-out  ${isMenu ? 'translate-x-0' : '-translate-x-60'}`}>
//             <div>
//                 <div className="py-6 flex justify-between">
//                     <div className="flex gap-2">
//                     <Activity size={25} className="text-sky-500"/>
//                 <h3 className="font-bold text-lg text-sky-500">Actions</h3>
//                 </div>
//                 <X size={20}  className="text-sky-500 absolute top-5 right-5 cursor-pointer" onClick={() => setIsMenu(false)}/>
//                 </div>
//                 <Link href={'/dashboard'}>
//                 <div className="border-b border-b-gray-300 pb-4 hover:text-sky-500">
//                     <div className="px-2 flex gap-2 items-center ">
//                     <Pointer size={15} className="rotate-90" />
//                     <p className="font-bold text-sm">My Dashboard</p>
//                     </div>
//                 </div>
//                 </Link>
//                 <Link href={'/attendance'}>
//                 <div className="border-b border-b-gray-300 py-4 hover:text-sky-500">
//                     <div className="px-2 flex gap-2 items-center ">
//                     <Pointer size={15} className="rotate-90" />
//                     <p className="font-bold text-sm">My Attendance</p>
//                     </div>
//                 </div>
//                 </Link>
//                 <div className="border-b border-b-gray-300 py-4">
//                     <div className="px-2 flex gap-2 items-center ">
//                     <Pointer size={15} className="rotate-9]0" />
//                     <p className="font-bold text-sm">My Overtime</p>
//                     </div>
//                 </div>
//                 <div className="border-b border-b-gray-300 py-4">
//                     <div className="px-2 flex gap-2 items-center ">
//                     <Pointer size={15} className="rotate-90" />
//                     <p className="font-bold text-sm">Milk Records</p>
//                     </div>
//                 </div>
//                 <div className="border-b border-b-gray-300 py-4">
//                     <div className="px-2 flex gap-2 items-center ">
//                     <Pointer size={15} className="rotate-90" />
//                     <p className="font-bold text-sm">Reports & Analytics</p>
//                     </div>
//                 </div>
//                 <div className="border-b border-b-gray-300 py-4">
//                     <div className="px-2 flex gap-2 items-center ">
//                     <Pointer size={15} className="rotate-90" />
//                     <p className="font-bold text-sm">My Off schedule</p>
//                     </div>
//                 </div>
//                  <div className="py-4">
//                     <div className="px-2 flex gap-2 items-center ">
//                     <Pointer size={15} className="rotate-90" />
//                     <p className="font-bold text-sm">Notifications</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import { Pointer, X, Activity, CalendarDays, Clock2, BarChart2, Bell } from "lucide-react";
import Link from "next/link";

interface Menu {
  isMenu: boolean;
  setIsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isMenu, setIsMenu }: Menu) => {
  return (
    <div
      className={`px-5 w-60 bg-gray-50 h-screen overflow-y-auto transition-transform duration-700 ease-in-out shadow-lg ${
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
        <SidebarLink href="/attendance" icon={<CalendarDays size={15} />} label="My Attendance" />
        <SidebarLink href="#" icon={<Clock2 size={15} />} label="My Overtime" />
        <SidebarLink href="#" icon={<BarChart2 size={15} />} label="Reports & Analytics" />
        <SidebarLink href="#" icon={<Pointer size={15} className="rotate-90" />} label="Milk Records" />
        <SidebarLink href="#" icon={<Pointer size={15} className="rotate-90" />} label="My Off Schedule" />
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