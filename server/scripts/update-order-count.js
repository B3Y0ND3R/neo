const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahsanulhasib2:hasib&abid@cluster0.gdn8u.mongodb.net/';

async function calculateAndUpdateOrderCount() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📊 Calculating order counts from existing orders...');
    
    // Get all confirmed/paid orders
    const orders = await Order.find({
      $or: [
        { orderStatus: 'confirmed' },
        { orderStatus: 'delivered' },
        { paymentStatus: 'paid' }
      ]
    });

    console.log(`📦 Found ${orders.length} confirmed orders to process`);

    // Calculate order count for each product
    const productOrderCounts = {};

    orders.forEach(order => {
      order.cartItems.forEach(item => {
        const productId = item.productId;
        if (productOrderCounts[productId]) {
          productOrderCounts[productId]++;
        } else {
          productOrderCounts[productId] = 1;
        }
      });
    });

    console.log(`📈 Calculated order counts for ${Object.keys(productOrderCounts).length} products`);

    // Update each product with its calculated order count
    let updatedCount = 0;
    for (const [productId, orderCount] of Object.entries(productOrderCounts)) {
      try {
        await Product.findByIdAndUpdate(productId, { orderCount });
        updatedCount++;
        console.log(`✅ Updated product ${productId} with order count: ${orderCount}`);
      } catch (error) {
        console.error(`❌ Failed to update product ${productId}:`, error.message);
      }
    }

    // Set orderCount to 0 for products that have never been ordered
    const productsWithOrders = Object.keys(productOrderCounts);
    const result = await Product.updateMany(
      { 
        _id: { $nin: productsWithOrders },
        orderCount: { $exists: false }
      },
      { $set: { orderCount: 0 } }
    );

    console.log(`✅ Set orderCount to 0 for ${result.modifiedCount} products with no orders`);
    console.log(`✅ Updated ${updatedCount} products with their actual order counts`);
    
    // Verify the results
    const totalProducts = await Product.countDocuments();
    const productsWithOrderCount = await Product.countDocuments({ orderCount: { $exists: true } });
    
    console.log(`📊 Total products: ${totalProducts}`);
    console.log(`📊 Products with orderCount: ${productsWithOrderCount}`);
    
    // Show some sample products with their order counts
    const sampleProducts = await Product.find({ orderCount: { $gt: 0 } })
      .select('title orderCount')
      .sort({ orderCount: -1 })
      .limit(5);
    
    console.log('🏆 Top 5 most ordered products:');
    sampleProducts.forEach(product => {
      console.log(`   ${product.title}: ${product.orderCount} orders`);
    });

  } catch (error) {
    console.error('❌ Error calculating order counts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

calculateAndUpdateOrderCount(); 