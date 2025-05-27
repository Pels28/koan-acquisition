"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ReportDashboard = dynamic(
  () => import('@/app/(protected)/dashboard/report/ReportDashboard'),
  { 
    ssr: false,
    loading: () => <div>Loading reports...</div>
  }
);

export default function ClientReportDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportDashboard />
    </Suspense>
  );
}