const { verify } = require('jsonwebtoken');
const UserSession = require("../models/usersession");

const isAuth = async (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.sendStatus(400);
  }
  const token = authorization.split(' ')[1];
  let payload;
  try {
    payload = await verify(token, "Secret encryption message for sessions");
  } catch (err) {
    if (err.name == "JsonWebTokenError") {
      return res.sendStatus(400);
    }
  }
  const session = await UserSession.findOne({ _userId: payload.userId });
  if (!session) {
    return res.sendStatus(400);
  } else if (session.token !== token) {
    return res.sendStatus(401);
  } else {
    next();
  }
};

module.exports = { isAuth };
