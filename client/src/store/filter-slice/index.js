import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api"; // or use import.meta.env.VITE_API_URL

export const fetchFilters = createAsyncThunk("filters/fetch", async () => {
  const res = await axios.get(`${API}/admin/filters`, { withCredentials: true });
  return res.data.data;
});

export const addFilter = createAsyncThunk("filters/add", async (payload) => {
  const res = await axios.post(`${API}/admin/filters`, payload, { withCredentials: true });
  return res.data.data;
});

export const deleteFilter = createAsyncThunk("filters/delete", async (id) => {
  await axios.delete(`${API}/admin/filters/${id}`, { withCredentials: true });
  return id;
});


const filterSlice = createSlice({
  name: "filter",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addFilter.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteFilter.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f._id !== action.payload);
      });
  },
});

export default filterSlice.reducer;
