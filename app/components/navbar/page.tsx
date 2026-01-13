"use client";
import { Grip } from "lucide-react";

interface Menu {
  isMenu: boolean;
  setIsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavBar = ({ isMenu, setIsMenu }: Menu) => {
  return (
    <header className="bg-gray-50 shadow-md left-0 top-0 w-full ">
      <nav className="px-5">
        <div className="flex justify-between items-center py-2">
          {/* Logo & Branding */}
          <div className="flex gap-3 items-center">
            <img
              src="https://www.sparkgist.com/wp-content/uploads/2022/05/CWAY-Group.jpeg"
              alt="logo"
              className="w-12 h-12 rounded-full border border-red-900"
            />
            <div className="flex flex-col leading-tight">
              <h2 className="text-sky-500 font-semibold text-base">CWAY FOOD AND BEVERAGES</h2>
              <div className="flex items-center gap-1 text-sm text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>MILKING TEAM</span>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Hamburger */}
          <div
            onClick={() => setIsMenu(!isMenu)}
            className="p-2 rounded hover:bg-gray-200 cursor-pointer transition"
          >
            <Grip size={28} className="text-sky-500" />
          </div>
        </div>

        {/* Separator */}
        <span className="block h-0.5 w-full bg-red-400 my-1"></span>

        {/* Page title */}
        <h3 className="bg-sky-500 text-white text-center text-lg py-2 rounded-md shadow-sm">
          Operation Management Portal
        </h3>
      </nav>
    </header>
  );
};

export default NavBar;