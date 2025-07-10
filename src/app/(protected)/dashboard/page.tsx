// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/app/dashboard/report/page.tsx
// "use client";

// import { useState, useEffect, ReactNode } from "react";
// import {
//   FiPieChart,
//   FiClock,
//   FiCheckCircle,
//   FiXCircle,
//   FiAlertCircle,
//   FiRefreshCw,
// } from "react-icons/fi";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   AreaChart,
//   Area,
// } from "recharts";
// import useAxios from "@/utils/useAxios";
// import { Skeleton } from "@heroui/react";

// // Define types
// interface WorkOrder {
//   id: string;
//   workOrderNumber: string;
//   date: string;
//   requester: string;
//   contactNumber: string;
//   assignedTechnician: string;
//   location: string;
//   description: string;
//   startDate: string;
//   completionDate: string | null;
//   priority: "high" | "medium" | "low";
//   partsAndMaterials: string;
//   specialInstructions: string;
//   status: string;
//   isApproved: boolean;
//   reviewDate: string | null;
//   reviewedBy: string;
//   reviewNotes: string | null;
//   reviewStatus: "pending_review" | "approved" | "rejected";
//   createdAt: string;
// }

// interface Stats {
//   total: number;
//   pending: number;
//   approved: number;
//   rejected: number;
//   avgCompletionTime: number | string;
//   highPriority: number;
//   mediumPriority: number;
//   lowPriority: number;
// }

// interface ChartData {
//   statusData: { name: string; value: number }[];
//   priorityData: { name: string; value: number }[];
//   requesterData: { name: string; value: number }[];
// }

// interface StatCardProps {
//   title: string;
//   value: number;
//   icon: ReactNode;
//   color: string;
// }

// interface PriorityCardProps {
//   title: string;
//   value: number;
//   color: string;
// }

// interface ChartCardProps {
//   title: string;
//   children: ReactNode;
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
// const STATUS_COLORS: Record<string, string> = {
//   pending_review: "#FFBB28",
//   approved: "#00C49F",
//   rejected: "#FF8042",
// };

// const PRIORITY_COLORS: Record<string, string> = {
//   high: "#FF6B6B",
//   medium: "#FFD93D",
//   low: "#6BCB77",
// };

// const transformData = (apiData: any[]): WorkOrder[] => {
//   return apiData.map((apiOrder) => ({
//     id: apiOrder.id.toString(),
//     workOrderNumber: apiOrder.work_order_number || "N/A",
//     date: apiOrder.date || "",
//     requester: apiOrder.requester || "Unknown",
//     contactNumber: apiOrder.contact_number || "",
//     assignedTechnician: apiOrder.assigned_technician || "Unassigned",
//     location: apiOrder.location || "",
//     description: apiOrder.description || "",
//     startDate: apiOrder.start_date || "",
//     completionDate: apiOrder.completion_date || null,
//     priority: apiOrder.priority || "medium",
//     partsAndMaterials: apiOrder.parts_and_materials || "",
//     specialInstructions: apiOrder.special_instructions || "",
//     status: apiOrder.status
//       ? apiOrder.status === "in_progress"
//         ? "In Progress"
//         : apiOrder.status.charAt(0).toUpperCase() + apiOrder.status.slice(1)
//       : "Pending",
//     isApproved: apiOrder.is_approved || false,
//     reviewDate: apiOrder.review_date || null,
//     reviewedBy: apiOrder.reviewed_by?.full_name || "NA",
//     reviewNotes: apiOrder.review_notes || null,
//     reviewStatus: apiOrder.review_status || "pending_review",
//     createdAt: apiOrder.created_at || "",
//   }));
// };

// const calculateStats = (data: WorkOrder[]): Stats => {
//   const total = data.length;
//   const pending = data.filter(
//     (order) => order.reviewStatus === "pending_review"
//   ).length;
//   const approved = data.filter(
//     (order) => order.reviewStatus === "approved"
//   ).length;
//   const rejected = data.filter(
//     (order) => order.reviewStatus === "rejected"
//   ).length;

//   const highPriority = data.filter((order) => order.priority === "high").length;
//   const mediumPriority = data.filter(
//     (order) => order.priority === "medium"
//   ).length;
//   const lowPriority = data.filter((order) => order.priority === "low").length;

//   // Calculate average days to complete approved orders
//   const completedOrders = data.filter(
//     (order) =>
//       order.reviewStatus === "approved" &&
//       order.startDate &&
//       order.completionDate
//   );

//   let totalDays = 0;
//   completedOrders.forEach((order) => {
//     const start = new Date(order.startDate);
//     const end = new Date(order.completionDate as string);
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     totalDays += diffDays;
//   });

