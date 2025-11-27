import './App.css'
import { Routes, Route } from 'react-router'
import Home from './components/Home/Home';
import Projects from './components/Projects/Projects';
import { useEffect } from 'react';
import useLanguageStore from './store/useLanguageStore';
import useThemeStore from './store/useThemeStore';
import Project from './components/Project/Project';

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
      <Route path='/projects' element={<Projects/>}/>
      <Route path='/project/:id' element={<Project/>}/>
    </Routes>
  )
}

export default App;
