import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Customer } from "@/types";
import { customerService } from "@/services/customer.service";

interface CustomerState {
  items: Customer[];
  query: string;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  items: [],
  query: "",
  loading: false,
  error: null,
};

// Create async thunk for getting all customers
export const getAllCustomers = createAsyncThunk(
  "customers/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customers");
    }
  }
);

// Create async thunk for getting active customers
export const getActiveCustomers = createAsyncThunk(
  "customers/getActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.getActive();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch active customers");
    }
  }
);

// Create async thunk for getting customer by ID
export const getCustomerById = createAsyncThunk(
  "customers/getById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await customerService.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customer");
    }
  }
);

// Create async thunk for searching customers
export const searchCustomers = createAsyncThunk(
  "customers/search",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await customerService.search(query);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to search customers");
    }
  }
);

// Create async thunk for creating customer
export const createCustomer = createAsyncThunk(
  "customers/create",
  async (customerData: { customer_name: string; phone: string; [key: string]: any }, { rejectWithValue }) => {
    try {
      const response = await customerService.create(customerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create customer");
    }
  }
);

// Create async thunk for updating customer
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }: { id: number; data: { [key: string]: any } }, { rejectWithValue }) => {
    try {
      const response = await customerService.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update customer");
    }
  }
);

// Create async thunk for deleting customer
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await customerService.delete(id);
      return { id, message: response.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete customer");
    }
  }
);

// Create async thunk for permanently deleting customer
export const permanentDeleteCustomer = createAsyncThunk(
  "customers/permanentDelete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await customerService.permanentDelete(id);
      return { id, message: response.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to permanently delete customer");
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setQuery(state, action: { payload: string }) {
      state.query = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GetAll handlers
      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch customers";
      })
      // GetActive handlers
      .addCase(getActiveCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(getActiveCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch active customers";
      })
      // GetById handlers
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        state.error = null;
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch customer";
      })
      // Search handlers
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to search customers";
      })
      // Create handlers
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to create customer";
      })
      // Update handlers
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to update customer";
      })
      // Delete handlers
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload.id);
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to delete customer";
      })
      // PermanentDelete handlers
      .addCase(permanentDeleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(permanentDeleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload.id);
        state.error = null;
      })
      .addCase(permanentDeleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to permanently delete customer";
      });
  },
});

export const { setQuery, clearError } = customerSlice.actions;
export default customerSlice.reducer;