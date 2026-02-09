"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
// import { useSession } from "next-auth/react"; // If auth is used

type Density = "compact" | "relaxed";
type Theme = "light" | "dark" | "glass";

interface UserPreference {
    density: Density;
    theme: Theme;
    sidebarOpen: boolean;
}

interface UserPreferenceContextType {
    preferences: UserPreference;
    setDensity: (density: Density) => void;
    setTheme: (theme: Theme) => void;
    toggleSidebar: () => void;
}

const defaultPreferences: UserPreference = {
    density: "relaxed",
    theme: "light",
    sidebarOpen: true,
};

const UserPreferenceContext = createContext<UserPreferenceContextType | undefined>(undefined);

export function UserPreferenceProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreference>(defaultPreferences);
    // const { data: session } = useSession();

    // Load preferences from local storage or API on mount
    useEffect(() => {
        // API integration would go here
        // For now, load from localStorage
        const saved = localStorage.getItem("user-preferences");
        if (saved) {
            try {
                setPreferences(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse user preferences", e);
            }
        }
    }, []);

    // Save to localStorage whenever preferences change
    useEffect(() => {
        localStorage.setItem("user-preferences", JSON.stringify(preferences));
        // Optional: Sync to backend API here
    }, [preferences]);

    const setDensity = (density: Density) => {
        setPreferences((prev) => ({ ...prev, density }));
    };

    const setTheme = (theme: Theme) => {
        setPreferences((prev) => ({ ...prev, theme }));
        // Update HTML class for theme
        document.documentElement.className = theme;
    };

    const toggleSidebar = () => {
        setPreferences((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
    };

    return (
        <UserPreferenceContext.Provider value={{ preferences, setDensity, setTheme, toggleSidebar }}>
            {children}
        </UserPreferenceContext.Provider>
    );
}

export function useUserPreference() {
    const context = useContext(UserPreferenceContext);
    if (context === undefined) {
        throw new Error("useUserPreference must be used within a UserPreferenceProvider");
    }
    return context;
}
