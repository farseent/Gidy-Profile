import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext(null);

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      setIsDarkMode(isDark);
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
    setIsLoaded(true);
  }, []);

  // Update dark mode and save to localStorage
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      updateDOMDarkMode(newValue);
      return newValue;
    });
  };

  // Update HTML element class for Tailwind dark mode
  const updateDOMDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Apply dark mode on first load
  useEffect(() => {
    if (isLoaded) {
      updateDOMDarkMode(isDarkMode);
    }
  }, [isLoaded, isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider");
  }
  return context;
};
