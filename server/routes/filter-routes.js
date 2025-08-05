const express = require("express");
const router = express.Router();
const {
  getAllFilters,
  addFilter,
  deleteFilter,
} = require("../controllers/filters-controller");

router.get("/admin/filters", getAllFilters);
router.post("/admin/filters", addFilter);
router.delete("/admin/filters/:id", deleteFilter);

module.exports = router;
