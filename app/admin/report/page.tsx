
"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "@/app/components/editor/RichTextEditor";
import { Layout } from "@/app/components/adminLayout/adminLayout";
import api from "@/app/components/services/api";

interface Report {
  id: string;
  title: string;
  tasks: string;
  challenges?: string;
  nextPlan?: string;
  date: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

type FilterType =
  | "daily-reports"
  | "daily-summary"
  | "weekly-summary"
  | "monthly-summary";

export default function AdminReportsPage() {
  const [records, setRecords] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterType>("daily-reports");

  const [editForm, setEditForm] = useState({
    title: "",
    tasks: "",
    challenges: "",
    nextPlan: "",
    date: "",
  });

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      let res;

      // 🔹 DAILY REPORTS
      if (filter === "daily-reports") {
        res = await api.get("/api/v1/report", { params: { range: "daily" } });
        setRecords(res.data.reports.day || []);
        return;
      }

      // 🔹 AI SUMMARIES
      const type =
        filter === "daily-summary"
          ? "daily"
          : filter === "weekly-summary"
          ? "weekly"
          : "monthly";

      res = await api.get("/api/v1/report/summary", {
        params: { type },
      });

      setRecords(
        res.data.map((s: any) => ({
          id: s.id,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Summary`,
          tasks: s.content,
          date: s.startDate,
          createdAt: s.createdAt,
          user: { name: "AI Summary" },
        }))
      );
    } catch (err) {
      console.error("Fetch failed", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  /* ---------------- EDIT REPORT ---------------- */
  const startEditing = (r: Report) => {
    setEditingId(r.id);
    setEditForm({
      title: r.title,
      tasks: r.tasks,
      challenges: r.challenges || "",
      nextPlan: r.nextPlan || "",
      date: r.date.split("T")[0],
    });
  };

  const saveEdit = async (id: string) => {
    try {
      setSavingId(id);
      const res = await api.put(`/api/v1/report/${id}`, editForm);
      setRecords(records.map((r) => (r.id === id ? res.data.report : r)));
      setEditingId(null);
      alert("Updated");
    } finally {
      setSavingId(null);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm("Delete report?")) return;
    await api.delete(`/api/v1/report/${id}`);
    setRecords(records.filter((r) => r.id !== id));
  };

  /* ---------------- GENERATE SUMMARY ---------------- */
  const generateSummary = async (type: "daily" | "weekly" | "monthly") => {
    if (!confirm(`Generate ${type} summary?`)) return;
    await api.post(`/api/v1/admin/summary/${type}`);
    alert("Summary generated");
  };

  /* ---------------- RENDER ---------------- */
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin – Reports</h1>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="rounded-xl border px-4 py-2"
            >
              <option value="daily-reports">Daily Reports</option>
              <option value="daily-summary">Daily Summary</option>
              <option value="weekly-summary">Weekly Summary</option>
              <option value="monthly-summary">Monthly Summary</option>
            </select>

            {filter !== "daily-reports" && (
              <button
                onClick={() =>
                  generateSummary(
                    filter.includes("weekly")
                      ? "weekly"
                      : filter.includes("monthly")
                      ? "monthly"
                      : "daily"
                  )
                }
                className="px-4 py-2 bg-green-600 text-white rounded-xl"
              >
                Generate Summary
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {records.map((r) =>
            editingId === r.id && filter === "daily-reports" ? (
              <div key={r.id} className="bg-white p-6 rounded-xl">
                <RichTextEditor
                  value={editForm.tasks}
                  onChange={(v) => setEditForm({ ...editForm, tasks: v })}
                />
                <button
                  onClick={() => saveEdit(r.id)}
                  className="mt-3 bg-sky-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div
                key={r.id}
                className="bg-white border rounded-xl p-6 flex justify-between"
              >
                <div>
                  <h2 className="font-semibold">{r.title}</h2>
                  <p className="text-sm text-gray-500">
                    {r.user?.name} · {new Date(r.date).toLocaleDateString()}
                  </p>
                </div>

                {filter === "daily-reports" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(r)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteReport(r.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}