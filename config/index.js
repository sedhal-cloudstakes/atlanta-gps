require("dotenv").config();
module.exports = {
  URL: process.env.NODE_ENVIRONMENT === 'local' ? `mongodb://localhost:27017/iotfleetdb` : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`,
  SECRET: process.env.SECRET,
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
  NODE_PORT: process.env.NODE_PORT,
  SALT_ROUND: process.env.SALT_ROUND,
  SMS_API_KEY: process.env.SMS_API_KEY,
  DB_NAME: process.env.DB_NAME
};
