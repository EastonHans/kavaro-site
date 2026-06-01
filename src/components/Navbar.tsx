import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import kavaroLogo from "@/assets/kavaro-logo.png";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
    { to: "/admin", label: "Admin" },
  ] as const;

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <img src={kavaroLogo} alt="Kavaro" className="h-10 object-contain" />
      </Link>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={pathname === l.to ? styles.active : ""}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.navRight}>
        <a href="mailto:hello.kavaro@gmail.com" className={styles.email}>
          hello.kavaro@gmail.com
        </a>
        <Link to="/contact" className={styles.cta}>
          Get a Quote
        </Link>
      </div>

      <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
