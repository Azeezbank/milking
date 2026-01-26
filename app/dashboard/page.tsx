
"use client";

import Layout from "../components/layout/page";
import axios from "axios";
import backendUrl from "@/app/config";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Milk,
  Users,
  TrendingUp,
  LoaderCircle,
  Megaphone,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

interface MilkSession {
  date: string;
  animalTag: string;
  time: string;
  period: string;
  quantity: number;
  recorder: string;
}

interface AnimalTag {
  animalTag: string;
}

const Dashboard = () => {
  // State
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMilk, setTotalMilk] = useState(0);
  const [prevTotalMilk, setPrevTotalMilk] = useState(0);
  const [animalsMilked, setAnimalsMilked] = useState(0);
  const [avgPerAnimal, setAvgPerAnimal] = useState(0);
  const [avgMilkingDays, setAvgMilkingDays] = useState(0);
  const [filteredAnimalStats, setFilteredAnimalStats] = useState<{ daysMilked: number; totalMilk: number } | null>(null);
  const [filterRange, setFilterRange] = useState("day");
  const [animalFilter, setAnimalFilter] = useState("");
  const [dailyTrendData, setDailyTrendData] = useState<{ date: string; total: number; }[]>([]);
  const [topAnimalsData, setTopAnimalsData] = useState<{ animal: string; total: number }[]>([]);
  const [sectionFilter, setSectionFilter] = useState("Today");
  const [animals, setAnimals] = useState<AnimalTag[]>([]);

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

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/admin/users/my/info`, { withCredentials: true });
        const user = res.data.user;
        setUserName(user.username);
        setIsAdmin(user.role === "Team Leader" || user.superRole === "Admin");
        setTotalUsers(res.data.totalUser || 0);
      } catch {
        setIsAdmin(false);
      }
    };
    fetchUserInfo();
  }, []);

  // Fetch milk summary from backend
  useEffect(() => {
    const fetchMilkSummary = async () => {
      try {
        const today = new Date().toISOString();
        const res = await axios.get(`${backendUrl}/api/v1/milk/record/summary`, {
          params: {
            range: filterRange,
            date: today,
            animalTag: animalFilter,
          },
          withCredentials: true,
        });

        const data = res.data;

        setTotalMilk(data.totalMilk);
        setPrevTotalMilk(Number(data.previousTotalMilk));
        setAvgMilkingDays(data.avgMilkingDays || 0);
        setFilteredAnimalStats(data.filteredAnimal || null);

        setAnimalsMilked(new Set(data.records.map((r: MilkSession) => r.animalTag)).size);
        setAvgPerAnimal(data.records.length ? data.totalMilk / new Set(data.records.map((r: MilkSession) => r.animalTag)).size : 0);

        // Daily trend chart
        const trendMap: Record<string, number> = {};
        data.records.forEach((r: MilkSession) => {
          const d = new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          trendMap[d] = (trendMap[d] || 0) + Number(r.quantity);
        });
        setDailyTrendData(Object.entries(trendMap).map(([date, total]) => ({ date, total })));

        // Top animals
        const animalMap: Record<string, { total: number; count: number }> = {};
        data.records.forEach((r: MilkSession) => {
          if (!animalMap[r.animalTag]) animalMap[r.animalTag] = { total: 0, count: 0 };
          animalMap[r.animalTag].total += Number(r.quantity);
          animalMap[r.animalTag].count += 1;
        });

        const animalsTop = Object.entries(animalMap)
          .map(([animal, { total }]) => ({
            animal,
            total: Number(total.toFixed(2)),
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);

        setTopAnimalsData(animalsTop);

      } catch (err) {
        console.error(err);
      }
    };

    fetchMilkSummary();
  }, [filterRange, animalFilter]);

  const percentChange = prevTotalMilk ? (((totalMilk - prevTotalMilk) / prevTotalMilk) * 100).toFixed(1) : "0";
  const shortName = userName.split(" ").slice(0, 2).join(" ");
  const absoluteChange = totalMilk - prevTotalMilk;
  const performanceIndex =
    prevTotalMilk > 0
      ? ((totalMilk / prevTotalMilk) * 100).toFixed(1)
      : "100";

  const handleFilterRange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRange(e.target.value);
    setSectionFilter(e.target.options[e.target.selectedIndex].text);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start md:items-center">
          <div>
            <span className="inline-block bg-linear-to-r from-sky-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm">
              Welcome, {shortName} 👋
            </span>
            <p className="text-gray-500 text-xs mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {isAdmin && (
            <Link href="/admin/dashboard">
              <button className="bg-sky-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-sky-700 transition">
                Admin Page
              </button>
            </Link>
          )}
        </div>

        {/* HERO */}
        <div className="bg-linear-to-r from-sky-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold">Milking Team Dashboard</h2>
          <p className="text-sm opacity-90 mt-2 max-w-xl">
            Monitor daily milking activities, track performance, manage tasks, and stay updated.
          </p>
        </div>

        {/* GLOBAL FILTERS */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center">
          <select
            value={filterRange}
            onChange={handleFilterRange}
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={animalFilter}
            onChange={(e) => setAnimalFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Animals</option>
            {animals.map((tag, index) => (
              <option key={index}>{tag.animalTag}</option>
            ))}
          </select>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 text-sky-600"><Milk /><p className="text-sm text-gray-500">{sectionFilter} Milk</p></div>
            <h3 className="text-3xl font-bold mt-3">{totalMilk} L</h3>
            <div className={`text-sm ${absoluteChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {absoluteChange >= 0 ? "↑" : "↓"} {absoluteChange.toFixed(1)} L
              ({percentChange}%) {absoluteChange >= 0 ? "Above" : "Below"} {filterRange === "day" ? "Yesterday" : filterRange === "week" ? "Last Week" : filterRange === "month" ? "Last Month" : "Last Year"}
            </div>
            <div className="text-xs text-gray-500">
              Performance: {performanceIndex}%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 text-sky-600"><Users /><p className="text-sm text-gray-500">Animals Milked</p></div>
            <h3 className="text-3xl font-bold mt-3">{animalsMilked}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 text-sky-600"><TrendingUp /><p className="text-sm text-gray-500">Average / Animal</p></div>
            <h3 className="text-3xl font-bold mt-3">{avgPerAnimal.toFixed(1)} L</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 text-sky-600"><Users /><p className="text-sm text-gray-500">Avg Milking Days</p></div>
            <h3 className="text-3xl font-bold mt-3">{avgMilkingDays.toFixed(1)}</h3>
          </div>

          {filteredAnimalStats && (
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 text-sky-600"><Users /><p className="text-sm text-gray-500">Selected Animal Stats</p></div>
              <h3 className="text-2xl font-bold mt-3">{filteredAnimalStats.daysMilked} days | {filteredAnimalStats.totalMilk} L</h3>
            </div>
          )}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* DAILY TREND */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">Daily Milk Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* TOP ANIMALS */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">Top 10 Animals – Total Milk (Selected Period)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topAnimalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="animal" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TASKS */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <LoaderCircle size={18} className="text-sky-500" />
            <p className="font-semibold text-gray-700">My Today’s Task</p>
          </div>
          <div className="px-6 py-4 text-sm text-gray-700">
            🚜 Ensure all milking sessions are logged correctly, hygiene standards are met, and production targets are achieved.
          </div>
        </div>

        {/* ANNOUNCEMENT */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <Megaphone size={18} className="text-sky-500" />
            <p className="font-semibold text-gray-700">Announcements</p>
          </div>
          <ul className="px-6 py-4 text-sm text-gray-700 space-y-3">
            <li className="border-b pb-3">🐄 Log each milking session promptly.</li>
            <li className="border-b pb-3">📅 Check schedules daily for updates.</li>
            <li className="border-b pb-3">🧼 Maintain hygiene standards at all times.</li>
            <li>💡 Share feedback with the admin team.</li>
          </ul>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
