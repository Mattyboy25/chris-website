import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import '../App.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className={`theme-toggle ${theme}`} 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? 
        <i className="fas fa-moon"></i> : 
        <i className="fas fa-sun"></i>
      }
    </button>
  );
}

export default ThemeToggle;