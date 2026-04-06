const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum:["Admin","CheckIn","Food","IceCream"]
  }
});

module.exports = mongoose.model("Admin", adminSchema);
