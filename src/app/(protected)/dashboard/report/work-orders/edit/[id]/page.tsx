

"use client";
import useAxios from "@/utils/useAxios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import WorkOrderForm from "@/components/WorkOrderForm";
import { CalendarDate } from "@heroui/react";
import {  Skeleton } from "@heroui/react";
import Link from "next/link";
import { toCalendarDate } from "@/utils/dateUtils";

interface WorkOrder {
  id?: string;
  workOrderNumber: string;
  date: null | CalendarDate;
  requester: string;
  contactNumber: string;
  assignedTechnician: string;
  location: string;
  description: string;
  startDate: null | CalendarDate;
  completionDate: null | CalendarDate;
  priority: string;
  partsAndMaterials: string;
  specialInstructions: string;
}

const WorkOrderEditPage = () => {
  const api = useAxios();
  const params = useParams();
  const id = params.id;
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`work-orders/${id}/`);


  
        
        setWorkOrder({
          // id: response.data.id,
          assignedTechnician: response.data.assigned_technician,
          completionDate: toCalendarDate(response.data.completion_date),
          contactNumber: response.data.contact_number,
          date: toCalendarDate(response.data.date),
          location: response.data.location,
          description: response.data.description,
          partsAndMaterials: response.data.parts_and_materials,
          priority: response.data.priority,
          requester: response.data.requester,
          specialInstructions: response.data.special_instructions,
          startDate: toCalendarDate(response.data.start_date),
          workOrderNumber: response.data.work_order_number,
        });
      } catch (error) {
        console.error(error);
        setError("Failed to load work order. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/3 rounded-lg mb-4" />
          <Skeleton className="h-6 w-2/3 rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Skeleton className="h-6 w-1/4 rounded-lg mb-2" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/4 rounded-lg mb-2" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Skeleton className="h-6 w-1/4 rounded-lg mb-2" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/4 rounded-lg mb-2" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </div>
        
        <div className="mb-8">
          <Skeleton className="h-6 w-1/4 rounded-lg mb-2" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        
        <div className="mb-8">
          <Skeleton className="h-6 w-1/4 rounded-lg mb-2" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        
        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Work Order</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Work Order Not Found</h2>
          <p className="text-yellow-600 mb-4">
            The requested work order could not be found.
          </p>
          <Link
            href="/dashboard/report/work-orders"
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Back to Work Orders
          </Link>
        </div>
      </div>
    );
  }

  return <WorkOrderForm initialData={workOrder} />;
};

export default WorkOrderEditPage;
