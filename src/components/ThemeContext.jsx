import React, { createContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always use dark theme - removed toggle functionality
  const theme = 'dark';
  
  // Maintain the context structure but without actual toggling
  const toggleTheme = () => {
    // No-op function - theme toggle disabled
    return;
  };

  // Update theme class on body element when theme changes
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};