
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Layout } from "@/app/components/layout/page";
// import api from "@/app/components/services/api";

// interface Report {
//   id: string;
//   title: string;
//   tasks: string;
//   challenges?: string;
//   nextPlan?: string;
//   createdAt: string;
//   date: string;
//   user?: {
//     name: string;
//   };
// }

// export default function ReportsListPage() {
//   const [reports, setReports] = useState<Report[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");

//   /** ---------------- FETCH REPORTS ---------------- */
//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       let res;

//       if (filter === "daily") {
//         // Fetch actual daily reports from database
//         res = await api.get("/api/v1/report", { params: { range: "daily" } });
//         setReports(res.data.reports.day || []);
//       } else {
//         // Fetch AI-generated summaries for weekly/monthly
//         res = await api.get(`/api/v1/summary/${filter}`);
//         // Transform AI summary into "report-like" object for display
//         setReports(
//           res.data.summary
//             ? [
//                 {
//                   id: res.data.summary.id,
//                   title: `${filter.charAt(0).toUpperCase() + filter.slice(1)} Summary`,
//                   tasks: res.data.summary.content,
//                   date: new Date(res.data.summary.startDate).toISOString(),
//                   createdAt: res.data.summary.createdAt,
//                   user: { name: "AI Summary" },
//                 },
//               ]
//             : []
//         );
//       }
//     } catch (err: any) {
//       console.error("Failed to fetch reports:", err);
//       setReports([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [filter]);

//   /** ---------------- PREVIEW TEXT ---------------- */
//   const previewText = (text: string) => {
//     const cleanText = text.replace(/<[^>]+>/g, ""); // remove HTML tags
//     return cleanText.length > 120 ? cleanText.substring(0, 120) + "..." : cleanText;
//   };

//   return (
//     <Layout>
//       <div className="max-w-6xl mx-auto p-6">
//         <h1 className="text-3xl font-bold text-slate-800 mb-6">Work Reports</h1>

//         {/* FILTER BUTTONS */}
//         <div className="flex gap-3 mb-6">
//           {["daily", "weekly", "monthly"].map((r) => (
//             <button
//               key={r}
//               onClick={() => setFilter(r as "daily" | "weekly" | "monthly")}
//               className={`px-4 py-2 rounded-xl font-medium transition
//                 ${filter === r ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
//             >
//               {r.charAt(0).toUpperCase() + r.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* REPORTS LIST */}
//         {loading ? (
//           <p className="text-slate-500">Loading reports...</p>
//         ) : reports.length === 0 ? (
//           <p className="text-slate-500">No reports found.</p>
//         ) : (
//           <div className="space-y-6">
//             {reports.map((report) => (
//               <div
//                 key={report.id}
//                 className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h2 className="text-xl font-semibold text-slate-800">{report.title}</h2>
//                   <span className="text-sm text-slate-500">
//                     {new Date(report.date || report.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>

//                 <p className="text-sm text-slate-600 mb-2">
//                   Reporter: <span className="font-medium">{report.user?.name || "AI Summary"}</span>
//                 </p>

//                 <p className="text-slate-700 mb-4">{previewText(report.tasks)}</p>

//                 <Link
//                   href={`/report/display/${report.id}`}
//                   className="inline-block px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition font-medium text-sm"
//                 >
//                   Read More
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layout } from "@/app/components/layout/page";
import api from "@/app/components/services/api";

interface Report {
  id: string;
  title: string;
  tasks: string;
  createdAt: string;
  date: string;
  user?: {
    name: string;
  };
}

type FilterType = "daily-reports" | "daily" | "weekly" | "monthly";

export default function ReportsListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("daily-reports");

  /** ---------------- FETCH DATA ---------------- */
  const fetchReports = async () => {
    setLoading(true);
    try {
      let res;

      // 🔹 DAILY REPORTS (reports table)
      if (filter === "daily-reports") {
        res = await api.get("/api/v1/report/", { params: { range: "daily" } });

        setReports(res.data.reports.day || []);
        return;
      }

      // 🔹 AI SUMMARY TABLE
     const summaryType =
      filter === "daily" || filter === "weekly" || filter === "monthly"
        ? filter
        : null;

    if (!summaryType) return;

    res = await api.get("/api/v1/report/summary", {
      params: { type: summaryType },
    });

      setReports(
        res.data.length
          ? res.data.map((summary: any) => ({
              id: summary.id,
              title: `${filter.charAt(0).toUpperCase() + filter.slice(1)} Summary`,
              tasks: summary.content,
              date: summary.startDate,
              createdAt: summary.createdAt,
              user: { name: "AI Summary" },
            }))
          : []
      );
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter]);

  /** ---------------- PREVIEW TEXT ---------------- */
  const previewText = (text: string) => {
    const clean = text.replace(/<[^>]+>/g, "");
    return clean.length > 120 ? clean.slice(0, 120) + "..." : clean;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Work Reports</h1>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { key: "daily-reports", label: "Daily Reports" },
            { key: "daily", label: "Daily Summary" },
            { key: "weekly", label: "Weekly Summary" },
            { key: "monthly", label: "Monthly Summary" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key as FilterType)}
              className={`px-4 py-2 rounded-xl font-medium transition
                ${
                  filter === btn.key
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-slate-500">No records found.</p>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {report.title}
                  </h2>
                  <span className="text-sm text-slate-500">
                    {new Date(report.date || report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-2">
                  Reporter:{" "}
                  <span className="font-medium">
                    {report.user?.name || "AI Summary"}
                  </span>
                </p>

                <p className="text-slate-700 mb-4">
                  {previewText(report.tasks)}
                </p>

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