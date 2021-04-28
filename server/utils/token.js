const { sign } = require('jsonwebtoken');
require('dotenv').config();

const createToken = userId => {
  return sign({ userId }, "Secret encryption message for sessions", {
    expiresIn: '15m',
  });
};

module.exports = {
  createToken
};