const SibApi = require('sib-api-v3-sdk');

const client = SibApi.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = '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';

const sendResetEmail = async (userEmail, resetToken) => {
  const resetUrl = `http://localhost:5173/auth/reset-password/${resetToken}`;
  
  const tranEmailApi = new SibApi.TransactionalEmailsApi();
  const sender = {
    email: 'ahsanulhasib2@gmail.com',
    name: 'My Shop',
  };
  const receivers = [
    {
      email: userEmail,
    },
  ];

  try {
    const sendResult = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Reset Your Password',
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px;">
              <h2 style="color: #6366f1; margin-bottom: 20px;">Password Reset Request</h2>
              <p style="margin-bottom: 20px;">You requested to reset your password. Click the link below to proceed:</p>
              <div style="margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #6366f1; 
                          color: #ffffff; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p style="color: #666666; margin-top: 20px;">This link will expire in 1 hour for security reasons.</p>
              <p style="color: #666666;">If you didn't request this, please ignore this email.</p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666666; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="color: #6366f1; font-size: 12px; word-break: break-all;">${resetUrl}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    console.log('Email sent successfully:', sendResult);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

module.exports = { sendResetEmail }; 