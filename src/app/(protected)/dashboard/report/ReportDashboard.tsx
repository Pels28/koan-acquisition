/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { FiFileText, FiArchive, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { Skeleton, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import useAxios from "@/utils/useAxios";

const ReportDashboard = () => {
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    workOrders: 0,
    landAcquisitions: 0
  });
  const [errors, setErrors] = useState({
    workOrders: "",
    landAcquisitions: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [workOrdersRes, landAcquisitionsRes] = await Promise.all([
          api.get('work-orders/'),
          api.get('land-acquisitions/')
        ]);
        
        setCounts({
          workOrders: workOrdersRes.data.count,
          landAcquisitions: landAcquisitionsRes.data.count
        });
      } catch (error) {
        console.error(error);
        setErrors({
          workOrders: "Failed to load work orders",
          landAcquisitions: "Failed to load land acquisitions"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const Card = ({ 
    title, 
    count, 
    error, 
    icon, 
    color, 
    viewRoute, 
    createRoute 
  }: {
    title: string;
    count: number;
    error: string | null;
    icon: React.ReactNode;
    color: string;
    viewRoute: string;
    createRoute: string;
  }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          
          {isLoading ? (
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md mt-3" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          ) : count > 0 ? (
            <>
              <p className="text-gray-600 mt-1">
                {count} {count === 1 ? 'report' : 'reports'} available
              </p>
              <div className="mt-4 flex gap-3">
                <Link href={viewRoute} className="flex-1">
                  <Button 
                    fullWidth
                    variant="flat" 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    View All
                  </Button>
                </Link>
                <Link href={createRoute} className="flex-1">
                  <Button 
                    fullWidth
                    endContent={<FiPlus />}
                  >
                    New
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-gray-500 mb-4">No reports created yet</p>
              <Link href={createRoute}>
                <Button 
                  fullWidth
                  endContent={<FiPlus />}
                  size="lg"
                  className="shadow-sm"
                >
                  Create New
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Reports Dashboard</h2>
        <div className="text-sm text-gray-500">
          {!isLoading && (
            `Total: ${counts.workOrders + counts.landAcquisitions} reports`
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Work Order Reports"
          count={counts.workOrders}
          error={errors.workOrders}
          icon={<FiFileText className="text-xl" />}
          color="bg-blue-500"
          viewRoute="/dashboard/report/work-orders"
          createRoute="/dashboard/work-order"
        />

        <Card
          title="Land Acquisition Reports"
          count={counts.landAcquisitions}
          error={errors.landAcquisitions}
          icon={<FiArchive className="text-xl" />}
          color="bg-green-500"
          viewRoute="/dashboard/report/land-acquisitions"
          createRoute="/dashboard/land-acquisition"
        />
      </div>

      {!isLoading && (counts.workOrders > 0 || counts.landAcquisitions > 0) && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-blue-800 text-sm">
            Tip: You can create new reports or manage existing ones from the respective sections.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;