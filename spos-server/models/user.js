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
  receipt_setting:  {type: Object, default: {bname: true, bntn: true, invoice_no: true, invoice_date:true, vat: true, discount:true, note:{status: false, value: ''}}},
  created_date: { type: String, default: new Date(Date.now()) },
});

module.exports = mongoose.model("users", scheme);