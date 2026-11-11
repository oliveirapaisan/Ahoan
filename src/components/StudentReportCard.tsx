import React from 'react';
import { Award, CheckCircle2, Calendar, User, Printer, X, Sparkles, BookOpen } from 'lucide-react';
import { GradeRecord, SUBJECT_CONFIGS, GradeSubject } from '../data/gradebookData';

interface StudentReportCardProps {
  grades: GradeRecord[];
  onClose: () => void;
}

export const StudentReportCard: React.FC<StudentReportCardProps> = ({ grades, onClose }) => {
  const subjects: GradeSubject[] = ['euskera', 'matematika', 'lengua', 'ingles'];

  // Styling helper for qualitative grades
  const getQualitativeStyle = (scaleLevel: number) => {
    switch (scaleLevel) {
      case 4: // Bikain / Sobresaliente / Excellent
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-400 font-extrabold shadow-sm';
      case 3: // Oso ongi / Notable / Very Good
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-400 font-bold';
      case 2: // Ongi / Bien / Good
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-400 font-semibold';
      case 1: // Nahiko / Suficiente / Pass
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-400 font-semibold';
      default: // Gutxi / Insuficiente / Needs improvement
        return 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-400 font-semibold';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Award className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold font-mono uppercase tracking-wider">
                  Boletin Ofiziala
                </span>
                <span className="text-xs text-white/80">1. Hiruhilekoa</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                M.Oliveiraren Kalifikazioak
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer text-white"
              title="Inprimatu txostena"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer text-white"
              title="Itxi leihoa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice of teacher release */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <b>Irakaslearen oharra (L.Oliveira):</b> Zure hiruhilekoko kalifikazioak berrikusi eta argitaratu dira. Lan bikaina!
            </span>
          </div>
          <span className="text-xs font-mono opacity-75 shrink-0 hidden sm:inline">
            Epea: Abenduak 23, 21:00
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {subjects.map((subId) => {
            const config = SUBJECT_CONFIGS[subId];
            const subGrades = grades.filter((g) => g.subject === subId);

            return (
              <div
                key={subId}
                className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80 dark:border-stone-700">
                  <h3 className="font-bold text-base text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                    {config.label}
                  </h3>
                  <span className="text-xs text-stone-400 font-medium">
                    {subGrades.length} gaitasun ebaluatu
                  </span>
                </div>

                {subGrades.length > 0 ? (
                  <div className="space-y-2.5">
                    {subGrades.map((record) => (
                      <div
                        key={record.id}
                        className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex flex-wrap items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                            {record.skill}
                          </p>
                          {record.activityTitle && (
                            <p className="text-xs text-stone-400">
                              {record.activityTitle}
                            </p>
                          )}
                          {record.feedback && (
                            <p className="text-xs text-stone-500 dark:text-stone-400 italic mt-1 bg-stone-50 dark:bg-stone-900/60 p-1.5 rounded-lg border border-stone-100 dark:border-stone-800">
                              "{record.feedback}"
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-xl text-xs border ${getQualitativeStyle(
                              record.scaleLevel
                            )}`}
                          >
                            {record.qualitative}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic py-2">
                    Oraindik ez da kalifikaziorik erregistratu arlo honetan.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs text-stone-500">
          <span>© Ahoan Ikasleak · Ebaluazio Zentroa</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Itxi
          </button>
        </div>
      </div>
    </div>
  );
};
