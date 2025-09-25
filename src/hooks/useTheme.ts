import { useState, useEffect, createContext, useContext } from 'react';

// Define theme types
 type Theme = 'light' | 'dark' | 'system';

// Define context type
 interface ThemeContextType {
 theme: Theme;
 setTheme: (theme: Theme) => void;
 resolvedTheme: 'light' | 'dark';
}

// Create context with undefined default value
 const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
 export function ThemeProvider({ children }: { children: React.ReactNode }) {
 // Initialize theme state with localStorage or default to 'system'
 const [theme, setTheme] = useState<Theme>(() => {
 try {
 if (typeof window !== 'undefined') {
 return (localStorage.getItem('theme') as Theme) || 'system';
 }
 } catch (error) {
 console.error('Error reading theme from localStorage:', error);
 }
 return 'system';
 });

 // Initialize resolved theme state
 const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

 useEffect(() => {
 const root = window.document.documentElement;

 const updateTheme = () => {
 try {
 let resolved: 'light' | 'dark' = 'dark';

 // Determine the resolved theme based on current theme setting
 if (theme === 'system') {
 resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
 } else {
 resolved = theme as 'light' | 'dark';
 }

 // Update state and apply theme classes
 setResolvedTheme(resolved);
 root.classList.remove('light', 'dark');
 root.classList.add(resolved);

 // Save theme to localStorage
 localStorage.setItem('theme', theme);
 } catch (error) {
 console.error('Error updating theme:', error);
 }
 };

 // Initial theme update
 updateTheme();

 // Listen for system theme changes
 const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
 const handleChange = () => {
 if (theme === 'system') {
 updateTheme();
 }
 };

 mediaQuery.addEventListener('change', handleChange);
 return () => mediaQuery.removeEventListener('change', handleChange);
 }, [theme]);

 return (
 <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
 {children}
 </ThemeContext.Provider>
 );
}

// Custom hook for using theme context
 export function useTheme() {
 const context = useContext(ThemeContext);
 if (context === undefined) {
 throw new Error('useTheme must be used within a ThemeProvider');
 }
 return context;
}