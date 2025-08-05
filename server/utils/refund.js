const SibApi = require('sib-api-v3-sdk');

const client = SibApi.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = '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';

const sendRefundEmail = async (userEmail, order) => {
  const tranEmailApi = new SibApi.TransactionalEmailsApi();
  const sender = {
    email: 'ahsanulhasib2@gmail.com',
    name: 'My Shop',
  };
  const receivers = [{ email: userEmail }];

  try {
    const sendResult = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: `Refund Processed for Order #${order._id}`,
      htmlContent: `
        <h2>Refund Successful</h2>
        <p>Your order <strong>#${order._id}</strong> has been successfully refunded.</p>
        <p>Amount: <strong>$${order.totalAmount.toFixed(2)}</strong></p>
        <p>Refund Transaction ID: <strong>${order.refundTransactionId}</strong></p>
        <p>Thank you for shopping with us.</p>
      `,
    });

    console.log("Refund email sent:", sendResult);
    return true;
  } catch (err) {
    console.error("Refund email error:", err);
    return false;
  }
};

module.exports = { sendRefundEmail };
