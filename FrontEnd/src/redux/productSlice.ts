import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import data from "@/data/products.json";
import type { Product } from "@/types";
import { loadJson, saveJson } from "@/utils/persist";

interface State { items: Product[]; query: string; }
const initialState: State = { items: loadJson("flora_products", data as Product[]), query: "" };

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, a: PayloadAction<Product>) { state.items.push(a.payload); saveJson("flora_products", state.items); },
    updateProduct(state, a: PayloadAction<Product>) {
      const i = state.items.findIndex((p) => p.id === a.payload.id);
      if (i >= 0) state.items[i] = a.payload;
      saveJson("flora_products", state.items);
    },
    deleteProduct(state, a: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== a.payload);
      saveJson("flora_products", state.items);
    },
    setQuery(state, a: PayloadAction<string>) { state.query = a.payload; },
  },
});

export const { addProduct, updateProduct, deleteProduct, setQuery } = slice.actions;
export default slice.reducer;