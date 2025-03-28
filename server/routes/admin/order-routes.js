const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
  deleteOrdersOlderThan30Days,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.delete("/:id", deleteOrder); // Route for deleting an individual order
router.delete("/delete-old", deleteOrdersOlderThan30Days);

module.exports = router;