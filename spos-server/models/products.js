const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  uid:   { type: String, required: true },
  name:  { type: String, required: true },
  code:  { type: String, required: true },
  price: { type: String, required: true },
  tax:   { type: String, default: 0 },
});

module.exports = mongoose.model("products", scheme);
