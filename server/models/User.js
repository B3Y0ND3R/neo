const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },
  userName: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    default: function () {
      return this.googleId ? `google_user_${Date.now()}` : undefined;
    },
    unique: true,
    sparse: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  role: {
    type: String,
    default: "user",
  },
  // profileImage: String,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
