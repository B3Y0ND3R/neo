const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },
  userName: {
    type: String,
    required: function() {
      return !this.googleId; 
    },
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; 
    },
  },
  role: {
    type: String,
    default: "user",
  }
  //profileImage: String, 
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
