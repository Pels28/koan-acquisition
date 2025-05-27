import axios from "axios";
// import * as paths from "@/resources/paths";

const baseUrl = "http://127.0.0.1:8000/";
export const REGISTER_URL = `api/v1/auth/users/`
export const LOGIN_URL = `api/v1/auth/jwt/create/`
export const ACTIVATE_URL = `api/v1/auth/users/activation/`
export const RESET_PASSWORD_URL = `api/v1/auth/users/reset_password/`
export const RESET_PASSWORD_CONFIRM_URL = `api/v1/auth/users/reset_password_confirm/`
export const RESEND_ACTIVATION_URL = `api/v1/auth/users/resend_activation/`; // New endpoint
export const GET_USER_INFO_URL = `api/v1/auth/users/me/`


const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// AxiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const token = localStorage.getItem("user");
//   if (token) {
//     config.headers.Authorization = `Token ${token}`;
//   }
//   return config;
// });


//inavlid token remove and redirect

// AxiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("user");
//       window.history.replaceState(
//         {},
//         "",
//         `/?${paths.AUTH_SEARCH_PARAM_KEY}=${paths.SEARCH_PARAMS.auth.signIn}`
//       );
//     }

//     return Promise.reject(error)
//   }
// );

export default AxiosInstance;
