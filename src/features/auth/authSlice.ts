import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService, { ActivationData, ResetPasswordConfirmData, ResetPasswordData, UserData } from "./authService";
import { RootState } from "@/store";

const userString = localStorage.getItem("user");
const user = userString ? JSON.parse(userString) : null;

const initialState = {
  user: user ? user : null,
  userInfo: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  activationSuccess: false,
  resendSuccess: false,
  // Separate error states
  activationError: false,
  resendError: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: UserData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      console.error(error)
      const message =
        // error.response?.data?.detail ||
        // error.response?.data?.non_field_errors?.[0] ||
        // Object.values(error.response?.data || {})
        //   .flatMap((arr) => arr)
        //   .join(", ") ||
        // error.message ||
        "Registration failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async (userData:{email: string, password: string} , thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      console.error(error)
      const message =
        // error.response?.data?.detail || // Most common Django REST framework format
        // error.response?.data?.non_field_errors?.[0] || // Form errors
        // error.response?.data?.message || // Custom error format
        // error.message ||
        "Login failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

export const activate = createAsyncThunk(
  "auth/activate",
  async (userData: ActivationData, thunkAPI) => {
    try {
      return await authService.activate(userData);
    } catch (error) {
      console.error(error)
      const message =
        // error.response?.data?.detail || // Djoser's primary error field
        // error.response?.data?.non_field_errors?.[0] || // Form-wide errors
        // Object.entries(error.response?.data || {})
        //   .map(([key, val]) => `${key}: ${val}`)
        //   .join("\n") ||
        // error.message ||
        "Activation failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData:ResetPasswordData, thunkAPI) => {
    try {
      return await authService.resetPassword(userData);
    } catch (error) {
      console.error(error)
      const message =
        // error.response?.data?.detail || // Djoser's primary error field
        // error.response?.data?.non_field_errors?.[0] || // Form-wide errors
        // Object.entries(error.response?.data || {})
        //   .map(([key, val]) => `${key}: ${val}`)
        //   .join("\n") ||
        // error.message ||
        "Reset Password failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (userData: ResetPasswordConfirmData, thunkAPI) => {
    try {
      return await authService.resetPasswordConfirm(userData);
    } catch (error) {
      console.error(error)
      const message =
        // error.response?.data?.detail || // Djoser's primary error field
        // error.response?.data?.non_field_errors?.[0] || // Form-wide errors
        // Object.entries(error.response?.data || {})
        //   .map(([key, val]) => `${key}: ${val}`)
        //   .join("\n") ||
        // error.message ||
        "Reset Password failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const accessToken = state.auth.user?.access;

      if (!accessToken) {
        throw new Error("No authentication token found");
      }

      return await authService.getUserInfo(accessToken);
    } catch (error) {
      console.error(error)
      const message =
        // error.response?.data?.detail ||
        // error.response?.data?.non_field_errors?.[0] ||
        // error.message ||
        "Failed to fetch user information";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resendActivationEmail = createAsyncThunk(
  "auth/resendActivation",
  async (email: string, thunkAPI) => {
    try {
      return await authService.resendActivation(email);
    } catch (error) {
      console.error(error)
      const message =
        // error.response?.data?.email?.[0] ||
        // error.response?.data?.detail ||
        // error.message ||
        "Failed to resend activation email";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(activate.pending, (state) => {
        state.isLoading = true;
        state.activationError = false;
      })
      .addCase(activate.fulfilled, (state) => {
        state.isLoading = false;
        state.activationSuccess = true;
      })
      .addCase(activate.rejected, (state, action) => {
        state.isLoading = false;
        state.activationError = true;
        state.message = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Password reset email sent successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Password reset successfully";
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        // Add action parameter
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
        // Don't clear user here - keep auth state
      })
      .addCase(resendActivationEmail.pending, (state) => {
        state.isLoading = true;
        state.resendError = false;
      })
      .addCase(resendActivationEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.resendSuccess = true;
      })
      .addCase(resendActivationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.resendError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
