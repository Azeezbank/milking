"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/adminLayout/adminLayout";
import backendUrl from "@/app/config";

const RegisterAnimalPage = () => {
  const router = useRouter();
  const [animalTag, setAnimalTag] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!animalTag.trim()) {
      alert("Animal tag is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${backendUrl}/api/v1/admin/create/animals`,
        { animalTag },
        { withCredentials: true }
      );

      setLoading(false);
      alert("Animal registered successfully ✅");
      setAnimalTag("");
      // router.push("/admin/animals");
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      alert(err.response?.data?.message || "Failed to register animal");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 to-white p-6">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Register New Animal
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Add animals to the farm database
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Animal Tag
              </label>
              <input
                type="text"
                value={animalTag}
                onChange={(e) => setAnimalTag(e.target.value)}
                placeholder="e.g. COW-001"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Registering..." : "Register Animal"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterAnimalPage;