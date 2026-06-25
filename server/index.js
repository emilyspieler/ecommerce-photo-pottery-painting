require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

console.log("ENV TEST:", {
  MAILGUN: process.env.MAILGUN_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

console.log(process.env.REACT_APP_SERVER_URL, "hello world")

console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Webhook must be registered before express.json() parses the body
const stripeController = require("./controllers/stripeController");
app.post("/stripe-webhook", express.raw({ type: "application/json" }), stripeController.webhook);

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth",         require("./Routes/auth"));
app.use("/contact",      require("./Routes/contact"));
app.use("/api/products", require("./Routes/products"));
app.use("/api/cart",     require("./Routes/cart"));
app.use("/",             require("./Routes/stripe"));

// Serve React build in non-local environments
if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/build", "index.html"))
  );
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("MAILGUN KEY EXISTS:", !!process.env.MAILGUN_API_KEY);
console.log("MAILGUN KEY VALUE:", process.env.MAILGUN_API_KEY);
