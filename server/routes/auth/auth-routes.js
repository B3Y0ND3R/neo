const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword
} = require("../../controllers/auth/auth-controller");
const jwt = require("jsonwebtoken");
const https = require("https");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/auth/login" }),
  (req, res) => {
    // Store the Google access token in session for later revocation
    if (req.user.accessToken) {
      req.session.googleAccessToken = req.user.accessToken;
    }
    
    // Create JWT token for Google authenticated user
    const token = jwt.sign(
      {
        id: req.user.id,
        role: req.user.role,
        email: req.user.email,
        userName: req.user.name
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Set the JWT token in cookie
    res.cookie("token", token, { httpOnly: true, secure: false });
    res.redirect("http://localhost:5173/shop/home");
  }
);

router.get("/google/logout", async (req, res) => {
  try {
    // Revoke Google access token if available
    if (req.session.googleAccessToken) {
      try {
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

        const req = https.request(options, (res) => {
          console.log('Google token revocation status:', res.statusCode);
        });

        req.on('error', (e) => {
          console.log('Error revoking Google token:', e);
        });

        req.write(postData);
        req.end();
      } catch (revokeError) {
        console.log('Error revoking Google token:', revokeError);
        // Continue with logout even if token revocation fails
      }
    }

    req.logout((err) => {
      if (err) return res.status(500).json({ success: false, message: "Logout failed" });

      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ success: false, message: "Session destruction failed" });
        }

        res.clearCookie("connect.sid", { path: "/" }); 
        res.clearCookie("token", { path: "/" }); 

        // Return JSON response instead of redirect for API calls
        res.status(200).json({ 
          success: true, 
          message: "Google logout successful",
          shouldRedirectToGoogle: true
        });
      });
    });
  } catch (error) {
    console.error('Google logout error:', error);
    res.status(500).json({ success: false, message: "Google logout failed" });
  }
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
