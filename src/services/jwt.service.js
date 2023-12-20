const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const config = require("../../config/local.json");

// PRIVATE and PUBLIC key
let currentDir = __dirname
const privateKEY = fs.readFileSync(path.join(currentDir, './../../private_key.pem'), 'utf8');
const publicKEY = fs.readFileSync(path.join(currentDir, './../../public_key.pem'), 'utf8');

const PAYLOAD_CONFIG = {
    user: "admin",
    id: 1
}

const JWT_CONFIG = {
    algorithm: "RS256",
    expiresIn: 60 * 5 // expires in 5 minutes
}
const createToken = async (body = PAYLOAD_CONFIG) => {
    const token = await jwt.sign(body, privateKEY, JWT_CONFIG);
    return token
}

const isValidateToken = async (token) => {
    const data = await jwt.verify(token, publicKEY, JWT_CONFIG);
    if (data.id === 1 && data.user === "admin") return true
    return false;
}

module.exports = {
    createToken,
    isValidateToken
}