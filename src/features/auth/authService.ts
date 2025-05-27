// import AxiosInstance, {
//   ACTIVATE_URL,
//   GET_USER_INFO_URL,
//   LOGIN_URL,
//   REGISTER_URL,
//   RESEND_ACTIVATION_URL,
//   RESET_PASSWORD_CONFIRM_URL,
//   RESET_PASSWORD_URL,
// } from "@/components/AxiosInstance";

// // const register = async (userData) => {

// //     const response = await AxiosInstance.post(REGISTER_URL, userData)

// //     return response.data
// // }


// const register = async (userData) => {
//   try {
//     const response = await AxiosInstance.post(REGISTER_URL, userData);

//     if (!response.data) {
//       throw new Error("No registration data received");
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Registration failed:", error);
//     throw error;
//   }
// };

// const login = async (userData) => {
//   try {
//     const response = await AxiosInstance.post(LOGIN_URL, userData);

//     if (!response.data) {
//       throw new Error("No authentication data received");
//     }

//     localStorage.setItem("user", JSON.stringify(response.data));
//     return response.data;
//   } catch (error) {
//     // Add additional error logging if needed
//     console.error("Login failed:", error);
//     throw error; // Let the thunk handle the error
//   }
// };

// const logout = () => {
//   return localStorage.removeItem("user");
// };

// const activate = async (userData) => {
//   try {
//     const response = await AxiosInstance.post(ACTIVATE_URL, userData);
//     // if (!response.data) throw new Error("No activation data received");
//     return response.data;
//   } catch (error) {
//     console.error("Activation error:", error.response?.data || error);
//     throw error; // Let thunk handle the error
//   }
// };

// const resetPassword = async (userData) => {
//   try {
//     const response = await AxiosInstance.post(RESET_PASSWORD_URL, userData);
//     //   if (!response.data) throw new Error("Something went wrong");
//     return response.data;
//   } catch (error) {
//     console.error("Reset password failed:", error.response?.data || error);
//     throw error; // Let thunk handle the error
//   }
// };

// const resetPasswordConfirm = async (userData) => {
//   try {
//     const response = await AxiosInstance.post(
//       RESET_PASSWORD_CONFIRM_URL,
//       userData
//     );
//     // if (!response.data) throw new Error("Something went wrong");
//     return response.data;
//   } catch (error) {
//     console.error("confirm password failed:", error.response?.data || error);
//     throw error; // Let thunk handle the error
//   }
// };

// const getUserInfo = async (accessToken: string) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   };

//   const response = await AxiosInstance.get(GET_USER_INFO_URL, config);
//   if (!response.data) throw new Error("Something went wrong");
//   return response.data;
// };


// const resendActivation = async (email: string) => {
//   try {
//     const response = await AxiosInstance.post(RESEND_ACTIVATION_URL, { email });
//     return response.data;
//   } catch (error) {
//     console.error("Resend activation failed:", error.response?.data || error);
//     throw error;
//   }
// };


// const authService = {
//   register,
//   login,
//   logout,
//   activate,
//   resetPassword,
//   resetPasswordConfirm,
//   getUserInfo,
//   resendActivation
// };

// export default authService;


import AxiosInstance, {
  ACTIVATE_URL,
  GET_USER_INFO_URL,
  LOGIN_URL,
  REGISTER_URL,
  RESEND_ACTIVATION_URL,
  RESET_PASSWORD_CONFIRM_URL,
  RESET_PASSWORD_URL,
} from "@/components/AxiosInstance";

// Type definitions
export interface UserData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface ActivationData {
  uid: string;
  token: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ResetPasswordConfirmData {
  uid: string;
  token: string;
  new_password: string;
}

interface UserInfo {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  // Add other user fields as needed
}
type AxiosErrorWithResponse = Error & {
  response?: {
    data?: {
      detail?: string;
      non_field_errors?: string[];
      email?: string[];
      password?: string[];
      [key: string]: unknown; // For other potential error fields
    };
  };
};
// Helper function for error handling
const handleServiceError = (error: unknown): never => {
  const err = error as AxiosErrorWithResponse;
  const errorData = err.response?.data;
  
  const message = errorData?.detail || 
                errorData?.non_field_errors?.join(', ') ||
                Object.values(errorData || {})
                  .flat()
                  .join(', ') ||
                err.message;

  console.error("Service error:", message);
  throw new Error(message);
};

// Service functions
const register = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post(REGISTER_URL, userData);
    return response.data;
  } catch (error) {
    return handleServiceError(error);
  }
};

const login = async (userData: Omit<UserData, 'first_name' | 'last_name'>): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post(LOGIN_URL, userData);
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return handleServiceError(error);
  }
};

const logout = (): void => {
  localStorage.removeItem("user");
};

const activate = async (activationData: ActivationData): Promise<void> => {
  try {
    await AxiosInstance.post(ACTIVATE_URL, activationData);
  } catch (error) {
    return handleServiceError(error);
  }
};

const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  try {
    await AxiosInstance.post(RESET_PASSWORD_URL, data);
  } catch (error) {
    return handleServiceError(error);
  }
};

const resetPasswordConfirm = async (data: ResetPasswordConfirmData): Promise<void> => {
  try {
    await AxiosInstance.post(RESET_PASSWORD_CONFIRM_URL, data);
  } catch (error) {
    return handleServiceError(error);
  }
};

const getUserInfo = async (accessToken: string): Promise<UserInfo> => {
  try {
    const response = await AxiosInstance.get(GET_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleServiceError(error);
  }
};

const resendActivation = async (email: string): Promise<void> => {
  try {
    await AxiosInstance.post(RESEND_ACTIVATION_URL, { email });
  } catch (error) {
    return handleServiceError(error);
  }
};

const authService = {
  register,
  login,
  logout,
  activate,
  resetPassword,
  resetPasswordConfirm,
  getUserInfo,
  resendActivation,
};

export default authService;
