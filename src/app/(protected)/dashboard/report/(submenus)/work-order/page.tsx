/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FiFileText, FiPlus, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { Skeleton, Button } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import useAxios from "@/utils/useAxios";
import AuthContext, { AuthContextType } from "@/context/authContext";

const WorkOrderPage = () => {
  const api = useAxios();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext) as AuthContextType;
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [unapprovedWorkOrders, setUnapprovedWorkOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("work-orders/");
        setCount(response.data.count);

        const unapproved = response.data.results.filter(
          (wo: any) => wo.review_status === "pending_review"
        );

        console.log("unapproved", unapproved)
        setUnapprovedWorkOrders(unapproved);
      } catch (err) {
        console.error(err);
        setError("Failed to load work orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Work Order Reports</h2>
        <div className="text-sm text-gray-500">
          {!isLoading && `${count} reports`}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-500 text-white">
            <FiFileText className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">Work Orders</h3>

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
                  {count} {count === 1 ? "report" : "reports"} available
                </p>
                {user?.is_manager && unapprovedWorkOrders.length > 0 && (
                  <span className="text-red-600 font-medium block mt-1">
                    {unapprovedWorkOrders.length} pending approval
                  </span>
                )}

                <div className="mt-4 flex gap-3">
                  <Link href="/dashboard/report/work-orders" className="flex-1">
                    <Button
                      fullWidth
                      variant="flat"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                    >
                      View All
                    </Button>
                  </Link>
                  <Link href="/dashboard/work-order" className="flex-1">
                    <Button fullWidth endContent={<FiPlus />}>
                      New
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <p className="text-gray-500 mb-4">No work orders created yet</p>
                <Link href="/dashboard/work-order">
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


      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiAlertCircle className="text-yellow-500" />
            Pending Approvals
          </h3>
          {unapprovedWorkOrders.length > 0 && !isLoading && (
            <div className="bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unapprovedWorkOrders.length}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : unapprovedWorkOrders.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">No pending approvals</p>
        ) : (
          <div className="space-y-3">
        {unapprovedWorkOrders.map((workOrder) => (
  <Link
    key={workOrder.id}
    href={`/dashboard/report/work-orders/${workOrder.id}`}
    className="block"
  >
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <p className="font-medium text-gray-800">
          {workOrder.work_order_number}
        </p>
        <p className="text-sm text-gray-600">
          {workOrder.description.substring(0, 60)}...
        </p>
        
        {/* Creator name visible only to managers */}
        {user?.is_manager && workOrder.user && (
          <p className="text-xs text-gray-500 mt-1">
            Created by: {workOrder.user.full_name}
          </p>
        )}
        
        <div className="flex gap-2 mt-1">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {workOrder.requester}
          </span>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {workOrder.priority}
          </span>
        </div>
      </div>
      {user?.is_manager && (
        <Button variant="flat" color="primary" className="text-sm">
          Review
        </Button>
      )}
    </div>
  </Link>
))}

            <div className="mt-4">
              <Link
                href={{
                  pathname: "/dashboard/report/work-orders",
                  query: { filter: "pending_review" },
                }}
                passHref
              >
                <Button fullWidth variant="light" color="warning">
                  View All Pending Approvals
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrderPage;
