import React from "react";
import AuthProvider from "./AuthProvider";

const ProtectedLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ProtectedLayout;
