import { useAuth } from "../../context/AuthContext";

function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Topbar() {
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <header className="topbar">
      <div>
        <div className="topbar-eyebrow">{dateStr}</div>
        <div className="topbar-title">Welcome back, {user?.name?.split(" ")[0] || "there"}</div>
      </div>
      <div className="topbar-user">
        <div style={{ textAlign: "right" }}>
          <div className="topbar-user-name">{user?.name}</div>
          <div className="topbar-user-role">{user?.role?.toLowerCase()}</div>
        </div>
        <div className="topbar-avatar">{initials(user?.name)}</div>
      </div>
    </header>
  );
}
