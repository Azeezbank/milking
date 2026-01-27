
"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/app/components/layout/page";
import RichTextEditor from "@/app/components/editor/RichTextEditor";
import backendUrl from "@/app/config";

export default function DailyWorkReport() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    tasks: "",
    challenges: "",
    nextPlan: "",
    date: "", // <-- add date here
  });

  const submitReport = async () => {
    if (!form.date) {
      alert("Please select a date for the report.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${backendUrl}http://localhost:5000/api/v1/report`, // use POST for creation
        form,
        { withCredentials: true }
      );
      setLoading(false);
      alert("Report submitted successfully");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to submit report");
    }
  };

  return (
    <Layout>
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Daily Work Report
        </h1>
        <p className="text-sm text-slate-500">
          Record your daily progress clearly and professionally
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-8">

        {/* DATE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Report Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Milking Team Milk Record Updates"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* TASKS */}
        <Section title="Tasks Completed">
          <RichTextEditor
            value={form.tasks}
            onChange={(v) => setForm({ ...form, tasks: v })}
          />
        </Section>

        {/* CHALLENGES */}
        <Section title="Challenges / Issues">
          <RichTextEditor
            value={form.challenges}
            onChange={(v) => setForm({ ...form, challenges: v })}
          />
        </Section>

        {/* NEXT PLAN */}
        <Section title="Plan for Next Day">
          <RichTextEditor
            value={form.nextPlan}
            onChange={(v) => setForm({ ...form, nextPlan: v })}
          />
        </Section>

        {/* ACTION */}
        <div className="flex justify-end pt-4">
          <button
            onClick={submitReport}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-sky-600 text-white
                       hover:bg-sky-700 transition font-medium
                       disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Report"}
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