require("dotenv").config();

const configObject = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  TOKEN_KEY: process.env.TOKEN_KEY,
  IMAGE_URL: process.env.IMAGE_URL,
};

module.exports = configObject;
