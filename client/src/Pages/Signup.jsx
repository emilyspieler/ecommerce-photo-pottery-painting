import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
  };

  const validatePassword = () => {
    if (!checks.length) return "Password must be at least 8 characters.";
    if (!checks.upper) return "Must include at least one uppercase letter.";
    if (!checks.lower) return "Must include at least one lowercase letter.";
    if (!checks.number) return "Must include at least one number.";
    if (!checks.special) return "Must include at least one special character.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword();
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await signup(email, password);

      navigate("/login", {
        state: {
          message: "You have successfully signed up. Please log in.",
        },
      });
    } catch (err) {
      setMessage("Error creating account. Try again.");
    }
  };

  const getStyle = (valid) => ({
    color: valid ? "#16a34a" : "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h2>Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("");
            }}
            required
          />

          <ul
            style={{
              margin: "0 0 16px",
              paddingLeft: "18px",
              fontSize: "0.9rem",
            }}
          >
            <li style={getStyle(checks.length)}>
              {checks.length ? "✓" : "•"} At least 8 characters
            </li>
            <li style={getStyle(checks.upper)}>
              {checks.upper ? "✓" : "•"} One uppercase letter
            </li>
            <li style={getStyle(checks.lower)}>
              {checks.lower ? "✓" : "•"} One lowercase letter
            </li>
            <li style={getStyle(checks.number)}>
              {checks.number ? "✓" : "•"} One number
            </li>
            <li style={getStyle(checks.special)}>
              {checks.special ? "✓" : "•"} One special character
            </li>
          </ul>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Create Account</button>
        </form>

        {message && (
          <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
        )}
      </div>
    </div>
  );
}
