"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout } from "@/app/components/layout/page"
import backendUrl from "@/app/config";

interface Report {
  id: string;
  title: string;
  tasks: string;
  challenges?: string;
  nextPlan?: string;
  createdAt: string;
  date: string;
  user: {
    name: string;
  };
}

export default function ReportsListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");

  const fetchReports = async () => {
    setLoading(true);
    try {
      let res;
      if (filter === "daily") {
        // Fetch actual daily reports from database
        res = await axios.get(`${backendUrl}/api/v1/report`, {
          withCredentials: true,
        });
        setReports(res.data.reports.day || []);
      } else {
        // Placeholder: fetch weekly/monthly summary from AI or other table
        // Later replace this endpoint with your AI integration
        res = await axios.get(`${backendUrl}/api/v1/report/summary?range=${filter}`, {
          withCredentials: true,
        });
        setReports(res.data.reports || []); // make sure AI returns array of objects with same structure
      }
    } catch (err) {
      console.error(err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const previewText = (text: string) => {
    const cleanText = text.replace(/<[^>]+>/g, ""); // remove html tags
    return cleanText.length > 120 ? cleanText.substring(0, 120) + "..." : cleanText;
  };

  return (
    <Layout>
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Work Reports</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        {["daily", "weekly", "monthly"].map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r as "daily" | "weekly" | "monthly")}
            className={`px-4 py-2 rounded-xl font-medium transition
              ${filter === r ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* REPORTS LIST */}
      {loading ? (
        <p className="text-slate-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-slate-500">No reports found.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-slate-800">{report.title}</h2>
                <span className="text-sm text-slate-500">
                  {new Date(report.date || report.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                Reporter: <span className="font-medium">{report.user?.name || "AI Summary"}</span>
              </p>
              <p className="text-slate-700 mb-4">{previewText(report.tasks)}</p>
              <Link
                href={`/report/display/${report.id}`}
                className="inline-block px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition font-medium text-sm"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
    </Layout>
  );
}