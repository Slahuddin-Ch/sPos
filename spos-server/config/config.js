var config = {};

config.env  = { production : true }
config.url  = { LIVE: 'http://v9pro.com', TEST: 'https://test-dev.com:4200'}
config.port = { LIVE: 3003, TEST: 3003}
config.MONGO_URI = 'mongodb://localhost:27017/spos';
config.SERVER_TOKEN_KEY = '12345678%#@)&fr';

// Export Configuration
module.exports = config;