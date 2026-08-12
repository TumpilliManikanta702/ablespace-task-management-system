'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function DatePicker({ value, onChange, label, className = '' }: DatePickerProps) {
  // Convert ISO string to YYYY-MM-DD for standard date input
  const formattedValue = value ? new Date(value).toISOString().split('T')[0] : '';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none">
          <Calendar className="w-4 h-4" />
        </div>
        <input
          type="date"
          value={formattedValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent py-2 pl-9 pr-3"
        />
      </div>
    </div>
  );
}
