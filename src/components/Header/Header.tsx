import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import "./Header.module.css";
import styles from "./Header.module.css";
import useLanguageStore, { type Locale } from "../../store/useLanguageStore";
import { useNavigate } from "react-router";

function Header() {
  const { locale } = useLanguageStore() as { locale: Locale | null };
  const navigator = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const handleNavigate = (path: string) => {
    navigator(path);
    closeMenu();
  };

  const headerTexts = locale?.home.header;

  return (
    <motion.header layoutRoot>
      <div className={styles.header}>
        <div className={styles.header_content}>
          <a
            className={styles.logotype}
            href="https://github.com/AtmSpheree"
            target="_blank"
            rel="noreferrer"
          >
            <img className={styles.logotype_icon} src={"/icons/github.svg"} />
            <img className={styles.logotype_arrow} src={"/icons/curve-arrow.svg"} />
            <span className={styles.logotype_span}>{headerTexts?.logotypeText}</span>
          </a>
          <nav className={styles.desktopNav}>
            <a
              className={`transition_fix ${styles.header_button}`}
              onClick={() => handleNavigate("/")}
            >
              {headerTexts?.homeText}
            </a>
            <a
              className={`transition_fix ${styles.header_button}`}
              onClick={() => handleNavigate("/projects")}
            >
              {headerTexts?.projectsText}
            </a>
            <a
              className={`transition_fix ${styles.header_active_button}`}
              href={'https://t.me/atmspheree'}
              target="_blank"
              rel="noreferrer"
            >
              {headerTexts?.contactsText}
            </a>
          </nav>
        </div>
        <div className={styles.header_content}>
          <div className={styles.utilityGroup}>
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeMenu}
          >
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.mobileMenuHeader}>
                <span>{headerTexts?.mobileMenuText}</span>
                <button
                  type="button"
                  className={styles.mobileMenuClose}
                  aria-label="Close navigation menu"
                  onClick={closeMenu}
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className={styles.mobileMenuLinks}>
                <a
                  className={`${styles.logotype} ${styles.mobileMenuLogotype}`}
                  href="https://github.com/AtmSpheree"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                >
                  <img className={styles.logotype_icon_mobile} src={"/icons/github.svg"} />
                  <img className={styles.logotype_arrow_mobile} src={"/icons/curve-arrow.svg"} />
                  <span className={styles.logotype_span_mobile}>{headerTexts?.logotypeText}</span>
                </a>
                <button
                  type="button"
                  className={`transition_fix ${styles.header_button} ${styles.mobileMenuLink}`}
                  onClick={() => handleNavigate("/")}
                >
                  {headerTexts?.homeText}
                </button>
                <button
                  type="button"
                  className={`transition_fix ${styles.header_button} ${styles.mobileMenuLink}`}
                  onClick={() => handleNavigate("/projects")}
                >
                  {headerTexts?.projectsText}
                </button>
                <button
                  type="button"
                  className={`transition_fix ${styles.header_active_button} ${styles.mobileMenuActiveLink}`}
                  onClick={() => location.href='https://t.me/atmspheree'}
                >
                  {headerTexts?.contactsText}
                </button>
              </div>

              <div className={styles.mobileMenuSwitches}>
                <LanguageSwitch />
                <ThemeSwitch />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
