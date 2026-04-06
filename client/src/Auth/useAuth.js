import { useState } from "react";
import api from "../Api/axios";

export default function useAuth() {
  const [accessToken, setAccessToken] = useState(null);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
  }

  async function refresh() {
    const res = await api.post("/auth/refresh");
    setAccessToken(res.data.accessToken);
  }

  return { accessToken, login, refresh };
}
