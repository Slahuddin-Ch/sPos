const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  uid:   { type: String, required: true },
  name:  { type: String, required: true, lowercase: true },
  tax:   { type: String, default: 0 },
});

module.exports = mongoose.model("category", scheme);
