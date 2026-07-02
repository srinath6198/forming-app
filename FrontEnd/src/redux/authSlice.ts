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
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        
        // For signup, we need to fetch the user data since the register response only returns userId and token
        // Map backend roles to frontend roles
        const roleMap: Record<string, "Super Admin" | "Admin" | "Billing User"> = {
          'ADMIN': 'Super Admin',
          'USER': 'Billing User',
        };
        
        // Since register response doesn't include full user data, we'll store minimal info
        // The user data will be fetched via getProfile when needed
        state.user = {
          id: action.payload.data.userId,
          name: "", // Will be populated when profile is fetched
          email: "", // Will be populated when profile is fetched
          password: "",
          role: 'Admin', // Default role
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("flora_token", action.payload.data.token);
          localStorage.setItem("flora_user", JSON.stringify(state.user));
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string || "Signup failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
