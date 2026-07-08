import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

// Normalizes whatever shape LoginResponse comes back as into one consistent
// user object, since field naming can vary (id vs userId, role vs roles[0]).
function normalizeUser(raw, fallbackEmail) {
  if (!raw) return null;
  const role = (raw.role || raw.userRole || (Array.isArray(raw.roles) ? raw.roles[0] : raw.roles) || "")
    .toString()
    .replace("ROLE_", "")
    .toUpperCase();

  return {
    id: raw.id ?? raw.userId ?? raw.studentId ?? raw.tutorId ?? raw.adminId ?? null,
    name: raw.name ?? raw.fullName ?? raw.username ?? fallbackEmail ?? "Account",
    email: raw.email ?? fallbackEmail ?? "",
    role: role || "STUDENT",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("tm_user");
    const storedToken = localStorage.getItem("tm_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("tm_user");
      }
    }
    setInitializing(false);
  }, []);

  const login = async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    const token = data?.token || data?.accessToken || data?.jwt;
    const normalized = normalizeUser(data, email);
    if (token) localStorage.setItem("tm_token", token);
    localStorage.setItem("tm_user", JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  };

  const register = async (payload) => {
    return authApi.register(payload);
  };

  const logout = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, initializing, login, register, logout, isAuthenticated: !!user }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
