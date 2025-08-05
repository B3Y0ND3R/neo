import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/products/add",
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

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/products/get"
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData, imageFile, oldImageUrl }) => {
    // If there's a new image file, use the new endpoint that handles file uploads
    if (imageFile) {
      const formDataWithFile = new FormData();
      
      // Add the image file
      formDataWithFile.append('image', imageFile);
      
      // Add all other form data
      Object.keys(formData).forEach(key => {
        if (key !== 'image') { // Don't add image field since we're uploading file
          if (key === 'sizes') {
            // Serialize sizes object to JSON string
            formDataWithFile.append(key, JSON.stringify(formData[key]));
          } else {
            formDataWithFile.append(key, formData[key]);
          }
        }
      });
      
      // Add old image URL for deletion
      if (oldImageUrl) {
        formDataWithFile.append('oldImageUrl', oldImageUrl);
      }
      
      const result = await axios.put(
        `http://localhost:5000/api/admin/products/edit-with-image/${id}`,
        formDataWithFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      return result?.data;
    } else {
      // No new image, use the old endpoint
      const result = await axios.put(
        `http://localhost:5000/api/admin/products/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      return result?.data;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;