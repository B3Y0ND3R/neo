import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  brandList: [],
};

export const addNewBrand = createAsyncThunk(
  "/brands/addnewbrand",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/brands/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllBrands = createAsyncThunk(
  "/brands/fetchAllBrands",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/brands/get"
    );

    return result?.data;
  }
);

export const editBrand = createAsyncThunk(
  "/brands/editBrand",
  async ({ id, formData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/brands/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteBrand = createAsyncThunk(
  "/brands/deleteBrand",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/brands/delete/${id}`
    );

    return result?.data;
  }
);

const AdminBrandsSlice = createSlice({
  name: "adminBrands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = action.payload.data;
      })
      .addCase(fetchAllBrands.rejected, (state) => {
        state.isLoading = false;
        state.brandList = [];
      });
  },
});

export default AdminBrandsSlice.reducer; 