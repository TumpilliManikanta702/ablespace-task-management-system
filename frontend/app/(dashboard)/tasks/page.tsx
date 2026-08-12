'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Task, ViewMode, TaskFilters, VisibleFields, TaskStatus, Project, User } from '@/types';
import { tasksApi, projectsApi, usersApi } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar';
import { BoardView } from '@/components/tasks/BoardView';
import { ListView } from '@/components/tasks/ListView';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/States';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
    team: true,
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quickAddStatus, setQuickAddStatus] = useState<TaskStatus>('TO_DO');

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await tasksApi.getTasks(filters);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks from backend server.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchMetaData = async () => {
    try {
      const [projData, userData] = await Promise.all([
        projectsApi.getProjects(),
        usersApi.getAllUsers(),
      ]);
      setProjects(projData);
      setUsers(userData);
    } catch (err) {
      console.error('Failed to load projects/users metadata:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchMetaData();
  }, []);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleQuickAddTask = (status: TaskStatus) => {
    setQuickAddStatus(status);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header
        title="Task Management"
        subtitle="Manage, track, and organize your team tasks across Board and List views."
      />

      {/* Filter & Controls Bar */}
      <TaskFilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
        visibleFields={visibleFields}
        onVisibleFieldsChange={setVisibleFields}
        onAddTask={() => handleQuickAddTask('TO_DO')}
        users={users}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {loading ? (
          <LoadingState message="Loading tasks from PostgreSQL database..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTasks} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks match your filter"
            description="Clear search or filter options to see all tasks."
            actionLabel="Create New Task"
            onAction={() => handleQuickAddTask('TO_DO')}
          />
        ) : viewMode === 'board' ? (
          <BoardView
            tasks={tasks}
            visibleFields={visibleFields}
            onSelectTask={handleSelectTask}
            onQuickAddTask={handleQuickAddTask}
          />
        ) : (
          <ListView
            tasks={tasks}
            visibleFields={visibleFields}
            onSelectTask={handleSelectTask}
            onQuickAddTask={handleQuickAddTask}
          />
        )}
      </main>

      {/* Task Details Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTask(null);
        }}
        onTaskUpdated={fetchTasks}
        projects={projects}
        users={users}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={fetchTasks}
        defaultStatus={quickAddStatus}
        projects={projects}
        users={users}
      />
    </div>
  );
}
