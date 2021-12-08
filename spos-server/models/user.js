const mongoose = require("mongoose");

const scheme = new mongoose.Schema({
  bname       : { type: String, required: true},
  bntn        : { type: String, required: true},
  email       : { type: String, unique: true, required: true},
  username    : { type: String, unique: true, required: true},
  password    : { type: String, required: true},
  role        : { type: String, default: 'user'},
  status      : { type: String, default: 'active'},
  allowed     : { type: String, default: '1'},
  created_date: { type: String, default: new Date(Date.now()) },
});

module.exports = mongoose.model("users", scheme);
