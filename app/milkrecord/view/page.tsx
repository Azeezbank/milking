
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "@/app/config";
import Layout from "@/app/components/layout/page";

interface MilkRow {
  date: string;
  animalTag: string;
  time: string;
  period: string;
  quantity: number;
  recorder: string;
}

export default function MilkRecordsPage() {
  const [records, setRecords] = useState<MilkRow[]>([]);
  const [totalMilk, setTotalMilk] = useState(0);
  const [animalTag, setAnimalTag] = useState("");
  const [range, setRange] = useState("day");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${backendUrl}/api/v1/milk/record/summary`,
        {
          params: {
            range,
            date,
            animalTag: animalTag || undefined,
            page,
            limit: 10,
          },
          withCredentials: true,
        }
      );

      setRecords(res.data.records);
      setTotalMilk(res.data.totalMilk);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page]);

  return (
    <Layout>
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Milk Records
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Animal Tag"
          value={animalTag}
          onChange={(e) => setAnimalTag(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500"
        />

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
          className="bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition"
        >
          Apply
        </button>
      </div>

      {/* Total Milk */}
      <div className="bg-sky-500 text-white rounded-xl p-5 mb-6">
        <p className="text-sm opacity-90">Total Milk Collected</p>
        <h2 className="text-3xl font-bold">
          {Number(totalMilk).toFixed(2)} Litres
        </h2>
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
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No records found
                </td>
              </tr>
            ) : (
              records.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {r.animalTag}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(r.time).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {r.period}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {r.quantity}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {r.recorder}
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