const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  name:  { type: String, unique: true, required: true },
  price: { type: String, required: true },
  tax:   { type: String, default: 0 },
});

module.exports = mongoose.model("category", scheme);
