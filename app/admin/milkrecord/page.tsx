"use client";

import { useEffect, useState } from "react";
import Layout from "@/app/components/adminLayout/adminLayout";
import api from "@/app/components/services/api";

interface MilkRow {
    id: string; // Milksessions.id
    date: string;
    animalTag: string;
    time: string;
    period: string;
    quantity: number;
    recorder: string;
}

interface AnimalTag {
    animalTag: string;
}

export default function MilkRecordsPage() {
    const [records, setRecords] = useState<MilkRow[]>([]);
    const [totalMilk, setTotalMilk] = useState(0);
    const [animalTag, setAnimalTag] = useState("");
    const [range, setRange] = useState("day");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [animals, setAnimals] = useState<AnimalTag[]>([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch animals
    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await api.get("/api/v1/milk/record/animals");
                setAnimals(res.data.animals);
            } catch (err) {
                console.error("Failed to fetch animals:", err);
            }
        };
        fetchAnimals();
    }, []);

    // Fetch records
    const fetchRecords = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/v1/milk/record/summary", {
                params: {
                    range,
                    date,
                    animalTag: animalTag || undefined,
                    page,
                    limit: 10,
                },
            });

            setRecords(res.data.records);
            setTotalMilk(res.data.totalMilk);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) {
            console.error("Failed to fetch milk records:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page]);

    // Delete milk session
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this milk session?"
        );
        if (!confirmed) return;

        try {
            setDeletingId(id);
            await api.delete(`/api/v1/admin/create/animals/${id}`);
            fetchRecords();
        } catch (err) {
            console.error("Failed to delete record:", err);
            alert("Failed to delete record");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Layout>
            <div className="p-6 bg-slate-50 min-h-screen">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Milk Records</h1>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500"
                        onChange={(e) => setAnimalTag(e.target.value)}
                    >
                        <option value="">Animal Tag</option>
                        {animals.map((tag, index) => (
                            <option key={index} value={tag.animalTag}>
                                {tag.animalTag}
                            </option>
                        ))}
                    </select>

                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                    </select>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                    />

                    <button
                        onClick={() => {
                            setPage(1);
                            fetchRecords();
                        }}
                        className="bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition py-1"
                    >
                        Apply Filter
                    </button>
                </div>

                {/* Total Milk */}
                <div className="bg-sky-500 text-white rounded-xl p-5 mb-6">
                    <p className="text-sm opacity-90">Total Milk Collected</p>
                    <h2 className="text-3xl font-bold">{Number(totalMilk).toFixed(2)} Litres</h2>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm">Date</th>
                                <th className="px-4 py-2 text-left text-sm">Animal Tag</th>
                                <th className="px-4 py-2 text-left text-sm">Time</th>
                                <th className="px-4 py-2 text-left text-sm">Period</th>
                                <th className="px-4 py-2 text-left text-sm">Quantity (L)</th>
                                <th className="px-4 py-2 text-left text-sm">Recorder</th>
                                <th className="px-4 py-2 text-left text-sm">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr key="loading">
                                    <td colSpan={7} className="text-center py-6">
                                        Loading...
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr key="empty">
                                    <td colSpan={7} className="text-center py-6">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                records.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2">{new Date(r.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 font-medium">{r.animalTag}</td>
                                        <td className="px-4 py-2">{new Date(r.time).toLocaleTimeString()}</td>
                                        <td className="px-4 py-2 capitalize">{r.period}</td>
                                        <td className="px-4 py-2 font-semibold">{r.quantity}</td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{r.recorder}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                disabled={deletingId === r.id}
                                                onClick={() => handleDelete(r.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {deletingId === r.id ? "Deleting..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 border rounded-lg disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 border rounded-lg disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </Layout>
    );
}