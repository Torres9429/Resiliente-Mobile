import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    backgroundColor: '#fcfcfc',
    textColor: '#000000',
    primaryColor: "#597cff", //azul
    secondaryColor: "#BACA16", //verde
    tertiaryColor: "#F6C80D", //amarillo
    accentColor: "#559BFA",
    cardBackground: '#FFFFFF',
    headerGradient: ['#51BBF5', '#559BFA', 'rgb(67, 128, 213)'],
    shadowColor: '#000000',
    borderColor: '#E0E0E0',
    textTabBar: '#aaa',
  },
  dark: {
    backgroundColor: '#1c1c1c',
    textColor: '#FFFFFF',
    primaryColor: "#597cff", //azul
    secondaryColor: "#BACA16", //verde
    tertiaryColor: "#F6C80D", //amarillo
    accentColor: '#559BFA',
    cardBackground: '#2D2D2D',
    headerGradient: ['#398ebd', '#1c4d85', 'rgb(4, 33, 73)'],
    shadowColor: '#FFFFFF',
    borderColor: '#404040',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? themes.dark : themes.light;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};