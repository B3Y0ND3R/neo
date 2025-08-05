const PDFDocument = require('pdfkit');

class CashMemoGenerator {
  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 20, // Reduced margin for more content
      info: {
        Title: 'Receipt',
        Author: 'NEO',
        Subject: 'Order Receipt',
        Keywords: 'receipt, order, invoice',
        CreationDate: new Date()
      }
    });
  }

  generateCashMemoBuffer(order, user) {
    return new Promise((resolve, reject) => {
      try {
        const chunks = [];
        const stream = this.doc;

        // Collect PDF chunks in memory
        stream.on('data', (chunk) => {
          chunks.push(chunk);
        });

        stream.on('end', () => {
          // Combine all chunks into a single buffer
          const buffer = Buffer.concat(chunks);
          const fileName = `cash-memo-${order._id}-${Date.now()}.pdf`;

          resolve({
            fileName,
            buffer
          });
        });

        stream.on('error', (error) => {
          reject(error);
        });

        // Generate PDF content
        this.generateHeader();
        this.generateOrderInfo(order);
        this.generateCustomerInfo(user, order.addressInfo);
        this.generateItemsTable(order.cartItems);
        this.generatePaymentSummary(order);
        this.generateFooter();

        // End the PDF generation
        this.doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  generateHeader() {
    // Company logo and title (centered)
    this.doc
      .fontSize(22) // Reduced font size for header
      .font('Helvetica-Bold')
      .fillColor('#1f2937')
      .text('Multi-Brand Clothing Website', { align: 'center' })
      .moveDown(0.2);

    this.doc
      .fontSize(10) // Smaller font size for description
      .font('Helvetica')
      .fillColor('#6b7280')
      .text('Discover new trends, everyday', { align: 'center' })
      .moveDown(0.3);

    // RECEIPT label on the right
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1f2937')
      .text('RECEIPT', 450, 40) // Moved up for tighter layout
      .moveDown(0.5);

    // Divider line
    this.doc
      .moveTo(20, this.doc.y)
      .lineTo(570, this.doc.y)
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .stroke()
      .moveDown(0.5);
  }

  generateOrderInfo(order) {
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#1f2937')
      .text('Order Information', 20, this.doc.y)
      .moveDown(0.3);

    const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.doc
      .fontSize(9) // Smaller font for order info
      .font('Helvetica')
      .fillColor('#374151');

    // Order Info
    this.doc.text(`Order ID: ${order._id}`, 20, this.doc.y);
    this.doc.text(`Order Date: ${orderDate}`, 20, this.doc.y + 12);
    this.doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 20, this.doc.y + 24);
    this.doc.text(`Order Status: ${order.orderStatus.toUpperCase()}`, 300, this.doc.y + 12);
    this.doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 300, this.doc.y + 24);

    this.doc.moveDown(0.3);

    // Divider line
    this.doc
      .moveTo(20, this.doc.y)
      .lineTo(570, this.doc.y)
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .stroke()
      .moveDown(0.3);
  }

  generateCustomerInfo(user, addressInfo) {
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#1f2937')
      .text('Customer Information', 20, this.doc.y)
      .moveDown(0.3);

    this.doc
      .fontSize(9) // Smaller font for customer info
      .font('Helvetica')
      .fillColor('#374151');

    // Customer Info
    this.doc.text(`Name: ${user.userName}`, 20, this.doc.y);
    this.doc.text(`Email: ${user.email}`, 20, this.doc.y + 12);
    this.doc.text(`Phone: ${addressInfo.phone}`, 20, this.doc.y + 24);
    this.doc.text(`Address: ${addressInfo.address}`, 20, this.doc.y + 36);
    this.doc.text(`City: ${addressInfo.city}`, 20, this.doc.y + 48);
    this.doc.text(`Pincode: ${addressInfo.pincode}`, 20, this.doc.y + 60);

    this.doc.moveDown(0.3);

    // Divider line
    this.doc
      .moveTo(20, this.doc.y)
      .lineTo(570, this.doc.y)
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .stroke()
      .moveDown(0.3);
  }

  generateItemsTable(cartItems) {
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#1f2937')
      .text('Order Items', 20, this.doc.y)
      .moveDown(0.3);

    // Table headers
    const tableTop = this.doc.y;
    const itemX = 20;
    const descriptionX = 80;
    const sizeX = 220;
    const qtyX = 280;
    const priceX = 320;
    const totalX = 380;

    // Headers
    this.doc
      .fontSize(9) // Smaller font for table
      .font('Helvetica-Bold')
      .fillColor('#1f2937');

    this.doc.text('Item', itemX, tableTop);
    this.doc.text('Description', descriptionX, tableTop);
    this.doc.text('Size', sizeX, tableTop);
    this.doc.text('Qty', qtyX, tableTop);
    this.doc.text('Price', priceX, tableTop);
    this.doc.text('Total', totalX, tableTop);

    // Header line
    this.doc
      .moveTo(20, tableTop + 10)
      .lineTo(570, tableTop + 10)
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .stroke();

    let currentY = tableTop + 20;

    // Items
    this.doc
      .fontSize(8) // Smaller font for table items
      .font('Helvetica')
      .fillColor('#374151');

    cartItems.forEach((item, index) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const itemTotal = price * quantity;

      const itemName = item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title;

      this.doc.text(`${index + 1}`, itemX, currentY);
      this.doc.text(itemName, descriptionX, currentY);
      this.doc.text(item.size || 'N/A', sizeX, currentY);
      this.doc.text(quantity.toString(), qtyX, currentY);
      this.doc.text(`$${price.toFixed(2)}`, priceX, currentY);
      this.doc.text(`$${itemTotal.toFixed(2)}`, totalX, currentY);

      currentY += 14;

      if (index < cartItems.length - 1) {
        this.doc
          .moveTo(20, currentY - 2)
          .lineTo(570, currentY - 2)
          .strokeColor('#f3f4f6')
          .lineWidth(0.5)
          .stroke();
      }
    });

    // Bottom line
    this.doc
      .moveTo(20, currentY + 2)
      .lineTo(570, currentY + 2)
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .stroke();

    this.doc.y = currentY + 8;
  }

  generatePaymentSummary(order) {
    const subtotal = order.cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#1f2937')
      .text('Payment Summary', 20, this.doc.y)
      .moveDown(0.3);

    this.doc
      .fontSize(9) // Smaller font for payment summary
      .font('Helvetica')
      .fillColor('#374151');

    // Payment details
    this.doc.text(`Payment Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, this.doc.y);
    this.doc.text(`Transaction ID: ${order._id}`, 20, this.doc.y + 12);
    this.doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 20, this.doc.y + 24);

    // Right column - Amount breakdown
    this.doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 300, this.doc.y - 30);
    this.doc.text(`Shipping: $${shipping.toFixed(2)}`, 300, this.doc.y);

    this.doc.moveDown(1);

    // Highlight total amount
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#059669') // Green color for total
      .text('Payment Received', 20, this.doc.y)
      .text(`$${total.toFixed(2)}`, 450, this.doc.y);

    this.doc.moveDown(0.5);

    // Divider line
    this.doc
      .moveTo(20, this.doc.y)
      .lineTo(570, this.doc.y)
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .stroke()
      .moveDown(0.5);
  }

  generateFooter() {
    this.doc
      .fontSize(7)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text('This receipt has been generated electronically', { align: 'center' })
      .moveDown(0.3);

    this.doc
      .fontSize(7)
      .text('Thank you for shopping with NEO STORE!', { align: 'center' })
      .moveDown(0.2);

    this.doc
      .fontSize(6)
      .text('For any queries, please contact us at support@neostore.com', { align: 'center' });
  }
}

module.exports = CashMemoGenerator;
