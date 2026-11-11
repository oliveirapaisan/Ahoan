import React from 'react';
import { Backpack, LogOut, Sparkles, GraduationCap } from 'lucide-react';

interface LevelPickerProps {
  currentLevel: number;
  currentUser?: string;
  isTeacher?: boolean;
  onSelectLevel: (level: number) => void;
  onLogout: () => void;
}

export const LevelPicker: React.FC<LevelPickerProps> = ({
  currentLevel,
  currentUser = 'Ikaslea',
  isTeacher = false,
  onSelectLevel,
  onLogout,
}) => {
  const levels = [1, 2, 3, 4, 5, 6];

  const levelDescriptions: Record<number, string> = {
    1: '1. Maila · Hasiberriak (LH 1)',
    2: '2. Maila · Oinarrizkoa (LH 2)',
    3: '3. Maila · Garatzen (LH 3)',
    4: '4. Maila · Ertaina (LH 4) · Audioak',
    5: '5. Maila · Aurreratua (LH 5)',
    6: '6. Maila · Sakontzen (LH 6) · Audioak',
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-3 shadow-inner">
            <Backpack className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center justify-center gap-2">
            🎒 Aukeratu zure maila
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Hautatu ikasturteko maila ahozko ulermeneko ariketak hasteko
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
          {levels.map((lvl) => {
            const isFeatured = lvl === 4 || lvl === 6;
            const isCurrent = lvl === currentLevel;

            return (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-stone-800'
                    : 'bg-stone-50 dark:bg-stone-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-stone-200 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-700 text-stone-700 dark:text-stone-200'
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-amber-400 text-stone-900 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" /> Audio
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 font-bold text-lg ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 group-hover:scale-105 transition-transform'
                  }`}
                >
                  {lvl}
                </div>
                <span className="font-semibold text-sm">
                  {lvl}. maila
                </span>
                <span className="text-[11px] opacity-75 mt-0.5">
                  LH {lvl}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-700/60 text-xs text-stone-500 dark:text-stone-400 flex items-start gap-2 mb-6">
          <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <b>Aholkua:</b> 4. eta 6. mailek audio erreproduzitzaile integratua eta galdetegi interaktiboak dituzte. Beste mailetan ariketa bereziak aurkituko dituzu.
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-stone-100 dark:border-stone-700">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700/40 rounded-xl text-sm transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Irten
          </button>
          <span className="text-xs text-stone-400">
            {isTeacher ? 'Irakaslea' : 'Erabiltzailea'}: <b className="text-stone-700 dark:text-stone-300">{currentUser}</b>
          </span>
        </div>
      </div>
    </div>
  );
};
