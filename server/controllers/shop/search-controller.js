const Product = require("../../models/Product");
const Brand = require("../../models/Brand"); // dynamic brands

const genderValues = ["men", "women", "kids"];
const categories = ["shirt", "jeans", "jacket", "shorts", "hoodie", "tshirt"]; // include tshirt here too
const colors = ["red", "blue", "black", "white", "green", "yellow", "purple", "pink", "gray", "brown", "orange", "gold", "silver", "beige", "turquoise", "coral", "lime", "teal", "navy", "maroon", "olive"];

const parseNaturalQuery = async (text) => {
  const keyword = text.toLowerCase();
  const filters = {};

  // Fetch all brands dynamically and lowercase their names
  const allBrands = await Brand.find({}, "name").lean();
  const brandNames = allBrands.map((b) => b.name.toLowerCase());

  // Detect brands in query
  const detectedBrands = brandNames.filter((brand) => keyword.includes(brand));
  if (detectedBrands.length > 0) {
    filters.brand = { $in: detectedBrands };
  }

  // Detect colors
  const detectedColors = colors.filter((color) => keyword.includes(color));
  if (detectedColors.length > 0) {
    filters.color = { $in: detectedColors };
  }

  // Detect genders
  const detectedGenders = genderValues.filter(g =>
    new RegExp(`\\b${g}\\b`, 'i').test(keyword)  // exact word match ignoring case
  );
  
  if (detectedGenders.length > 0) {
    filters.gender = { $in: detectedGenders };
  }
  

  // Detect categories
  const detectedCategories = categories.filter((cat) => keyword.includes(cat));
  if (detectedCategories.length > 0) {
    filters.category = { $in: detectedCategories };
  }

  // Price constraints
  const priceRegex = /(?:under|below|less than|less)\s*(\d+)|(?:over|above|greater than|more than)\s*(\d+)/g;

  let match;
  while ((match = priceRegex.exec(keyword)) !== null) {
    if (match[1]) {
      filters.price = { ...filters.price, $lte: Number(match[1]) };
    }
    if (match[2]) {
      filters.price = { ...filters.price, $gte: Number(match[2]) };
    }
  }

  return filters;
};

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword must be a non-empty string",
      });
    }

    const filters = await parseNaturalQuery(keyword);

    const textRegex = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { color: { $regex: keyword, $options: "i" } },
        { gender: { $regex: keyword, $options: "i" } },
      ],
    };

    let finalQuery;

    if (Object.keys(filters).length > 0) {
      // Use filters alone if any filter detected (avoid over-restrictive regex)
      finalQuery = filters;
    } else {
      // Use fallback regex OR search only if no filters
      finalQuery = textRegex;
    }

    console.log("Filters:", filters);
    console.log("Final MongoDB Query:", JSON.stringify(finalQuery, null, 2));

    const products = await Product.find(finalQuery);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = { searchProducts };
