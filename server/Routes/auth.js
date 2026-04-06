const express = require("express");
const router = express.Router();
const { authenticate } = require("../Middleware/auth");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login",    authController.login);
router.post("/logout",   authController.logout);
router.get("/me",        authenticate, authController.me);

module.exports = router;