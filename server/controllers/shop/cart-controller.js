const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size } = req.body;

    if (!userId || !productId || quantity <= 0 || !size) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the selected size has enough stock
    if (!product.sizes[size] || product.sizes[size] < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock for size ${size}`,
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity, size });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    // Update product inventory
    product.sizes[size] -= quantity;
    await product.save();

    await cart.save();
    
    // Emit stock update to admin room
    if (global.emitStockUpdate) {
      global.emitStockUpdate(productId, product.sizes);
    }
    
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is manadatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems
      .filter((item) => {
        // Filter out items without size and log them
        if (!item.size) {
          console.error('Cart item missing size, filtering out:', item);
          return false;
        }
        return true;
      })
      .map((item) => ({
        productId: item.productId._id,
        image: item.productId.image,
        title: item.productId.title,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity,
        size: item.size,
      }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity, size } = req.body;

    if (!userId || !productId || quantity <= 0 || !size) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    // Get the old quantity to calculate the difference
    const oldQuantity = cart.items[findCurrentProductIndex].quantity;
    const quantityDifference = quantity - oldQuantity;

    // Check if the new quantity is valid
    if (quantityDifference > 0) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found!",
        });
      }

      // Check if we have enough stock for the additional quantity
      if (!product.sizes[size] || product.sizes[size] < quantityDifference) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for size ${size}. Available: ${product.sizes[size] || 0}`,
        });
      }

      // Update product stock
      product.sizes[size] -= quantityDifference;
      await product.save();
      
      // Emit stock update to admin room
      if (global.emitStockUpdate) {
        global.emitStockUpdate(productId, product.sizes);
      }
    } else if (quantityDifference < 0) {
      // If quantity is reduced, add back to stock
      const product = await Product.findById(productId);
      if (product) {
        product.sizes[size] += Math.abs(quantityDifference);
        await product.save();
        
        // Emit stock update to admin room
        if (global.emitStockUpdate) {
          global.emitStockUpdate(productId, product.sizes);
        }
      }
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, size } = req.params;
    if (!userId || !productId || !size) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Find the item to get its quantity before removing it
    const itemToDelete = cart.items.find(
      (item) => item.productId._id.toString() === productId && item.size === size
    );

    if (itemToDelete) {
      // Restore the stock
      const product = await Product.findById(productId);
      if (product) {
        product.sizes[size] += itemToDelete.quantity;
        await product.save();
        
        // Emit stock update to admin room
        if (global.emitStockUpdate) {
          global.emitStockUpdate(productId, product.sizes);
        }
      }
    }

    // Remove the specific size item
    cart.items = cart.items.filter(
      (item) => !(item.productId._id.toString() === productId && item.size === size)
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};