//   const avgCompletionTime =
//     completedOrders.length > 0
//       ? (totalDays / completedOrders.length).toFixed(1)
//       : 0;

//   return {
//     total,
//     pending,
//     approved,
//     rejected,
//     avgCompletionTime,
//     highPriority,
//     mediumPriority,
//     lowPriority,
//   };
// };

// const getChartData = (data: WorkOrder[]): ChartData => {
//   const statusData = [
//     {
//       name: "Pending Review",
//       value: data.filter((o) => o.reviewStatus === "pending_review").length,
//     },
//     {
//       name: "Approved",
//       value: data.filter((o) => o.reviewStatus === "approved").length,
//     },
//     {
//       name: "Rejected",
//       value: data.filter((o) => o.reviewStatus === "rejected").length,
//     },
//   ];

//   const priorityData = [
//     { name: "High", value: data.filter((o) => o.priority === "high").length },
//     {
//       name: "Medium",
//       value: data.filter((o) => o.priority === "medium").length,
//     },
//     { name: "Low", value: data.filter((o) => o.priority === "low").length },
//   ];

//   // Group by requester
//   const requesterCount = data.reduce((acc: Record<string, number>, order) => {
//     acc[order.requester] = (acc[order.requester] || 0) + 1;
//     return acc;
//   }, {});

//   const requesterData = Object.entries(requesterCount)
//     .map(([name, value]) => ({ name, value }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 5);

//   return { statusData, priorityData, requesterData };
// };

// export default function DashboardPage() {
//   const api = useAxios();
//   const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [chartData, setChartData] = useState<ChartData | null>(null);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await api.get("work-orders/");
//       const responseData = response.data.results;

//       // Transform the API data
//       const transformedData = transformData(responseData);
//       setWorkOrders(transformedData);

//       // Calculate statistics
//       const calculatedStats = calculateStats(transformedData);
//       setStats(calculatedStats);

//       // Prepare chart data
//       const charts = getChartData(transformedData);
//       setChartData(charts);
//     } catch (err) {
//       setError("Failed to fetch work orders. Please try again later.");
//       console.error("Error fetching work orders:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (isLoading && workOrders.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="bg-white rounded-xl shadow p-6">
//               <Skeleton />
//               <Skeleton className="mt-2" />
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow p-6 h-80">
//             <Skeleton />
//             <Skeleton />
//           </div>
//           <div className="bg-white rounded-xl shadow p-6 h-80">
//             <Skeleton />
//             <Skeleton className="mt-4" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-12 text-center">
//         <div className="bg-red-50 text-red-700 p-6 rounded-xl max-w-2xl mx-auto">
//           <FiAlertCircle className="text-4xl mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2">
//             Error Loading Dashboard
//           </h2>
//           <p className="mb-4">{error}</p>
//           <button
//             onClick={fetchData}
//             className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center justify-center mx-auto"
//           >
//             <FiRefreshCw className="mr-2" /> Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Early return if stats or chartData are not available
//   if (!stats || !chartData) {
//     return null;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Work Order Analytics
//         </h1>
//         <button
//           onClick={fetchData}
//           className="flex items-center text-primary hover:text-primary-dark"
//         >
//           <FiRefreshCw className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
//           Refresh Data
//         </button>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Total Work Orders"
//           value={stats.total}
//           icon={<FiPieChart />}
//           color="bg-blue-100 text-blue-600"
//         />
//         <StatCard
//           title="Pending Review"
//           value={stats.pending}
//           icon={<FiClock />}
//           color="bg-yellow-100 text-yellow-600"
//         />
//         <StatCard
//           title="Approved"
//           value={stats.approved}
//           icon={<FiCheckCircle />}
//           color="bg-green-100 text-green-600"
//         />
//         <StatCard
//           title="Rejected"
//           value={stats.rejected}
//           icon={<FiXCircle />}
//           color="bg-red-100 text-red-600"
//         />
//       </div>

//       {/* Priority Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <PriorityCard
//           title="High Priority"
//           value={stats.highPriority}
//           color={PRIORITY_COLORS.high}
//         />
//         <PriorityCard
//           title="Medium Priority"
//           value={stats.mediumPriority}
//           color={PRIORITY_COLORS.medium}
//         />
//         <PriorityCard
//           title="Low Priority"
//           value={stats.lowPriority}
//           color={PRIORITY_COLORS.low}
//         />
//       </div>

