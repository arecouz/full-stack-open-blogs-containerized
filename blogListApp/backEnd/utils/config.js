require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? (console.log("using test db..."), process.env.TEST_MONGODB_URI)
    : (console.log("not using test db..."), process.env.MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT,
};
