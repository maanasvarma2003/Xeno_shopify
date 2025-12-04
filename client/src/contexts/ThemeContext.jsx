import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const [timeBasedColors, setTimeBasedColors] = useState({
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899'
    });

    // Dynamic theme based on time of day
    useEffect(() => {
        const updateThemeByTime = () => {
            const hour = new Date().getHours();

            // Morning (6am - 12pm): Fresh, energetic blues and greens
            if (hour >= 6 && hour < 12) {
                setTimeBasedColors({
                    primary: '#3b82f6',   // Blue
                    secondary: '#10b981', // Green
                    accent: '#06b6d4',    // Cyan
                    gradient: 'from-blue-400 via-cyan-400 to-green-400',
                    name: 'Morning'
                });
            }
            // Afternoon (12pm - 6pm): Warm, productive oranges and yellows
            else if (hour >= 12 && hour < 18) {
                setTimeBasedColors({
                    primary: '#f59e0b',   // Amber
                    secondary: '#f97316', // Orange
                    accent: '#eab308',    // Yellow
                    gradient: 'from-orange-400 via-amber-400 to-yellow-400',
                    name: 'Afternoon'
                });
            }
            // Evening (6pm - 10pm): Calm, sophisticated purples and pinks
            else if (hour >= 18 && hour < 22) {
                setTimeBasedColors({
                    primary: '#8b5cf6',   // Purple
                    secondary: '#a855f7', // Violet
                    accent: '#ec4899',    // Pink
                    gradient: 'from-purple-400 via-pink-400 to-rose-400',
                    name: 'Evening'
                });
            }
            // Night (10pm - 6am): Deep, focused indigos and blues
            else {
                setTimeBasedColors({
                    primary: '#4f46e5',   // Indigo
                    secondary: '#6366f1', // Blue-indigo
                    accent: '#3b82f6',    // Blue
                    gradient: 'from-indigo-600 via-blue-600 to-purple-600',
                    name: 'Night'
                });
            }
        };

        updateThemeByTime();

        // Update every 15 minutes
        const interval = setInterval(updateThemeByTime, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Apply CSS variables
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', timeBasedColors.primary);
        root.style.setProperty('--color-secondary', timeBasedColors.secondary);
        root.style.setProperty('--color-accent', timeBasedColors.accent);
    }, [timeBasedColors]);

    const value = {
        theme,
        setTheme,
        timeBasedColors,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
