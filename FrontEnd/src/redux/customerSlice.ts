import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import data from "@/data/customers.json";
import type { Customer } from "@/types";
import { loadJson, saveJson } from "@/utils/persist";

interface State { items: Customer[]; query: string; }
const initialState: State = { items: loadJson("flora_customers", data as Customer[]), query: "" };

const slice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer(state, a: PayloadAction<Customer>) { state.items.push(a.payload); saveJson("flora_customers", state.items); },
    updateCustomer(state, a: PayloadAction<Customer>) {
      const i = state.items.findIndex((c) => c.id === a.payload.id);
      if (i >= 0) state.items[i] = a.payload;
      saveJson("flora_customers", state.items);
    },
    deleteCustomer(state, a: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== a.payload);
      saveJson("flora_customers", state.items);
    },
    setQuery(state, a: PayloadAction<string>) { state.query = a.payload; },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer, setQuery } = slice.actions;
export default slice.reducer;