/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  FiPieChart,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiChevronRight,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import useAxios from "@/utils/useAxios";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@heroui/react";
import Link from "next/link";

// Define types
interface LandAcquisition {
  id: number;
  review_status: "pending_review" | "approved" | "rejected";
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  reviewed_by: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  } | null;
  review_date: string | null;
  review_notes: string | null;
  propertyType: string;
  locationRegion: string;
  locationDistrict: string;
  locationRoad: string;
  landSize: string;
  landValue: string;
  leaseYears: string;
  leaseRemaining: string;
  decision: string | null;
  reason: string | null;
  totalEstimatedCost: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgLandSize: number;
  avgLandValue: number;
  avgLeaseYears: number;
  avgTotalCost: number;
  efficiency: number;
}

interface ChartData {
  statusData: { name: string; value: number }[];
  regionData: { name: string; value: number }[];
  propertyTypeData: { name: string; value: number }[];
  timelineData: { date: string; count: number }[];
}

const COLORS = ["#4361ee", "#4cc9f0", "#f72585", "#7209b7", "#3a0ca3"];
const STATUS_COLORS: Record<string, string> = {
  pending_review: "#FFBB28",
  approved: "#4cc9f0",
  rejected: "#f72585",
};

const transformData = (apiData: any[]): LandAcquisition[] => {
  return apiData.map((item) => ({
    ...item,
    id: item.id,
    review_status: item.review_status || "pending_review",
    user: item.user || {
      id: 0,
      email: "",
      first_name: "",
      last_name: "",
      full_name: "Unknown",
    },
    reviewed_by: item.reviewed_by || null,
    review_date: item.review_date || null,
    review_notes: item.review_notes || null,
    propertyType: item.propertyType || "land",
    locationRegion: item.locationRegion || "Unknown Region",
    locationDistrict: item.locationDistrict || "Unknown District",
    locationRoad: item.locationRoad || "Unknown Road",
    landSize: item.landSize || "0",
    landValue: item.landValue || "0",
    leaseYears: item.leaseYears || "0",
    leaseRemaining: item.leaseRemaining || "0",
    decision: item.decision || null,
    reason: item.reason || null,
    totalEstimatedCost: item.totalEstimatedCost || "0",
    created_at: item.created_at || "",
    updated_at: item.updated_at || "",
  }));
};

const calculateStats = (data: LandAcquisition[]): Stats => {
  const total = data.length;
  const pending = data.filter(
    (item) => item.review_status === "pending_review"
  ).length;
  const approved = data.filter(
    (item) => item.review_status === "approved"
  ).length;
  const rejected = data.filter(
    (item) => item.review_status === "rejected"
  ).length;

  // Calculate averages
  const landSizes = data.map(
    (item) => parseFloat(item.landSize.replace(/[^\d.-]/g, "")) || 0
  );
  const landValues = data.map(
    (item) => parseFloat(item.landValue.replace(/[^\d.-]/g, "")) || 0
  );
  const leaseYears = data.map((item) => parseFloat(item.leaseYears) || 0);
  const totalCosts = data.map(
    (item) => parseFloat(item.totalEstimatedCost.replace(/[^\d.-]/g, "")) || 0
  );

  const avgLandSize =
    landSizes.reduce((sum, size) => sum + size, 0) / (landSizes.length || 1);
  const avgLandValue =
    landValues.reduce((sum, value) => sum + value, 0) /
    (landValues.length || 1);
  const avgLeaseYears =
    leaseYears.reduce((sum, years) => sum + years, 0) /
    (leaseYears.length || 1);
  const avgTotalCost =
    totalCosts.reduce((sum, cost) => sum + cost, 0) / (totalCosts.length || 1);

  const efficiency = approved > 0 ? Math.round((approved / total) * 100) : 0;

  return {
    total,
    pending,
    approved,
    rejected,
    avgLandSize,
    avgLandValue,
    avgLeaseYears,
    avgTotalCost,
    efficiency,
  };
};