//       {/* Charts */}
//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <ChartCard title="Review Status Distribution">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={chartData.statusData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={true}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={({ name, percent }) => {
//                   // Handle potentially undefined percent value
//                   const percentage = (percent || 0) * 100;
//                   return `${name}: ${percentage.toFixed(0)}%`;
//                 }}
//               >
//                 {chartData.statusData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={
//                       STATUS_COLORS[
//                         entry.name.toLowerCase().replace(" ", "_")
//                       ] || COLORS[index % COLORS.length]
//                     }
//                   />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => [`${value} orders`, "Count"]} />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         <ChartCard title="Priority Distribution">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData.priorityData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="value" name="Work Orders">
//                 {chartData.priorityData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={
//                       PRIORITY_COLORS[entry.name.toLowerCase()] ||
//                       COLORS[index % COLORS.length]
//                     }
//                   />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>

//       {/* Additional Charts */}
//       <div className="grid grid-cols-1 mb-8">
//         <ChartCard title="Top Requesters">
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={chartData.requesterData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="value"
//                 name="Work Orders"
//                 stroke="#8884d8"
//                 fill="#8884d8"
//                 fillOpacity={0.3}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl shadow p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4">Recent Work Orders</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   WO Number
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Requester
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Priority
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {workOrders.slice(0, 5).map((order) => (
//                 <tr key={order.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {order.workOrderNumber}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {order.requester}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                     {order.description}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full ${
//                         order.priority === "high"
//                           ? "bg-red-100 text-red-800"
//                           : order.priority === "medium"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {order.priority.charAt(0).toUpperCase() +
//                         order.priority.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full ${
//                         order.reviewStatus === "pending_review"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : order.reviewStatus === "approved"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {order.reviewStatus === "pending_review"
//                         ? "Pending Review"
//                         : order.reviewStatus.charAt(0).toUpperCase() +
//                           order.reviewStatus.slice(1)}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-blue-50 rounded-lg p-4">
//             <h3 className="font-medium text-blue-800 mb-2">
//               Completion Efficiency
//             </h3>
//             <p className="text-blue-700">
//               {stats.approved > 0
//                 ? `${Math.round(
//                     (stats.approved / stats.total) * 100
//                   )}% of work orders are approved`
//                 : "No approved work orders yet"}
//             </p>
//             <p className="text-blue-700 mt-2">
//               Average completion time: {stats.avgCompletionTime} days
//             </p>
//           </div>
//           <div className="bg-yellow-50 rounded-lg p-4">
//             <h3 className="font-medium text-yellow-800 mb-2">Pending Items</h3>
//             <p className="text-yellow-700">
//               {stats.pending} work orders (
//               {Math.round((stats.pending / stats.total) * 100)}%) need review
//             </p>
//             <p className="text-yellow-700 mt-2">
//               {stats.highPriority} high priority items require attention
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Component for statistic cards
// const StatCard = ({ title, value, icon, color }: StatCardProps) => (
//   <div className="bg-white rounded-xl shadow p-6 flex items-center">
//     <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
//     <div className="ml-4">
//       <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
//       <p className="text-2xl font-bold">{value}</p>
//     </div>
//   </div>
// );

// // Component for priority cards
// const PriorityCard = ({ title, value, color }: PriorityCardProps) => (
//   <div className="bg-white rounded-xl shadow p-6">
//     <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
//     <div className="mt-2 flex items-center">
//       <div className="w-full bg-gray-200 rounded-full h-2.5">
//         <div
//           className="h-2.5 rounded-full"
//           style={{
//             width: `${(value / 10) * 100}%`,
//             backgroundColor: color,
//           }}
//         ></div>
//       </div>
//       <span className="ml-2 text-lg font-bold" style={{ color }}>
//         {value}
//       </span>
//     </div>
//   </div>
// );

// // Component for chart cards
// const ChartCard = ({ title, children }: ChartCardProps) => (
//   <div className="bg-white rounded-xl shadow p-6">
//     <h3 className="text-lg font-semibold mb-4">{title}</h3>
//     {children}
//   </div>
// );

"use client";

import Tabs from "@/components/Tabs";
import WorkOrderAnalytics from "./WorkOrderAnalytics";
import LandAcquisitionAnalytics from "./LandAcquisitionAnalytics";

export default function DashboardPage() {
  return (
    <Tabs
      fullWidth
    size="lg"
    radius="lg"
      color="primary"
      items={[
        {
          id: "Work Order Analytics",
          label: "Work Order Analytics",
          content: <WorkOrderAnalytics />,
        },
        {
          id: "Land Acquisition Analytics",
          label: "Land Acquisition Analytics",
          content: <LandAcquisitionAnalytics/>,
        },
      ]}
    />
  );
}
