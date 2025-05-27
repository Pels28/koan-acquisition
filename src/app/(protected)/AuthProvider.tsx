"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import * as paths from "@/resources/paths";
import AuthContext, { AuthContextType } from "@/context/authContext";

const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const {user} = useContext(AuthContext) as AuthContextType
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace(`/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`);
    }
  }, [user, router]);
  return <>{children}</>;
};

export default AuthProvider;
