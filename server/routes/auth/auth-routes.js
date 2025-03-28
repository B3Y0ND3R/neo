const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/logout", logoutUser);
router.post("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return res.status(500).json({ success: false, message: "Logout failed" });

      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ success: false, message: "Logout failed" });
        }

        res.clearCookie("connect.sid");
        res.clearCookie("token");

        return res.json({ success: true, message: "Logged out successfully!" });
      });
    });
  } else {
    res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully!",
    });
  }
});


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




router.get("/google/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return res.status(500).json({ success: false, message: "Session destruction failed" });
      }

      res.clearCookie("connect.sid", { path: "/" }); 
      res.clearCookie("token", { path: "/" }); 

      res.redirect("http://localhost:5173/auth/login");
    });
  });
});


module.exports = router;
