const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dyflxdxju",
  api_key: "131239537475537",
  api_secret: "c-TAmvTzsHpX5wQIeAQ1zYl-RE8",
});

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const imageUploadUtil = async (dataURI) => {
  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'products',
      resource_type: 'auto',
      overwrite: true
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

module.exports = {
  upload,
  imageUploadUtil,
  cloudinary
};