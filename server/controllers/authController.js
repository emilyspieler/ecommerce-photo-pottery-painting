const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/db");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const hashed = await bcrypt.hash(password, 12);
    connection.query(
      "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
      [email, hashed],
      (err) => {
        if (err) return res.status(400).json({ error: "Email already exists" });
        res.json({ success: true });
      },
    );
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.hashed_password);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, COOKIE_OPTIONS);
      res.json({
        success: true,
        user: { id: user.id, email: user.email, is_admin: user.is_admin },
      });
    },
  );
};

exports.logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ success: true });
};

exports.me = (req, res) => {
  res.json({ user: req.user });
};
