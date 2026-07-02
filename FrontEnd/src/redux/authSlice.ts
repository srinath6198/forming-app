import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

const storedUser = typeof window !== "undefined" ? localStorage.getItem("flora_user") : null;
const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  error: null,
  loading: false,
};

// Create async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Invalid email or password");
    }
  }
);

// Create async thunk for signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: { name: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// Create async thunk for fetching profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getProfile();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("flora_token");
        localStorage.removeItem("flora_user");
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login handlers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        
        // Map backend roles to frontend roles
        const roleMap: Record<string, "Super Admin" | "Admin" | "Billing User"> = {
          'ADMIN': 'Super Admin',
          'USER': 'Billing User',
        };
        
        state.user = {
          id: action.payload.data.user.id,
          name: action.payload.data.user.name,
          email: action.payload.data.user.email,
          password: "",
          role: roleMap[action.payload.data.user.role] || 'Admin',
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("flora_token", action.payload.data.token);
          localStorage.setItem("flora_user", JSON.stringify(state.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string || "Invalid email or password";
      })
      // Signup handlers
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store token from signup response
        if (typeof window !== "undefined") {
          localStorage.setItem("flora_token", action.payload.data.token);
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string || "Signup failed";
      })
      // GetProfile handlers
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        
        // Map backend roles to frontend roles
        const roleMap: Record<string, "Super Admin" | "Admin" | "Billing User"> = {
          'ADMIN': 'Super Admin',
          'USER': 'Billing User',
        };
        
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          password: "",
          role: roleMap[action.payload.role] || 'Admin',
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("flora_user", JSON.stringify(state.user));
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string || "Failed to fetch profile";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;