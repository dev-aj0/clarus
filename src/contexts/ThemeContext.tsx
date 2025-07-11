import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: string;
  fontSize: string;
  highContrast: boolean;
  reducedMotion: boolean;
  setTheme: (theme: string) => void;
  setFontSize: (size: string) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage with proper defaults
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'system';
    } catch {
      return 'system';
    }
  });
  
  const [fontSize, setFontSizeState] = useState(() => {
    try {
      return localStorage.getItem('fontSize') || 'medium';
    } catch {
      return 'medium';
    }
  });
  
  const [highContrast, setHighContrastState] = useState(() => {
    try {
      const stored = localStorage.getItem('highContrast');
      return stored ? stored === 'true' : false;
    } catch {
      return false;
    }
  });
  
  const [reducedMotion, setReducedMotionState] = useState(() => {
    try {
      const stored = localStorage.getItem('reducedMotion');
      return stored ? stored === 'true' : false;
    } catch {
      return false;
    }
  });

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const setFontSize = (newFontSize: string) => {
    setFontSizeState(newFontSize);
    try {
      localStorage.setItem('fontSize', newFontSize);
    } catch (error) {
      console.error('Failed to save fontSize:', error);
    }
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    try {
      localStorage.setItem('highContrast', enabled.toString());
    } catch (error) {
      console.error('Failed to save highContrast:', error);
    }
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    try {
      localStorage.setItem('reducedMotion', enabled.toString());
    } catch (error) {
      console.error('Failed to save reducedMotion:', error);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme with system detection
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply font size with smooth transition
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
    root.classList.add(`text-${fontSize}`);
    
    // Apply high contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Listen for system theme changes when using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, fontSize, highContrast, reducedMotion]);

  return (
    <ThemeContext.Provider value={{
      theme,
      fontSize,
      highContrast,
      reducedMotion,
      setTheme,
      setFontSize,
      setHighContrast,
      setReducedMotion,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};