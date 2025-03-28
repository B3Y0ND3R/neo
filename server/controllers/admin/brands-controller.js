const Brand = require("../../models/Brand");
const { imageUploadUtil } = require("../../helpers/cloudinary");

const handleIconUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
};

const addBrand = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    const newBrand = new Brand({
      name,
      icon,
      description,
    });

    await newBrand.save();
    res.status(201).json({
      success: true,
      data: newBrand,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const fetchAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const editBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description } = req.body;

    let brand = await Brand.findById(id);
    if (!brand)
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });

    brand.name = name || brand.name;
    brand.icon = icon || brand.icon;
    brand.description = description || brand.description;

    await brand.save();
    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand)
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = {
  handleIconUpload,
  addBrand,
  fetchAllBrands,
  editBrand,
  deleteBrand,
}; 