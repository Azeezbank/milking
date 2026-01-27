"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/layout/page";
import { Droplet, Clock, Save } from "lucide-react";
import backendUrl from "@/app/config";
import { useRouter } from "next/navigation";

interface Animal {
  id: string;
  animalTag: string;
}

const MilkRecordPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalId, setAnimalId] = useState("");
  const [animalTag, setAnimalTag] = useState("");
  const [period, setPeriod] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");

  // Fetch animals
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/v1/milk/record/animals`,
          { withCredentials: true }
        );
        setAnimals(res.data.animals);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnimals();
  }, []);

  const handleAnimalChange = (id: string) => {
    const selected = animals.find(a => a.id === id);
    setAnimalId(id);
    setAnimalTag(selected?.animalTag || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!animalId || !period || !quantity) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${backendUrl}/api/v1/admin/create/animals/record`,
        {
          animalId,
          animalTag,
          period,
          quantity: Number(quantity),
          date
        },
        { withCredentials: true }
      );

      setMessage("Milk record saved successfully");
      setQuantity("");
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to save record");
      setLoading(false);
    }
  };

  const router = useRouter();
   // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/admin/users/my/info`, { withCredentials: true });
        const user = res.data.user;
        if (user.role !== "Team Leader" && user.role !== "Deputy Team Leader" && user.role !== "Operation Manager" && user.superRole !== "Admin") {
       router.push("/");
        }
      } catch {
        router.push("/");
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
              <Droplet />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Daily Milk Record
              </h1>
              <p className="text-sm text-gray-500">
                Record milk yield for today
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Animal */}
            <div>
              <label className="text-sm text-gray-600">Animal</label>
              <select
                value={animalId}
                onChange={(e) => handleAnimalChange(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-0 focus:border-sky-500"
                required
              >
                <option value="">Select animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.animalTag}
                  </option>
                ))}
              </select>
            </div>

            {/* Period */}
            <div>
              <label className="text-sm text-gray-600">Milking Period</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg pl-9 pr-3 py-2 outline-0 focus:border-sky-500"
                  required
                >
                  <option value="">Select period</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm text-gray-600">Quantity (Liters)</label>
              <input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-0 focus:border-sky-500"
                placeholder="e.g. 12.5"
                required
              />
            </div>

             {/* Date */}
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 outline-0 focus:border-sky-500"
                placeholder="e.g. 12.5"
                required
              />
            </div>

            {/* Feedback */}
            {message && (
              <p className="text-sm text-center text-gray-700">
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Record"}
            </button>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default MilkRecordPage;