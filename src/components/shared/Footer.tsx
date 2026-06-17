import { Link } from 'react-router-dom';
import { MdSportsTennis } from 'react-icons/md';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import styles from "./Footer.module.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
      <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          <div className={styles.brandSection}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logoBox}>
                <MdSportsTennis className="text-dark-950 text-xl" />
              </div>

              <span className={styles.logoText}>
                Pickle<span className={styles.highlight}>Pad</span>
              </span>
            </Link>

            <p className={styles.tagline}>
              No calls. No hassle. Just you and the game.
            </p>

            <div className={styles.liveStatus}>
              <span className={styles.liveDot} />
              <span className={styles.liveText}>Courts Available Now</span>
            </div>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Quick Links</h4>

            <ul className={styles.linkList}>
              {[
                { label: "Explore Courts", to: "/" },
                { label: "Sign In", to: "/login" },
                { label: "Register", to: "/register" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Support</h4>

            <ul className={styles.linkList}>
              {[
                "Help Center",
                "Terms of Service",
                "Privacy Policy",
                "Cancellation Policy",
              ].map((item) => (
                <li key={item}>
                  <span className={styles.link}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Contact Us</h4>

            <ul className={styles.linkList}>
              <li className={styles.contactItem}>
                <HiLocationMarker className={styles.contactIcon} />
                <span className={styles.contactText}>
                  Ahmedabad, Gujarat
                </span>
              </li>

              <li className={styles.contactItem}>
                <HiMail className={styles.contactIcon} />
                <a
                  href="mailto:hello@picklepad.com"
                  className={styles.link}
                >
                  hello@picklepad.com
                </a>
              </li>

              <li className={styles.contactItem}>
                <HiPhone className={styles.contactIcon} />
                <a
                  href="tel:+919876543210"
                  className={styles.link}
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className={styles.divider} />

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} PicklePad. All rights reserved.
          </p>

          <p className={styles.madeWith}>
            Made with <span className={styles.heart}>❤</span> for Ahmedabad
          </p>
        </div>
      </div>
    </footer>
    );
}
