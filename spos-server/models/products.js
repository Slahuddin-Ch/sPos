const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  uid:    { type: String, required: true },
  cat_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name:   { type: String, required: true },
  code:   { type: String, required: true },
  price:  { type: String, required: true }
});

module.exports = mongoose.model("products", scheme);
