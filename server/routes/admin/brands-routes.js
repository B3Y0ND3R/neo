const express = require("express");
const {
  handleIconUpload,
  addBrand,
  editBrand,
  fetchAllBrands,
  deleteBrand,
} = require("../../controllers/admin/brands-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-icon", upload.single("my_file"), handleIconUpload);
router.post("/add", addBrand);
router.put("/edit/:id", editBrand);
router.delete("/delete/:id", deleteBrand);
router.get("/get", fetchAllBrands);

module.exports = router; 