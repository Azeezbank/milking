
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/app/components/layout/page"
import api from "@/app/components/services/api";

interface Report {
  id: string;
  title: string;
  tasks: string;
  challenges?: string;
  nextPlan?: string;
  date: string;       // report date
  createdAt: string;
  user: { name: string };
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
  try {
    setLoading(true);
    const res = await api.get(`/api/v1/report/${id}`);
    setReport(res.data.report);
  } catch (err: any) {
    console.error("Failed to fetch report:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  if (loading) return <p className="p-6 text-slate-500">Loading report...</p>;
  if (!report) return <p className="p-6 text-slate-500">Report not found.</p>;

  return (
    <Layout>
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sky-500 hover:text-sky-600 font-medium"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold text-slate-800 mb-2">{report.title}</h1>
      <p className="text-sm text-slate-500 mb-4">
        Reporter: <span className="font-medium">{report.user.name}</span> | Date:{" "}
        {new Date(report.date).toLocaleDateString()}
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
        <Section title="Tasks Completed" content={report.tasks} />
        {report.challenges && <Section title="Challenges / Issues" content={report.challenges} />}
        {report.nextPlan && <Section title="Plan for Next Day" content={report.nextPlan} />}
      </div>
    </div>
    </Layout>
  );
}

/* ---------------- SUB COMPONENT ---------------- */
const Section = ({ title, content }: { title: string; content: string }) => (
  <div>
    <h3 className="text-sm font-medium text-slate-700 mb-2">{title}</h3>
    <div
      className="text-slate-700 prose prose-slate max-w-full"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
);