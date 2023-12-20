const status = require('http-status');
const {
    isValidateToken
} = require('../services/jwt.service');

module.exports = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (!token) return res.status(403).send("Access denied.");
        token = token.split(' ')[1];
        const isValid = await isValidateToken(token);
        if (!isValid) res.send({
            error: "Token not valid!"
        }).status(status.UNAUTHORIZED);
        next();
    } catch (error) {
        res.status(status.UNAUTHORIZED).send("Invalid token");
    }
};