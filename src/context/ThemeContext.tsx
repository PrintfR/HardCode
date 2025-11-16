"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTheme as useNextTheme } from "next-themes";

interface ThemeContextType {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const { theme, setTheme } = useNextTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within ThemeProvider");
    }
    return context;
}

