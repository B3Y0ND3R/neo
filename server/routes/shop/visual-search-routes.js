const express = require("express");
const router = express.Router();
const { searchSimilarProducts, extractFeaturesFromUrl } = require("../../controllers/shop/visual-search-controller");

// Visual search routes
router.post("/search-similar", searchSimilarProducts);
router.post("/extract-features", extractFeaturesFromUrl);

module.exports = router; 