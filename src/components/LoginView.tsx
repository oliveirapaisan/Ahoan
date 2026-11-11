import React, { useState } from 'react';
import { Lock, User, KeyRound, BookOpen, Volume2, GraduationCap, Backpack } from 'lucide-react';

export type UserRole = 'student' | 'teacher';

interface LoginViewProps {
  onLoginSuccess: (username: string, role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const u = username.trim();
    const w = password;

    // Check teacher credentials (L.Oliveira)
    if (u === 'L.Oliveira' && (w === 'Oliveira1710' || w === 'Oliveira2052')) {
      try {
        sessionStorage.setItem('ahoan-s', '1');
        sessionStorage.setItem('ahoan-user', 'L.Oliveira');
        sessionStorage.setItem('ahoan-role', 'teacher');
      } catch {
        // Storage might be restricted
      }
      setError('');
      onLoginSuccess('L.Oliveira', 'teacher');
      return;
    }

    // Check student credentials (M.Oliveira with Oliveira2052)
    if (u === 'M.Oliveira' && (w === 'Oliveira2052' || w === 'Oliveira1234')) {
      try {
        sessionStorage.setItem('ahoan-s', '1');
        sessionStorage.setItem('ahoan-user', 'M.Oliveira');
        sessionStorage.setItem('ahoan-role', 'student');
      } catch {
        // Storage might be restricted
      }
      setError('');
      onLoginSuccess('M.Oliveira', 'student');
      return;
    }

    setError('Erabiltzailea edo pasahitza okerra.');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top welcome card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white shadow-lg mb-3 shadow-emerald-500/20">
            <Volume2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-800 dark:text-stone-100">
            Ahoan · Ikasleak
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            Ahozko ulermena lantzeko plataforma
          </p>
        </div>

        {/* Login box */}
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Profile / Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl mb-6 border border-stone-200/80 dark:border-stone-700">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-stone-200/60 dark:border-stone-700'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              <Backpack className="w-4 h-4" />
              <span>Ikasleak</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('teacher');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'teacher'
                  ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-sm border border-stone-200/60 dark:border-stone-700'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Irakasleak</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-stone-100 dark:border-stone-700">
            <div className={`p-2 rounded-lg ${
              activeTab === 'teacher'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
            }`}>
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-800 dark:text-stone-100 text-lg leading-tight">
                {activeTab === 'teacher' ? 'Irakasleen sarbidea' : 'Ikasleen saioa'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {activeTab === 'teacher'
                  ? 'Sartu zure irakasle kontuarekin fitxak kudeatzeko'
                  : 'Sartu zure kontuarekin ariketak hasteko'}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Erabiltzailea
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="lu"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Erabiltzailea"
                  autoComplete="username"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Pasahitza
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="lp"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Pasahitza"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 text-white font-medium rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'teacher'
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Sartu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
