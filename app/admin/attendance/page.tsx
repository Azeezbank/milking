"use client";

import { useState, useEffect } from "react";
// import Layout from "../components/layout/page";
import axios from "axios";
import { CalendarDays, Clock2, ArrowUpNarrowWide, TrendingUp, Edit } from "lucide-react";
import Link from "next/link";
import Layout from "../../components/adminLayout/adminLayout";

const AdminAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("today"); // today, yesterday, custom
  const [customDate, setCustomDate] = useState("");

  // Fetch attendance
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://milkingapi.onrender.com/api/v1/admin/attendance?page=${page}&limit=${limit}&filter=${filter}${customDate ? `&date=${customDate}` : ""}`,
        { withCredentials: true }
      );

      setAttendanceRecords(response.data.attendances);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, limit, filter, customDate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Admin Attendance</h2>
            <p className="text-sm text-gray-500">Today: {new Date().toDateString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex gap-2 items-center">
            <label className="text-gray-600 font-medium">Filter:</label>
            <select
              className="border border-gray-300 rounded px-2 py-1 outline-0"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="custom">Custom</option>
            </select>
            {filter === "custom" && (
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 outline-0"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-gray-600">
                  <span className="inline-flex items-center gap-1"><ArrowUpNarrowWide size={12} />S/N</span>
                </th>
                <th className="px-3 py-2 text-left text-gray-600">
                  <span className="inline-flex items-center gap-1"><CalendarDays size={12} />Name</span>
                </th>
                <th className="px-3 py-2 text-left text-gray-600">
                  <span className="inline-flex items-center gap-1"><CalendarDays size={12} />Date</span>
                </th>
                <th className="px-3 py-2 text-left text-gray-600">
                  <span className="inline-flex items-center gap-1"><Clock2 size={12} />Time</span>
                </th>
                <th className="px-3 py-2 text-left text-gray-600">
                  <span className="inline-flex items-center gap-1"><TrendingUp size={12} />Status</span>
                </th>
                <th className="px-3 py-2 text-center text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">No records found</td>
                </tr>
              ) : (
                attendanceRecords.map((record, index) => {
                  const dt = new Date(record.date);
                  const dateOnly = dt.toLocaleDateString('en-CA');
                  const timeOnly = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={record.id} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{record.User.name}</td>
                      <td className="px-3 py-2">{dateOnly}</td>
                      <td className="px-3 py-2">{timeOnly}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Link href={`/admin/attendance/edit/${record.User.id}/${record.id}`}>
                        <button className="bg-sky-500 text-white px-2 py-1 rounded text-sm flex items-center gap-1 hover:bg-sky-600 transition">
                          <Edit size={14} /> Edit
                        </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end gap-2 p-4 items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-sky-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-sky-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AdminAttendance;