import { motion, AnimatePresence } from "framer-motion";
import styles from "./LanguageSwitch.module.css";
import useLocaleStore from "../../store/useLanguageStore";

function LanguageSwitch() {
  const { getNextLanguage, toggleLanguage } = useLocaleStore();

  return (
    <button
      className={styles.language_switch_container}
      onClick={toggleLanguage}
    >
      <motion.div
        className={styles.language_switch_handle}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={getNextLanguage()}
            className={styles.language_switch_label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0}}
            transition={{ duration: 0.3 }}
          >
            {getNextLanguage().toUpperCase()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </button>
  )
}

export default LanguageSwitch;
