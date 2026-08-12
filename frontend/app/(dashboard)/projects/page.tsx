'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project, ProjectPriority, User } from '@/types';
import { projectsApi, usersApi } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/States';
import { FolderKanban, Plus, Calendar, ArrowRight, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ProjectPriority>('MEDIUM');
  const [leadId, setLeadId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setError(null);
      const [projData, userData] = await Promise.all([
        projectsApi.getProjects(),
        usersApi.getAllUsers(),
      ]);
      setProjects(projData);
      setUsers(userData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await projectsApi.createProject({
        name,
        description,
        priority,
        leadId: leadId || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });

      setName('');
      setDescription('');
      setPriority('MEDIUM');
      setLeadId('');
      setDueDate('');
      setIsCreateModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Projects"
        subtitle="Organize tasks into structured projects and track overall completion progress."
      />

      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-brand-600" />
          <span>Active Projects ({projects.length})</span>
        </h2>

        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Main Projects Grid */}
      <main className="flex-1 p-6">
        {loading ? (
          <LoadingState message="Loading workspace projects..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchProjects} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects created yet"
            description="Create your first project to start grouping tasks."
            actionLabel="Create Project"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const taskCount = project.tasks?.length || 0;
              const completedCount =
                project.tasks?.filter((t) => t.status === 'COMPLETED').length || 0;
              const progressPct =
                taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                        {project.priority} Priority
                      </span>
                      {project.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(project.dueDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {project.name}
                    </h3>

                    {project.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Progress & Lead Footer */}
                  <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckSquare className="w-4 h-4 text-brand-600" />
                        <span>
                          {completedCount}/{taskCount} tasks completed
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {progressPct}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {project.lead ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={project.lead.name}
                            src={project.lead.avatar}
                            size="xs"
                          />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Lead: {project.lead.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No Lead Assigned</span>
                      )}

                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Project <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
          <Input
            label="Project Name *"
            placeholder="e.g. AbleSpace Web App v2.0"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Project description and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                className="text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Lead
              </label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Project Lead</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
