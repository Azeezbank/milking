"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Layout from "@/app/components/adminLayout/adminLayout";
import backendUrl from "@/app/config";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/v1/admin/users`, { withCredentials: true });
      setUsers(res.data.users);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Users</h1>

        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 text-sm">Name</th>
                <th className="px-4 py-2 text-left text-gray-500 text-sm">Email</th>
                <th className="px-4 py-2 text-left text-gray-500 text-sm">Phone</th>
                <th className="px-4 py-2 text-left text-gray-500 text-sm">Username</th>
                <th className="px-4 py-2 text-left text-gray-500 text-sm">Role</th>
                <th className="px-4 py-2 text-center text-gray-500 text-sm">User Info</th>
                <th className="px-4 py-2 text-center text-gray-500 text-sm">Task Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <Link
                        href={`/admin/users/edit/${user.id}`}
                        className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 transition text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                    <td className=" py-2 text-center">
                      <Link
                        href={`/admin/tasks/assign/${user.id}`}
                        className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition text-sm"
                      >
                        Assign
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default UsersPage;