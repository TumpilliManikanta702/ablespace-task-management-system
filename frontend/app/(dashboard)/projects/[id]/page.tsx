'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project, Task, VisibleFields } from '@/types';
import { projectsApi, tasksApi } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { BoardView } from '@/components/tasks/BoardView';
import { ListView } from '@/components/tasks/ListView';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/States';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, FolderKanban, LayoutGrid, List, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const visibleFields: VisibleFields = {
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
    team: true,
  };

  const fetchProjectDetails = async () => {
    try {
      setError(null);
      const proj = await projectsApi.getProjectById(projectId);
      setProject(proj);
      const projTasks = await tasksApi.getTasks({ projectId });
      setTasks(projTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (loading) return <LoadingState message="Loading project details..." />;
  if (error || !project) return <ErrorState message={error || 'Project not found'} />;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          onClick={() => router.push('/projects')}
          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {project.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {project.description || 'Project Tasks & Scope Management'}
          </p>
        </div>
      </div>

      {/* Project Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Lead:</span>
            {project.lead ? (
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Avatar name={project.lead.name} src={project.lead.avatar} size="xs" />
                <span>{project.lead.name}</span>
              </div>
            ) : (
              <span className="text-slate-400 font-medium">Unassigned</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Priority:</span>
            <span className="font-bold text-brand-600 dark:text-brand-400 uppercase">
              {project.priority}
            </span>
          </div>

          {project.dueDate && (
            <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Target: {format(new Date(project.dueDate), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {/* View Switcher & Add Task */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                viewMode === 'board'
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
                viewMode === 'list'
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
          </div>

          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Main Tasks List/Board for Project */}
      <main className="flex-1">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks in this project"
            description="Add your first task to start tracking progress for this project."
            actionLabel="Add Task to Project"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : viewMode === 'board' ? (
          <BoardView
            tasks={tasks}
            visibleFields={visibleFields}
            onSelectTask={(task) => {
              setSelectedTask(task);
              setIsDrawerOpen(true);
            }}
            onQuickAddTask={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <ListView
            tasks={tasks}
            visibleFields={visibleFields}
            onSelectTask={(task) => {
              setSelectedTask(task);
              setIsDrawerOpen(true);
            }}
            onQuickAddTask={() => setIsCreateModalOpen(true)}
          />
        )}
      </main>

      {/* Task Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTask(null);
        }}
        onTaskUpdated={fetchProjectDetails}
        projects={[project]}
        users={[]}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={fetchProjectDetails}
        projects={[project]}
        users={[]}
      />
    </div>
  );
}
