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
import Link from "next/link"

// Define types
interface WorkOrder {
  id: string;
  workOrderNumber: string;
  date: string;
  requester: string;
  contactNumber: string;
  assignedTechnician: string;
  location: string;
  description: string;
  startDate: string;
  completionDate: string | null;
  priority: "high" | "medium" | "low";
  partsAndMaterials: string;
  specialInstructions: string;
  status: string;
  isApproved: boolean;
  reviewDate: string | null;
  reviewedBy: string;
  reviewNotes: string | null;
  reviewStatus: "pending_review" | "approved" | "rejected";
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgCompletionTime: number | string;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  efficiency: number;
}

interface ChartData {
  statusData: { name: string; value: number }[];
  priorityData: { name: string; value: number }[];
  requesterData: { name: string; value: number }[];
  timelineData: { date: string; count: number }[];
}

const COLORS = ["#4361ee", "#4cc9f0", "#f72585", "#7209b7", "#3a0ca3"];
const STATUS_COLORS: Record<string, string> = {
  pending_review: "#FFBB28",
  approved: "#4cc9f0",
  rejected: "#f72585",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "#f72585",
  medium: "#FFBB28",
  low: "#4cc9f0",
};

const transformData = (apiData: any[]): WorkOrder[] => {
  return apiData.map((apiOrder) => ({
    id: apiOrder.id.toString(),
    workOrderNumber: apiOrder.work_order_number || "N/A",
    date: apiOrder.date || "",
    requester: apiOrder.requester || "Unknown",
    contactNumber: apiOrder.contact_number || "",
    assignedTechnician: apiOrder.assigned_technician || "Unassigned",
    location: apiOrder.location || "",
    description: apiOrder.description || "",
    startDate: apiOrder.start_date || "",
    completionDate: apiOrder.completion_date || null,
    priority: apiOrder.priority || "medium",
    partsAndMaterials: apiOrder.parts_and_materials || "",
    specialInstructions: apiOrder.special_instructions || "",
    status: apiOrder.status
      ? apiOrder.status === "in_progress"
        ? "In Progress"
        : apiOrder.status.charAt(0).toUpperCase() + apiOrder.status.slice(1)
      : "Pending",
    isApproved: apiOrder.is_approved || false,
    reviewDate: apiOrder.review_date || null,
    reviewedBy: apiOrder.reviewed_by?.full_name || "NA",
    reviewNotes: apiOrder.review_notes || null,
    reviewStatus: apiOrder.review_status || "pending_review",
    createdAt: apiOrder.created_at || "",
  }));
};

const calculateStats = (data: WorkOrder[]): Stats => {
  const total = data.length;
  const pending = data.filter(
    (order) => order.reviewStatus === "pending_review"
  ).length;
  const approved = data.filter(
    (order) => order.reviewStatus === "approved"
  ).length;
  const rejected = data.filter(
    (order) => order.reviewStatus === "rejected"
  ).length;

  const highPriority = data.filter((order) => order.priority === "high").length;
  const mediumPriority = data.filter(
    (order) => order.priority === "medium"
  ).length;
  const lowPriority = data.filter((order) => order.priority === "low").length;

  // Calculate average days to complete approved orders
  const completedOrders = data.filter(
    (order) =>
      order.reviewStatus === "approved" &&
      order.startDate &&
      order.completionDate
  );

  let totalDays = 0;
  completedOrders.forEach((order) => {
    const start = new Date(order.startDate);
    const end = new Date(order.completionDate as string);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalDays += diffDays;
  });

  const avgCompletionTime =
    completedOrders.length > 0
      ? (totalDays / completedOrders.length).toFixed(1)
      : 0;

  const efficiency = approved > 0 ? Math.round((approved / total) * 100) : 0;

  return {
    total,
    pending,
    approved,
    rejected,
    avgCompletionTime,
    highPriority,
    mediumPriority,
    lowPriority,
    efficiency,
  };
};

const getChartData = (data: WorkOrder[]): ChartData => {
  const statusData = [
    {
      name: "Pending Review",
      value: data.filter((o) => o.reviewStatus === "pending_review").length,
    },
    {
      name: "Approved",
      value: data.filter((o) => o.reviewStatus === "approved").length,
    },
    {
      name: "Rejected",
      value: data.filter((o) => o.reviewStatus === "rejected").length,
    },
  ];

  const priorityData = [
    { name: "High", value: data.filter((o) => o.priority === "high").length },
    {
      name: "Medium",
      value: data.filter((o) => o.priority === "medium").length,
    },
    { name: "Low", value: data.filter((o) => o.priority === "low").length },
  ];

  // Group by requester
  const requesterCount = data.reduce((acc: Record<string, number>, order) => {
    acc[order.requester] = (acc[order.requester] || 0) + 1;
    return acc;
  }, {});

  const requesterData = Object.entries(requesterCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Timeline data (last 7 days)
  const timelineData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    const count = data.filter(
      (order) =>
        new Date(order.createdAt).toISOString().split("T")[0] === dateString
    ).length;

    timelineData.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    });
  }

  return { statusData, priorityData, requesterData, timelineData };
};

