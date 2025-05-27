"use client";
import { FiFileText, FiArchive } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";

const ReportDashboard = () => {
  const [mockStats, setMockStats] = useState({
    workOrders: 0,
    landAcquisitions: 0
  });

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setMockStats({
        workOrders: 15,
        landAcquisitions: 8
      });
    }, 500);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8">Reports Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/report/work-orders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <FiFileText className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Work Order Reports</h3>
              <p className="text-gray-600">{mockStats.workOrders} reports</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/report/land-acquisitions"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <FiArchive className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Land Acquisition Reports</h3>
              <p className="text-gray-600">{mockStats.landAcquisitions} reports</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ReportDashboard;