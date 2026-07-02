import { NavLink } from "react-router-dom";
import type { ComponentType } from "react";
import {
  FiHome, FiShoppingCart, FiPackage, FiUsers, FiTruck,
  FiBarChart2, FiSettings, FiUser, FiX,
} from "react-icons/fi";
import { useAppSelector } from "@/app/hooks";
import type { Role } from "@/types";

const links: { to: string; label: string; icon: ComponentType<{ className?: string }>; roles: Role[] }[] = [
  { to: "/", label: "Dashboard", icon: FiHome, roles: ["Super Admin", "Admin", "Billing User"] },
  { to: "/billing", label: "Billing", icon: FiShoppingCart, roles: ["Super Admin", "Admin", "Billing User"] },
  { to: "/products", label: "Products", icon: FiPackage, roles: ["Super Admin", "Admin"] },
  { to: "/customers", label: "Customers", icon: FiUsers, roles: ["Super Admin", "Admin"] },
  { to: "/suppliers", label: "Suppliers", icon: FiTruck, roles: ["Super Admin", "Admin"] },
  { to: "/reports", label: "Reports", icon: FiBarChart2, roles: ["Super Admin", "Admin"] },
  { to: "/settings", label: "Settings", icon: FiSettings, roles: ["Super Admin"] },
  { to: "/profile", label: "Profile", icon: FiUser, roles: ["Super Admin", "Admin", "Billing User"] },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAppSelector((s) => s.auth.user);
  const role = user?.role;

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo-wrap">
            <div className="sidebar__logo">F</div>
            <span className="sidebar__name">FloraBill</span>
          </div>
          <button type="button" onClick={onClose} className="sidebar__close" aria-label="Close menu">
            <FiX />
          </button>
        </div>
        <nav className="sidebar__nav">
          {links.filter((l) => !role || l.roles.includes(role))?.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={onClose}
              className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              <l.icon />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">v1.0 · {role ?? "Guest"}</div>
      </aside>
    </>
  );
}
