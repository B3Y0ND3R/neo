const Product = require("../../models/Product");
const axios = require('axios');

// FastAPI service URL
const FASTAPI_URL = "https://23a7497865b6.ngrok-free.app";

// Cosine similarity function
const cosineSimilarity = (vectorA, vectorB) => {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB) || vectorA.length !== vectorB.length) {
    console.log(`❌ Vector validation failed: A=${vectorA?.length}, B=${vectorB?.length}`);
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    console.log(`❌ Zero norm detected: A=${normA}, B=${normB}`);
    return 0;
  }

  const similarity = dotProduct / (normA * normB);
  
  // Debug: Show detailed calculation for first few comparisons
  if (Math.random() < 0.1) { // Only show 10% of calculations to avoid spam
    console.log(`🔍 Detailed similarity calculation:`);
    console.log(`  - Vector A length: ${vectorA.length}`);
    console.log(`  - Vector B length: ${vectorB.length}`);
    console.log(`  - First 3 values A: [${vectorA.slice(0, 3).join(', ')}]`);
    console.log(`  - First 3 values B: [${vectorB.slice(0, 3).join(', ')}]`);
    console.log(`  - Dot product: ${dotProduct}`);
    console.log(`  - Norm A: ${normA}`);
    console.log(`  - Norm B: ${normB}`);
    console.log(`  - Similarity: ${similarity}`);
  }
  
  return similarity;
};

// Extract feature vector from image URL using FastAPI
const extractFeatureVector = async (imageUrl) => {
  try {
    console.log(`🔍 Extracting features from: ${imageUrl}`);
    
    const response = await axios.get(`${FASTAPI_URL}/extract-vector-from-url?url=${encodeURIComponent(imageUrl)}`, {
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Node.js/VisualSearch'
      }
    });

    if (response.data && response.data.vector) {
      console.log(`✅ Feature vector extracted successfully. Length: ${response.data.vector.length}`);
      console.log(`📊 FastAPI vector first 10: [${response.data.vector.slice(0, 10).join(', ')}]`);
      return response.data.vector;
    } else {
      console.log(`❌ No vector in response:`, response.data);
      return null;
    }
  } catch (error) {
    console.error(`❌ Feature extraction failed:`, error.response?.data || error.message);
    return null;
  }
};

// Search for similar products
const searchSimilarProducts = async (req, res) => {
  try {
    const { featureVector, limit = 4 } = req.body;

    if (!featureVector || !Array.isArray(featureVector)) {
      return res.status(400).json({
        success: false,
        message: "Feature vector is required and must be an array"
      });
    }

    console.log(`🔍 Searching for products similar to vector of length: ${featureVector.length}`);
    console.log(`📊 First 10 values of search vector: [${featureVector.slice(0, 10).join(', ')}]`);

    // Get all products with feature vectors
    const products = await Product.find({
      featureVector: { $exists: true, $ne: null, $ne: [] }
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products with feature vectors found"
      });
    }

    // Calculate similarity for each product
    console.log(`\n🔍 CALCULATING SIMILARITY FOR ${products.length} PRODUCTS...`);
    const productsWithSimilarity = products.map(product => {
      console.log(`\n📦 Comparing with "${product.title}":`);
      console.log(`📊 MongoDB vector first 10: [${product.featureVector.slice(0, 10).join(', ')}]`);
      
      const similarity = cosineSimilarity(featureVector, product.featureVector);
      console.log(`🔍 Similarity: ${similarity} (${Math.round(similarity * 100)}%)`);
      
      return {
        ...product.toObject(),
        similarity_score: similarity
      };
    });

    // Sort by similarity (highest first) and take top results
    console.log(`\n📊 SORTING BY SIMILARITY...`);
    const sortedProducts = productsWithSimilarity
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);

    console.log(`✅ TOP ${sortedProducts.length} SIMILAR PRODUCTS:`);
    sortedProducts.forEach((product, index) => {
      console.log(`${index + 1}. "${product.title}": ${Math.round(product.similarity_score * 100)}% match`);
    });

    // Debug: Show all similarities
    console.log(`\n📊 ALL PRODUCT SIMILARITIES:`);
    productsWithSimilarity
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .forEach((product, index) => {
        console.log(`${index + 1}. "${product.title}": ${Math.round(product.similarity_score * 100)}% match`);
      });

    res.json({
      success: true,
      products: sortedProducts
    });

  } catch (error) {
    console.error('Error in searchSimilarProducts:', error);
    res.status(500).json({
      success: false,
      message: "Error searching for similar products",
      error: error.message
    });
  }
};

// Extract features from image URL (backend proxy to avoid CORS)
const extractFeaturesFromUrl = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required"
      });
    }

    console.log(`🔍 Backend extracting features from: ${imageUrl}`);

    const featureVector = await extractFeatureVector(imageUrl);

    if (featureVector) {
      res.json({
        success: true,
        vector: featureVector,
        message: `Successfully extracted ${featureVector.length} features`
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to extract features from image"
      });
    }

  } catch (error) {
    console.error('Error in extractFeaturesFromUrl:', error);
    res.status(500).json({
      success: false,
      message: "Error extracting features",
      error: error.message
    });
  }
};

module.exports = {
  searchSimilarProducts,
  extractFeaturesFromUrl
}; 