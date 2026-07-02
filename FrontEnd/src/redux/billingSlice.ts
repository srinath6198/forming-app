import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import bills from "@/data/bills.json";
import type { Bill, BillItem } from "@/types";
import { loadJson, saveJson } from "@/utils/persist";

interface State {
  cart: BillItem[];
  bills: Bill[];
  customer: string;
  payment: "Cash" | "UPI" | "Card";
  globalDiscount: number;
}

const initialState: State = {
  cart: [],
  bills: loadJson("flora_bills", bills as Bill[]),
  customer: "",
  payment: "Cash",
  globalDiscount: 0,
};

const slice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    addToCart(state, a: PayloadAction<BillItem>) {
      const exists = state.cart.find((i) => i.productId === a.payload.productId);
      if (exists) exists.quantity += 1;
      else state.cart.push(a.payload);
      state.cart.forEach(recalc);
    },
    updateQty(state, a: PayloadAction<{ id: string; qty: number }>) {
      const it = state.cart.find((i) => i.productId === a.payload.id);
      if (it) { it.quantity = Math.max(1, a.payload.qty); recalc(it); }
    },
    removeItem(state, a: PayloadAction<string>) {
      state.cart = state.cart.filter((i) => i.productId !== a.payload);
    },
    clearCart(state) { state.cart = []; },
    setCustomer(state, a: PayloadAction<string>) { state.customer = a.payload; },
    setPayment(state, a: PayloadAction<"Cash" | "UPI" | "Card">) { state.payment = a.payload; },
    setDiscount(state, a: PayloadAction<number>) { state.globalDiscount = a.payload; },
    saveBill(state, a: PayloadAction<Bill>) {
      state.bills.unshift(a.payload);
      state.cart = [];
      saveJson("flora_bills", state.bills);
    },
  },
});

function recalc(it: BillItem) {
  const base = it.price * it.quantity;
  const disc = (base * it.discount) / 100;
  const taxed = base - disc;
  const gst = (taxed * it.gst) / 100;
  it.total = +(taxed + gst).toFixed(2);
}

export const { addToCart, updateQty, removeItem, clearCart, setCustomer, setPayment, setDiscount, saveBill } = slice.actions;
export default slice.reducer;