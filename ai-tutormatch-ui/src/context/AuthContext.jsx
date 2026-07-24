import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

function normalizeUser(raw, fallbackEmail) {
  if (!raw) return null;

  const token = raw.token || raw.accessToken || raw.jwt;

  let claims = {};

  if (token) {
    try {
      claims = jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
    }
  }

  const role = (
    claims.role ||
    raw.role ||
    raw.userRole ||
    (Array.isArray(raw.roles) ? raw.roles[0] : raw.roles) ||
    ""
  )
    .toString()
    .replace("ROLE_", "")
    .toUpperCase();

  return {
    // IDs come from the JWT
    id: claims.userId ?? raw.id ?? raw.userId ?? null,
    studentId: claims.studentId ?? null,
    tutorId: claims.tutorId ?? null,
    adminId: claims.adminId ?? null,

    name:
      raw.name ??
      raw.fullName ??
      raw.username ??
      fallbackEmail ??
      claims.sub ??
      "Account",

    email:
      raw.email ??
      fallbackEmail ??
      claims.sub ??
      "",

    role: role || "STUDENT",

    token,
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
        const parsed = JSON.parse(storedUser);

        // Decode token again so IDs stay in sync
        const normalized = normalizeUser(
          {
            ...parsed,
            token: storedToken,
          },
          parsed.email
        );

        setUser(normalized);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("tm_user");
        localStorage.removeItem("tm_token");
      }
    }

    setInitializing(false);
  }, []);

  const login = async ({ email, password }) => {
    const response = await authApi.login({
      email,
      password,
    });

    const token =
      response.token ||
      response.accessToken ||
      response.jwt;

    if (!token) {
      throw new Error("Authentication token not returned.");
    }

    const normalized = normalizeUser(response, email);

    localStorage.setItem("tm_token", token);
    localStorage.setItem(
      "tm_user",
      JSON.stringify(normalized)
    );

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
    () => ({
      user,
      initializing,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, initializing]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}