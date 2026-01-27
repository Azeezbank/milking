
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RichTextEditor from "@/app/components/editor/RichTextEditor";
import { Layout } from "@/app/components/adminLayout/adminLayout"
import backendUrl from "@/app/config";

interface Report {
    id: string;
    title: string;
    tasks: string;
    challenges?: string;
    nextPlan?: string;
    date: string;       // include date
    createdAt: string;
    user: {
        name: string;
    };
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        tasks: "",
        challenges: "",
        nextPlan: "",
        date: "",
    });

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/v1/report?range=daily`, {
                withCredentials: true,
            });
            setReports(res.data.reports.day || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setReports([]);
            setLoading(false);
        }
    };

    const startEditing = (report: Report) => {
        setEditingId(report.id);
        setEditForm({
            title: report.title,
            tasks: report.tasks,
            challenges: report.challenges || "",
            nextPlan: report.nextPlan || "",
            date: report.date.split("T")[0], // format as yyyy-mm-dd for input
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({
            title: "",
            tasks: "",
            challenges: "",
            nextPlan: "",
            date: "",
        });
    };


    const saveEdit = async (id: string) => {
        try {
            setSavingId(id); // start saving
            const res = await axios.put(
                `${backendUrl}/api/v1/report/${id}`,
                editForm,
                { withCredentials: true }
            );

            // Preserve the user object from previous report
            setReports(
                reports.map((r) =>
                    r.id === id ? { ...res.data.report, user: r.user } : r
                )
            );

            setEditingId(null);
            alert("Report updated successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to update report");
        } finally {
            setSavingId(null); // done saving
        }
    };

    const deleteReport = async (id: string) => {
        if (!confirm("Are you sure you want to delete this report?")) return;
        try {
            await axios.delete(`${backendUrl}/api/v1/report/${id}`, {
                withCredentials: true,
            });
            setReports(reports.filter((r) => r.id !== id));
            alert("Report deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete report");
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) return <p className="p-6 text-slate-500">Loading reports...</p>;
    if (reports.length === 0) return <p className="p-6 text-slate-500">No reports found.</p>;

    return (
        <Layout>
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin - Daily Reports</h1>

            <div className="space-y-6">
                {reports.map((report) =>
                    editingId === report.id ? (
                        // ---------------- EDIT FORM ----------------
                        <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            {/* Tasks */}
                            <Section title="Tasks Completed">
                                <RichTextEditor
                                    value={editForm.tasks}
                                    onChange={(v) => setEditForm({ ...editForm, tasks: v })}
                                />
                            </Section>

                            {/* Challenges */}
                            <Section title="Challenges / Issues">
                                <RichTextEditor
                                    value={editForm.challenges}
                                    onChange={(v) => setEditForm({ ...editForm, challenges: v })}
                                />
                            </Section>

                            {/* Next Plan */}
                            <Section title="Plan for Next Day">
                                <RichTextEditor
                                    value={editForm.nextPlan}
                                    onChange={(v) => setEditForm({ ...editForm, nextPlan: v })}
                                />
                            </Section>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={cancelEditing}
                                    className="px-4 py-2 rounded-xl bg-gray-400 text-white hover:bg-gray-500"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => saveEdit(report.id)}
                                    className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700"
                                    disabled={savingId === report.id}
                                >
                                    {savingId === report.id ? "Updating..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // ---------------- VIEW REPORT ----------------
                        <div
                            key={report.id}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">{report.title}</h2>
                                <p className="text-sm text-slate-500">
                                    Reporter: {report.user.name} | Date: {new Date(report.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => startEditing(report)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteReport(report.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
        </Layout>
    );
}

/* ---------------- SUB COMPONENT ---------------- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">{title}</h3>
        {children}
    </div>
);