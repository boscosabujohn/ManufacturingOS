'use client';

import * as React from 'react';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    userType: string;
    companyId: string;         // required for multi-tenant API calls
    isSystemAdmin?: boolean;
    permissions?: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

// DEMO MODE: when enabled (baked into the deployed image), auth is bypassed —
// the app treats the visitor as a system admin and never calls the auth API.
// Off by default so local dev keeps the real login flow. See middleware.ts.
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const DEMO_USER: User = {
    id: 'demo-admin',
    username: 'admin',
    email: 'admin@manufacturingos.com',
    firstName: 'Demo',
    lastName: 'Admin',
    fullName: 'Demo Admin',
    userType: 'admin',
    companyId: 'demo-company',
    isSystemAdmin: true,
    permissions: ['*'],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(DEMO_MODE ? DEMO_USER : null);
    const [isLoading, setIsLoading] = useState(!DEMO_MODE);
    const router = useRouter();

    const logout = useCallback(async () => {
        if (DEMO_MODE) {
            // No real session to end in demo — stay signed in as the demo admin.
            router.push('/dashboard');
            return;
        }
        try {
            await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch {
            // best-effort
        }
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    }, [router]);

    const refreshUser = useCallback(async () => {
        if (DEMO_MODE) return; // no auth API in demo mode
        try {
            const response = await fetch(`${API_URL}/auth/profile`, { credentials: 'include' });
            if (response.ok) {
                const latestUser: User = await response.json();
                setUser(latestUser);
                localStorage.setItem('user', JSON.stringify(latestUser));
            } else if (response.status === 401) {
                await logout();
            }
        } catch {
            // network error — keep current user state
        }
    }, [logout]);

    useEffect(() => {
        if (DEMO_MODE) {
            // Seed localStorage so service clients that read the cached user
            // (e.g. companyId for API calls) work without a real login.
            localStorage.setItem('user', JSON.stringify(DEMO_USER));
            setIsLoading(false);
            return;
        }
        const initAuth = async () => {
            const saved = localStorage.getItem('user');
            if (saved) {
                try {
                    setUser(JSON.parse(saved));
                    await refreshUser();  // sync with server on every app load
                } catch {
                    // malformed localStorage data
                }
            }
            setIsLoading(false);
        };
        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (userData: User) => {
        // Only the (non-secret) user profile is cached for fast reloads. The auth
        // tokens live exclusively in HttpOnly cookies set by the backend — never
        // in localStorage, so they are not reachable by injected scripts.
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        if (user.isSystemAdmin || user.permissions?.includes('SUPER_ADMIN') || user.permissions?.includes('*')) return true;
        return user.permissions?.includes(permission) ?? false;
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
