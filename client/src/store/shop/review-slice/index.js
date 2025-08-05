import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formData) => {
    try {
      // Create a new FormData object
      const data = new FormData();
      data.append("productId", formData.productId);
      data.append("userId", formData.userId);
      data.append("userName", formData.userName);
      data.append("reviewMessage", formData.reviewMessage);
      data.append("reviewValue", formData.reviewValue);
      
      // Append images if they exist
      if (formData.reviewImages && formData.reviewImages.length > 0) {
        formData.reviewImages.forEach((image) => {
          data.append("reviewImages", image);
        });
      }

      const response = await axios.post(
        `http://localhost:5000/api/shop/review/add`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add review');
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (productId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/review/${productId}`
    );
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  "shopReview/deleteReview",
  async ({ productId, reviewId }) => {
    const result = await axios.delete(
      `http://localhost:5000/api/shop/review/${productId}/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return result.data;
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.reviews = state.reviews.filter(
            review => review._id !== action.payload.reviewId
          );
        }
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.reviews.push(action.payload.data);
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reviewSlice.reducer;