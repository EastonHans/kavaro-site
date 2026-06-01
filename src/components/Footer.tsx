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
            A professional creative agency delivering design and development solutions for
            forward-thinking businesses.
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
              <Link to="/services">Brand Strategy</Link>
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
            <li>
              <Link to="/contact">Careers</Link>
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
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Kavaro Agency. All rights reserved.</p>
        <p>
          <a href="#">Privacy Policy</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <a href="#">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
