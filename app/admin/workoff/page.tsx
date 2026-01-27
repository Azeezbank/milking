
"use client";

import { useEffect, useState } from "react";
import { Calendar, Users } from "lucide-react";
import Layout from "@/app/components/adminLayout/adminLayout";
import api from "@/app/components/services/api";

interface WorkOff {
  id: string;
  date: string;
  used: boolean;
  usedAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AdminWorkOffPage() {
  const [records, setRecords] = useState<WorkOff[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [maxDays, setMaxDays] = useState(0);
  const [month] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // Fetch all users

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/v1/admin/users");
      setUsers(res.data.users);
      // Set first user as default selected
      if (res.data.users.length > 0) setSelectedUser(res.data.users[0].id);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Fetch work-off records (optionally for selected user)

  const fetchOverview = async (userId?: string) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/admin/off?month=${month}&year=${year}${userId ? `&userId=${userId}` : ""}`
      );
      setRecords(res.data.records);
    } catch (err: any) {
      console.error("Failed to fetch overview:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save work-off limit
  const saveLimit = async () => {
    try {
      await api.post("/api/v1/admin/off", { month, year, maxDays });
      alert("Work-off limit saved");
    } catch (err: any) {
      console.error("Failed to save work-off limit:", err);
      alert(err.response?.data?.message || "Failed to save limit");
    }
  };

  // Update work-off date
  const updateDate = async (id: string, newDate: string) => {
    try {
      await api.put(`/api/v1/admin/off/${id}`, { newDate });
      fetchOverview(selectedUser); // refresh after update
    } catch (err: any) {
      console.error("Failed to update work-off date:", err);
    }
  };

  // Fetch max days limit
  const fetchLimit = async () => {
    try {
      const res = await api.get("/api/v1/off/limit");
      if (res.status === 200) setMaxDays(res.data.maxDays);
    } catch (err: any) {
      console.error("Failed to fetch max days limit:", err);
    }
  };

  // On mount
  useEffect(() => {
    fetchUsers();
    fetchLimit();
  }, []);

  // Fetch records when selected user changes
  useEffect(() => {
    if (selectedUser) fetchOverview(selectedUser);
  }, [selectedUser]);

  return (
    <Layout>
      <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
        {/* HERO CARD */}
        <div className="bg-linear-to-r from-sky-500 to-blue-500 text-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold">Monthly Work-Off Settings</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <input
              type="number"
              min={1}
              max={31}
              value={maxDays}
              onChange={(e) => setMaxDays(+e.target.value)}
              className="w-24 px-3 py-2 rounded-lg text-white text-center border border-gray-300"
            />
            <button
              onClick={saveLimit}
              className="bg-white text-sky-500 px-5 py-2 rounded-lg font-medium hover:scale-105 transition"
            >
              Save Limit
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Users />} label="Total Records" value={records.length} />
          <StatCard icon={<Calendar />} label="Current Period" value={`${month}/${year}`} />
          <StatCard icon={<Calendar />} label="Max Days Allowed" value={maxDays} />
        </div>

        {/* USER FILTER */}
        <div className="mt-4">
          <label className="text-sm font-medium mr-2">Select User:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4 text-left">User</th>
                <th>Date</th>
                <th>Status</th>
                <th>Used At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50 transition">
                  <td className="p-4">
                    <p className="font-medium">{r.user.name}</p>
                    {/* <p className="text-xs text-gray-500">{r.user.email}</p> */}
                  </td>
                  <td>{new Date(r.date).toDateString()}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${r.used ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {r.used ? "Used" : "Available"}
                    </span>
                  </td>
                  <td>{r.usedAt ? new Date(r.usedAt).toLocaleString() : "-"}</td>
                  <td className="pr-4">
                    {!r.used && (
                      <input
                        type="date"
                        onChange={(e) => updateDate(r.id, e.target.value)}
                        className="border rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </td>
                </tr>
              ))}
              {!records.length && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

/* ---------- SMALL COMPONENT ---------- */
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);