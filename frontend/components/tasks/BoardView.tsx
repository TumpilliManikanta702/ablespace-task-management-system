'use client';

import React from 'react';
import { Task, TaskStatus, VisibleFields } from '@/types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface BoardViewProps {
  tasks: Task[];
  visibleFields: VisibleFields;
  onSelectTask: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export function BoardView({
  tasks,
  visibleFields,
  onSelectTask,
  onQuickAddTask,
}: BoardViewProps) {
  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'TO_DO', title: 'To Do', color: 'bg-slate-400' },
    { status: 'DOING', title: 'Doing', color: 'bg-blue-500' },
    { status: 'COMPLETED', title: 'Completed', color: 'bg-emerald-500' },
    { status: 'ON_HOLD', title: 'On Hold', color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 min-h-[calc(100vh-160px)]">
      {columns.map(({ status, title, color }) => {
        const columnTasks = tasks.filter((t) => t.status === status);

        return (
          <div
            key={status}
            className="flex flex-col bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                <span className="px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onQuickAddTask(status)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title={`Add task to ${title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 font-medium">No tasks in {title}</span>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    visibleFields={visibleFields}
                    onClick={onSelectTask}
                  />
                ))
              )}
            </div>

            {/* Quick Add Footer Button */}
            <button
              onClick={() => onQuickAddTask(status)}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
