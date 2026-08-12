'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';
import { authApi, usersApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestLogin: () => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ablespace_token');
      if (token) {
        try {
          const profile = await usersApi.getProfile();
          setUser(profile);
        } catch (err) {
          console.error('Auth initialization error:', err);
          localStorage.removeItem('ablespace_token');
          localStorage.removeItem('ablespace_user');
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
      } else if (pathname !== '/login') {
        router.push('/login');
      }
      setLoading(false);
    };

    initAuth();
  }, [pathname, router]);

  const guestLogin = async () => {
    setLoading(true);
    try {
      const res = await authApi.guestLogin();
      setUser(res.user);
      router.push('/tasks');
    } catch (err) {
      console.error('Guest login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ablespace_token');
    localStorage.removeItem('ablespace_user');
    setUser(null);
    router.push('/login');
  };

  const updateUser = async (updated: Partial<User>) => {
    if (!user) return;
    const res = await usersApi.updateProfile(updated);
    setUser(res);
  };

  return (
    <AuthContext.Provider value={{ user, loading, guestLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
