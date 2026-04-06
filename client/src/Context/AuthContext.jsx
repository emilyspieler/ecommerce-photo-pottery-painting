import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  console.log(user)

  // Check login on page load
  useEffect(() => {
    api.get("/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const login = async (email, password) => {
    await api.post("/auth/login", { email, password });
    const res = await api.get("/auth/me", { withCredentials: true });
    setUser(res.data.user);
  };

  const signup = async (email, password) => {
    await api.post("/auth/register", { email, password });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
