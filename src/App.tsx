import './App.css'
import { Routes, Route } from 'react-router'
import Home from './components/Home/Home';
import { useEffect } from 'react';
import useLanguageStore from './store/useLanguageStore';
import useThemeStore from './store/useThemeStore';

function App() {
  const { locale, loadLocale } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    setTheme(theme);
    loadLocale();
  }, [])

  if (!locale) {
    return (<></>)
  }

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
    </Routes>
  )
}

export default App;
