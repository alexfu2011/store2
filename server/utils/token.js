const { sign } = require('jsonwebtoken');
require('dotenv').config();

const createToken = userId => {
  return sign({ userId }, "Secret encryption message for sessions", {
    expiresIn: '1m',
  });
};

module.exports = {
  createToken
};