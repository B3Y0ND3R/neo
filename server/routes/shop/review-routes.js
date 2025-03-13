const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const {
  addProductReview,
  getProductReviews,
  deleteProductReview
} = require("../../controllers/shop/product-review-controller");


const router = express.Router();

router.post("/add", upload.array('reviewImages', 5), addProductReview);
router.get("/:productId", getProductReviews);
router.delete("/:productId/:reviewId", deleteProductReview);

module.exports = router;