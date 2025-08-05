const cloudinary = require('cloudinary').v2;
const Product = require("../../models/Product");
const axios = require('axios');

// FastAPI service URL for feature vector generation
const FASTAPI_URL = "https://23a7497865b6.ngrok-free.app";

// Function to generate feature vector for an image
const generateFeatureVector = async (imageUrl) => {
  try {
    // Validate image URL
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.log(`❌ Invalid image URL: ${imageUrl}`);
      return null;
    }

    // Check if it's a Cloudinary URL (should be for admin uploads)
    if (!imageUrl.includes('cloudinary.com')) {
      console.log(`⚠️  Warning: Image URL is not from Cloudinary: ${imageUrl}`);
    }

    console.log(`🔍 Generating feature vector for image: ${imageUrl}`);
    console.log(`🌐 FastAPI URL: ${FASTAPI_URL}/extract-vector-from-url?url=${encodeURIComponent(imageUrl)}`);
    
    const response = await axios.get(`${FASTAPI_URL}/extract-vector-from-url?url=${encodeURIComponent(imageUrl)}`, {
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Node.js/AdminProduct'
      }
    });
    
    if (response.data && response.data.vector) {
      console.log(`✅ Feature vector generated successfully. Length: ${response.data.vector.length}`);
      console.log(`📊 First 5 values: [${response.data.vector.slice(0, 5).join(', ')}]`);
      return response.data.vector;
    } else {
      console.log(`❌ No vector in response:`, response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Feature vector generation failed:', error.response?.data || error.message);
    console.error('❌ Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return null;
  }
};

const handleImageUpload = async (req, res) => {
  try {
    // If there's an old image, delete it first
    if (req.body.oldImageUrl) {
      try {
        // Extract public_id from URL (e.g., from "...cloudinary.com/your-cloud/image/upload/v1234567890/products/abc123" get "products/abc123")
        const urlParts = req.body.oldImageUrl.split('/');
        const publicId = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1].split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error('Error deleting old image:', deleteError);
      }
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Generate a unique filename using timestamp
    const uniqueFilename = `product_${Date.now()}`;

    // Upload new image with unique filename and overwrite option
    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: uniqueFilename,
      folder: 'products',
      overwrite: true,
      resource_type: 'auto'
    });

    res.json({
      success: true,
      result: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      color,
      gender,
      sizes,
    } = req.body;

    console.log(averageReview, "averageReview");

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      color,
      gender,
      sizes,
    });

    await newlyCreatedProduct.save();
    
    // Verify sizes were saved
    console.log(`✅ Product created successfully: ${newlyCreatedProduct._id}`);
    console.log(`📦 Sizes provided:`, sizes);
    console.log(`📦 Sizes saved:`, newlyCreatedProduct.sizes);

    // Generate feature vector for the product image
    if (image && typeof image === 'string' && image.trim() !== '') {
      try {
        console.log(`🔍 Generating feature vector for new product: ${newlyCreatedProduct._id}`);
        console.log(`📦 Product title: ${title}`);
        console.log(`🖼️  Image URL: ${image}`);
        console.log(`🔗 URL type: ${image.startsWith('http') ? 'Valid HTTP URL' : 'Invalid URL'}`);
        
        const featureVector = await generateFeatureVector(image);
        
        if (featureVector) {
          // Update the product with the feature vector
          await Product.findByIdAndUpdate(newlyCreatedProduct._id, {
            featureVector: featureVector
          });
          console.log(`✅ Feature vector generated and saved for product: ${newlyCreatedProduct._id}`);
          console.log(`📊 Vector length: ${featureVector.length}`);
        } else {
          console.log(`❌ Failed to generate feature vector for product: ${newlyCreatedProduct._id}`);
          console.log(`⚠️  Product created but without feature vector - visual search won't work for this product`);
        }
      } catch (featureError) {
        console.error('❌ Error generating feature vector:', featureError);
        console.log(`⚠️  Product created but feature vector generation failed - visual search won't work for this product`);
        // Don't fail the product creation if feature vector generation fails
      }
    } else {
      console.log(`⚠️  No valid image URL provided for product: ${newlyCreatedProduct._id}`);
      console.log(`⚠️  Product created but without feature vector - visual search won't work for this product`);
    }

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      color,
      gender,
      sizes,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;
    findProduct.color = color || findProduct.color;
    findProduct.gender = gender || findProduct.gender;
    findProduct.sizes = sizes || findProduct.sizes;

    // Check if image has changed and generate new feature vector
    const oldImage = findProduct.image;
    const imageChanged = image && typeof image === 'string' && image.trim() !== '' && image !== oldImage;
    
    console.log(`🔍 Image change detection for product: ${id}`);
    console.log(`🖼️  Old image: ${oldImage}`);
    console.log(`🖼️  New image: ${image}`);
    console.log(`🔄 Image changed: ${imageChanged}`);
    console.log(`🔍 Comparison details:`);
    console.log(`  - image exists: ${!!image}`);
    console.log(`  - image is string: ${typeof image === 'string'}`);
    console.log(`  - image not empty: ${image && image.trim() !== ''}`);
    console.log(`  - images different: ${image !== oldImage}`);
    console.log(`  - old image length: ${oldImage ? oldImage.length : 0}`);
    console.log(`  - new image length: ${image ? image.length : 0}`);
    
    if (imageChanged) {
      try {
        console.log(`🔍 Image changed, generating new feature vector for product: ${id}`);
        console.log(`📦 Product title: ${title}`);
        console.log(`🔗 URL type: ${image.startsWith('http') ? 'Valid HTTP URL' : 'Invalid URL'}`);
        
        const featureVector = await generateFeatureVector(image);
        
        if (featureVector) {
          findProduct.featureVector = featureVector;
          console.log(`✅ New feature vector generated and saved for product: ${id}`);
          console.log(`📊 Vector length: ${featureVector.length}`);
          console.log(`📊 Vector first 5 values: [${featureVector.slice(0, 5).join(', ')}]`);
        } else {
          console.log(`❌ Failed to generate new feature vector for product: ${id}`);
          console.log(`⚠️  Product updated but feature vector generation failed - visual search may not work properly`);
        }
      } catch (featureError) {
        console.error('❌ Error generating feature vector for updated product:', featureError);
        console.log(`⚠️  Product updated but feature vector generation failed - visual search may not work properly`);
        // Don't fail the product update if feature vector generation fails
      }
    } else if (image && typeof image === 'string' && image.trim() !== '') {
      console.log(`ℹ️  Image unchanged for product: ${id}`);
    } else {
      console.log(`⚠️  No valid image URL provided for product update: ${id}`);
    }

    await findProduct.save();
    
    // Verify the feature vector was saved
    const savedProduct = await Product.findById(id);
    console.log(`✅ Product saved successfully: ${id}`);
    console.log(`📊 Feature vector saved: ${savedProduct.featureVector ? 'Yes' : 'No'}`);
    console.log(`📊 Feature vector length: ${savedProduct.featureVector ? savedProduct.featureVector.length : 0}`);
    
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Regenerate feature vectors for products that don't have them
const regenerateFeatureVectors = async (req, res) => {
  try {
    console.log('🔧 Starting feature vector regeneration...');
    
    // Find products without feature vectors
    const productsWithoutVectors = await Product.find({
      $or: [
        { featureVector: { $exists: false } },
        { featureVector: null },
        { featureVector: { $size: 0 } }
      ]
    });
    
    console.log(`📊 Found ${productsWithoutVectors.length} products without feature vectors`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < productsWithoutVectors.length; i++) {
      const product = productsWithoutVectors[i];
      console.log(`\n[${i + 1}/${productsWithoutVectors.length}] Processing: ${product.title}`);
      
      if (!product.image) {
        console.log(`⚠️  No image for product: ${product.title}`);
        failCount++;
        continue;
      }
      
      try {
        const featureVector = await generateFeatureVector(product.image);
        
        if (featureVector) {
          await Product.findByIdAndUpdate(product._id, {
            featureVector: featureVector
          });
          console.log(`✅ Feature vector generated for: ${product.title}`);
          successCount++;
        } else {
          console.log(`❌ Failed to generate feature vector for: ${product.title}`);
          failCount++;
        }
        
        // Add delay to avoid overwhelming the FastAPI service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${product.title}:`, error.message);
        failCount++;
      }
    }
    
    console.log(`\n🎉 Feature vector regeneration completed!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    
    res.json({
      success: true,
      message: `Feature vector regeneration completed. Success: ${successCount}, Failed: ${failCount}`,
      data: {
        total: productsWithoutVectors.length,
        success: successCount,
        failed: failCount
      }
    });
    
  } catch (error) {
    console.error('❌ Error in regenerateFeatureVectors:', error);
    res.status(500).json({
      success: false,
      message: "Error regenerating feature vectors",
      error: error.message
    });
  }
};

// Edit product with image upload (handles both image upload and product update)
const editProductWithImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔧 Editing product with image upload: ${id}`);
    console.log(`📦 Request body:`, req.body);
    console.log(`📁 File uploaded:`, req.file ? 'Yes' : 'No');
    
    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      color,
      gender,
      sizes,
      oldImageUrl, // For deleting old image
    } = req.body;

    console.log(`🔧 Editing product with image upload: ${id}`);
    console.log(`📦 Received form data:`, {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      color,
      gender,
      sizes: typeof sizes === 'string' ? `[String: ${sizes}]` : sizes,
      oldImageUrl
    });

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Handle image upload if new image is provided
    let newImageUrl = null;
    if (req.file) {
      console.log(`📤 New image uploaded, processing...`);
      
      // Delete old image if it exists
      if (oldImageUrl) {
        try {
          const urlParts = oldImageUrl.split('/');
          const publicId = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1].split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
          console.log(`🗑️  Old image deleted: ${oldImageUrl}`);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }
      }

      // Upload new image to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uniqueFilename = `product_${Date.now()}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        public_id: uniqueFilename,
        folder: 'products',
        overwrite: true,
        resource_type: 'auto'
      });

      newImageUrl = result.secure_url;
      console.log(`✅ New image uploaded to Cloudinary: ${newImageUrl}`);
    }

    // Update product fields
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.averageReview = averageReview || findProduct.averageReview;
    findProduct.color = color || findProduct.color;
    findProduct.gender = gender || findProduct.gender;
    
    // Handle sizes field properly (it might come as a string from FormData)
    if (sizes) {
      try {
        // If sizes is a string, try to parse it as JSON
        if (typeof sizes === 'string') {
          findProduct.sizes = JSON.parse(sizes);
        } else {
          findProduct.sizes = sizes;
        }
      } catch (parseError) {
        console.log(`⚠️  Could not parse sizes field: ${sizes}, keeping existing sizes`);
        // Keep existing sizes if parsing fails
      }
    }

    // Update image if new one was uploaded
    if (newImageUrl) {
      findProduct.image = newImageUrl;
    }

    // Generate new feature vector if image changed
    if (newImageUrl) {
      try {
        console.log(`🔍 Generating new feature vector for updated image: ${newImageUrl}`);
        
        const featureVector = await generateFeatureVector(newImageUrl);
        
        if (featureVector) {
          findProduct.featureVector = featureVector;
          console.log(`✅ New feature vector generated and saved for product: ${id}`);
          console.log(`📊 Vector length: ${featureVector.length}`);
          console.log(`📊 Vector first 5 values: [${featureVector.slice(0, 5).join(', ')}]`);
        } else {
          console.log(`❌ Failed to generate new feature vector for product: ${id}`);
          console.log(`⚠️  Product updated but feature vector generation failed - visual search may not work properly`);
        }
      } catch (featureError) {
        console.error('❌ Error generating feature vector for updated product:', featureError);
        console.log(`⚠️  Product updated but feature vector generation failed - visual search may not work properly`);
      }
    }

    await findProduct.save();
    
    // Verify the feature vector was saved
    const savedProduct = await Product.findById(id);
    console.log(`✅ Product saved successfully: ${id}`);
    console.log(`📊 Feature vector saved: ${savedProduct.featureVector ? 'Yes' : 'No'}`);
    console.log(`📊 Feature vector length: ${savedProduct.featureVector ? savedProduct.featureVector.length : 0}`);
    
    res.status(200).json({
      success: true,
      data: findProduct,
      message: newImageUrl ? "Product updated with new image and feature vector" : "Product updated"
    });

  } catch (error) {
    console.error('❌ Error in editProductWithImage:', error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message
    });
  }
};

// Force update feature vector for a product (debug endpoint)
const forceUpdateFeatureVector = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    if (!product.image) {
      return res.status(400).json({
        success: false,
        message: "Product has no image"
      });
    }
    
    console.log(`🔧 Force updating feature vector for product: ${id}`);
    console.log(`📦 Product: ${product.title}`);
    console.log(`🖼️  Image: ${product.image}`);
    
    const featureVector = await generateFeatureVector(product.image);
    
    if (featureVector) {
      await Product.findByIdAndUpdate(id, {
        featureVector: featureVector
      });
      
      console.log(`✅ Feature vector force updated for product: ${id}`);
      console.log(`📊 Vector length: ${featureVector.length}`);
      
      res.json({
        success: true,
        message: `Feature vector updated for product: ${product.title}`,
        vectorLength: featureVector.length
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to generate feature vector"
      });
    }
    
  } catch (error) {
    console.error('❌ Error in forceUpdateFeatureVector:', error);
    res.status(500).json({
      success: false,
      message: "Error updating feature vector",
      error: error.message
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  editProductWithImage,
  deleteProduct,
  regenerateFeatureVectors,
  forceUpdateFeatureVector,
};