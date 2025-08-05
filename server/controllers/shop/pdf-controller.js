const CashMemoGenerator = require('../../utils/pdf-generator');
const Order = require('../../models/Order');
const User = require('../../models/User');

const generateCashMemo = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order with populated user information
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Find the user
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Generate PDF in memory
    const pdfGenerator = new CashMemoGenerator();
    const pdfResult = await pdfGenerator.generateCashMemoBuffer(order, user);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.fileName}"`);
    res.setHeader('Content-Length', pdfResult.buffer.length);

    // Send PDF buffer directly to browser
    res.send(pdfResult.buffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate PDF" 
    });
  }
};

module.exports = {
  generateCashMemo
}; 