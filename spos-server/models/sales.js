const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  uid         : { type: String, required: true },
  subtotal    : { type: String, required: true },
  discount    : { type: String, default: 0 },
  total       : { type: String, required: true },
  paid        : { type: String, required: true },
  method      : { type: String, required: true, lowercase: true },
  items       : { type: String, required: true},
  created_date: { type: String, default: new Date(Date.now()).toISOString() },
});
module.exports = mongoose.model("sales", scheme);
