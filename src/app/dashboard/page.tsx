// "use client";
// import LandStationAcquisitionForm from "@/components/LandStationAcquisitionForm";
// import WorkOrderForm from "@/components/WorkOrderForm";
// import { useState } from "react";
// import { FiFileText, FiPieChart } from "react-icons/fi";

// const Dashboard = () => {
//   const [pageContent, setPageContent] = useState<string>("workOder");

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-primary text-white py-4 px-6 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold font-montserrat">KOAN Analytics</h1>
//           <div className="flex items-center space-x-4">
//             <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
//               <span className="font-bold">AD</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Dashboard */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Sidebar */}
//           <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 sticky top-0 h-[calc(100vh-80px)] overflow-y-auto">
//             <h2 className="font-montserrat font-bold text-lg mb-6 text-gray-700">
//               Navigation
//             </h2>
//             <ul className="space-y-3">
//               <li>
//                 <button
//                   onClick={() => {
//                     setPageContent("workOder");
//                   }}
//                   className={`w-full flex items-center space-x-3 hover:bg-gray-100 hover:text-gray-600 ${
//                     pageContent === "workOder" && "bg-primary/10 text-primary"
//                   } p-3 rounded-lg font-montserrat font-medium`}
//                 >
//                   <FiFileText className="text-lg" />
//                   <span>Work Order</span>
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => {
//                     setPageContent("landAcquisition");
//                   }}
//                   className={`w-full flex items-center space-x-3 hover:bg-gray-100 hover:text-gray-600  ${
//                     pageContent === "landAcquisition" &&
//                     "bg-primary/10 text-primary"
//                   }  p-3 rounded-lg font-montserrat font-medium`}
//                 >
//                   <FiFileText className="text-lg" />
//                   <span>Land Acquisition</span>
//                 </button>
//               </li>
//               <li>
//                 <button className="w-full flex items-center space-x-3 hover:bg-gray-100 hover:text-gray-600  p-3 rounded-lg font-montserrat">
//                   <FiPieChart className="text-lg" />
//                   <span>Reports Dashboard</span>
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Your main content goes here */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <div>
//                 {pageContent === "workOder" && <WorkOrderForm />}
//                 {pageContent === "landAcquisition" && (
//                   <LandStationAcquisitionForm />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import { FiPieChart } from "react-icons/fi";

export default function DashboardPage() {
  return (
    <div className="text-center py-12">
      <FiPieChart className="text-4xl mx-auto text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-600">
        Select an option from the sidebar to get started
      </h2>
    </div>
  );
}
