import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  // 🎉 Success message from signup
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setErr("Invalid email or password.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h2>Login</h2>

        {/* ✅ Success message */}
        {successMessage && (
          <p style={{ color: "green", marginBottom: "10px" }}>
            {successMessage}
          </p>
        )}

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
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="amazon-cart-btn" type="submit">Login</button>
        </form>

        {err && <p style={{ color: "red" }}>{err}</p>}

        <p style={{ marginTop: "10px" }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}