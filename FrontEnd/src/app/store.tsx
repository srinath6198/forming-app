import { configureStore } from "@reduxjs/toolkit";
import auth from "@/redux/authSlice";
import products from "@/redux/productSlice";
import customers from "@/redux/customerSlice";
import suppliers from "@/redux/supplierSlice";
import billing from "@/redux/billingSlice";
import reports from "@/redux/reportSlice";

export const store = configureStore({
  reducer: { auth, products, customers, suppliers, billing, reports },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;