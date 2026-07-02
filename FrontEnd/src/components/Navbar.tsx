import { FiMenu, FiBell, FiLogOut } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const crumb = loc.pathname === "/" ? "Dashboard" : loc.pathname.slice(1).split("/")[0];

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button type="button" onClick={onMenu} className="navbar__menu" aria-label="Open menu">
          <FiMenu />
        </button>
        <div>
          <div className="navbar__crumb-label">Pages</div>
          <div className="navbar__crumb">{crumb}</div>
        </div>
      </div>
      <div className="navbar__right">
        <button type="button" className="navbar__bell" aria-label="Notifications">
          <FiBell />
          <span />
        </button>
        <div className="navbar__user">
          <span className="navbar__user-name">{user?.name}</span>
          <span className="navbar__user-role">{user?.role}</span>
        </div>
        <div className="navbar__avatar">{user?.name?.[0] ?? "U"}</div>
        <button
          type="button"
          onClick={() => { dispatch(logout()); nav("/login"); }}
          className="navbar__logout"
          title="Logout"
          aria-label="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </header>
  );
}
