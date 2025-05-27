// app/SearchParamWrapper.tsx
"use client";

import { Suspense } from "react";


export function SearchParamWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}