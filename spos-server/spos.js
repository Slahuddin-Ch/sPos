const https = require("https");
const http  = require('http');
const fs    = require('fs');
const app   = require("./app");


http.createServer(app).listen(3003);