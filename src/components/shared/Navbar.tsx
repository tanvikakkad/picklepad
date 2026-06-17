import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { HiMenu, HiX } from "react-icons/hi";
import { MdSportsTennis } from "react-icons/md";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, isLoggedIn, isOwner, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setMobileOpen(false);
  }

  function isActive(path: string): boolean {
    return location.pathname === path;
  }

  const dashboardPath = isOwner
    ? "/dashboard/owner"
    : "/dashboard/player";

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.inner}>
          
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoBox}>
              <MdSportsTennis className="text-dark-950 text-xl" />
            </div>

            <span className={styles.logoText}>
              Pickle<span className={styles.highlight}>Pad</span>
            </span>
          </Link>

          <div className={styles.desktopNav}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                isActive("/") ? styles.activeLink : ""
              }`}
            >
              Explore Courts
            </Link>

            {isLoggedIn && (
              <Link
                to={dashboardPath}
                className={`${styles.navLink} ${
                  location.pathname.startsWith("/dashboard")
                    ? styles.activeLink
                    : ""
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className={styles.userSection}>
            {isLoggedIn ? (
              <>
                <div className={styles.userCard}>
                  <div className={styles.avatar}>
                    {user?.name.charAt(0)}
                  </div>

                  <div className={styles.userText}>
                    <span className={styles.userName}>
                      {user?.name}
                    </span>

                    <span className={styles.userRole}>
                      ({user?.role})
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm !px-4 !py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-sm !px-5 !py-2"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={styles.mobileToggle}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <HiX className="text-xl" />
            ) : (
              <HiMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileContainer}>
            
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`${styles.mobileLink} ${
                isActive("/") ? styles.activeLink : ""
              }`}
            >
              Explore Courts
            </Link>

            {isLoggedIn && (
              <Link
                to={dashboardPath}
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileLink} ${
                  location.pathname.startsWith("/dashboard")
                    ? styles.activeLink
                    : ""
                }`}
              >
                Dashboard
              </Link>
            )}

            <div className={styles.mobileDivider}>
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className={styles.mobileUser}>
                    <div className={styles.mobileAvatar}>
                      {user?.name.charAt(0)}
                    </div>

                    <div>
                      <div className={styles.mobileUserName}>
                        {user?.name}
                      </div>

                      <div className={styles.mobileUserRole}>
                        {user?.role}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full btn-primary text-sm text-center"
                >
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}