const getChartData = (data: LandAcquisition[]): ChartData => {
  const statusData = [
    {
      name: "Pending Review",
      value: data.filter((o) => o.review_status === "pending_review").length,
    },
    {
      name: "Approved",
      value: data.filter((o) => o.review_status === "approved").length,
    },
    {
      name: "Rejected",
      value: data.filter((o) => o.review_status === "rejected").length,
    },
  ];

  // Group by region
  const regionCount = data.reduce((acc: Record<string, number>, item) => {
    const region = item.locationRegion || "Unknown";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  const regionData = Object.entries(regionCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Group by property type
  const propertyTypeCount = data.reduce((acc: Record<string, number>, item) => {
    const type = item.propertyType || "land";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const propertyTypeData = Object.entries(propertyTypeCount).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })
  );

  // Timeline data (last 7 days)
  const timelineData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    const count = data.filter(
      (item) =>
        new Date(item.created_at).toISOString().split("T")[0] === dateString
    ).length;

    timelineData.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    });
  }

  return { statusData, regionData, propertyTypeData, timelineData };
};

export default function LandAcquisitionAnalytics() {
  const api = useAxios();
  const [acquisitions, setAcquisitions] = useState<LandAcquisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">(
    "overview"
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get("land-acquisitions/");
      const responseData = response.data.results;

      // Transform the API data
      const transformedData = transformData(responseData);
      setAcquisitions(transformedData);

      // Calculate statistics
      const calculatedStats = calculateStats(transformedData);
      setStats(calculatedStats);

      // Prepare chart data
      const charts = getChartData(transformedData);
      setChartData(charts);
    } catch (err) {
      setError("Failed to fetch land acquisitions. Please try again later.");
      console.error("Error fetching land acquisitions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading && acquisitions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <Skeleton className="h-[30px] w-[70%]" />
                <Skeleton className="h-[24px] w-[50%] mt-4" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
              <Skeleton className="h-[30px] w-[40%]" />
              <Skeleton className="h-[30px] w-[40%] mt-4" />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 h-80">
              <Skeleton className="h-[30px] w-[40%]" />
              <Skeleton className="h-[200px] w-[40%] mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <FiAlertCircle className="text-4xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-full flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-105"
          >
            <FiRefreshCw className="mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats || !chartData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Land Acquisition Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Insights and metrics for land acquisition proposals
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-full shadow p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "analytics"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Analytics
              </button>
            </div>

            <button
              onClick={fetchData}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiRefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Proposals"
                  value={stats.total}
                  icon={<FiPieChart />}
                  color="bg-blue-100 text-blue-600"
                  trend={12}
                />
                <StatCard
                  title="Pending Review"
                  value={stats.pending}
                  icon={<FiClock />}
                  color="bg-yellow-100 text-yellow-600"
                  trend={-3}
                />
                <StatCard
                  title="Approved"
                  value={stats.approved}
                  icon={<FiCheckCircle />}
                  color="bg-green-100 text-green-600"
                  trend={8}
                />
                <StatCard
                  title="Rejected"
                  value={stats.rejected}
                  icon={<FiXCircle />}
                  color="bg-red-100 text-red-600"
                  trend={-2}
                />
              </div>

              {/* Averages Card */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AverageCard
                    title="Avg. Land Size"
                    value={`${stats.avgLandSize.toFixed(1)} m²`}
                    icon={<FiLayers />}
                  />
                  <AverageCard
                    title="Avg. Land Value"
                    value={`GHS ${stats.avgLandValue.toFixed(2)}`}
                    icon={<FiDollarSign />}
                  />
                  <AverageCard
                    title="Avg. Lease Years"
                    value={`${stats.avgLeaseYears.toFixed(1)} years`}
                    icon={<FiClock />}
                  />
                  <AverageCard
                    title="Avg. Total Cost"
                    value={`GHS ${stats.avgTotalCost.toFixed(2)}`}
                    icon={<FiDollarSign />}
                  />
                </div>
              </div>

              {/* Property Type Stats */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Property Type Distribution
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.propertyTypeData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                      />
                      <Bar
                        dataKey="value"
                        name="Acquisitions"
                        fill="#3a0ca3"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Timeline Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Acquisition Timeline
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.timelineData}>
                      <defs>
                        <linearGradient
                          id="colorCount"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4361ee"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4361ee"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#4361ee"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        activeDot={{ r: 8, fill: "#4f46e5" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Recent Acquisition Proposals
                  </h3>
                  <Link href="/dashboard/report/land-acquisitions">
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
                      View All <FiChevronRight className="ml-1" />
                    </button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {acquisitions.slice(0, 5).map((acquisition) => (
                    <motion.div
                      key={acquisition.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-4 ${
                          acquisition.review_status === "pending_review"
                            ? "bg-yellow-500"
                            : acquisition.review_status === "approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {acquisition.propertyType} -{" "}
                          {acquisition.locationRegion}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {acquisition.user.full_name} •{" "}
                          {acquisition.locationDistrict}
                        </p>
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-900">
                          GHS {acquisition.landValue}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Review Status Distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart
                      margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
                    >
                      <Pie
                        data={chartData.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => {
                          const percentage = (percent || 0) * 100;
                          return `${name.split(" ")[0]}: ${percentage.toFixed(
                            0
                          )}%`;
                        }}
                      >
                        {chartData.statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              STATUS_COLORS[
                                entry.name.toLowerCase().replace(" ", "_")
                              ] || COLORS[index % COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value, name) => [
                          `${value} proposals`,
                          name,
                        ]}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: 20 }}
                        formatter={(value) => (
                          <span className="text-gray-700 text-sm">
                            {value.split(" ")[0]}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Regional Distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.regionData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                      />
                      <Bar
                        dataKey="value"
                        name="Acquisitions"
                        radius={[4, 4, 0, 0]}
                      >
                        {chartData.regionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                      <FiTrendingUp className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Approval Efficiency
                    </h3>
                  </div>
                  <p className="text-blue-100 mb-4">
                    {stats.approved > 0
                      ? `${Math.round(
                          (stats.approved / stats.total) * 100
                        )}% of proposals are approved`
                      : "No approved proposals yet"}
                  </p>
                  <p className="text-white text-2xl font-bold">
                    {stats.avgTotalCost.toFixed(2)} GHS
                    <span className="text-blue-100 text-sm font-normal block">
                      Average total cost
                    </span>
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl shadow-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                      <FiAlertCircle className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Pending Items
                    </h3>
                  </div>
                  <p className="text-purple-100 mb-4">
                    {stats.pending} proposals need review
                  </p>
                  <p className="text-white text-2xl font-bold">
                    {stats.avgLandSize.toFixed(1)} m²
                    <span className="text-purple-100 text-sm font-normal block">
                      Average land size
                    </span>
                  </p>
                </div>
              </div>

              {/* Value Distribution */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Land Value Distribution
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={acquisitions
                        .sort(
                          (a, b) =>
                            parseFloat(b.landValue) - parseFloat(a.landValue)
                        )
                        .slice(0, 10)
                        .map((item) => ({
                          name: `${item.locationDistrict.slice(0, 10)}...`,
                          value: parseFloat(item.landValue),
                        }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 40, // Increased left margin to accommodate Y-axis labels
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        width={60} // Explicit width for Y-axis
                        tickFormatter={(value) => {
                          // Format large numbers with K/M/B suffixes
                          if (value >= 1000000000) {
                            return `GHS ${(value / 1000000000).toFixed(1)}B`;
                          }
                          if (value >= 1000000) {
                            return `GHS ${(value / 1000000).toFixed(1)}M`;
                          }
                          if (value >= 1000) {
                            return `GHS ${(value / 1000).toFixed(1)}K`;
                          }
                          return `GHS ${value}`;
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [
                          `GHS ${value.toLocaleString()}`,
                          "Land Value",
                        ]}
                        labelStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                      />
                      <Bar
                        dataKey="value"
                        name="Land Value"
                        fill="#7209b7"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Component for statistic cards
const StatCard = ({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  trend: number;
}) => (
  <motion.div
    className="bg-white rounded-2xl shadow-lg p-6 flex items-center"
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
    <div className="ml-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold">{value}</p>
        {trend !== 0 && (
          <span
            className={`ml-2 text-sm font-medium ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

// Component for average cards
const AverageCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) => (
  <motion.div
    className="bg-white bg-opacity-20 rounded-xl p-4 flex items-center"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3">{icon}</div>
    <div>
      <h3 className="text-white text-sm font-medium">{title}</h3>
      <p className="text-white text-xl font-bold">{value}</p>
    </div>
  </motion.div>
);

// Component for chart cards
const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <motion.div
    className="bg-white rounded-2xl shadow-xl p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </motion.div>
);
