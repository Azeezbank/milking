"use client";

import Layout from "../components/layout/page";
import { Megaphone, LoaderCircle, Milk, Users, Calendar, PlaneTakeoff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "@/app/config";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

   useEffect(() => {
          const checkAuth = async () => {
              try {
                  const res = await axios.get(`${backendUrl}/api/v1/admin/users/my/info`, { withCredentials: true });
                  if (res.data.user.role === "Team Leader" || res.data.user.superRole === "Admin") {
                      setIsAdmin(true);
                      setName(res.data.user.name);
                      setTotalUsers(res.data.totalUser);
                  } else {
                      setIsAdmin(false);
                  }
              } catch (err: any) {
                  setIsAdmin(false);
              }
          };
  
          checkAuth();
      }, []);

      const shortName = name.split(" ").slice(0, 2).join(" ");

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">

        {/* Top Bar */}
        <div className="flex justify-between items-start md:items-center">
          <div>
            <span className="inline-block bg-linear-to-r from-sky-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm">
              Welcome, {shortName} 👋
            </span>
            <p className="text-gray-500 text-xs mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
  
          <Link href="/admin/dashboard">
          <span className={`bg-sky-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-sky-700 transition cursor-pointer ${isAdmin ? 'block' : 'hidden'}`}>
            Admin Page
          </span>
          </Link>
        </div>

        {/* Hero / Welcome Card */}
        <div className="bg-linear-to-r from-sky-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold">
            Milking Team Dashboard
          </h2>
          <p className="text-sm opacity-90 mt-2 max-w-xl">
            Monitor daily milking activities, track performance, and keep operations running smoothly.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <Milk className="text-sky-500" />
              <p className="text-sm text-gray-500">Today’s Milk Output</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">1,240 L</h3>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <Users className="text-sky-500" />
              <p className="text-sm text-gray-500">Active Staff</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">{totalUsers}</h3>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <Calendar className="text-sky-500" />
              <p className="text-sm text-gray-500">Scheduled Sessions</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">4</h3>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <PlaneTakeoff className="text-sky-500" />
              <p className="text-sm text-gray-500">Month Off</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">10</h3>
          </div>
        </div>

        {/* My Today's Task */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <LoaderCircle size={18} className="text-sky-500" />
            <p className="font-semibold text-gray-700">
              My Today’s Task
            </p>
          </div>

          <div className="px-6 py-4 text-sm text-gray-700">
            🚜 Ensure all milking sessions are logged correctly, hygiene standards are met, and production targets are achieved.
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <Megaphone size={18} className="text-sky-500" />
            <p className="font-semibold text-gray-700">
              Announcements
            </p>
          </div>

          <ul className="px-6 py-4 text-sm text-gray-700 space-y-3">
            <li className="border-b pb-3">🐄 Log each milking session promptly.</li>
            <li className="border-b pb-3">📅 Check schedules daily for updates.</li>
            <li className="border-b pb-3">🧼 Maintain hygiene standards at all times.</li>
            <li>💡 Share feedback with the admin team.</li>
          </ul>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;