'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User as UserType } from "@/lib/types";

type User = UserType;

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    firstName: string,
    middleName: string | undefined,
    lastName: string,
    email: string,
    password: string,
    department?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on mount to prevent hydration mismatches
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response received:', text);
        return { success: false, error: 'Server error - unexpected response format' };
      }
      
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Login failed' };
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (
    firstName: string,
    middleName: string | undefined,
    lastName: string,
    email: string,
    password: string,
    department?: string
  ) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, middleName, lastName, email, password, department }),
      });
      
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response received:', text);
        return { success: false, error: 'Server error - unexpected response format' };
      }
      
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Registration failed' };
      // Optionally auto-login after registration
      setUser(data);
      setToken(null); // No token returned on register, require login
      return { success: true };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  // Google login function
  const loginWithGoogle = async (credential: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response received:', text);
        return { success: false, error: 'Server error - unexpected response format' };
      }
      
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Google authentication failed' };
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err: any) {
      console.error('Google login error:', err);
      return { success: false, error: err.message || 'Google authentication failed' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user: isInitialized ? user : null,
    token: isInitialized ? token : null,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 