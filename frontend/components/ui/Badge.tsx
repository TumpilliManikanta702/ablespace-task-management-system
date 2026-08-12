'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Priority, TaskStatus } from '@/types';
import { AlertCircle, ArrowUp, ArrowRight, ArrowDown, Minus, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
  className?: string;
}

export function PriorityBadge({ priority, size = 'md', className }: PriorityBadgeProps) {
  const map: Record<Priority, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    URGENT: {
      label: 'Urgent',
      bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60',
      text: 'text-red-700 dark:text-red-400',
      icon: <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />,
    },
    HIGH: {
      label: 'High',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-700 dark:text-amber-400',
      icon: <ArrowUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />,
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-700 dark:text-blue-400',
      icon: <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />,
    },
    LOW: {
      label: 'Low',
      bg: 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
      text: 'text-slate-700 dark:text-slate-300',
      icon: <ArrowDown className="w-3 h-3 text-slate-500" />,
    },
    NO_PRIORITY: {
      label: 'No Priority',
      bg: 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
      text: 'text-slate-500 dark:text-slate-400',
      icon: <Minus className="w-3 h-3 text-slate-400" />,
    },
  };

  const item = map[priority] || map.NO_PRIORITY;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium border rounded-md',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
          item.bg,
          item.text,
          className
        )
      )}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const map: Record<TaskStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    TO_DO: {
      label: 'To Do',
      bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      text: 'text-slate-700 dark:text-slate-300',
      icon: <Clock className="w-3 h-3 text-slate-500" />,
    },
    DOING: {
      label: 'Doing',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-700 dark:text-blue-400',
      icon: <PlayCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />,
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
    },
    ON_HOLD: {
      label: 'On Hold',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60',
      text: 'text-purple-700 dark:text-purple-400',
      icon: <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />,
    },
  };

  const item = map[status] || map.TO_DO;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium border rounded-md',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
          item.bg,
          item.text,
          className
        )
      )}
    >
      {item.icon}
      {item.label}
    </span>
  );
}
