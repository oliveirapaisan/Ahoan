import React from 'react';
import { Headphones, Moon, Sun, Volume2, VolumeX, LogOut, ChevronDown, GraduationCap, User, FilePlus, Award, LayoutDashboard, FileText } from 'lucide-react';
import { SUBJECT_COLORS, AppSubject } from '../data/ahoanData';
import { UserRole } from './LoginView';

export type TeacherTab = 'arbela' | 'create_fitxa' | 'gradebook' | 'grades_list' | 'grades_progress';

interface HeaderProps {
  currentLang: AppSubject;
  currentLevel: number;
  currentUser: string;
  userRole: UserRole;
  teacherTab?: TeacherTab;
  gradesPublished?: boolean;
  onOpenReportCard?: () => void;
  isDark: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onSelectLang: (lang: AppSubject) => void;
  onSelectLevel: (level: number) => void;
  onChangeTeacherTab?: (tab: TeacherTab) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  currentLevel,
  currentUser,
  userRole,
  teacherTab = 'arbela',
  gradesPublished = false,
  onOpenReportCard,
  isDark,
  soundEnabled,
  onToggleSound,
  onToggleTheme,
  onSelectLang,
  onSelectLevel,
  onChangeTeacherTab,
  onLogout,
}) => {
  const isEn = currentLang === 'ingles';
  const themeColor = SUBJECT_COLORS[currentLang].hex;
  const isTeacher = userRole === 'teacher';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-colors"
            style={{ backgroundColor: themeColor }}
          >
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-stone-900 dark:text-stone-100 text-lg leading-tight flex items-center gap-1.5">
              <span>Ahoan</span>
              <span className="text-stone-400 font-light">·</span>
              <span className="text-stone-600 dark:text-stone-400 font-medium">Ikasleak</span>
            </h1>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 leading-none">
              Ahozko ulermena eta ariketak
            </p>
          </div>
        </div>

        {/* Level and Language selectors */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Maila / Level Select */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Maila:
            </span>
            <div className="relative inline-block">
              <select
                id="cur"
                value={currentLevel}
                onChange={(e) => onSelectLevel(Number(e.target.value))}
                className="bg-transparent text-stone-800 dark:text-stone-200 font-semibold text-xs sm:text-sm pl-1 pr-6 py-0.5 appearance-none focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100">
                    {num}. maila
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-0.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Subject / Language toggle buttons */}
          <nav id="nav" className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => onSelectLang('euskera')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentLang === 'euskera'
                  ? 'bg-[#27ae60] text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Euskara
            </button>
            <button
              onClick={() => onSelectLang('lengua')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentLang === 'lengua'
                  ? 'bg-[#e11d48] text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Lengua
            </button>
            <button
              onClick={() => onSelectLang('ingles')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentLang === 'ingles'
                  ? 'bg-[#2e86de] text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onSelectLang('matematika')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentLang === 'matematika'
                  ? 'bg-[#f59e0b] text-stone-950 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Mate
            </button>
          </nav>
        </div>

        {/* Right utility buttons & User Info */}
        <div className="flex items-center gap-2">
          {/* Student Report Card button if published */}
          {!isTeacher && gradesPublished && onOpenReportCard && (
            <button
              onClick={onOpenReportCard}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer animate-pulse"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Nire Notak</span>
            </button>
          )}

          {/* User Role Badge */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
            isTeacher
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400'
          }`}>
            {isTeacher ? (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Irakaslea · {currentUser}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{currentUser}</span>
              </>
            )}
          </div>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Soinua itzali' : 'Soinua piztu'}
            className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Modu argia' : 'Modu iluna'}
            className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            title="Saioa itxi"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Irten</span>
          </button>
        </div>
      </div>

      {/* Teacher Action Subheader Bar */}
      {isTeacher && onChangeTeacherTab && (
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-t border-amber-200/50 dark:border-amber-800/40 px-4 py-1.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider hidden sm:inline font-mono">
              Irakasle Panela:
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => onChangeTeacherTab('arbela')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherTab === 'arbela'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>✏️ Arbela</span>
              </button>

              <button
                onClick={() => onChangeTeacherTab('create_fitxa')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherTab === 'create_fitxa'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>➕ Fitxa Berria Sortu</span>
              </button>

              <button
                onClick={() => onChangeTeacherTab('grades_list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherTab === 'grades_list'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>👁️ Jarritako Notak</span>
              </button>

              <button
                onClick={() => onChangeTeacherTab('grades_progress')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherTab === 'grades_progress'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📊 Nola Doazen Notak</span>
              </button>

              <button
                onClick={() => onChangeTeacherTab('gradebook')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherTab === 'gradebook'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>📝 Notak Jarri (3ko erregela)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
