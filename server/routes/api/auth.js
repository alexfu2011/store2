const router = require("express").Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { hash, compare } = require('bcryptjs');
const { verify } = require('jsonwebtoken');
const { createToken } = require('../../utils/token');
const User = require("../../models/user");
const UserSession = require("../../models/usersession");
const { userId } = require("../../../admin/src/constants/auth");

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = User.findOne({ username });
        if (user) throw new Error('User already exist');
        const hashedPassword = await hash(password, 10);
        user.save({
            username,
            password: hashedPassword,
        });
        res.send({ message: 'User Created' });
        console.log(fakeDB);
    } catch (err) {
        res.send({
            error: `${err.message}`,
        });
    }
});

router.post('/login', jsonParser, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }
        const valid = await compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ error: 'Password not correct' });
        }
        const token = createToken(user._id);
        const session = new UserSession({ _userId: user._id, token });
        await session.save();
        res.status(200).cookie('token', token, {
            httpOnly: true,
            path: '/api/auth/refresh_token',
        }).json({ token });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: `${err.message}`,
        });
    }
});

router.post('/logout', (_req, res) => {
    res.clearCookie('refreshtoken', { path: '/refresh_token' });
    return res.send({
        message: 'Logged out',
    });
});

router.post('/refresh_token', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ token: "" });
    }
    let payload = null;
    try {
        payload = await verify(token, "Secret encryption message for sessions");
    } catch (err) {
        if (err.name == "TokenExpiredError") {
            return res.status(401).json({ token: "" });
        } else {
            return res.status(400).json({ token: "" });
        }
    }
    const session = await UserSession.findOne({ _userId: payload.userId });
    if (!session) {
        return res.status(400).json({ token: "" });
    } else if (session.token !== token) {
        return res.status(401).json({ token: "" });
    } else {
        const newToken = createToken(payload.userId);
        session.token = newToken;
        await session.save();
        res.status(200).cookie('token', newToken, {
            httpOnly: true,
            path: '/api/auth/refresh_token',
        }).json({ token: newToken });
    }
});

module.exports = router;
