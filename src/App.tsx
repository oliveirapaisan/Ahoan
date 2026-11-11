/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header, TeacherTab } from './components/Header';
import { LoginView, UserRole } from './components/LoginView';
import { LevelPicker } from './components/LevelPicker';
import { ArbelaView } from './components/ArbelaView';
import { FitxaView } from './components/FitxaView';
import { FitxaCreator } from './components/FitxaCreator';
import { GradebookView } from './components/GradebookView';
import { StudentReportCard } from './components/StudentReportCard';
import { D, FX, AudioItem, Question, AppSubject, LanguageData } from './data/ahoanData';
import {
  GradeRecord,
  CustomFitxa,
  StudentSubmission,
  loadGradesFromStorage,
  saveGradesToStorage,
  loadCustomFitxakFromStorage,
  saveCustomFitxakToStorage,
  loadSubmissionsFromStorage,
  saveSubmissionsToStorage,
  purgeUnsentSubmissions,
  isGradesPublished,
  convertRuleOfThree,
} from './data/gradebookData';
import { sounds } from './utils/audioChime';

interface AppState {
  c: number; // Current level (1 - 6)
  id: AppSubject; // Current subject
  ans: Record<string, Record<number, number> & { done?: boolean }>;
}

export default function App() {
  // Authentication state
  const [auth, setAuth] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ahoan-s') === '1';
    } catch {
      return false;
    }
  });

  // Current user username and role
  const [currentUser, setCurrentUser] = useState<string>(() => {
    try {
      return sessionStorage.getItem('ahoan-user') || 'Ikaslea';
    } catch {
      return 'Ikaslea';
    }
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      return (sessionStorage.getItem('ahoan-role') as UserRole) || 'student';
    } catch {
      return 'student';
    }
  });

  // Level picked state for this session
  const [picked, setPicked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ahoan-picked') === '1';
    } catch {
      return false;
    }
  });

  // Teacher navigation tab: 'notak_jarri' / 'arbela' | 'create_fitxa' | 'gradebook'
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('arbela');

  // Teacher-created custom fitxak
  const [customFitxak, setCustomFitxak] = useState<CustomFitxa[]>(() => {
    return loadCustomFitxakFromStorage();
  });

  // Grade records strictly for M.Oliveira
  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    return loadGradesFromStorage();
  });

  // Student exercise submissions
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    return loadSubmissionsFromStorage();
  });

  // Student report card modal toggle
  const [showStudentReportCard, setShowStudentReportCard] = useState<boolean>(false);

  // App core persistent state (level, subject, answers)
  const [state, setState] = useState<AppState>(() => {
    const defaultAnswers: Record<string, Record<number, number> & { done?: boolean }> = {
      e4a2: {
        0: 0,
        1: 1,
        2: 3,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        done: true,
      },
    };
    const defaultState: AppState = {
      c: 4,
      id: 'euskera',
      ans: defaultAnswers,
    };
    try {
      const stored = localStorage.getItem('ahoan-ikasle');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.ans) parsed.ans = {};
        // Eliminate unsent answers
        const cleanedAns: Record<string, Record<number, number> & { done?: boolean }> = {};
        for (const [k, v] of Object.entries(parsed.ans as Record<string, any>)) {
          if (v && v.done) {
            cleanedAns[k] = v;
          }
        }
        if (!cleanedAns.e4a2 || !cleanedAns.e4a2.done) {
          cleanedAns.e4a2 = defaultAnswers.e4a2;
        }
        // Ensure subject starts in euskera by default
        const activeSubj = parsed.id === 'ingles' ? 'euskera' : (parsed.id || 'euskera');
        return { ...defaultState, ...parsed, ans: cleanedAns, id: activeSubj };
      }
    } catch {
      // Fallback
    }
    return defaultState;
  });

  // Current active fitxa key (null = arbela view)
  const [activeFitxaKey, setActiveFitxaKey] = useState<string | null>(null);

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ahoan-theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sound effects enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ahoan-sound') !== '0';
    } catch {
      return true;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ahoan-ikasle', JSON.stringify(state));
    } catch {
      // Storage restricted
    }
  }, [state]);

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('ahoan-theme', isDark ? 'dark' : 'light');
    } catch {
      // Ignore
    }
  }, [isDark]);

  // Sync sounds
  useEffect(() => {
    sounds.enabled = soundEnabled;
    try {
      localStorage.setItem('ahoan-sound', soundEnabled ? '1' : '0');
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Dynamically merge base dataset with teacher custom fitxak
  const mergedD: Record<AppSubject, LanguageData> = useMemo(() => {
    const cloned = JSON.parse(JSON.stringify(D));
    customFitxak.forEach((f) => {
      const subj = f.subject as AppSubject;
      if (!cloned[subj]) {
        cloned[subj] = { ext: {}, own: {} };
      }
      if (!cloned[subj].ext) {
        cloned[subj].ext = {};
      }
      const lvlStr = String(f.level);
      if (!cloned[subj].ext[lvlStr]) {
        cloned[subj].ext[lvlStr] = [];
      }
      cloned[subj].ext[lvlStr].push({
        t: f.t,
        k: f.k,
        u: f.u,
        f: f.f,
        description: f.description,
        passage: f.passage,
        activityType: f.activityType,
      });
    });
    return cloned;
  }, [customFitxak]);

  // Dynamically merge questions
  const mergedFX: Record<string, Question[]> = useMemo(() => {
    const cloned = { ...FX };
    customFitxak.forEach((f) => {
      cloned[f.k] = f.questions;
    });
    return cloned;
  }, [customFitxak]);

  // Save custom fitxa
  const handleSaveCustomFitxa = (newFitxa: CustomFitxa) => {
    const updated = [newFitxa, ...customFitxak];
    setCustomFitxak(updated);
    saveCustomFitxakToStorage(updated);
    setState((prev) => ({
      ...prev,
      c: newFitxa.level,
      id: newFitxa.subject,
    }));
  };

  // Delete custom fitxa
  const handleDeleteCustomFitxa = (key: string) => {
    const updated = customFitxak.filter((f) => f.k !== key);
    setCustomFitxak(updated);
    saveCustomFitxakToStorage(updated);
  };

  // Save grade (Strictly M.Oliveira, and exclude Audioa 1)
  const handleSaveGrade = (gradeRecord: GradeRecord) => {
    if (gradeRecord.studentName !== 'M.Oliveira') return;
    if (gradeRecord.activityTitle?.includes('Audioa 1')) return;

    const existingIndex = grades.findIndex((g) => g.id === gradeRecord.id);
    let updated: GradeRecord[];
    if (existingIndex >= 0) {
      updated = [...grades];
      updated[existingIndex] = gradeRecord;
    } else {
      updated = [gradeRecord, ...grades];
    }
    setGrades(updated);
    saveGradesToStorage(updated);
  };

  // Delete grade
  const handleDeleteGrade = (id: string) => {
    const updated = grades.filter((g) => g.id !== id);
    setGrades(updated);
    saveGradesToStorage(updated);
  };

  // Delete submission
  const handleDeleteSubmission = (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    saveSubmissionsToStorage(updated);
  };

  // Purge any unsent submissions
  const handlePurgeUnsentSubmissions = () => {
    const updated = purgeUnsentSubmissions();
    setSubmissions(updated);
  };

  // Login handler
  const handleLoginSuccess = (username: string, role: UserRole) => {
    setAuth(true);
    setCurrentUser(username);
    setUserRole(role);
    setPicked(true);
    setTeacherTab('arbela');
    setState((prev) => ({
      ...prev,
      id: 'euskera',
      c: prev.c || 4,
    }));
    try {
      sessionStorage.setItem('ahoan-s', '1');
      sessionStorage.setItem('ahoan-user', username);
      sessionStorage.setItem('ahoan-role', role);
      sessionStorage.setItem('ahoan-picked', '1');
    } catch {
      // Ignore
    }
  };

  // Logout handler
  const handleLogout = () => {
    setAuth(false);
    setPicked(false);
    setCurrentUser('Ikaslea');
    setUserRole('student');
    setActiveFitxaKey(null);
    setTeacherTab('arbela');
    setShowStudentReportCard(false);
    try {
      sessionStorage.removeItem('ahoan-s');
      sessionStorage.removeItem('ahoan-user');
      sessionStorage.removeItem('ahoan-role');
      sessionStorage.removeItem('ahoan-picked');
    } catch {
      // Ignore
    }
  };

  // Select level
  const handleSelectLevel = (level: number) => {
    setState((prev) => ({ ...prev, c: level }));
    setPicked(true);
    setActiveFitxaKey(null);
    try {
      sessionStorage.setItem('ahoan-picked', '1');
    } catch {
      // Ignore
    }
  };

  // Select language
  const handleSelectLang = (lang: AppSubject) => {
    setState((prev) => ({ ...prev, id: lang }));
    setActiveFitxaKey(null);
  };

  // Find audio item across merged datasets
  const findAudioItem = (key: string): AudioItem | null => {
    for (const langId of ['euskera', 'lengua', 'ingles', 'matematika'] as const) {
      if (mergedD[langId]?.ext) {
        for (const level in mergedD[langId].ext) {
          for (const item of mergedD[langId].ext[level]) {
            if (item.k === key) return item;
          }
        }
      }
    }
    return null;
  };

  // Handle answer select in a fitxa
  const handleOptionSelect = (fitxaKey: string, qIndex: number, optIndex: number) => {
    setState((prev) => {
      const currentAns = prev.ans[fitxaKey] || {};
      return {
        ...prev,
        ans: {
          ...prev.ans,
          [fitxaKey]: {
            ...currentAns,
            [qIndex]: optIndex,
          },
        },
      };
    });
  };

  // Handle fitxa submit: records student submission & score (except Audioa 1)
  const handleFitxaSubmit = (fitxaKey: string) => {
    setState((prev) => {
      const currentAns = prev.ans[fitxaKey] || {};
      return {
        ...prev,
        ans: {
          ...prev.ans,
          [fitxaKey]: {
            ...currentAns,
            done: true,
          },
        },
      };
    });

    // Record submission for M.Oliveira (excluding Audioa 1)
    if (currentUser === 'M.Oliveira') {
      const questions = mergedFX[fitxaKey] || [];
      const item = findAudioItem(fitxaKey);
      const isAudio1 = fitxaKey === 'e4a1' || item?.t?.includes('Audioa 1');

      if (questions.length > 0 && !isAudio1) {
        const currentAns = state.ans[fitxaKey] || {};
        const correctCount = questions.filter((q, i) => currentAns[i] === q.a).length;
        const subSubj = state.id;

        const newSub: StudentSubmission = {
          id: `sub-${Date.now()}`,
          studentName: 'M.Oliveira',
          fitxaKey,
          fitxaTitle: item ? item.t : 'Ariketa',
          subject: subSubj,
          level: state.c,
          correctCount,
          totalQuestions: questions.length,
          percentage: Math.round((correctCount / questions.length) * 100),
          date: new Date().toISOString().split('T')[0],
        };

        const updatedSubs = [newSub, ...submissions];
        setSubmissions(updatedSubs);
        saveSubmissionsToStorage(updatedSubs);
      }
    }
  };

  // Handle fitxa reset
  const handleFitxaReset = (fitxaKey: string) => {
    setState((prev) => {
      return {
        ...prev,
        ans: {
          ...prev.ans,
          [fitxaKey]: {} as Record<number, number> & { done?: boolean },
        },
      };
    });
  };

  const isTeacher = userRole === 'teacher';
  const published = isGradesPublished();

  // Active audio item for fitxa
  const activeAudioItem = activeFitxaKey ? findAudioItem(activeFitxaKey) : null;
  const activeQuestions = activeFitxaKey ? mergedFX[activeFitxaKey] || [] : [];
  const activeSavedAnswers = activeFitxaKey ? state.ans[activeFitxaKey] || {} : {};
  const isFitxaDone = !!activeSavedAnswers.done;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f2] dark:bg-[#17181b] text-[#1f2328] dark:text-[#ececec] font-sans transition-colors">
      {/* If logged in and level is picked, show full header */}
      {auth && picked && (
        <Header
          currentLang={state.id}
          currentLevel={state.c}
          currentUser={currentUser}
          userRole={userRole}
          teacherTab={teacherTab}
          gradesPublished={published}
          onOpenReportCard={() => setShowStudentReportCard(true)}
          isDark={isDark}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onToggleTheme={() => setIsDark(!isDark)}
          onSelectLang={handleSelectLang}
          onSelectLevel={handleSelectLevel}
          onChangeTeacherTab={(tab) => {
            setActiveFitxaKey(null);
            setTeacherTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={handleLogout}
        />
      )}

      {/* Main viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
        {!auth ? (
          /* Step 1: Login View */
          <LoginView onLoginSuccess={handleLoginSuccess} />
        ) : !picked ? (
          /* Step 2: Level Selection View */
          <LevelPicker
            currentLevel={state.c}
            currentUser={currentUser}
            isTeacher={isTeacher}
            onSelectLevel={handleSelectLevel}
            onLogout={handleLogout}
          />
        ) : isTeacher && teacherTab === 'create_fitxa' ? (
          /* Step 3: Teacher Fitxa Creator */
          <FitxaCreator
            onSaveFitxa={(fitxa) => {
              handleSaveCustomFitxa(fitxa);
              setTeacherTab('arbela');
            }}
            onCancel={() => setTeacherTab('arbela')}
            existingCustomFitxak={customFitxak}
            onDeleteCustomFitxa={handleDeleteCustomFitxa}
          />
        ) : isTeacher && (teacherTab === 'gradebook' || teacherTab === 'grades_list' || teacherTab === 'grades_progress') ? (
          /* Step 4: Teacher Gradebook View (Notak jarri, Jarritakoak & Nola doazen) */
          <GradebookView
            grades={grades}
            submissions={submissions}
            onSaveGrade={handleSaveGrade}
            onDeleteGrade={handleDeleteGrade}
            onDeleteSubmission={handleDeleteSubmission}
            onPurgeUnsentSubmissions={handlePurgeUnsentSubmissions}
            onCancel={() => setTeacherTab('arbela')}
            initialTab={
              teacherTab === 'grades_list'
                ? 'jarritakoak'
                : teacherTab === 'grades_progress'
                ? 'nola_doazen'
                : 'notak_jarri'
            }
          />
        ) : activeFitxaKey && activeAudioItem ? (
          /* Step 5: Fitxa / Worksheet View */
          <FitxaView
            item={activeAudioItem}
            questions={activeQuestions}
            savedAnswers={activeSavedAnswers}
            isDone={isFitxaDone}
            isTeacher={isTeacher}
            onSelectOption={(qIdx, optIdx) => handleOptionSelect(activeFitxaKey, qIdx, optIdx)}
            onSubmit={() => handleFitxaSubmit(activeFitxaKey)}
            onReset={() => handleFitxaReset(activeFitxaKey)}
            onBack={() => setActiveFitxaKey(null)}
          />
        ) : (
          /* Step 6: Arbela View */
          <ArbelaView
            currentLang={state.id}
            currentLevel={state.c}
            answers={state.ans}
            dataset={mergedD}
            questionsMap={mergedFX}
            isTeacher={isTeacher}
            currentUser={currentUser}
            gradesPublished={published}
            onOpenReportCard={() => setShowStudentReportCard(true)}
            onOpenFitxa={(key) => {
              setActiveFitxaKey(key);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTeacherTab={(tab) => {
              setActiveFitxaKey(null);
              setTeacherTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleLogout}
            onSelectLevel={handleSelectLevel}
          />
        )}
      </main>

      {/* Student Report Card Modal (accessible when grades published) */}
      {showStudentReportCard && (
        <StudentReportCard
          grades={grades}
          onClose={() => setShowStudentReportCard(false)}
        />
      )}

      {/* Subtle school footer */}
      {auth && (
        <footer className="py-4 text-center text-xs text-stone-400 dark:text-stone-500 border-t border-stone-200/60 dark:border-stone-800/80">
          <p>© Ahoan · Ikasleak — Ahozko ulermeneko hezkuntza proiektua</p>
        </footer>
      )}
    </div>
  );
}
