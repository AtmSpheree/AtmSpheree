import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./ThemeSwitch.module.css";
import { data } from "../../static";
import useThemeStore from "../../store/useThemeStore";
import useLanguageStore from "../../store/useLanguageStore";

function ThemeSwitch() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAnimating } = useLanguageStore();

  return (
    <button
        className={styles.theme_switch_container}
        style={{
            justifyContent: "flex-" + (theme === "light" ? "start" : "end"),
        }}
        onClick={toggleTheme}
    >
      <motion.div
        className={styles.theme_switch_handle}
        layout="position"
        layoutScroll
        transition={{
          type: "spring",
          duration: isAnimating ? 0 : data.animation.theme.change / 1000,
          bounce: 0.2,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0}}
            transition={{ duration: 0 }}
            style={{width: 18, height: 18}}
          >
            {theme === "light" ? (
              <FiSun color="#ffffff" size={18} />
            ) : (
              <FiMoon color="#ffffff" size={18} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </button>
  )
}

export default ThemeSwitch;
