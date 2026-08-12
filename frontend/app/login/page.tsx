'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Layers, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { guestLogin } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [googleNotice, setGoogleNotice] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await guestLogin();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to authenticate guest session. Please check backend server.';
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setGoogleNotice(true);
    setTimeout(() => setGoogleNotice(false), 4000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* Centered Login Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
        {/* AbleSpace Logo Icon */}
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg mb-4">
          <Layers className="w-7 h-7" />
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Let&apos;s get back on track
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-xs">
          Sign in to your account or continue as a guest to access AbleSpace workspace.
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Visual Button Notice */}
        {googleNotice && (
          <div className="w-full mb-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs rounded-xl text-left">
            Google login is visually integrated for Figma fidelity. Use <strong>Continue as Guest</strong> for immediate full-stack authentication!
          </div>
        )}

        {/* Form Fields & Actions */}
        <div className="w-full flex flex-col gap-4 text-left">
          <Input
            label="Work Email"
            type="email"
            placeholder="name@company.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />

          {/* Primary Action: Continue as Guest */}
          <Button
            size="lg"
            className="w-full font-bold shadow-md"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            <UserCheck className="w-5 h-5" />
            <span>{loading ? 'Authenticating Guest...' : 'Continue as Guest'}</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase">
              Or
            </span>
          </div>

          {/* Google Login Option */}
          <button
            onClick={handleGoogleClick}
            type="button"
            className="flex items-center justify-center gap-3 w-full py-2.5 px-4 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Login with Google</span>
          </button>
        </div>

        {/* Footer Legal Terms */}
        <div className="mt-8 text-[11px] text-slate-400 dark:text-slate-500">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
