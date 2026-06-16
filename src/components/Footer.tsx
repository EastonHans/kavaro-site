import { Link } from "@tanstack/react-router";
import kavaroLogo from "@/assets/kavaro-logo.png";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <img src={kavaroLogo} alt="Kavaro Agency logo" className={styles.logoImage} />
          <p className={styles.desc}>
            A small remote team designing and building honest digital products for growing
            businesses. One website at a time.
          </p>
          <a href="mailto:hello.kavaro@gmail.com" className={styles.emailLink}>
            hello.kavaro@gmail.com
          </a>
        </div>
        <div className={styles.col}>
          <h5>Services</h5>
          <ul>
            <li>
              <Link to="/services">UI / UX Design</Link>
            </li>
            <li>
              <Link to="/services">Graphic Design</Link>
            </li>
            <li>
              <Link to="/services">Web Development</Link>
            </li>
            <li>
              <Link to="/services">AI Solutions</Link>
            </li>
            <li>
              <Link to="/services">Brand Basics</Link>
            </li>
          </ul>
        </div>
        <div className={styles.col}>
          <h5>Company</h5>
          <ul>
            <li>
              <Link to="/">About Us</Link>
            </li>
            <li>
              <Link to="/services">Our Work</Link>
            </li>
          </ul>
        </div>
        <div className={styles.col}>
          <h5>Contact</h5>
          <ul>
            <li>
              <a href="mailto:hello.kavaro@gmail.com">hello.kavaro@gmail.com</a>
            </li>
            <li>
              <a
                href={import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/hello-kavaro"}
                target="_blank"
                rel="noreferrer"
              >
                Book a Call
              </a>
            </li>
            <li>
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Kavaro Agency. All rights reserved.</p>
        <p>Remote · Nairobi, Kenya</p>
      </div>
    </footer>
  );
}
