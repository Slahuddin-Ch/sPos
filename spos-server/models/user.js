const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  username:     { type: String, unique: true, required: true },
  password:     { type: String, required: true },
  email:        { type: String, default: null },
  role:         { type: String, default: 'user' },
  created_date: { type: String, default: new Date(Date.now()) },
});

module.exports = mongoose.model("users", scheme);