export default function WorkOrderAnalytics() {
    const api = useAxios();
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
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
  
        const response = await api.get("work-orders/");
      
        const responseData = response.data.results;
  
        // Transform the API data
        const transformedData = transformData(responseData);
        setWorkOrders(transformedData);
  
        // Calculate statistics
        const calculatedStats = calculateStats(transformedData);
        setStats(calculatedStats);
  
        // Prepare chart data
        const charts = getChartData(transformedData);
        setChartData(charts);
      } catch (err) {
        setError("Failed to fetch work orders. Please try again later.");
        console.error("Error fetching work orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    if (isLoading && workOrders.length === 0) {
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
                Work Order Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Insights and metrics for your work orders
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
                    title="Total Work Orders"
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
  
                {/* Efficiency Card */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-white">
                        Workflow Efficiency
                      </h3>
                      <p className="text-blue-100 mt-1">
                        Average completion time: {stats.avgCompletionTime} days
                      </p>
                    </div>
  
                    <div className="relative w-full md:w-48 h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl font-bold text-white">
                            {stats.efficiency}%
                          </span>
                          <p className="text-blue-100 mt-1">Approval Rate</p>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="white"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          initial={{ strokeDashoffset: 283 }}
                          animate={{
                            strokeDashoffset:
                              283 - (283 * stats.efficiency) / 100,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
  
                {/* Priority Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <PriorityCard
                    title="High Priority"
                    value={stats.highPriority}
                    color={PRIORITY_COLORS.high}
                    icon={<FiAlertCircle />}
                  />
                  <PriorityCard
                    title="Medium Priority"
                    value={stats.mediumPriority}
                    color={PRIORITY_COLORS.medium}
                    icon={<FiClock />}
                  />
                  <PriorityCard
                    title="Low Priority"
                    value={stats.lowPriority}
                    color={PRIORITY_COLORS.low}
                    icon={<FiCheckCircle />}
                  />
                </div>
  
                {/* Timeline Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Work Orders Timeline
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
                      Recent Work Orders
                    </h3>
                    <Link href="/dashboard/report/work-orders">
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
                      View All <FiChevronRight className="ml-1" />
                    </button>
                    </Link>
                  </div>
  
                  <div className="space-y-4">
                    {workOrders.slice(0, 5).map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mr-4 ${
                            order.reviewStatus === "pending_review"
                              ? "bg-yellow-500"
                              : order.reviewStatus === "approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
  
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {order.workOrderNumber} - {order.description}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {order.requester} • {order.location}
                          </p>
                        </div>
  
                        <div className="ml-4 flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : order.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {order.priority.charAt(0).toUpperCase() +
                              order.priority.slice(1)}
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
                          formatter={(value, name) => [`${value} orders`, name]}
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
  
                  <ChartCard title="Priority Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.priorityData}>
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
                          name="Work Orders"
                          radius={[4, 4, 0, 0]}
                        >
                          {chartData.priorityData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                PRIORITY_COLORS[entry.name.toLowerCase()] ||
                                COLORS[index % COLORS.length]
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
  
                {/* Additional Charts */}
                <div className="grid grid-cols-1 mb-8">
                  <ChartCard title="Top Requesters">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.requesterData}>
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
                          name="Work Orders"
                          fill="#3a0ca3"
                          radius={[4, 4, 0, 0]}
                        />
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
                        Completion Efficiency
                      </h3>
                    </div>
                    <p className="text-blue-100 mb-4">
                      {stats.approved > 0
                        ? `${Math.round(
                            (stats.approved / stats.total) * 100
                          )}% of work orders are approved`
                        : "No approved work orders yet"}
                    </p>
                    <p className="text-white text-2xl font-bold">
                      {stats.avgCompletionTime} days
                      <span className="text-blue-100 text-sm font-normal block">
                        Average completion time
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
                      {stats.pending} work orders need review
                    </p>
                    <p className="text-white text-2xl font-bold">
                      {stats.highPriority}
                      <span className="text-purple-100 text-sm font-normal block">
                        High priority items
                      </span>
                    </p>
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
  
  // Component for priority cards
  const PriorityCard = ({
    title,
    value,
    color,
    icon,
  }: {
    title: string;
    color: string;
    value: number;
    icon: ReactNode;
  }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <div
          className={`p-2 rounded-lg ${color
            .replace("bg-", "bg-")
            .replace("text-", "text-")}`}
        >
          {icon}
        </div>
        <h3 className="text-gray-800 font-medium ml-3">{title}</h3>
      </div>
  
      <div className="mt-2 flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full"
            style={{
              width: `${(value / 10) * 100}%`,
              backgroundColor: color,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(value / 10) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
      </div>
      <span className="ml-3 text-lg font-bold" style={{ color }}>
        {value}
      </span>
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