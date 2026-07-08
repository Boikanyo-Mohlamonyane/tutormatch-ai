import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NAV_CONFIG } from "./navConfig";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const groups = NAV_CONFIG[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">AI</div>
        <div>
          <div className="sidebar-brand-text">TutorMatch</div>
          <div className="sidebar-brand-sub">{user?.role || "Portal"}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {groups.map((group) => (
          <div key={group.group}>
            <div className="sidebar-group-label">{group.group}</div>
            {group.items.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
