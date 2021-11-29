const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
var cors      = require('cors');
const db      = require('./config/database');
var ObjectId  = require('mongodb').ObjectID;
const category = require('./routes/categories.router');

const app = express();
// Connect Database
db.connect();
// Setup Cors
var corsOptions = { origin: 'http://localhost:4200'}
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
  extended: true
}));
// Define Routes
app.use('/category', category);

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
    res.status(404).json({
      success: "false",
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
  });
  
module.exports = app;