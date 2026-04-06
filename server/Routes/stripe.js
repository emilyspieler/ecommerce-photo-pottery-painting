const express = require("express");
const router = express.Router();
const { optionalAuth } = require("../Middleware/auth");
const stripeController = require("../controllers/stripeController");

router.post("/create-checkout-session", optionalAuth, stripeController.createCheckoutSession);
router.post("/stripe-webhook", express.raw({ type: "application/json" }), stripeController.webhook);

module.exports = router;