const jwt = require("jsonwebtoken");
const SERVER_TOKEN_KEY = '12345678%#@)&fr';

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({code: "TOKEN_MISSING", message: "A token is required for authentication. Please login again & try."});
  }
  try {
    const decoded = jwt.verify(token, SERVER_TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(403).json({code: "TOKEN_EXPIRED", message: "Session Expired. Kindly Login again to continue"});
  }
  return next();
};

module.exports = verifyToken;
