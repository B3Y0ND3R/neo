const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
      size: String, // Add size information
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "in_process", "delivered", "cancelled"],
    default: "pending"
  },
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
  refundStatus: {
    type: String,
    enum: ["not_requested", "requested", "refunded"],
    default: "not_requested"
  },
          refundDate: Date,
        refundTransactionId: String,
});

module.exports = mongoose.model("Order", OrderSchema);