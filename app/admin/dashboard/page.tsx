"use client";

import {
  Users,
  ClipboardCheck,
  Milk,
  Clock,
  Bell,
  TrendingUp,
} from "lucide-react";
import Layout from "../../components/adminLayout/adminLayout";



export default function AdminDashboard() {
  return (
    <Layout>
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Overview of milking team activities and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Bell className="text-sky-500 cursor-pointer" />
          <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Team Members"
          value="12"
          icon={<Users />}
          color="sky"
        />
        <StatCard
          title="Present Today"
          value="9"
          icon={<ClipboardCheck />}
          color="green"
        />
        <StatCard
          title="Milk Collected (Today)"
          value="420 L"
          icon={<Milk />}
          color="amber"
        />
        <StatCard
          title="Overtime Hours"
          value="6 hrs"
          icon={<Clock />}
          color="rose"
        />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* ===== RECENT ATTENDANCE ===== */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">
            📋 Recent Attendance
          </h3>

          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="pb-3">Name</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Banky", status: "Present", time: "6:00 AM" },
                { name: "Jimi", status: "Present", time: "6:05 AM" },
                { name: "Idris", status: "Late", time: "6:30 AM" },
                { name: "Logbon", status: "Absent", time: "-" },
              ].map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3 font-medium">{item.name}</td>
                  <td
                    className={`font-semibold ${
                      item.status === "Present"
                        ? "text-green-600"
                        : item.status === "Late"
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className="text-gray-500">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== QUICK INSIGHTS ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">
            📊 Quick Insights
          </h3>

          <div className="space-y-4">
            <Insight
              title="Milk Yield Trend"
              value="+12% today"
              icon={<TrendingUp />}
            />
            <Insight
              title="Hygiene Reports"
              value="No issues"
              icon={<ClipboardCheck />}
            />
            <Insight
              title="Pending Requests"
              value="2"
              icon={<Bell />}
            />
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}

/* ===== SMALL COMPONENTS ===== */

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      </div>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}-100 text-${color}-600`}
      >
        {icon}
      </div>
    </div>
  );
};

const Insight = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-sky-500">{icon}</div>
        <p className="font-medium text-gray-700">{title}</p>
      </div>
      <span className="text-sm font-semibold text-gray-600">{value}</span>
    </div>
  );
};