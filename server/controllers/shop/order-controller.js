const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User"); // Needed for refund email
const { sendRefundEmail } = require("../../utils/refund"); // Email sender

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // Handle different payment methods
    if (paymentMethod === "cod") {
      // For Cash on Delivery, create order directly without PayPal
      const newOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        refundStatus: "not_requested",
      });

      await newOrder.save();

      // Increment order count for each product in the order
      for (let item of cartItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { orderCount: 1 } }
        );
      }

      // Clear cart after successful order creation
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } }
      );



      return res.status(201).json({
        success: true,
        approvalURL: null, // No approval URL for COD
        orderId: newOrder._id,
      });
    } else {
      // For PayPal payments, create PayPal payment first
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:5173/shop/paypal-return",
          cancel_url: "http://localhost:5173/shop/paypal-cancel",
        },
        transactions: [
          {
            item_list: {
              items: cartItems.map((item) => ({
                name: item.title,
                sku: item.productId,
                price: item.price.toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              })),
            },
            amount: {
              currency: "USD",
              total: totalAmount.toFixed(2),
            },
            description: "Order for MyShop",
          },
        ],
      };

      paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "PayPal payment creation failed" });
        }

        const approvalURL = paymentInfo.links.find((link) => link.rel === "approval_url").href;

        const newOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          refundStatus: "not_requested",
        });

        await newOrder.save();

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newOrder._id,
        });
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error during order creation" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    paypal.payment.execute(paymentId, { payer_id: payerId }, async (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Payment execution failed" });
      }

      const saleId = payment.transactions[0].related_resources[0].sale.id;

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = saleId;
      order.payerId = payerId;

      // Update stock
      for (let item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.title}`,
          });
        }

        console.log(`Before reduction - Product: ${product.title}, Size: ${item.size}, Current stock: ${product.sizes[item.size]}, Quantity to reduce: ${item.quantity}`);

        // Reduce size-specific stock
        if (item.size && product.sizes[item.size] !== undefined) {
          product.sizes[item.size] -= item.quantity;
        }
        
        // Let the pre-save middleware recalculate totalStock automatically
        await product.save();
        
        console.log(`After reduction - Product: ${product.title}, Size: ${item.size}, New stock: ${product.sizes[item.size]}`);
        
        // Emit stock update to admin room
        if (global.emitStockUpdate) {
          global.emitStockUpdate(item.productId, product.sizes);
        }
      }

      // Increment order count for each product in the order
      for (let item of order.cartItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { orderCount: 1 } }
        );
      }

      await Cart.findByIdAndDelete(order.cartId);
      await order.save();



      res.status(200).json({
        success: true,
        message: "Order confirmed and paid",
        data: order,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error during payment capture" });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to fetch order details" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    console.log(`=== ORDER CANCELLATION DEBUG ===`);
    console.log(`Order ID: ${order._id}`);
    console.log(`Order Status: ${order.orderStatus}`);
    console.log(`Payment Status: ${order.paymentStatus}`);
    console.log(`Cart Items:`, order.cartItems);

    const now = new Date();
    const orderTime = new Date(order.orderDate);
    const timeDiff = now - orderTime;

    if (timeDiff > 24 * 60 * 60 * 1000) {
      return res.status(400).json({ success: false, message: "Order can only be cancelled within 24 hours" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }

    if (order.paymentStatus === "paid") {
      console.log(`Processing PAID order cancellation with refund`);
      // Auto-refund
      paypal.sale.refund(order.paymentId, {
        amount: {
          currency: "USD",
          total: order.totalAmount.toFixed(2),
        },
      }, async (error, refund) => {
        if (error) {
          console.error(error.response);
          return res.status(500).json({ success: false, message: "Refund failed during cancellation" });
        }
        
        // Restore stock for paid orders
        for (let item of order.cartItems) {
          const product = await Product.findById(item.productId);
          if (product) {
            console.log(`Before restoration - Product: ${product.title}, Size: ${item.size}, Current stock: ${product.sizes[item.size]}, Quantity to restore: ${item.quantity}`);
            
            // Restore size-specific stock
            if (item.size && product.sizes[item.size] !== undefined) {
              product.sizes[item.size] += item.quantity;
              console.log(`Updated size ${item.size} stock from ${product.sizes[item.size] - item.quantity} to ${product.sizes[item.size]}`);
            } else {
              console.log(`Size ${item.size} not found in product sizes:`, product.sizes);
            }
            
            // Let the pre-save middleware recalculate totalStock automatically
            await product.save();
            
            console.log(`After restoration - Product: ${product.title}, Size: ${item.size}, New stock: ${product.sizes[item.size]}`);
            
            // Emit stock update to admin room
            if (global.emitStockUpdate) {
              global.emitStockUpdate(item.productId, product.sizes);
            }
          } else {
            console.log(`Product not found for ID: ${item.productId}`);
          }
        }
        
        order.paymentStatus = "refunded";
        order.orderStatus = "cancelled";
        order.orderUpdateDate = new Date();
        order.refundStatus = "refunded";
        order.refundDate = new Date();
        order.refundTransactionId = refund.id;

        await order.save();

        // Send refund email
        const user = await User.findById(order.userId);
        if (user) await sendRefundEmail(user.email, order);

        return res.status(200).json({ success: true, message: "Order cancelled and refunded successfully" });
      });
    } else {
      console.log(`Processing UNPAID order cancellation`);
      // ALWAYS restore stock for unpaid orders (since stock was reduced during checkout)
      console.log(`Restoring stock for unpaid order cancellation`);
      // Restore stock for all unpaid orders
      for (let item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          console.log(`Before restoration - Product: ${product.title}, Size: ${item.size}, Current stock: ${product.sizes[item.size]}, Quantity to restore: ${item.quantity}`);
          
          // Restore size-specific stock
          if (item.size && product.sizes[item.size] !== undefined) {
            product.sizes[item.size] += item.quantity;
            console.log(`Updated size ${item.size} stock from ${product.sizes[item.size] - item.quantity} to ${product.sizes[item.size]}`);
          } else {
            console.log(`Size ${item.size} not found in product sizes:`, product.sizes);
          }
          
          // Let the pre-save middleware recalculate totalStock automatically
          await product.save();
          
          console.log(`After restoration - Product: ${product.title}, Size: ${item.size}, New stock: ${product.sizes[item.size]}`);
          
          // Emit stock update to admin room
          if (global.emitStockUpdate) {
            global.emitStockUpdate(item.productId, product.sizes);
          }
        } else {
          console.log(`Product not found for ID: ${item.productId}`);
        }
      }
      
      order.orderStatus = "cancelled";
      order.orderUpdateDate = new Date();
      await order.save();

      return res.status(200).json({ success: true, message: "Order cancelled successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  cancelOrder,
};
