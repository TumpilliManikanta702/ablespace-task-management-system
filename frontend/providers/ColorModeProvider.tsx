'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorMode } from '@/types';

interface ColorModeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

const COLOR_MAP: Record<ColorMode, { 50: string; 100: string; 200: string; 500: string; 600: string; 700: string }> = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  black: {
    50: '#f4f4f5',
    100: '#e4e4e7',
    200: '#d4d4d8',
    500: '#3f3f46',
    600: '#27272a',
    700: '#18181b',
  },
};

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');

  const applyColorMode = (mode: ColorMode) => {
    const palette = COLOR_MAP[mode] || COLOR_MAP.blue;
    const root = document.documentElement;
    root.style.setProperty('--color-brand-50', palette[50]);
    root.style.setProperty('--color-brand-100', palette[100]);
    root.style.setProperty('--color-brand-200', palette[200]);
    root.style.setProperty('--color-brand-500', palette[500]);
    root.style.setProperty('--color-brand-600', palette[600]);
    root.style.setProperty('--color-brand-700', palette[700]);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('ablespace_colormode') as ColorMode;
    if (savedMode && COLOR_MAP[savedMode]) {
      setColorModeState(savedMode);
      applyColorMode(savedMode);
    } else {
      applyColorMode('blue');
    }
  }, []);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('ablespace_colormode', mode);
    applyColorMode(mode);
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
}
