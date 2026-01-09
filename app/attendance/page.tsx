
"use client";
import { useEffect, useState } from "react";
import { LoadingModal } from "../components/modal/page";
import axios from "axios";
import Layout from "../components/layout/page";
import { ArrowUpNarrowWide, CalendarDays, Clock2, TrendingUp } from "lucide-react";
import backendUrl from "@/app/config";

export const Attendance = () => {
    const [status, setStatus] = useState("Present");
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await axios.put(
                `${backendUrl}/api/v1/attendance`,
                { status },
                { withCredentials: true }
            );
            alert("Attendance marked successfully");
            setLoading(false);
            fetchAttendanceRecords();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to mark attendance");
            setLoading(false);
        }
    };

    const fetchAttendanceRecords = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${backendUrl}/api/v1/attendance?page=${page}&limit=${limit}`,
                { withCredentials: true }
            );
            setAttendanceRecords(response.data.attendances);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceRecords();
    }, [page, limit]);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-5 space-y-5">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Daily Attendance</h2>
                    <p className="text-sm text-gray-500">{new Date().toDateString()}</p>
                </div>

                {/* Mark Attendance */}
                <div className="bg-white rounded-xl shadow p-5 space-y-3">
                    <h3 className="font-semibold text-gray-800">Mark Today's Attendance</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]} // cannot go before today
                            max={new Date().toISOString().split("T")[0]} // cannot go after today
                            className="border border-gray-300 rounded px-3 py-1 outline-0"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 outline-0"
                        >
                            <option>Present</option>
                            <option>Absent</option>
                        </select>
                        <button
                            onClick={handleSubmit}
                            className="bg-sky-500 text-white px-4 py-1 rounded hover:bg-sky-600 transition"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="bg-white rounded-xl shadow overflow-x-auto p-5 space-y-3">
                    <h3 className="font-semibold text-gray-800">Your Attendance Records</h3>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-3">
                        <div className="flex gap-2 items-center">
                            <span className="text-gray-600 text-sm">Show:</span>
                            <select
                                className="border border-gray-300 rounded px-2 py-1 outline-0 text-sm"
                                onChange={(e) => setLimit(Number(e.target.value))}
                            >
                                {pageOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <span className="text-gray-600 text-sm">entries</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <span className="text-gray-600 text-sm">Search:</span>
                            <input
                                type="text"
                                placeholder="Enter Keywords"
                                className="border border-gray-300 rounded px-2 py-1 outline-0 text-sm"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left text-gray-600">
                                    <ArrowUpNarrowWide size={14} className="inline mr-1" />
                                    S/N
                                </th>
                                <th className="px-3 py-2 text-left text-gray-600">
                                    <CalendarDays size={14} className="inline mr-1" />
                                    Date
                                </th>
                                <th className="px-3 py-2 text-left text-gray-600">
                                    <Clock2 size={14} className="inline mr-1" />
                                    Time
                                </th>
                                <th className="px-3 py-2 text-left text-gray-600">
                                    <TrendingUp size={14} className="inline mr-1" />
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-gray-500">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                attendanceRecords.map((record, index) => {
                                    const dt = new Date(record.date);
                                    const dateOnly = dt.toLocaleDateString("en-CA");
                                    const timeOnly = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                                    return (
                                        <tr
                                            key={record.id}
                                            className="hover:bg-gray-50 transition border-b border-gray-200"
                                        >
                                            <td className="px-3 py-2 text-sm">{index + 1}</td>
                                            <td className="px-3 py-2 text-sm">{dateOnly}</td>
                                            <td className="px-3 py-2 text-sm">{timeOnly}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === "Present"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-end items-center gap-2 mt-3">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-3 py-1 bg-sky-500 text-white rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-3 py-1 bg-sky-500 text-white rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

                <LoadingModal isOpen={loading} />
            </div>
        </Layout>
    );
};

export default Attendance;