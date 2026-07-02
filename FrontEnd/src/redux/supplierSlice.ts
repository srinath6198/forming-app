import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import data from "@/data/suppliers.json";
import type { Supplier } from "@/types";
import { loadJson, saveJson } from "@/utils/persist";

interface State { items: Supplier[]; query: string; }
const initialState: State = { items: loadJson("flora_suppliers", data as Supplier[]), query: "" };

const slice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    addSupplier(state, a: PayloadAction<Supplier>) { state.items.push(a.payload); saveJson("flora_suppliers", state.items); },
    updateSupplier(state, a: PayloadAction<Supplier>) {
      const i = state.items.findIndex((s) => s.id === a.payload.id);
      if (i >= 0) state.items[i] = a.payload;
      saveJson("flora_suppliers", state.items);
    },
    deleteSupplier(state, a: PayloadAction<string>) {
      state.items = state.items.filter((s) => s.id !== a.payload);
      saveJson("flora_suppliers", state.items);
    },
    setQuery(state, a: PayloadAction<string>) { state.query = a.payload; },
  },
});

export const { addSupplier, updateSupplier, deleteSupplier, setQuery } = slice.actions;
export default slice.reducer;