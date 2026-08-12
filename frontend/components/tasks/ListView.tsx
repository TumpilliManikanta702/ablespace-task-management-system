'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, VisibleFields } from '@/types';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { ChevronDown, ChevronRight, Plus, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface ListViewProps {
  tasks: Task[];
  visibleFields: VisibleFields;
  onSelectTask: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export function ListView({
  tasks,
  visibleFields,
  onSelectTask,
  onQuickAddTask,
}: ListViewProps) {
  const groups: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'TO_DO', title: 'To Do', color: 'bg-slate-400' },
    { status: 'DOING', title: 'Doing', color: 'bg-blue-500' },
    { status: 'COMPLETED', title: 'Completed', color: 'bg-emerald-500' },
    { status: 'ON_HOLD', title: 'On Hold', color: 'bg-purple-500' },
  ];

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (status: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {groups.map(({ status, title, color }) => {
        const groupTasks = tasks.filter((t) => t.status === status);
        const isCollapsed = Boolean(collapsedGroups[status]);

        return (
          <div
            key={status}
            className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Group Collapsible Header */}
            <div
              onClick={() => toggleGroup(status)}
              className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <button className="text-slate-400">
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                <span className="px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-full">
                  {groupTasks.length}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAddTask(status);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            </div>

            {/* Group Table */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                      <th className="py-2.5 px-4 font-semibold">Task</th>
                      {visibleFields.priority && <th className="py-2.5 px-4 font-semibold">Priority</th>}
                      {visibleFields.members && <th className="py-2.5 px-4 font-semibold">Members</th>}
                      {visibleFields.dueDate && <th className="py-2.5 px-4 font-semibold">Due Date</th>}
                      {visibleFields.labels && <th className="py-2.5 px-4 font-semibold">Labels</th>}
                      {visibleFields.team && <th className="py-2.5 px-4 font-semibold">Team</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {groupTasks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 px-4 text-center text-slate-400 italic font-normal"
                        >
                          No tasks in {title}
                        </td>
                      </tr>
                    ) : (
                      groupTasks.map((task) => (
                        <tr
                          key={task.id}
                          onClick={() => onSelectTask(task)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                        >
                          {/* Title Column */}
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                            {task.title}
                          </td>

                          {/* Priority Column */}
                          {visibleFields.priority && (
                            <td className="py-3 px-4">
                              <PriorityBadge priority={task.priority} size="sm" />
                            </td>
                          )}

                          {/* Members Column */}
                          {visibleFields.members && (
                            <td className="py-3 px-4">
                              {task.members && task.members.length > 0 ? (
                                <div className="flex items-center -space-x-1.5 overflow-hidden">
                                  {task.members.map(({ user }) => (
                                    <Avatar key={user.id} name={user.name} src={user.avatar} size="xs" />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Unassigned</span>
                              )}
                            </td>
                          )}

                          {/* Due Date Column */}
                          {visibleFields.dueDate && (
                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                              {task.dueDate ? (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">-</span>
                              )}
                            </td>
                          )}

                          {/* Labels Column */}
                          {visibleFields.labels && (
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {task.labels && task.labels.length > 0 ? (
                                  task.labels.map(({ label }) => (
                                    <span
                                      key={label.id}
                                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                    >
                                      {label.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400 text-[11px]">-</span>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Team Column */}
                          {visibleFields.team && (
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                              {task.team || '-'}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
