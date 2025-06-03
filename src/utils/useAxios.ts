// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";
// import { useContext } from "react";
// import AuthContext, { AuthContextType } from "@/context/authContext";

// const baseUrl = "http://127.0.0.1:8000/";

// interface JwtPayload {
//   exp: number;
//   token_type?: { access: string; refresh: string };
//   // Add other fields you expect in your token
//   user_id?: string;
//   email?: string;
//   first_name?: string;
//   last_name?: string;
//   // access?: string;
//   // refresh?: string
//   jti?: string;
//   iat?: string;
//   full_name?: string;
//   bio?: string;
//   image?: string;
//   verfied?: boolean;
// }

// const useAxios = () => {
//   const { authTokens, setUser, setAuthTokens } = useContext(
//     AuthContext
//   ) as AuthContextType;

//   const axiosInstance = axios.create({
//     baseURL: baseUrl,
//     timeout: 1000000,
//     headers: {
//       "Content-Type": "application/json",
//       accept: "application/json",
//       Authorization: `Bearer ${authTokens?.access}`,
//     },
//   });

//   axiosInstance.interceptors.request.use(async (req) => {
//     const user = jwtDecode<JwtPayload>(authTokens?.access);
//     const isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1;

//     if (!isExpired) return req;
//     try {
//       const response = await axios.post(`${baseUrl}/api/token/refresh`, {
//         refresh: authTokens?.refresh,
//       });

//       localStorage.setItem("authTokens", JSON.stringify(response.data));

//       setAuthTokens(response.data);
//       setUser(jwtDecode(response.data.access));

//       req.headers.Authorization = `Bearer ${response.data.access}`;
//     } catch (error) {
//       console.error(error);
//       return req;
//     }
//   });

//   //   axiosInstance.interceptors.response.use(
//   //     (response) => {
//   //       return response;
//   //     },
//   //     (error) => {
//   //       if (error.response && error.response.status === 401) {
//   //         localStorage.removeItem("authTokens");
//   //         window.history.replaceState(
//   //           {},
//   //           "",
//   //           `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
//   //         );
//   //       }

//   //       return Promise.reject(error)
//   //     }
//   //   );

//   return axiosInstance;
// };

// export default useAxios;

import axios, { InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext, { AuthContextType } from "@/context/authContext";
// import * as paths from "@/resources/paths";
import swal from "sweetalert2";


// export const baseUrl = "http://127.0.0.1:8000/";
export const baseUrl = "https://django-koan-backend.onrender.com/";

interface JwtPayload {
  exp: number;
  user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  bio?: string;
  image?: string;
  verified?: boolean;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } = useContext(
    AuthContext
  ) as AuthContextType;


  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 1000000,
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });
  axiosInstance.interceptors.request.use(
    async (req: InternalAxiosRequestConfig) => {
      try {
        if (!authTokens?.access) return req;

        const user = jwtDecode<JwtPayload>(authTokens.access);
        const isExpired = dayjs.unix(user.exp).isBefore(dayjs());

        if (!isExpired) {
          req.headers.Authorization = `Bearer ${authTokens.access}`;
          return req;
        }

        // Initialize headers if undefined
        req.headers = req.headers || {};

        // Handle Content-Type for non-FormData requests
        if (!(req.data instanceof FormData)) {
          req.headers["Content-Type"] = "application/json";
        }

        // Refresh tokens
        const response = await axios.post<AuthTokens>(
          `${baseUrl}api/token/refresh/`,
          { refresh: authTokens.refresh }
        );

        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        req.headers.Authorization = `Bearer ${response.data.access}`;

        return req;
      } catch (error) {
        console.error("Token refresh failed:", error);
        logoutUser();
        // router.replace(
        //   `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
        // );
        swal.fire({
          title: "Session Expired",
          text: "Please log in again",
          icon: "error",
          toast: true,
          timer: 3000,
          position: "top-right",
        });
        return Promise.reject(error);
      }
    }
  );

  // axiosInstance.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     if (
  //       error.response?.status === 401 &&
  //       !error.config.url.includes("token")
  //     ) {
  //       logoutUser();
  //       // window.history.replaceState(
  //       //   {},
  //       //   "",
  //       //   `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
  //       // );
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  return axiosInstance;
};

export default useAxios;
