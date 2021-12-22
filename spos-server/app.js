const express  = require("express");
var cors       = require('cors');
const db       = require('./config/database');
const category = require('./routes/categories.router');
const products = require('./routes/products.router');
const user     = require('./routes/user.router');
const sales    = require('./routes/sales.router');

const app = express();
// Connect Database
db.connect();
// Setup Cors
var corsOptions = { 
  origin: ['http://localhost:4200', 'http://192.168.10.3:8080', 'http://v9pro.com']
}
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({extended: true}));
// Define Routes
app.use('/user',     user);
app.use('/category', category);
app.use('/products', products);
app.use('/sales',    sales);

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