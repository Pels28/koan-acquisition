// app/dashboard/report/work-orders/page.tsx
import { Suspense } from 'react';
import LandAcquisitionDashboard from './LandAcquisitionDashboard';
import WorkOrderSkeleton from '../work-orders/WorkOrderSkeleton';


export default async function Page({
  params

// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: {params: any}) {

  const {filter} = await params
  return (
    <Suspense fallback={<WorkOrderSkeleton/>}>
      <LandAcquisitionDashboard filter={filter} />
    </Suspense>
  );
}