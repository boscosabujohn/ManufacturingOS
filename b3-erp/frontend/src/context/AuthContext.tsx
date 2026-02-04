'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    userType: string;
    isSystemAdmin?: boolean;
    permissions?: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: any, token: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    const initialUser = JSON.parse(savedUser);
                    setUser(initialUser);

                    // Fetch latest profile to ensure permissions/isSystemAdmin are up to date
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                    const response = await fetch(`${apiUrl}/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const latestUser = await response.json();
                        setUser(latestUser);
                        localStorage.setItem('user', JSON.stringify(latestUser));
                    } else if (response.status === 401) {
                        logout();
                    }
                } catch (error) {
                    console.error('Failed to initialize auth:', error);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData: any, token: string) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        // System Admin bypass
        if (user.isSystemAdmin || user.permissions?.includes('SUPER_ADMIN') || user.permissions?.includes('*')) return true;
        return user.permissions?.includes(permission) || false;
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasPermission }}>
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
