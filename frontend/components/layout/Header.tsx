'use client';

import React from 'react';
import { Bell, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'Dashboard', subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Guest Session Badge */}
        {user?.isGuest && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Authenticated Guest Session</span>
          </div>
        )}

        {/* Demo Notification Indicator */}
        <div className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
        </div>

        {/* AI Agent / AbleSpace Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 rounded-lg text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AbleSpace Assessment v1.0</span>
        </div>
      </div>
    </header>
  );
}
