import React, { useState } from 'react';
import { ExternalLink, FileText, CheckCircle, Sparkles, LogOut, BookOpen, Layers, GraduationCap } from 'lucide-react';
import { AudioItem, D, FX, Question, AppSubject, LanguageData, SUBJECT_COLORS } from '../data/ahoanData';
import { AudioEmbed } from './AudioEmbed';

interface ArbelaViewProps {
  currentLang: AppSubject;
  currentLevel: number;
  answers: Record<string, Record<number, number> & { done?: boolean }>;
  dataset?: Record<AppSubject, LanguageData>;
  questionsMap?: Record<string, Question[]>;
  publishedFitxaKeys?: string[];
  onSendFitxa?: (key: string) => void;
  isTeacher?: boolean;
  currentUser?: string;
  gradesPublished?: boolean;
  onOpenReportCard?: () => void;
  onOpenFitxa: (key: string) => void;
  onNavigateTeacherTab?: (tab: 'create_fitxa' | 'gradebook' | 'grades_list' | 'grades_progress') => void;
  onLogout: () => void;
  onSelectLevel: (lvl: number) => void;
}

export const ArbelaView: React.FC<ArbelaViewProps> = ({
  currentLang,
  currentLevel,
  answers,
  dataset,
  questionsMap,
  publishedFitxaKeys = [],
  onSendFitxa,
  isTeacher = false,
  currentUser = 'Ikaslea',
  gradesPublished = false,
  onOpenReportCard,
  onOpenFitxa,
  onNavigateTeacherTab,
  onLogout,
  onSelectLevel,
}) => {
  const isEn = currentLang === 'ingles';
  const isEs = currentLang === 'lengua';
  const isMate = currentLang === 'matematika';

  const effectiveData = dataset || D;
  const langData = effectiveData[currentLang] || { ext: {}, own: {} };
  const allExtList = (langData.ext && langData.ext[String(currentLevel)]) || [];
  const extList = isTeacher ? allExtList : allExtList.filter((item) => publishedFitxaKeys.includes(item.k));
  const ownUrl = langData.own ? langData.own[String(currentLevel)] : undefined;

  const [showAllAudios, setShowAllAudios] = useState(false);

  // Default items logic matching user's original items() function
  const hasExtAudios = extList.length > 0;

  // Primary featured exercise
  const primaryAudio = hasExtAudios ? extList[0] : null;
  const secondaryAudios = hasExtAudios ? extList.slice(1) : [];

  const getAudioStatus = (key: string) => {
    const ans = answers[key];
    if (!ans || !ans.done) return null;
    const qs = (questionsMap && questionsMap[key]) || FX[key] || [];
    if (!qs.length) return { done: true, text: 'Bidalita' };
    const correct = qs.filter((q, i) => ans[i] === q.a).length;
    return {
      done: true,
      text: `Bidalita (${correct}/${qs.length})`,
      perfect: correct === qs.length,
    };
  };

  const subjectLabel = SUBJECT_COLORS[currentLang]?.name || 'Euskara';
  const levelText = isEn ? `${currentLevel}. Level` : isEs ? `${currentLevel}.º Nivel` : `${currentLevel}. Maila`;
  const subtitleText = isEn
    ? "Today's exercise · Listen carefully and complete the worksheet"
    : isEs
    ? "Ejercicio de hoy · Escucha con atención y completa la ficha"
    : isMate
    ? "Gaurko ariketa · Irakurri adi problemak eta ebatzi eragiketak"
    : "Gaurko ariketa · Entzun arretaz eta osatu fitxa";

  return (
    <div className="arbela-frame rounded-3xl p-5 sm:p-8 text-[#f4f1e6] shadow-2xl relative my-3 transition-all">
      {/* Blackboard Title */}
      <div className="flex items-center justify-between gap-3 mb-2 pb-3 border-b border-white/15">
        <div>
          <p className="font-chalk text-2xl sm:text-3xl font-bold tracking-wide text-[#f4f1e6] flex items-center gap-2">
            <span>✏️ Arbela</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-sans font-normal border border-white/20">
              {levelText} · {subjectLabel}
            </span>
          </p>
          <p className="text-xs sm:text-sm text-[#f4f1e6]/80 font-chalk text-base mt-0.5">
            {subtitleText}
          </p>
        </div>

        {/* Level quick badges */}
        <div className="hidden sm:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <button
              key={l}
              onClick={() => onSelectLevel(l)}
              className={`w-7 h-7 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                l === currentLevel
                  ? 'bg-[#f4f1e6] text-[#264333] shadow'
                  : 'text-[#f4f1e6]/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Teacher banner */}
      {isTeacher && (
        <div className="mt-3 p-3.5 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-amber-200">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <b>Irakasle panela ({currentUser}):</b> Fitxa berriak sortu ditzakezu eta ikasleei notak jarri.
            </span>
          </div>

          {onNavigateTeacherTab && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onNavigateTeacherTab('create_fitxa')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                ➕ Fitxa Berria
              </button>
              <button
                onClick={() => onNavigateTeacherTab('grades_list')}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                👁️ Jarritako Notak
              </button>
              <button
                onClick={() => onNavigateTeacherTab('grades_progress')}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                📊 Nola Doazen
              </button>
              <button
                onClick={() => onNavigateTeacherTab('gradebook')}
                className="px-3 py-1.5 bg-[#f4f1e6] hover:bg-white text-[#264333] font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                📝 Notak Jarri
              </button>
            </div>
          )}
        </div>
      )}

      {/* Student published grades banner */}
      {!isTeacher && gradesPublished && onOpenReportCard && (
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-blue-600/30 border-2 border-emerald-400/70 flex flex-wrap items-center justify-between gap-3 text-[#f4f1e6] shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold">
              📬
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full">
                  Berria
                </span>
                <h4 className="font-bold text-sm sm:text-base">
                  1. Hiruhilekoko notak argitaratu dira!
                </h4>
              </div>
              <p className="text-xs text-[#f4f1e6]/80 mt-0.5">
                L.Oliveira irakasleak zure kalifikazioak eta ebaluazio kualitatiboa prestatu ditu.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenReportCard}
            className="px-4 py-2 bg-[#f4f1e6] hover:bg-white text-[#264333] font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Ikusi nire notak</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="space-y-5 my-4">
        {/* If External Audios exist (e.g. Level 4, Level 6 in Basque) */}
        {hasExtAudios ? (
          <div>
            {/* Primary / Today's Exercise */}
            {primaryAudio && (
              <div className="chalk-box rounded-2xl p-4 sm:p-6 relative overflow-hidden transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-lg">
                      {primaryAudio.activityType === 'grammar' ? '🔤' : primaryAudio.activityType === 'reading' ? '📖' : primaryAudio.activityType === 'math' ? '🔢' : '🎧'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-400 text-stone-900 text-[10px] font-bold rounded-md uppercase tracking-wide">
                          Gaurko ariketa
                        </span>
                        <h2 className="font-bold text-base sm:text-lg text-[#f4f1e6]">
                          {primaryAudio.t}
                        </h2>
                      </div>
                      {primaryAudio.description && (
                        <p className="text-xs text-[#f4f1e6]/70 mt-0.5">
                          {primaryAudio.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status badge if completed */}
                  {(() => {
                    const status = getAudioStatus(primaryAudio.k);
                    if (!status) return null;
                    return (
                      <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/50 text-emerald-200 text-xs font-bold font-mono">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{status.text}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Passage preview or embedded audio player */}
                {primaryAudio.passage && (
                  <div className="my-3 p-3.5 bg-black/30 border border-white/10 rounded-xl text-xs sm:text-sm text-[#f4f1e6]/90 line-clamp-3 font-sans italic">
                    "{primaryAudio.passage}"
                  </div>
                )}

                {primaryAudio.u && (
                  <AudioEmbed
                    url={primaryAudio.u}
                    title={primaryAudio.t}
                    isIvoox={primaryAudio.f === 1}
                  />
                )}

                {/* Action buttons */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  {isTeacher && onSendFitxa && (
                    <button onClick={() => onSendFitxa(primaryAudio.k)} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm rounded-xl shadow cursor-pointer">📨 Enviar al alumno</button>
                  )}
                  <button
                    onClick={() => onOpenFitxa(primaryAudio.k)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4f1e6] hover:bg-white text-[#264333] font-bold text-sm sm:text-base rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>📄 Fitxa ireki</span>
                  </button>

                  {primaryAudio.u && (
                    <a
                      href={primaryAudio.u}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#f4f1e6]/80 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Audioaren orria ireki
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Extra audios in this level (Audioa 2, Audioa 3, etc.) */}
            {secondaryAudios.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-chalk text-xl font-bold text-[#f4f1e6] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Maila honetako beste fitxa eta audioak ({secondaryAudios.length})</span>
                  </h3>
                  <button
                    onClick={() => setShowAllAudios(!showAllAudios)}
                    className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[#f4f1e6] transition-all cursor-pointer"
                  >
                    {showAllAudios ? 'Itxi' : 'Guztiak erakutsi'}
                  </button>
                </div>

                {showAllAudios && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {secondaryAudios.map((item) => {
                      const status = getAudioStatus(item.k);
                      const icon = item.activityType === 'grammar' ? '🔤' : item.activityType === 'reading' ? '📖' : item.activityType === 'math' ? '🔢' : '🎧';
                      return (
                        <div
                          key={item.k}
                          className="chalk-box rounded-xl p-4 flex flex-col justify-between transition-all hover:bg-white/5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <h4 className="font-bold text-sm text-[#f4f1e6] flex items-center gap-1.5">
                                <span>{icon}</span> {item.t}
                              </h4>
                              {status && (
                                <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                                  {status.text}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-[#f4f1e6]/70 line-clamp-2 mb-3">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 mt-2">
                            {isTeacher && onSendFitxa && <button onClick={() => onSendFitxa(item.k)} className="text-xs px-2 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold cursor-pointer">📨 Enviar</button>}
                            <button
                              onClick={() => onOpenFitxa(item.k)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f1e6] hover:bg-white text-[#264333] font-bold text-xs rounded-lg transition-all shadow cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Fitxa
                            </button>

                            {item.u && (
                              <a
                                href={item.u}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#f4f1e6]/70 hover:text-white inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Audioa
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Optional extra test card matching original `D.euskera.own[S.c]` */}
            {ownUrl && (
              <div className="chalk-box rounded-xl p-4 flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#f4f1e6]">
                      📝 Testa (testua + galderak)
                    </h3>
                    <p className="text-xs text-[#f4f1e6]/70">
                      Ariketa osagarria eta galdetegi integrala
                    </p>
                  </div>
                </div>

                <a
                  href={ownUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f4f1e6] hover:bg-white text-[#264333] font-bold text-xs sm:text-sm rounded-xl shadow transition-all cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-700" />
                  Ariketa ireki
                </a>
              </div>
            )}
          </div>
        ) : (
          /* When there are no external audios: display the level's interactive listening comprehension module */
          <div className="chalk-box rounded-2xl p-6 sm:p-8 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-white/10 text-[#f4f1e6] mb-3">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>

            <h3 className="font-chalk text-2xl font-bold text-[#f4f1e6] mb-1">
              🎧 {isEn ? `Listening · level ${currentLevel}` : `Ahozko ulermena · ${currentLevel}. maila`}
            </h3>

            <p className="text-sm text-[#f4f1e6]/80 max-w-md mx-auto mb-6">
              {isEn
                ? 'Open it, listen to the audio, and when you come back in, answer the test.'
                : 'Ireki, entzun audioa eta berriro sartzean erantzun testa.'}
            </p>

            {ownUrl ? (
              <a
                href={ownUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#f4f1e6] hover:bg-white active:scale-95 text-[#264333] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm sm:text-base"
              >
                <ExternalLink className="w-5 h-5 text-emerald-700" />
                <span>{isEn ? '🔗 Open exercise' : '🔗 Ariketa ireki'}</span>
              </a>
            ) : (
              <p className="text-xs text-[#f4f1e6]/60">
                Ariketa hau prestatzen ari da.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Blackboard Footer */}
      <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-[#f4f1e6]/60">
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-[#f4f1e6] hover:bg-white/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Irten</span>
        </button>

        <span className="font-chalk text-sm text-[#f4f1e6]/75">
          {subjectLabel} · Ahozko eta Idatzizko Ulermena
        </span>
      </div>
    </div>
  );
};
