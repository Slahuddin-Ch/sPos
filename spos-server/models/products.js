const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  uid:   { type: String, required: true },
  name:  { type: String, unique: true, required: true },
  code:  { type: String, unique: true, required: true },
  price: { type: String, required: true },
  tax:   { type: String, default: 0 },
});

module.exports = mongoose.model("products", scheme);
