import { Question } from './ahoanData';

export type GradeSubject = 'euskera' | 'matematika' | 'lengua' | 'ingles';

export type QualitativeScaleLevel = 0 | 1 | 2 | 3 | 4;

export const QUALITATIVE_SCALES: Record<GradeSubject, string[]> = {
  euskera: ['Gutxi', 'Nahiko', 'Ongi', 'Oso ongi', 'Bikain'],
  matematika: ['Gutxi', 'Nahiko', 'Ongi', 'Oso ongi', 'Bikain'],
  lengua: ['Insuficiente', 'Suficiente', 'Bien', 'Notable', 'Sobresaliente'],
  ingles: ['Needs improvement', 'Pass', 'Good', 'Very Good', 'Excellent'],
};

export interface SubjectConfig {
  id: GradeSubject;
  label: string;
  badge: string;
  color: string;
  skills: string[];
}

export const SUBJECT_CONFIGS: Record<GradeSubject, SubjectConfig> = {
  euskera: {
    id: 'euskera',
    label: 'Euskara',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    color: '#27ae60',
    skills: [
      'Aditzak',
      'Aditzak (Nor-Nork eta Nor-Nori-Nork)',
      'Aditz trinkoak eta laguntzaileak',
      'Ahozko ulermena',
      'Idatzizko ulermena',
      'Gramatika eta Deklinabidea',
      'Ahozko adierazpena',
      'Idatzizko adierazpena',
      'Irakurketa',
    ],
  },
  matematika: {
    id: 'matematika',
    label: 'Matematika',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    color: '#f59e0b',
    skills: [
      'Buruketak',
      'Eragiketak',
      'Planoak',
    ],
  },
  lengua: {
    id: 'lengua',
    label: 'Lengua Castellana',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
    color: '#e11d48',
    skills: [
      'Comprensión oral',
      'Comprensión escrita',
      'Expresión oral',
      'Expresión escrita',
      'Lectura',
    ],
  },
  ingles: {
    id: 'ingles',
    label: 'English',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    color: '#2e86de',
    skills: [
      'Oral comprehension (Listening)',
      'Written comprehension (Reading)',
      'Oral expression (Speaking)',
      'Written expression (Writing)',
      'Reading',
    ],
  },
};

export interface GradeRecord {
  id: string;
  studentName: 'M.Oliveira';
  subject: GradeSubject;
  skill: string;
  level: number;
  activityTitle?: string;
  qualitative: string; // Gutxi, Nahiko, Ongi, Oso ongi, Bikain (or language equivalent)
  scaleLevel: QualitativeScaleLevel; // 0..4
  numericGrade?: number; // 0 - 10 scale computed by rule of 3
  pointsObtained?: number;
  maxPoints?: number;
  feedback?: string;
  term: string; // e.g. "1. Hiruhilekoa"
  date: string;
}

export interface StudentSubmission {
  id: string;
  studentName: 'M.Oliveira';
  fitxaKey: string;
  fitxaTitle: string;
  subject: GradeSubject;
  level: number;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

export interface CustomFitxa {
  k: string;
  t: string;
  subject: GradeSubject;
  level: number;
  u?: string;
  description: string;
  passage?: string;
  activityType?: 'audio' | 'reading' | 'math' | 'grammar' | 'mixed';
  f?: number;
  questions: Question[];
  createdAt: string;
}

export const TERM_DEADLINE_ISO = '2026-12-23T21:00:00';
export const TERM_DEADLINE_LABEL = 'Abenduaren 23a, 21:00';

// Convert points with Rule of Three to Qualitative Scale (0 to 4)
export const convertRuleOfThree = (
  points: number,
  maxPoints: number,
  subject: GradeSubject
): { scaleLevel: QualitativeScaleLevel; text: string; percentage: number; scoreOn10: number } => {
  const safeMax = maxPoints > 0 ? maxPoints : 10;
  const safePoints = Math.max(0, Math.min(points, safeMax));
  const percentage = Math.round((safePoints * 100) / safeMax);
  const scoreOn10 = Number(((safePoints * 10) / safeMax).toFixed(1));

  let scaleLevel: QualitativeScaleLevel = 0;
  if (percentage >= 90) {
    scaleLevel = 4; // Bikain / Sobresaliente / Excellent
  } else if (percentage >= 80) {
    scaleLevel = 3; // Oso ongi / Notable / Very Good
  } else if (percentage >= 65) {
    scaleLevel = 2; // Ongi / Bien / Good
  } else if (percentage >= 50) {
    scaleLevel = 1; // Nahiko / Suficiente / Pass
  } else {
    scaleLevel = 0; // Gutxi / Insuficiente / Needs improvement
  }

  const text = QUALITATIVE_SCALES[subject][scaleLevel];
  return { scaleLevel, text, percentage, scoreOn10 };
};

// No mock or invented grades. Starts completely empty until teacher creates grades!
export const INITIAL_GRADES: GradeRecord[] = [];

// M.Oliveirak egindako Ahozko ulermeneko entzute lana (10/10 bikain):
export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-ahozko-10',
    studentName: 'M.Oliveira',
    fitxaKey: 'e4a2',
    fitxaTitle: 'Audioa 2 · Ahozko ulermena',
    subject: 'euskera',
    level: 4,
    correctCount: 10,
    totalQuestions: 10,
    percentage: 100,
    date: '2026-10-22',
  },
];

// List of mock IDs to purge from storage if previously saved
const MOCK_GRADE_IDS = new Set([
  'g-eusk-1',
  'g-eusk-2',
  'g-mat-1',
  'g-mat-2',
  'g-len-1',
  'g-ing-1',
  'g-1',
  'g-2',
  'g-3',
  'g-4',
]);

