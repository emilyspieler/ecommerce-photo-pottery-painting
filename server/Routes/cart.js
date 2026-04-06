const express = require("express");
const router = express.Router();
const { authenticate } = require("../Middleware/auth");
const cartController = require("../controllers/cartController");

router.post("/add", authenticate, cartController.addToCart);

module.exports = router;