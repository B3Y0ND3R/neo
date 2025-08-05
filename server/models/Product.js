const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    color: String,
    gender: String,
    featureVector: [Number], // Add feature vector field
    orderCount: { type: Number, default: 0 }, // Track number of times product was ordered
    sizes: {
      XS: { type: Number, default: 0 },
      S: { type: Number, default: 0 },
      M: { type: Number, default: 0 },
      L: { type: Number, default: 0 },
      XL: { type: Number, default: 0 },
      XXL: { type: Number, default: 0 }
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate total stock from sizes
ProductSchema.pre('save', function(next) {
  if (this.sizes) {
    this.totalStock = Object.values(this.sizes).reduce((sum, stock) => sum + stock, 0);
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);