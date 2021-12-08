const jwt = require("jsonwebtoken");
const config = require('../config/config');

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({code: "TOKEN_MISSING", message: "A token is required for authentication. Please login again & try."});
  }
  try {
    const decoded = jwt.verify(token, config.SERVER_TOKEN_KEY);
    if(decoded.role==='admin'){
        req.user = decoded;
    }else{
        return res.status(403).json({code: "NO_PERMISSION", message: "Only admin can perform this action."});
    }
  } catch (err) {
    return res.status(403).json({code: "TOKEN_EXPIRED", message: "Session Expired. Kindly Login again to continue"});
  }
  return next();
};

module.exports = verifyToken;
