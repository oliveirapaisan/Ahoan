import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, AlertCircle, Award, Check, Headphones, Eye, EyeOff, GraduationCap, Send, Trash2 } from 'lucide-react';
import { AudioItem, Question } from '../data/ahoanData';
import { AudioEmbed } from './AudioEmbed';
import { sounds } from '../utils/audioChime';

interface FitxaViewProps {
  item: AudioItem;
  questions: Question[];
  savedAnswers: Record<number, number>;
  isDone: boolean;
  isTeacher?: boolean;
  onSelectOption: (questionIndex: number, optionIndex: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  onBack: () => void;
}

export const FitxaView: React.FC<FitxaViewProps> = ({
  item,
  questions,
  savedAnswers,
  isDone,
  isTeacher = false,
  onSelectOption,
  onSubmit,
  onReset,
  onBack,
}) => {
  const [validationError, setValidationError] = useState('');
  const [teacherRevealSolutions, setTeacherRevealSolutions] = useState(false);

  const hasQuestions = questions && questions.length > 0;
  const allAnswered = hasQuestions && questions.every((_, i) => savedAnswers[i] !== undefined);
  const correctCount = hasQuestions
    ? questions.filter((q, i) => savedAnswers[i] === q.a).length
    : 0;

  const handleSubmit = () => {
    if (!allAnswered) {
      setValidationError('Erantzun galdera guztiei.');
      sounds.playWarning();
      return;
    }
    setValidationError('');
    sounds.playSuccess();
    onSubmit();
  };

  const handleReset = () => {
    setValidationError('');
    sounds.playChirp();
    onReset();
  };

  const scorePercentage = hasQuestions ? Math.round((correctCount / questions.length) * 100) : 0;
  const displayAsEvaluated = isDone || (isTeacher && teacherRevealSolutions);

  return (
    <div className="arbela-frame rounded-2xl p-4 sm:p-7 text-[#f4f1e6] shadow-2xl relative my-4">
      {/* Top back button row */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-white/10 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f1e6] hover:bg-white text-[#264333] font-bold text-xs sm:text-sm rounded-xl shadow transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Atzera
        </button>

        <div className="flex items-center gap-2">
          {/* Teacher solution toggle */}
          {isTeacher && hasQuestions && (
            <button
              onClick={() => setTeacherRevealSolutions(!teacherRevealSolutions)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-stone-900" />
              {teacherRevealSolutions ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Ezkutatu soluzioak</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Irakaslea: Ikusi soluzioak</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-[#f4f1e6]/80 font-mono">
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>{item.t}</span>
          </div>
        </div>
      </div>

      {/* Passage box (Reading story or Math problem context) */}
      {item.passage && (
        <div className="bg-stone-900/70 border border-amber-400/30 rounded-2xl p-4 sm:p-5 mb-5 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10 text-amber-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <span>📖 Testua / Irakurgaia / Reading Story</span>
            </div>
            {item.description && (
              <span className="text-xs text-white/60 font-sans">{item.description}</span>
            )}
          </div>
          <div className="text-sm sm:text-base text-stone-100 whitespace-pre-line leading-relaxed font-sans bg-black/30 p-4 rounded-xl border border-white/5">
            {item.passage}
          </div>
        </div>
      )}

      {/* Audio player card (if audio URL is provided) */}
      {item.u ? (
        <div className="chalk-box rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-base sm:text-lg flex items-center gap-2 text-[#f4f1e6]">
              <span>🎧 Audioa · {item.t}</span>
            </h2>
            {hasQuestions && (
              <span className="text-xs px-2.5 py-1 bg-white/10 rounded-full font-mono">
                {Object.keys(savedAnswers).filter((k) => k !== 'done').length}/{questions.length} erantzunda
              </span>
            )}
          </div>
          <p className="text-xs text-[#f4f1e6]/75 mb-2 font-chalk text-base">
            Entzun audioa arretaz eta erantzun beheko galderei.
          </p>

          {/* Embedded player */}
          <AudioEmbed url={item.u} title={item.t} isIvoox={item.f === 1} />
        </div>
      ) : !item.passage ? (
        <div className="chalk-box rounded-xl p-4 mb-5">
          <h2 className="font-bold text-base sm:text-lg flex items-center gap-2 text-[#f4f1e6]">
            <span>📄 {item.t}</span>
          </h2>
          {item.description && (
            <p className="text-xs text-[#f4f1e6]/80 mt-1">{item.description}</p>
          )}
        </div>
      ) : null}

      {/* Teacher notice banner if revealing solutions */}
      {isTeacher && teacherRevealSolutions && (
        <div className="p-3 mb-4 rounded-xl bg-amber-400/20 border border-amber-400/60 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
            <span><b>Irakasle modua:</b> Erantzun zuzenak berdez nabarmenduta daude ikasleen fitxak zuzendu ahal izateko.</span>
          </div>
        </div>
      )}

      {/* Questions section */}
      {!hasQuestions ? (
        <div className="chalk-box rounded-xl p-6 text-center text-[#f4f1e6]/80 my-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-300 opacity-80" />
          <p className="font-chalk text-xl">Oraindik ez dago galderarik fitxa honetan.</p>
          <p className="text-xs text-[#f4f1e6]/60 mt-1">Laster gehituko dira ariketa honetarako galderak.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {questions.map((q, qIndex) => {
            const selectedOpt = savedAnswers[qIndex];
            const isQuestionAnswered = selectedOpt !== undefined;

            return (
              <div
                key={qIndex}
                className={`chalk-box rounded-xl p-4 sm:p-5 transition-all ${
                  displayAsEvaluated
                    ? selectedOpt === q.a || teacherRevealSolutions
                      ? 'border-emerald-400/60 bg-emerald-950/20'
                      : 'border-red-400/50 bg-red-950/20'
                    : isQuestionAnswered
                    ? 'border-[#f4f1e6]/60'
                    : 'border-[#f4f1e6]/25'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug">
                    <span className="font-mono text-emerald-300 mr-1.5">{qIndex + 1}.</span>
                    {q.q}
                  </h3>

                  {displayAsEvaluated && (
                    <div className="shrink-0 mt-0.5">
                      {selectedOpt === q.a || (teacherRevealSolutions && selectedOpt === undefined) ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-400/40">
                          <Check className="w-3.5 h-3.5" /> {teacherRevealSolutions ? 'Soluzioa' : 'Ondo'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-300 bg-red-900/60 px-2 py-0.5 rounded-full border border-red-400/40">
                          <XCircle className="w-3.5 h-3.5" /> Oker
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {q.o.map((opt, optIndex) => {
                    const isSelected = selectedOpt === optIndex;
                    const isCorrectAnswer = q.a === optIndex;

                    let optionStateStyle = 'hover:bg-white/5 border-white/15 text-[#f4f1e6]';

                    if (displayAsEvaluated) {
                      if (isCorrectAnswer) {
                        optionStateStyle = 'bg-emerald-800/40 border-emerald-400/70 text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrectAnswer) {
                        optionStateStyle = 'bg-red-900/40 border-red-400/60 text-red-200 line-through';
                      } else {
                        optionStateStyle = 'opacity-60 border-transparent';
                      }
                    } else if (isSelected) {
                      optionStateStyle = 'bg-white/15 border-[#f4f1e6] font-medium';
                    }

                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer text-xs sm:text-sm ${optionStateStyle} ${
                          isDone && !isTeacher ? 'cursor-default pointer-events-none' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question_${qIndex}`}
                          checked={isSelected}
                          disabled={isDone && !isTeacher}
                          onChange={() => {
                            sounds.playChirp();
                            onSelectOption(qIndex, optIndex);
                            if (validationError) setValidationError('');
                          }}
                          className="w-4 h-4 accent-[#f4f1e6] cursor-pointer shrink-0"
                        />
                        <span className="flex-1">
                          {opt}
                        </span>

                        {displayAsEvaluated && isCorrectAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Validation warning */}
      {validationError && (
        <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-400 text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
          <span id="fp" className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Submission & Score Section */}
      {hasQuestions && (
        <div className="pt-2">
          {isDone ? (
            <div className="chalk-box rounded-xl p-5 sm:p-6 text-center border-2 border-emerald-400/50 bg-emerald-950/30">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 mb-2">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-chalk text-[#f4f1e6]">
                Puntuazioa: <span className="text-emerald-300">{correctCount}</span> / {questions.length}
              </h3>

              <p className="text-sm text-[#f4f1e6]/80 mt-1 mb-4">
                {scorePercentage === 100
                  ? '🌟 Bikain! Galdera guztiak zuzen erantzun dituzu!'
                  : scorePercentage >= 70
                  ? '👏 Oso ondo egina! Ulermen bikaina erakutsi duzu.'
                  : '💪 Lan ona! Entzun berriro audioa eta saiatu berriro erantzuten hobetzeko.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4f1e6] hover:bg-white text-[#264333] font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Berriro hasi
                </button>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#f4f1e6] font-medium rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  ← Arbela nagusira itzuli
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#f4f1e6] hover:bg-white active:scale-95 text-[#264333] font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5 text-emerald-600" />
                  <span>Bidali irakasleari</span>
                </button>

                {Object.keys(savedAnswers).filter((k) => k !== 'done').length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/40 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                    title="Ezabatu emandako erantzunak bidali gabe"
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                    <span>Ezabatu (ez bidali)</span>
                  </button>
                )}
              </div>

              <span className="text-xs text-[#f4f1e6]/70 font-chalk text-base">
                {allAnswered ? 'Galdera guztiak bete dira!' : 'Ziurtatu galdera guztiak erantzun dituzula.'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
