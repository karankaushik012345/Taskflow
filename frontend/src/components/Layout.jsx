
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Layout.module.css";
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  const initials = user && user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>TF</div>
          <span className={styles.logoText}>TaskFlow</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <span className={styles.navIcon}>▣</span> Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <span className={styles.navIcon}>◈</span> Kanban
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <span className={styles.navIcon}>◉</span> Profile
          </NavLink>
        </nav>
        <div className={styles.divider} />
        <div className={styles.userSection}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user && user.name}</span>
            <span className={styles.userEmail}>{user && user.email}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">out</button>
        </div>
      </aside>
      <main className={styles.main}><Outlet /></main>
    </div>
  );
}
