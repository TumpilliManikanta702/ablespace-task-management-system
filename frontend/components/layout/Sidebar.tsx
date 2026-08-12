'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CheckSquare,
  FolderKanban,
  User as UserIcon,
  Sun,
  Moon,
  Palette,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useColorMode } from '@/providers/ColorModeProvider';
import { Avatar } from '../ui/Avatar';
import { ColorMode } from '@/types';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();
  const [collapsed, setCollapsed] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const navItems = [
    { label: 'Tasks', href: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { label: 'Projects', href: '/projects', icon: <FolderKanban className="w-5 h-5" /> },
    { label: 'Profile', href: '/profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  const colorOptions: { id: ColorMode; name: string; bg: string }[] = [
    { id: 'blue', name: 'Blue', bg: 'bg-blue-500' },
    { id: 'amber', name: 'Amber', bg: 'bg-amber-500' },
    { id: 'pink', name: 'Pink', bg: 'bg-pink-500' },
    { id: 'rose', name: 'Rose', bg: 'bg-rose-500' },
    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500' },
    { id: 'black', name: 'Black', bg: 'bg-zinc-800' },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Workspace Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white font-bold shrink-0 shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                AbleSpace Workspace
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Pro Plan
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        {!collapsed && (
          <span className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
            Menu
          </span>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Theme & Accent Controls */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? (
            <Sun className="w-5 h-5 text-amber-500 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 text-blue-400 shrink-0" />
          )}
          {!collapsed && (
            <span>{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
          )}
        </button>

        {/* Accent Color Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Palette className="w-5 h-5 text-brand-600 shrink-0" />
            {!collapsed && (
              <span className="capitalize">Color Mode ({colorMode})</span>
            )}
          </button>

          {showColorPicker && (
            <div className="absolute bottom-full left-0 mb-2 p-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-500">Accent Color</span>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setColorMode(opt.id);
                      setShowColorPicker(false);
                    }}
                    className={`h-8 rounded-md flex items-center justify-center text-xs font-medium text-white transition-transform ${
                      opt.bg
                    } ${colorMode === opt.id ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-slate-100 scale-105' : 'hover:scale-105'}`}
                    title={opt.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Footer */}
      {user && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar name={user.name} src={user.avatar} size="md" />
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
