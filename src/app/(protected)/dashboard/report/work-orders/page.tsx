// app/dashboard/report/work-orders/page.tsx
import { Suspense } from "react";
import WorkOrderDashboard from "./WorkOrderDashboard";
import WorkOrderSkeleton from "./WorkOrderSkeleton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params}: { params: any } ) 
{

  const {filter} = await params
  return (
    <Suspense fallback={<WorkOrderSkeleton />}>
      <WorkOrderDashboard filter={filter} />
    </Suspense>
  );
}
