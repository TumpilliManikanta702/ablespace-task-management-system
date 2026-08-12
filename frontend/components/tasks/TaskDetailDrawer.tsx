'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority, Project, User, Subtask, Comment } from '@/types';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { DatePicker } from '../ui/DatePicker';
import { Button } from '../ui/Button';
import {
  X,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  MessageSquare,
  CheckSquare,
  Calendar,
  User as UserIcon,
  Folder,
  Send,
  ExternalLink,
} from 'lucide-react';
import { tasksApi, subtasksApi, commentsApi } from '@/lib/api';
import { format } from 'date-fns';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  projects: Project[];
  users: User[];
}

export function TaskDetailDrawer({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
  projects,
  users,
}: TaskDetailDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TO_DO');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [projectId, setProjectId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [team, setTeam] = useState<string>('');
  const [resources, setResources] = useState<string>('');

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setProjectId(task.projectId || '');
      setDueDate(task.dueDate || '');
      setTeam(task.team || '');
      setResources(task.resources || '');
      setSubtasks(task.subtasks || []);
      setComments(task.comments || []);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleUpdateTaskField = async (fields: Partial<Task>) => {
    try {
      await tasksApi.updateTask(task.id, fields);
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      const created = await subtasksApi.createSubtask({
        title: newSubtaskTitle,
        taskId: task.id,
      });
      setSubtasks([...subtasks, created]);
      setNewSubtaskTitle('');
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  const handleToggleSubtask = async (subtask: Subtask) => {
    try {
      const updated = await subtasksApi.updateSubtask(subtask.id, {
        completed: !subtask.completed,
      });
      setSubtasks(subtasks.map((st) => (st.id === subtask.id ? updated : st)));
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  const handleDeleteSubtask = async (id: string) => {
    try {
      await subtasksApi.deleteSubtask(id);
      setSubtasks(subtasks.filter((st) => st.id !== id));
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to delete subtask:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;
    setIsSubmittingComment(true);
    try {
      const authorId = users[0]?.id || task.reporterId || 'guest_id';
      const created = await commentsApi.createComment({
        content: newCommentContent,
        taskId: task.id,
        authorId,
      });
      setComments([created, ...comments]);
      setNewCommentContent('');
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteTask = async () => {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      try {
        await tasksApi.deleteTask(task.id);
        onTaskUpdated();
        onClose();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <StatusBadge status={status} size="sm" />
              <PriorityBadge priority={priority} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteTask}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Task Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleUpdateTaskField({ title })}
              className="text-xl font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-brand-500 focus:outline-none py-1 transition-colors"
              placeholder="Task Title..."
            />

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
              {/* Status Selector */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" /> Status
                </span>
                <select
                  value={status}
                  onChange={(e) => {
                    const val = e.target.value as TaskStatus;
                    setStatus(val);
                    handleUpdateTaskField({ status: val });
                  }}
                  className="rounded-md border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 p-1.5 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="TO_DO">To Do</option>
                  <option value="DOING">Doing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  Priority
                </span>
                <select
                  value={priority}
                  onChange={(e) => {
                    const val = e.target.value as Priority;
                    setPriority(val);
                    handleUpdateTaskField({ priority: val });
                  }}
                  className="rounded-md border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 p-1.5 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="NO_PRIORITY">No Priority</option>
                </select>
              </div>

              {/* Project Selector */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" /> Project
                </span>
                <select
                  value={projectId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProjectId(val);
                    handleUpdateTaskField({ projectId: val || undefined });
                  }}
                  className="rounded-md border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 p-1.5 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">No Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date Picker */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </span>
                <input
                  type="date"
                  value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDueDate(val);
                    handleUpdateTaskField({ dueDate: val ? new Date(val).toISOString() : undefined });
                  }}
                  className="rounded-md border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 p-1.5 font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleUpdateTaskField({ description })}
                rows={3}
                placeholder="Add detailed task description..."
                className="w-full text-xs rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            {/* Subtasks Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-brand-600" />
                  Subtasks ({subtasks.filter((st) => st.completed).length}/{subtasks.length})
                </h4>
              </div>

              {/* Add Subtask Input Form */}
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Button size="sm" type="submit" variant="secondary">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </Button>
              </form>

              {/* Subtasks List */}
              <div className="flex flex-col gap-1.5 mt-1">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 group"
                  >
                    <div
                      onClick={() => handleToggleSubtask(subtask)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1"
                    >
                      {subtask.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          subtask.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments & History Section */}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                Comments & Activity ({comments.length})
              </h4>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex flex-col gap-2">
                <textarea
                  rows={2}
                  placeholder="Write a comment..."
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  className="w-full text-xs rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
                <div className="flex justify-end">
                  <Button size="sm" type="submit" disabled={isSubmittingComment || !newCommentContent.trim()}>
                    <Send className="w-3.5 h-3.5" />
                    <span>Comment</span>
                  </Button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="flex flex-col gap-3 mt-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <Avatar name={comment.author?.name || 'User'} src={comment.author?.avatar} size="xs" />
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {comment.author?.name || 'User'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
