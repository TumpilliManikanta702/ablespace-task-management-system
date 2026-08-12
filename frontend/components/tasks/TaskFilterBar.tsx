'use client';

import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, Plus, Filter, X } from 'lucide-react';
import { ViewMode, TaskFilters, VisibleFields, Priority, TaskStatus, User } from '@/types';
import { Button } from '../ui/Button';
import { FieldsDropdown } from './FieldsDropdown';

interface TaskFilterBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  visibleFields: VisibleFields;
  onVisibleFieldsChange: (fields: VisibleFields) => void;
  onAddTask: () => void;
  users: User[];
}

export function TaskFilterBar({
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  visibleFields,
  onVisibleFieldsChange,
  onAddTask,
  users,
}: TaskFilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input update to filters
  useEffect(() => {
    const handler = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || filters.memberId || filters.team
  );

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: View Switcher & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Board / List Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Board</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center min-w-[240px]">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, teams..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-xs rounded-lg border bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 py-2 pl-9 pr-3"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Filters, Fields, Add Task */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Select */}
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                priority: (e.target.value as Priority) || undefined,
              })
            }
            className="text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Priority: All</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="NO_PRIORITY">No Priority</option>
          </select>

          {/* Status Select */}
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: (e.target.value as TaskStatus) || undefined,
              })
            }
            className="text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Status: All</option>
            <option value="TO_DO">To Do</option>
            <option value="DOING">Doing</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>

          {/* Member Filter */}
          <select
            value={filters.memberId || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                memberId: e.target.value || undefined,
              })
            }
            className="text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Member: All</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-semibold hover:underline px-2 py-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Fields Dropdown */}
          <FieldsDropdown
            visibleFields={visibleFields}
            onChange={onVisibleFieldsChange}
          />

          {/* Add Task Primary Action */}
          <Button size="sm" onClick={onAddTask}>
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
