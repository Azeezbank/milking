"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "../config";
import Layout from "../components/layout/page";

interface WorkOff {
  id: string;
  date: string;
  used: boolean;
  usedAt?: string;
}

export default function WorkOffPage() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [records, setRecords] = useState<WorkOff[]>([]);
  const [offLimit, setOffLimit] = useState(0)
  const [summary, setSummary] = useState({
    totalSelected: 0,
    used: 0,
    remaining: 0,
  });

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    try {
      const handleOffLimit = async () => {
        const res = await axios.get(`${backendUrl}/api/v1/off/limit`, { withCredentials: true });
        if (res.status === 200) {
          setOffLimit(res.data.maxDays)
        }
      };
      handleOffLimit();
    } catch (err) {
      console.error(err);
    }
  }, [])

  /** FETCH USER WORK-OFF SUMMARY */
  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/v1/off`,
        { withCredentials: true }
      );

      setRecords(res.data.records);
      setSummary({
        totalSelected: res.data.totalSelected,
        used: res.data.used,
        remaining: res.data.remaining,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  /** HANDLE DATE SELECTION (ADD ONLY) */
  const handleDateSelect = (date: string) => {
    setSelectedDates((prev) => {
      if (prev.includes(date)) return prev;

      const nextTotal = summary.totalSelected + prev.length + 1;

      if (nextTotal > offLimit) {
        alert(`You can only select exactly ${offLimit} work-off days`);
        return prev;
      }

      return [...prev, date];
    });
  };

  /** REMOVE SELECTED DATE */
  const removeDate = (date: string) => {
    setSelectedDates((prev) => prev.filter((d) => d !== date));
  };

  /** SAVE SELECTED DAYS */
  const saveWorkOffDays = async () => {
    try {
      setLoading(true);
      if (summary.totalSelected + selectedDates.length !== offLimit) {
        setLoading(false);
        alert(`You must select exactly ${offLimit} work-off days before submitting`);
        return;
      }

      await axios.post(
        `${backendUrl}/api/v1/off`,
        { dates: selectedDates },
        { withCredentials: true }
      );

      alert('Your days off selection has been saved successfully')

      setSelectedDates([]);
      fetchSummary();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save days");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-slate-50 min-h-screen">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Work-Off Days
        </h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="Selected" value={summary.totalSelected} />
          <SummaryCard title="Used" value={summary.used} />
          <SummaryCard title="Remaining" value={summary.remaining} />
        </div>

        {/* DATE PICKER */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-3">
            Select Work-Off Days (Must be {offLimit})
          </h2>

          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleDateSelect(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-64"
          />

          {/* SELECTED DATES */}
          {selectedDates.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedDates.map((d) => (
                <span
                  key={d}
                  onClick={() => removeDate(d)}
                  className="cursor-pointer bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm hover:bg-sky-200 transition"
                  title="Click to remove"
                >
                  {d} ✕
                </span>
              ))}
            </div>
          )}

          <button
            onClick={saveWorkOffDays}
            disabled={loading || selectedDates.length === 0}
            className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition disabled:opacity-40"
          >
            {loading ? "Saving..." : "Save Work-Off Days"}
          </button>
        </div>

        {/* RECORDS TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm">Date</th>
                <th className="px-4 py-2 text-left text-sm">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6">
                    No work-off days selected
                  </td>
                </tr>
              ) : (
                records.map((r) => {
                  const dateKey = r.date.split("T")[0];
                  const isSelected = selectedDates.includes(dateKey);

                  return (
                    <tr
                      key={r.id}
                      className={isSelected ? "bg-sky-50" : ""}
                    >
                      <td className="px-4 py-2">
                        {new Date(r.date).toDateString()}
                      </td>

                      <td className="px-4 py-2">
                        {r.used ? (
                          <span className="text-gray-500 font-medium">
                            Used
                          </span>
                        ) : (
                          <span className="text-sky-600 font-medium">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

/** SUMMARY CARD */
const SummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => (
  <div className="bg-white rounded-xl shadow p-5">
    <p className="text-sm text-slate-500">{title}</p>
    <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
  </div>
);