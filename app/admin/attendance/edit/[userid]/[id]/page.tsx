"use client";

import { useState, useEffect } from "react";
// import Layout from "../components/layout/page";
import axios from "axios";
import { UserCheck, UserX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import Layout from "@/app/components/adminLayout/adminLayout";

const AdminEditAttendance = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("Absent");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

   const id = params.userid;
   const pid = params.id;
  

  // Fetch record (placeholder)
  useEffect(() => {

    const fetchRecord = async () => {
      try {
       
        const response = await axios.get(`https://milkingapi.onrender.com/api/v1/admin/attendance/${id}`, { withCredentials: true });
        const record = response.data.record;

        setUserName(record.User.name);
        setDate(record.date);
        setTime(record.date);
        setStatus(record.status);
        const dt = new Date(record.date);
        setDate(dt.toLocaleDateString());
        setTime(dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecord();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`https://milkingapi.onrender.com/api/v1/admin/attendance/${pid}`, { status }, { withCredentials: true });
      alert("Attendance status updated successfully!");
      router.push("/admin/attendance");
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-6">

          <h2 className="text-xl font-semibold text-gray-800">Edit Attendance Status</h2>
          <p className="text-sm text-gray-500">Only the attendance status can be updated by admin.</p>

          {/* User Name */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">User Name</label>
            <input
              type="text"
              value={userName}
              disabled
              className="border border-gray-300 rounded px-3 py-2 outline-0 bg-gray-100"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Date</label>
            <input
              type="text"
              value={date}
              disabled
              className="border border-gray-300 rounded px-3 py-2 outline-0 bg-gray-100"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Time</label>
            <input
              type="text"
              value={time}
              disabled
              className="border border-gray-300 rounded px-3 py-2 outline-0 bg-gray-100"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium flex items-center gap-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 outline-0"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Status"}
          </button>

        </div>
      </div>
    </Layout>
  );
};

export default AdminEditAttendance;