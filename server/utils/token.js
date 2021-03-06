const { sign } = require('jsonwebtoken');
require('dotenv').config();

const createToken = userId => {
  return sign({ userId, datatime: Date.now() }, "Secret encryption message for sessions", {
    expiresIn: '1m',
  });
};

module.exports = {
  createToken
};