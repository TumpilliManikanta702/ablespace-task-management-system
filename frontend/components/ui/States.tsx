'use client';

import React from 'react';
import { Loader2, FileQuestion, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function LoadingState({ message = 'Loading tasks...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export function EmptyState({
  title = 'No tasks found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 my-4">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mb-3">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  message = 'Unable to load data. Please try again.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl my-4">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
      <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Error Occurred</h4>
      <p className="text-xs text-red-600 dark:text-red-400 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
