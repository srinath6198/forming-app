import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface State { dateFrom: string; dateTo: string; }
const initialState: State = { dateFrom: "", dateTo: "" };

const slice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setRange(state, a: PayloadAction<{ from: string; to: string }>) {
      state.dateFrom = a.payload.from;
      state.dateTo = a.payload.to;
    },
  },
});

export const { setRange } = slice.actions;
export default slice.reducer;