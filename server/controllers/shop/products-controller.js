const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { gender = [], brand = [], color = [], category = [], rating = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (gender.length) {
      filters.gender = { $in: gender.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }
    
    if (color.length) {
        filters.color = {
          $in: color.split(",").map((c) => new RegExp(`^${c}$`, "i")),
        };
    }

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (rating.length) {
      const ratingValues = rating.split(",").map(Number);
      // Filter products where averageReview falls within the selected rating ranges
      // For example, if rating is 3, it should match products with averageReview >= 3 and < 4
      const ratingConditions = ratingValues.map(ratingValue => ({
        averageReview: { $gte: ratingValue, $lt: ratingValue + 1 }
      }));
      filters.$or = ratingConditions;
    }

    const { price } = req.query;

if (price) {
  const [min, max] = price.split(",").map(Number);
  if (!isNaN(min) && !isNaN(max)) {
    filters.price = { $gte: min, $lte: max };
  }
}


    let sort = {};

    switch (sortBy) {
      case "popular":
        sort.orderCount = -1; // Sort by order count descending (most popular first)
        break;
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }


    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };