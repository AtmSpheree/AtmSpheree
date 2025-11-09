import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import './Header.module.css'
import styles from './Header.module.css'

function Header() {

  return (<header>
    <div>logo</div>
    <div className={styles.header_content}>
      <LanguageSwitch/>
      <ThemeSwitch/>
    </div>
  </header>)
}

export default Header;