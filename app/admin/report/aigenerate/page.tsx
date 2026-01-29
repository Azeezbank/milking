"use client";

import { useState } from "react";
import Layout from "@/app/components/adminLayout/adminLayout";
import RichTextEditor from "@/app/components/editor/RichTextEditor";
import api from "@/app/components/services/api";

export default function AiSummaryPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    type: "Daily", // Daily | Weekly | Monthly
    content: "",
  });

  const submitSummary = async () => {
    if (!form.content.trim()) {
      alert("Summary content is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/v1/admin/summary", form); // backend later
      alert("Summary created successfully");
      setForm({ type: "Daily", content: "" });
    } catch (err: any) {
      console.error("Failed to submit summary:", err);
      alert(err.response?.data?.message || "Failed to submit summary");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">
            AI Summary
          </h1>
          <p className="text-sm text-slate-500">
            Create daily, weekly, or monthly summaries
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-8">

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Summary Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* CONTENT */}
          <Section title="Summary Content">
            <RichTextEditor
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
            />
          </Section>

          {/* ACTION */}
          <div className="flex justify-end pt-4">
            <button
              onClick={submitSummary}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-sky-600 text-white
                         hover:bg-sky-700 transition font-medium
                         disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Create Summary"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ---------------- SUB COMPONENT ---------------- */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-sm font-medium text-slate-700 mb-2">
      {title}
    </h3>
    {children}
  </div>
);