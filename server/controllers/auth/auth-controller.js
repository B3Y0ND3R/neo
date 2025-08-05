const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { sendResetEmail } = require("../../utils/emailService");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};


const logoutUser = async (req, res) => {
  try {
    // Check if user is a Google user
    const user = req.user;
    const isGoogleUser = user && user.googleId;
    
    // Clear the JWT token cookie
    res.clearCookie("token");
    
    // If it's a Google user, also clear the session
    if (isGoogleUser && req.session) {
      // Clear the Google access token from session
      if (req.session.googleAccessToken) {
        try {
          // Revoke the Google access token
          const https = require('https');
          const postData = `token=${req.session.googleAccessToken}`;
          const options = {
            hostname: 'oauth2.googleapis.com',
            port: 443,
            path: '/revoke',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData)
            }
          };

          const revokeReq = https.request(options, (revokeRes) => {
            console.log('Google token revocation status:', revokeRes.statusCode);
          });

          revokeReq.on('error', (e) => {
            console.log('Error revoking Google token:', e);
          });

          revokeReq.write(postData);
          revokeReq.end();
        } catch (error) {
          console.log('Error revoking Google token:', error);
        }
      }
      
      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.log('Error destroying session:', err);
        }
      });
      
      // Clear session cookie
      res.clearCookie("connect.sid");
    }
    
    res.json({
      success: true,
      message: "Logged out successfully!",
      isGoogleUser: isGoogleUser
    });
  } catch (error) {
    console.log('Logout error:', error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


const authMiddleware = async (req, res, next) => {
  try {
    // First check JWT token
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
        req.user = decoded;
        return next();
      } catch (error) {
        // Token verification failed, continue to check session
      }
    }

    
    if (req.isAuthenticated()) {
      return next();
    }

    
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });
    
    // Don't reveal if user exists or not
    if (!user) {
      return res.json({
        success: true, // Still return success
        message: "If an account exists with this email, you will receive a password reset link"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    try {
      const emailSent = await sendResetEmail(email, resetToken);
      if (!emailSent) {
        console.error("Failed to send email");
        return res.status(500).json({
          success: false,
          message: "Failed to send reset email. Please try again."
        });
      }
    } catch (emailError) {
      console.error("Email error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again."
      });
    }

    res.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again."
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Password reset token is invalid or has expired"
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error resetting password"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword
};