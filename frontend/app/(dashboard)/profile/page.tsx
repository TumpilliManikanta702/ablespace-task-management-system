'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useColorMode } from '@/providers/ColorModeProvider';
import { Header } from '@/components/layout/Header';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { usersApi } from '@/lib/api';
import { User, LogOut, ShieldAlert, CheckCircle, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle(user.title || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateUser({ name, title, username });
      setSuccessMsg('Profile details saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveWorkspace = async () => {
    if (
      confirm(
        'Are you sure you want to leave the AbleSpace Workspace? This will clear your active session.'
      )
    ) {
      try {
        await usersApi.leaveWorkspace();
      } catch (err) {
        console.error(err);
      }
      logout();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="User Profile & Settings"
        subtitle="Manage your personal preferences, title, workspace role, and security access."
      />

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <Avatar name={user.name} src={user.avatar} size="lg" className="w-20 h-20 text-xl shadow-md" />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.title || 'Team Member'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                {user.isGuest ? 'Guest User' : 'Workspace Member'}
              </span>
              <span className="text-xs text-slate-400 font-mono">@{user.username}</span>
            </div>
          </div>
        </div>

        {/* Save Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Details Form */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            Account Details
          </h3>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Full Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                label="Email Address"
                value={email}
                disabled
                className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-75"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Workspace Access Section */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-200 dark:border-slate-800">
            Workspace Access & Permissions
          </h3>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Remove Yourself from Workspace
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Disconnect your account access from AbleSpace demo workspace.
                </span>
              </div>
            </div>

            <Button variant="danger" size="sm" onClick={handleLeaveWorkspace}>
              <LogOut className="w-4 h-4" />
              <span>Leave Workspace</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
