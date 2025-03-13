const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");
const { imageUploadUtil } = require("../../helpers/cloudinary");
const jwt = require("jsonwebtoken");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;
    let reviewImages = [];

    // Handle image uploads if present
    if (req.files && req.files.length > 0) {
      // Upload each image to cloudinary
      const uploadPromises = req.files.map(file => {
        const dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return imageUploadUtil(dataURI);
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      reviewImages = uploadResults.map(result => result.url);
    }

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
      reviewImages,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
      error: e.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    // First find and delete the review
    const review = await ProductReview.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: "Review not found" 
      });
    }

    // Update product's average review
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    
    let averageReview = 0;
    if (totalReviewsLength > 0) {
      averageReview = reviews.reduce((sum, review) => sum + review.reviewValue, 0) / totalReviewsLength;
    }

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviewId: reviewId
    });

  } catch (error) {
    console.error("Error in deleteProductReview:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews,
  deleteProductReview
};