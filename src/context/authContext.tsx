import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Changed from jwt_decode to jwtDecode
import { useRouter } from "next/navigation";
import * as paths from "@/resources/paths";
import { baseUrl } from "@/utils/useAxios";

// Define types for your context
type AuthTokens = {
  access: string;
  refresh: string;
} | null;

type User = {
  user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  jti?: string;
  iat?: string;
  full_name?: string;
  bio?: string;
  image?: string;
  verfied?: boolean;
} | null;

export type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  authTokens: AuthTokens;
  setAuthTokens: React.Dispatch<React.SetStateAction<AuthTokens>>;
  registerUser: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

export const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();

  const [authTokens, setAuthTokens] = useState<AuthTokens>(() => {
    if (typeof window !== "undefined") {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? JSON.parse(tokens) : null;
    }
    return null;
  });

  const [user, setUser] = useState<User>(() => {
    if (typeof window !== "undefined" && authTokens) {
      return jwtDecode(authTokens.access);
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${baseUrl}api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      router.push("/");
    } else {
      console.error("Login failed:", response.status, data);
      throw new Error(data.detail || "Login failed");
    }
  };

  const registerUser = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => {
    const response = await fetch(`${baseUrl}api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
      }),
    });

    if (response.status === 201) {
      router.push(
        `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
      );
    } else {
      const errorData = await response.json();
      console.error("Registration failed:", response.status, errorData);
      throw new Error(errorData.detail || "Registration failed");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    // router.push(`/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`);
    window.history.replaceState(
      {},
      "",
      `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
    );
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!authTokens) {
      throw new Error("Not authenticated");
    }
  
    const response = await fetch(`${baseUrl}api/change-password/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authTokens.access}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Password change failed");
    }
  
    // Optionally log the user out after password change
    logoutUser();
  };

  const contextData: AuthContextType = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    changePassword
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
