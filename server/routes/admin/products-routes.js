const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  editProductWithImage,
  fetchAllProducts,
  deleteProduct,
  regenerateFeatureVectors,
  forceUpdateFeatureVector,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.put("/edit-with-image/:id", upload.single("image"), editProductWithImage);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
router.post("/regenerate-feature-vectors", regenerateFeatureVectors);
router.post("/force-update-feature-vector/:id", forceUpdateFeatureVector);

module.exports = router;