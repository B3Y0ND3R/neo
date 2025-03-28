import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  reviews: [],
  isLoading: false,
};

export const adminDeleteReview = createAsyncThunk(
  "adminReview/deleteReview",
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

const adminReviewSlice = createSlice({
  name: "adminReview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminDeleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminDeleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.reviews = state.reviews.filter(
            review => review._id !== action.payload.reviewId
          );
        }
      })
      .addCase(adminDeleteReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminReviewSlice.reducer; 