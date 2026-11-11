import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  Search,
  Download,
  Check,
  Sparkles,
  User,
  BookOpen,
  AlertCircle,
  Calculator,
  Send,
  Clock,
  CheckCircle2,
  Eye,
  Layers,
  BarChart3,
  TrendingUp,
  FileText,
  Filter,
} from 'lucide-react';
import {
  GradeRecord,
  GradeSubject,
  SUBJECT_CONFIGS,
  QUALITATIVE_SCALES,
  QualitativeScaleLevel,
  convertRuleOfThree,
  StudentSubmission,
  TERM_DEADLINE_LABEL,
  isGradesPublished,
  setGradesPublished,
} from '../data/gradebookData';
import { sounds } from '../utils/audioChime';

export type GradebookTab = 'jarritakoak' | 'nola_doazen' | 'notak_jarri' | 'emaitzak';

interface GradebookViewProps {
  grades: GradeRecord[];
  submissions: StudentSubmission[];
  onSaveGrade: (grade: GradeRecord) => void;
  onDeleteGrade: (id: string) => void;
  onDeleteSubmission?: (id: string) => void;
  onPurgeUnsentSubmissions?: () => void;
  onCancel: () => void;
  onTogglePublish?: () => void;
  initialTab?: GradebookTab;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  grades,
  submissions,
  onSaveGrade,
  onDeleteGrade,
  onDeleteSubmission,
  onPurgeUnsentSubmissions,
  onCancel,
  initialTab = 'jarritakoak',
}) => {
  const [activeTab, setActiveTab] = useState<GradebookTab>(initialTab);
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(() => isGradesPublished());

  // Filter state
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form state - student is strictly M.Oliveira
  const studentName = 'M.Oliveira' as const;
  const [subject, setSubject] = useState<GradeSubject>('euskera');
  const [skill, setSkill] = useState<string>(SUBJECT_CONFIGS.euskera.skills[0]);
  const [customSkill, setCustomSkill] = useState<string>('');
  const [level, setLevel] = useState<number>(4);
  const [activityTitle, setActivityTitle] = useState('Aditzak · Nor-Nork aditz laguntzaileak');

  // Rule of three calculation inputs - defaults to student's 10/10 submission
  const [pointsObtained, setPointsObtained] = useState<number>(10);
  const [maxPoints, setMaxPoints] = useState<number>(10);
  const [manualScaleLevel, setManualScaleLevel] = useState<QualitativeScaleLevel | null>(null);
  const [feedback, setFeedback] = useState('Aditz laguntzaileen eta ahozko ulermeneko ariketak bikain osatuak (10/10 puntu).');
  const [formError, setFormError] = useState('');

  // Synchronize when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Calculate current qualitative grade using rule of 3
  const ruleOfThreeResult = convertRuleOfThree(pointsObtained, maxPoints, subject);
  const effectiveScaleLevel: QualitativeScaleLevel =
    manualScaleLevel !== null ? manualScaleLevel : ruleOfThreeResult.scaleLevel;
  const effectiveQualitativeText = QUALITATIVE_SCALES[subject][effectiveScaleLevel];

  // When subject changes, reset skill and clear manual override
  const handleSubjectChange = (newSubject: GradeSubject) => {
    setSubject(newSubject);
    setSkill(SUBJECT_CONFIGS[newSubject].skills[0]);
    setCustomSkill('');
    setManualScaleLevel(null);
  };

  // Toggle publish status for student
  const handleTogglePublish = () => {
    sounds.playChirp();
    const nextState = !isPublished;
    setIsPublished(nextState);
    setGradesPublished(nextState);
  };

  // Start edit action
  const handleStartEdit = (record: GradeRecord) => {
    sounds.playChirp();
    setEditingGradeId(record.id);
    setSubject(record.subject);
    setSkill(record.skill);
    setCustomSkill(record.skill);
    setLevel(record.level);
    setActivityTitle(record.activityTitle || '');
    setPointsObtained(record.pointsObtained || 10);
    setMaxPoints(record.maxPoints || 10);
    setManualScaleLevel(record.scaleLevel);
    setFeedback(record.feedback || '');
    setActiveTab('notak_jarri');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick action: start grading a specific skill
  const handleStartGradeSkill = (targetSubject: GradeSubject, targetSkill: string) => {
    sounds.playChirp();
    setEditingGradeId(null);
    setSubject(targetSubject);
    setSkill(targetSkill);
    setCustomSkill(targetSkill);
    setLevel(4);
    setActivityTitle(`${targetSkill} ebaluazioa`);
    setPointsObtained(10);
    setMaxPoints(10);
    setManualScaleLevel(null);
    setFeedback(`${targetSkill} ariketen jarraipena eta proba.`);
    setActiveTab('notak_jarri');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transfer a student submission into the Rule of Three form
  const handleTransferSubmission = (sub: StudentSubmission) => {
    sounds.playChirp();
    setEditingGradeId(null);
    setSubject(sub.subject);
    setSkill(
      sub.subject === 'ingles'
        ? 'Oral comprehension (Listening)'
        : sub.subject === 'lengua'
        ? 'Comprensión oral'
        : 'Ahozko ulermena'
    );
    setLevel(sub.level);
    setActivityTitle(sub.fitxaTitle);
    setPointsObtained(sub.correctCount);
    setMaxPoints(sub.totalQuestions);
    setManualScaleLevel(null);
    setFeedback(`Ikasleak aplikazioan egindako ahozko ariketa (${sub.correctCount}/${sub.totalQuestions} galdera asmatuak).`);
    setActiveTab('notak_jarri');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit grade form
  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();

    if (maxPoints <= 0) {
      setFormError('Gehienezko puntuak 0 baino handiagoak izan behar dira.');
      sounds.playWarning();
      return;
    }

    const newRecord: GradeRecord = {
      id: editingGradeId || `g-${Date.now()}`,
      studentName: 'M.Oliveira',
      subject,
      skill,
      level,
      activityTitle: activityTitle.trim() || `${skill} jarduera`,
      qualitative: effectiveQualitativeText,
      scaleLevel: effectiveScaleLevel,
      numericGrade: ruleOfThreeResult.scoreOn10,
      pointsObtained,
      maxPoints,
      feedback: feedback.trim(),
      term: '1. Hiruhilekoa',
      date: new Date().toISOString().split('T')[0],
    };

    sounds.playSuccess();
    onSaveGrade(newRecord);
    setEditingGradeId(null);
    setActivityTitle('');
    setFeedback('');
    setFormError('');
    setManualScaleLevel(null);
    setActiveTab('jarritakoak');
  };

  // Filtered grades list (strictly M.Oliveira)
  const filteredGrades = grades.filter((g) => {
    if (g.studentName !== 'M.Oliveira') return false;
    if (filterSubject !== 'all' && g.subject !== filterSubject) return false;
    if (
      searchQuery &&
      !g.skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !g.activityTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Calculate overall statistics
  const totalGradesCount = grades.length;
  const passCount = grades.filter((g) => g.scaleLevel >= 1).length;
  const passRate = totalGradesCount > 0 ? Math.round((passCount / totalGradesCount) * 100) : 0;
  const numericSum = grades.reduce((acc, g) => acc + (g.numericGrade || 0), 0);
  const globalAverageScore = totalGradesCount > 0 ? (numericSum / totalGradesCount).toFixed(1) : '-';

  // Helper for grade badge styling
  const getBadgeStyle = (scaleLevel: number) => {
    switch (scaleLevel) {
      case 4: // Bikain / Sobresaliente / Excellent
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400 font-extrabold';
      case 3: // Oso ongi / Notable / Very Good
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-400 font-bold';
      case 2: // Ongi / Bien / Good
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-400 font-semibold';
      case 1: // Nahiko / Suficiente / Pass
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-400 font-semibold';
      default: // Gutxi / Insuficiente / Needs improvement
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-400 font-semibold';
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    sounds.playChirp();
    const headers = 'Ikaslea,Asignatura,Gaitasuna,Kalifikazioa,Puntuak,Max,Iruzkina,Data\n';
    const rows = filteredGrades
      .map(
        (g) =>
          `"${g.studentName}","${SUBJECT_CONFIGS[g.subject].label}","${g.skill}","${g.qualitative}","${g.pointsObtained || ''}","${g.maxPoints || ''}","${g.feedback || ''}","${g.date}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kalifikazioak_M_Oliveira_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allSubjects: GradeSubject[] = ['euskera', 'lengua', 'ingles', 'matematika'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-stone-800 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                Kalifikazioen Kudeaketa
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/50">
                👤 M.Oliveira
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Notak jarri, ikusi jarritakoak eta jarraitu ikaslearen eboluzioa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Arbela</span>
          </button>
        </div>
      </div>

      {/* Publication Deadline Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-blue-500/15 border-2 border-amber-300/60 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-xl">
          <div className="p-2.5 bg-amber-400 text-stone-950 rounded-2xl shrink-0 mt-0.5 shadow-md">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                1. Hiruhilekoko entrega-epea: {TERM_DEADLINE_LABEL}
              </h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
              M.Oliveirak beranduenez <b>abenduaren 23an 21:00etan</b> jasoko ditu bere notak automatikoki. Edo nahi baduzu, orain bertan argitara ditzakezu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePublish}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
              isPublished
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/50'
                : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
            }`}
          >
            {isPublished ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Notak bidalita (Argitaratuta)</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Bidali notak ikasleari orain</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 4 Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-stone-100 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 gap-1">
        {/* Tab 1: Jarritako Notak (Ver notas puestas) */}
        <button
          onClick={() => setActiveTab('jarritakoak')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'jarritakoak'
              ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-300 shadow-sm ring-1 ring-amber-300/50'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Eye className="w-4 h-4 text-amber-500" />
          <span>👁️ Jarritako Notak ({grades.length})</span>
        </button>

        {/* Tab 2: Nola Doazen Notak (Cómo van las notas) */}
        <button
          onClick={() => setActiveTab('nola_doazen')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'nola_doazen'
              ? 'bg-white dark:bg-stone-700 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-300/50'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <span>📊 Nola Doazen Notak</span>
        </button>

        {/* Tab 3: Notak Jarri (Poner notas con regla de 3) */}
        <button
          onClick={() => setActiveTab('notak_jarri')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notak_jarri'
              ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-300/50'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-500" />
          <span>📝 Notak Jarri (3ko erregela)</span>
        </button>

        {/* Tab 4: Ikasleak Ateratakoa */}
        <button
          onClick={() => setActiveTab('emaitzak')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'emaitzak'
              ? 'bg-white dark:bg-stone-700 text-purple-700 dark:text-purple-300 shadow-sm ring-1 ring-purple-300/50'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-500" />
          <span>🎧 Ariketak ({submissions.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: JARRITAKO NOTAK (VER LAS NOTAS QUE HE PUESTO)
         ========================================================================= */}
      {activeTab === 'jarritakoak' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Subject Filters */}
          <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Bilatu gaitasunez edo jardueraz..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Subject filter buttons */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => setFilterSubject('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterSubject === 'all'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Guztiak ({grades.length})
                </button>
                <button
                  onClick={() => setFilterSubject('euskera')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterSubject === 'euskera'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Euskara
                </button>
                <button
                  onClick={() => setFilterSubject('lengua')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterSubject === 'lengua'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Lengua
                </button>
                <button
                  onClick={() => setFilterSubject('ingles')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterSubject === 'ingles'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setFilterSubject('matematika')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterSubject === 'matematika'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Mate
                </button>
              </div>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 cursor-pointer"
                title="Deskargatu CSV (Excel) formatuan"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Deskargatu CSV</span>
              </button>

              <button
                onClick={() => {
                  setEditingGradeId(null);
                  setActiveTab('notak_jarri');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nota Berria Jarri</span>
              </button>
            </div>
          </div>

          {/* List of Placed Grades */}
          {filteredGrades.length > 0 ? (
            <div className="space-y-3">
              {filteredGrades.map((record) => {
                const subCfg = SUBJECT_CONFIGS[record.subject];
                return (
                  <div
                    key={record.id}
                    className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-amber-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${subCfg.badge}`}
                        >
                          {subCfg.label}
                        </span>

                        <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                          {record.skill}
                        </span>

                        {record.activityTitle && (
                          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                            · {record.activityTitle}
                          </span>
                        )}
                      </div>

                      {/* Rule of Three Calculation Detail */}
                      <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300 flex-wrap">
                        <span className="font-mono bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded-md">
                          🔢 Puntuak: <b>{record.pointsObtained ?? '-'}</b> / {record.maxPoints ?? '-'}
                        </span>
                        <span className="font-mono bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded-md">
                          📐 3ko erregela: <b>{record.numericGrade !== undefined ? `${record.numericGrade} / 10` : '-'}</b>
                        </span>
                        <span className="text-stone-400">
                          🗓️ Data: {record.date}
                        </span>
                      </div>

                      {/* Teacher Feedback / Observations */}
                      {record.feedback && (
                        <p className="text-xs text-stone-600 dark:text-stone-300 italic bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                          "{record.feedback}"
                        </p>
                      )}
                    </div>

                    {/* Right side: Qualitative badge & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-700">
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-xl text-xs sm:text-sm border shadow-sm ${getBadgeStyle(
                            record.scaleLevel
                          )}`}
                        >
                          {record.qualitative}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(record)}
                          className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Aldatu nota hau"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteGrade(record.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Ezabatu nota hau"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-8 sm:p-12 text-center shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg text-stone-800 dark:text-stone-100">
                  Oraindik ez da notarik jarri {filterSubject !== 'all' ? `(${SUBJECT_CONFIGS[filterSubject as GradeSubject]?.label})` : 'M.Oliveirarentzat'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  Sartu "Notak Jarri" atalean edo aukeratu beheko botoia M.Oliveirari 3ko erregelarekin nota kualitatiboa jartzeko.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingGradeId(null);
                  setActiveTab('notak_jarri');
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nota Berria Jarri</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: NOLA DOAZEN NOTAK (CÓMO VAN LAS NOTAS - PROGRESO Y RESUMEN)
         ========================================================================= */}
      {activeTab === 'nola_doazen' && (
        <div className="space-y-6">
          {/* Global Progress Overview Card */}
          <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span>M.Oliveira · Noten egoera eta bilakaera</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  1. Hiruhilekoko laburpen orokorra eta gaitasunen ebaluazio egoera
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200">
                  Guztira {grades.length} nota jarrita
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Media Orokorra
                </span>
                <span className="text-2xl font-black text-amber-500 mt-1 block">
                  {globalAverageScore} <span className="text-xs font-normal text-stone-400">/ 10</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Gaindituak (Nahiko+)
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {passRate}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Bikain Kalifikazioak
                </span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
                  {grades.filter((g) => g.scaleLevel === 4).length}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Argitaratze Egoera
                </span>
                <span
                  className={`text-xs font-bold mt-2 px-2.5 py-1 rounded-full inline-block ${
                    isPublished
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {isPublished ? 'Bidalita (Ikusgai)' : 'Zirriborroan (Abenduak 23)'}
                </span>
              </div>
            </div>
          </div>

          {/* Subject by Subject Breakdown (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allSubjects.map((subjId) => {
              const cfg = SUBJECT_CONFIGS[subjId];
              const subjGrades = grades.filter((g) => g.subject === subjId);
              const evaluatedSkills = new Set(subjGrades.map((g) => g.skill));
              const progressPercentage = Math.round(
                (evaluatedSkills.size / cfg.skills.length) * 100
              );

              return (
                <div
                  key={subjId}
                  className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                        <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                          {cfg.label}
                        </h4>
                      </div>

                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                        {evaluatedSkills.size} / {cfg.skills.length} gaitasun
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 my-3">
                      <div className="flex justify-between text-[11px] text-stone-400 font-semibold">
                        <span>Ebaluazioaren aurrerapena</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: cfg.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Skills Checklist */}
                    <div className="space-y-2 pt-1">
                      {cfg.skills.map((skName) => {
                        const gradeForSkill = subjGrades.find((g) => g.skill === skName);
                        const isEvaluated = !!gradeForSkill;

                        return (
                          <div
                            key={skName}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60 text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {isEvaluated ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-stone-300 dark:border-stone-600 shrink-0" />
                              )}
                              <span
                                className={`font-medium ${
                                  isEvaluated
                                    ? 'text-stone-800 dark:text-stone-200'
                                    : 'text-stone-500 dark:text-stone-400'
                                }`}
                              >
                                {skName}
                              </span>
                            </div>

                            {isEvaluated ? (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] border font-bold ${getBadgeStyle(
                                  gradeForSkill.scaleLevel
                                )}`}
                              >
                                {gradeForSkill.qualitative}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartGradeSkill(subjId, skName)}
                                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                              >
                                + Jarri nota
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-700 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSubject(subjId);
                        setSkill(cfg.skills[0]);
                        setActiveTab('notak_jarri');
                      }}
                      className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jarri nota {cfg.label}n</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NOTAK JARRI (3KO ERREGELAREN BIDEZ NOTA SARTU)
         ========================================================================= */}
      {activeTab === 'notak_jarri' && (
        <form
          onSubmit={handleSubmitGrade}
          className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <span>{editingGradeId ? '✏️ Aldatu Nota' : '📝 Nota Berria Jarri'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
                  3ko Erregela
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ikaslea: <b>M.Oliveira</b> · Hautatu asignatura, gaitasuna eta kalkulatu nota kualitatiboa
              </p>
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Subject selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              1. Aukeratu Asignatura / Hizkuntza
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSubjectChange('euskera')}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  subject === 'euskera'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-stone-800'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-base">🟢</span>
                <span>Euskara</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubjectChange('matematika')}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  subject === 'matematika'
                    ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-stone-800'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-base">🟡</span>
                <span>Matematika</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubjectChange('lengua')}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  subject === 'lengua'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-400 ring-offset-2 dark:ring-offset-stone-800'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-base">🔴</span>
                <span>Lengua Castellana</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubjectChange('ingles')}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  subject === 'ingles'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-stone-800'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-base">🔵</span>
                <span>English</span>
              </button>
            </div>
          </div>

          {/* 2. Skill selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                2. Zer ebaluatu nahi duzu? (Gaitasuna / Edukia) *
              </label>
              {subject === 'euskera' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 flex items-center gap-1">
                  ✨ Aditzak barne!
                </span>
              )}
            </div>

            {/* Quick chips especially for Aditzak in Euskara */}
            {subject === 'euskera' && (
              <div className="p-2.5 mb-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
                  ⚡ Klik azkarra:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playChirp();
                    setSkill('Aditzak');
                    setCustomSkill('Aditzak');
                    setActivityTitle('Aditzak · Ebaluazioa eta kontrola');
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    skill === 'Aditzak'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  🟢 Aditzak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playChirp();
                    setSkill('Aditzak (Nor-Nork eta Nor-Nori-Nork)');
                    setCustomSkill('Aditzak (Nor-Nork eta Nor-Nori-Nork)');
                    setActivityTitle('Aditz laguntzaileak · Nor-Nork eta Nor-Nori-Nork');
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    skill === 'Aditzak (Nor-Nork eta Nor-Nori-Nork)'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  Nor-Nork & Nor-Nori-Nork
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playChirp();
                    setSkill('Aditz trinkoak eta laguntzaileak');
                    setCustomSkill('Aditz trinkoak eta laguntzaileak');
                    setActivityTitle('Aditz trinkoak (Joan, Etorri, Ibili, Jakin)');
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    skill === 'Aditz trinkoak eta laguntzaileak'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  Aditz Trinkoak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playChirp();
                    setSkill('Ahozko ulermena');
                    setCustomSkill('Ahozko ulermena');
                    setActivityTitle('Ahozko ulermena · Entzute lana');
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    skill === 'Ahozko ulermena'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  Ahozko Ulermena
                </button>
              </div>
            )}

            {/* Grid of predefined skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SUBJECT_CONFIGS[subject].skills.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => {
                    setSkill(sk);
                    setCustomSkill('');
                    if (!activityTitle) setActivityTitle(`${sk} ebaluazioa`);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    skill === sk
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/50 shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-medium">{sk}</span>
                  {skill === sk && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Custom skill freeform input box */}
            <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-1.5">
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                ✍️ Edo idatzi hemen beste edozein gai edo gaitasun pertsonalizatu (adib. "Aditzak", "Nor-Nork oraina", "Iragana", "Deklinabidea"):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomSkill(val);
                    if (val.trim()) {
                      setSkill(val.trim());
                    }
                  }}
                  placeholder="Idatzi hemen gaitasunaren izena (adib. Aditzak)..."
                  className="flex-1 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {customSkill && (
                  <button
                    type="button"
                    onClick={() => {
                      if (customSkill.trim()) {
                        setSkill(customSkill.trim());
                        sounds.playChirp();
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Ezari
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. Rule of Three calculation Box */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-stone-50 to-emerald-500/10 dark:from-stone-900 dark:to-stone-900 rounded-3xl border-2 border-amber-300 dark:border-amber-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-500" />
                <span>3ko Erregela: Puntuak sartu</span>
              </h4>
              <span className="text-[11px] text-stone-500 font-mono">
                Formula: ({pointsObtained} × 100) ÷ {maxPoints} = {ruleOfThreeResult.percentage}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Lortutako Puntuak (Aciertos)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={pointsObtained}
                  onChange={(e) => {
                    setPointsObtained(Number(e.target.value));
                    setManualScaleLevel(null);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-base font-bold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Guztira Puntu Posibleak (Total)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={maxPoints}
                  onChange={(e) => {
                    setMaxPoints(Number(e.target.value));
                    setManualScaleLevel(null);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-base font-bold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Automatic Result badge */}
              <div className="p-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-center shadow-inner">
                <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                  Emaitza Kualitatiboa
                </p>
                <p className="text-xl font-black mt-0.5" style={{ color: SUBJECT_CONFIGS[subject].color }}>
                  {effectiveQualitativeText}
                </p>
                <p className="text-xs text-stone-400 font-mono">
                  {ruleOfThreeResult.percentage}% ({ruleOfThreeResult.scoreOn10} / 10)
                </p>
              </div>
            </div>

            {/* Direct Qualitative Scale Buttons (Gutxi, Nahiko, Ongi, Oso ongi, Bikain) */}
            <div>
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                Edo hautatu zuzenean nota kualitatiboa ({SUBJECT_CONFIGS[subject].label} hizkuntzan):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {QUALITATIVE_SCALES[subject].map((scaleName, idx) => {
                  const isSelected = effectiveScaleLevel === idx;
                  return (
                    <button
                      key={scaleName}
                      type="button"
                      onClick={() => setManualScaleLevel(idx as QualitativeScaleLevel)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                        isSelected
                          ? `${getBadgeStyle(idx)} ring-2 ring-amber-400 ring-offset-1`
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <span>{scaleName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Activity Title and Comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Jardueraren izena / Ariketa (Aukerakoa)
              </label>
              <input
                type="text"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                placeholder="adib. 1. hiruhilekoko ahozko proba"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Irakaslearen Oharrak / Observaciones
              </label>
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Idatzi iruzkin eraikitzailea M.Oliveirarentzat..."
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingGradeId(null);
                setActiveTab('jarritakoak');
              }}
              className="px-4 py-2 text-stone-500 hover:text-stone-800 text-sm cursor-pointer"
            >
              Utzi
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Gorde Nota ({effectiveQualitativeText})</span>
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 4: IKASLEAREN ARIKETAK (SUBMISSIONS ETA 10/10 LANA)
         ========================================================================= */}
      {activeTab === 'emaitzak' && (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <span>M.Oliveirak aplikazioan bidalitako lanak eta puntuazioak</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ikasleak bidalitako lanak hemen daude. Nahi izanez gero, bidali ez direnak edo nahi ez direnak ezabatu ditzakezu.
              </p>
            </div>

            {onPurgeUnsentSubmissions && submissions.length > 0 && (
              <button
                type="button"
                onClick={onPurgeUnsentSubmissions}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Garbitu eta utzi soilik ikasleak benetan bidalitakoak"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminatu ez direnak bidali</span>
              </button>
            )}
          </div>

          {submissions.length > 0 ? (
            <div className="divide-y divide-stone-100 dark:divide-stone-700">
              {submissions.map((sub) => {
                const subCfg = SUBJECT_CONFIGS[sub.subject];
                const isTenOnTen = sub.correctCount === 10 && sub.totalQuestions === 10;
                return (
                  <div
                    key={sub.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${subCfg.badge}`}>
                          {subCfg.label}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {sub.fitxaTitle}
                        </h4>
                        {isTenOnTen && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300">
                            ⭐ 10/10 Puntuazio Perfektua
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        Puntuazioa: <b>{sub.correctCount} / {sub.totalQuestions}</b> ({sub.percentage}%) · Data: {sub.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTransferSubmission(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold text-xs rounded-xl border border-amber-300 transition-all cursor-pointer shadow-sm"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Kalkulatu 3ko erregela honekin</span>
                      </button>

                      {onDeleteSubmission && (
                        <button
                          type="button"
                          onClick={() => onDeleteSubmission(sub.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                          title="Ezabatu ariketa hau"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400 text-sm">
              Ez dago erregistratutako ariketarik oraindik.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
