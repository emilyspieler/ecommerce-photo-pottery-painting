const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: "5m" });
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

module.exports = { generateAccessToken, generateRefreshToken };