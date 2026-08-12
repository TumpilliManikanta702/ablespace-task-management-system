'use client';

import React from 'react';
import { Task, VisibleFields } from '@/types';
import { PriorityBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Calendar, CheckSquare, MessageSquare, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  visibleFields: VisibleFields;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, visibleFields, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const commentCount = task.comments?.length || 0;

  return (
    <div
      onClick={() => onClick(task)}
      className="group relative flex flex-col gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer select-none"
    >
      {/* Labels row */}
      {visibleFields.labels && task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.labels.map(({ label }) => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <Tag className="w-2.5 h-2.5" />
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
        {task.title}
      </h4>

      {/* Description Snippet if available */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Metadata Row: Priority & Due Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {visibleFields.priority && (
          <PriorityBadge priority={task.priority} size="sm" />
        )}

        {visibleFields.dueDate && task.dueDate && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
      </div>

      {/* Footer Row: Subtasks, Comments & Assignee Avatars */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          )}

          {commentCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>{commentCount}</span>
            </div>
          )}
        </div>

        {/* Members Avatar Stack */}
        {visibleFields.members && task.members && task.members.length > 0 && (
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {task.members.map(({ user }) => (
              <Avatar key={user.id} name={user.name} src={user.avatar} size="xs" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