const MOCK_SUB_IDS = new Set(['sub-1', 'sub-2']);

export const loadGradesFromStorage = (): GradeRecord[] => {
  try {
    const raw = localStorage.getItem('ahoan-grades');
    if (raw) {
      const parsed: any[] = JSON.parse(raw);
      const cleaned: GradeRecord[] = parsed
        .filter((g) => {
          // Never accept mock invented IDs
          if (MOCK_GRADE_IDS.has(g.id)) return false;
          // Must strictly be M.Oliveira
          if (g.studentName !== 'M.Oliveira') return false;
          // Disallow Audioa 1
          if (
            g.activityTitle?.includes('Audioa 1') ||
            g.fitxaTitle?.includes('Audioa 1') ||
            g.fitxaKey === 'e4a1' ||
            g.skill?.includes('Audioa 1')
          ) {
            return false;
          }
          return true;
        })
        .map((g) => {
          const sub = (g.subject as GradeSubject) || 'euskera';
          const scaleLvl: QualitativeScaleLevel =
            typeof g.scaleLevel === 'number' ? g.scaleLevel : 3;
          return {
            id: g.id || `g-${Date.now()}`,
            studentName: 'M.Oliveira',
            subject: sub,
            skill: g.skill || 'Ahozko ulermena',
            level: g.level || 4,
            activityTitle: g.activityTitle || g.fitxaTitle || '',
            qualitative: g.qualitative || QUALITATIVE_SCALES[sub][scaleLvl],
            scaleLevel: scaleLvl,
            numericGrade: Number(g.numericGrade || g.grade) || 0,
            pointsObtained: g.pointsObtained !== undefined ? g.pointsObtained : 0,
            maxPoints: g.maxPoints || 10,
            feedback: g.feedback || '',
            term: g.term || '1. Hiruhilekoa',
            date: g.date || new Date().toISOString().split('T')[0],
          };
        });

      // Update storage with purged clean list
      localStorage.setItem('ahoan-grades', JSON.stringify(cleaned));
      return cleaned;
    }
  } catch {
    // Ignore
  }
  return [];
};

export const saveGradesToStorage = (grades: GradeRecord[]) => {
  try {
    const clean = grades.filter(
      (g) =>
        g.studentName === 'M.Oliveira' &&
        !MOCK_GRADE_IDS.has(g.id) &&
        !g.activityTitle?.includes('Audioa 1')
    );
    localStorage.setItem('ahoan-grades', JSON.stringify(clean));
  } catch {
    // Ignore
  }
};

export const loadSubmissionsFromStorage = (): StudentSubmission[] => {
  try {
    const raw = localStorage.getItem('ahoan-submissions');
    if (raw) {
      const parsed: any[] = JSON.parse(raw);
      const cleaned: StudentSubmission[] = parsed.filter(
        (s) =>
          !MOCK_SUB_IDS.has(s.id) &&
          s.studentName === 'M.Oliveira' &&
          !s.fitxaTitle?.includes('Audioa 1') &&
          s.fitxaKey !== 'e4a1'
      );
      // Ensure the 10/10 Ahozko Ulermena submission is preserved if list is empty
      const hasAhozko10 = cleaned.some(
        (s) =>
          (s.correctCount === 10 && s.totalQuestions === 10) ||
          s.fitxaKey === 'e4a2' ||
          s.fitxaTitle?.includes('Ahozko ulermena')
      );
      if (!hasAhozko10 && cleaned.length === 0) {
        cleaned.unshift(...INITIAL_SUBMISSIONS);
      }
      localStorage.setItem('ahoan-submissions', JSON.stringify(cleaned));
      return cleaned;
    }
  } catch {
    // Ignore
  }
  return [...INITIAL_SUBMISSIONS];
};

export const purgeUnsentSubmissions = (): StudentSubmission[] => {
  try {
    const onlyConfirmed = [...INITIAL_SUBMISSIONS];
    localStorage.setItem('ahoan-submissions', JSON.stringify(onlyConfirmed));
    return onlyConfirmed;
  } catch {
    return [...INITIAL_SUBMISSIONS];
  }
};

export const saveSubmissionsToStorage = (submissions: StudentSubmission[]) => {
  try {
    const clean = submissions.filter(
      (s) =>
        s.studentName === 'M.Oliveira' &&
        !MOCK_SUB_IDS.has(s.id) &&
        !s.fitxaTitle?.includes('Audioa 1') &&
        s.fitxaKey !== 'e4a1'
    );
    localStorage.setItem('ahoan-submissions', JSON.stringify(clean));
  } catch {
    // Ignore
  }
};

export const isGradesPublished = (): boolean => {
  try {
    const flag = localStorage.getItem('ahoan-grades-published');
    if (flag === 'true') return true;
    if (flag === 'false') return false;

    const now = new Date();
    const deadline = new Date(TERM_DEADLINE_ISO);
    return now.getTime() >= deadline.getTime();
  } catch {
    return false;
  }
};

export const setGradesPublished = (published: boolean) => {
  try {
    localStorage.setItem('ahoan-grades-published', published ? 'true' : 'false');
  } catch {
    // Ignore
  }
};

export const loadCustomFitxakFromStorage = (): CustomFitxa[] => {
  try {
    const raw = localStorage.getItem('ahoan-custom-fitxak');
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return [];
};

export const saveCustomFitxakToStorage = (fitxak: CustomFitxa[]) => {
  try {
    localStorage.setItem('ahoan-custom-fitxak', JSON.stringify(fitxak));
  } catch {
    // Ignore
  }
};
