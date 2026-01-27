"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/app/components/adminLayout/adminLayout";
import api from "@/app/components/services/api";

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/users/${id}`);
      setUser(res.data.user);
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/api/v1/admin/users/${id}`, user);
      alert("User updated successfully!");
      router.push("/admin/users");
    } catch (err: any) {
      console.error("Failed to update user:", err);
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto space-y-4"
        >
          <div>
            <label className="block text-gray-700 text-sm mb-1">Name</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Phone</label>
            <input
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Role</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-0"
            >
              <option value="Team Leader">Team Leader</option>
              <option value="Deputy Team Leader">Deputy Team Leader</option>
              <option value="Operation Officer">Operation Officer</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditUserPage;