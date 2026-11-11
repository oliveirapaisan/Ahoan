import React, { useState } from 'react';
import {
  PlusCircle,
  Trash2,
  CheckCircle2,
  Headphones,
  FilePlus2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Eye,
  BookOpen,
  Calculator,
  Layers,
  Wand2,
} from 'lucide-react';
import { CustomFitxa, GradeSubject, SUBJECT_CONFIGS } from '../data/gradebookData';
import { Question } from '../data/ahoanData';
import { AudioEmbed } from './AudioEmbed';
import { sounds } from '../utils/audioChime';

interface FitxaCreatorProps {
  onSaveFitxa: (fitxa: CustomFitxa) => void;
  onCancel: () => void;
  existingCustomFitxak: CustomFitxa[];
  onDeleteCustomFitxa: (key: string) => void;
}

interface NewQuestionForm {
  q: string;
  o: string[];
  a: number;
}

interface TemplatePreset {
  id: string;
  label: string;
  subject: GradeSubject;
  activityType: 'audio' | 'reading' | 'math' | 'grammar';
  level: number;
  title: string;
  description: string;
  passage?: string;
  audioUrl?: string;
  questions: NewQuestionForm[];
}

const TEMPLATES: TemplatePreset[] = [
  // EUSKARA ADITZAK ETA GRAMATIKA TEMPLATES (FIRST & PROMINENT)
  {
    id: 'eu-aditzak-nornork-1',
    label: '🟢 Euskara · Aditzak (Nor-Nork Oraina)',
    subject: 'euskera',
    activityType: 'grammar',
    level: 4,
    title: 'Aditzak · Nor-Nork aditz laguntzaileak (Oraina)',
    description: 'Nik dut, zuk duzu, hark du, guk dugu/ditugu, zuek duzue, haiek dute ariketa praktikoak.',
    passage:
      'NOR-NORK ADITZ LAGUNTZAILEAK (ORAINA):\n\n• Nik liburua irakurri DUT (nik / hura -> DUT)\n• Nik liburuak irakurri DITUT (nik / haiek -> DITUT)\n• Zuk sagarra jan DUZU (zuk / hura -> DUZU)\n• Zuk sagarrak jan DITUZU (zuk / haiek -> DITUZU)\n• Hark baloia bota DU (hark / hura -> DU)\n• Guk etxeko lanak egin DITUGU (guk / haiek -> DITUGU)\n• Zuek musika entzun DUZUE (zuek / hura -> DUZUE)\n• Haiek txangoa antolatu DUTE (haiek / hura -> DUTE)',
    questions: [
      {
        q: "Aukeratu aditz zuzena: 'Nik atzo istorio polita irakurri _________.'",
        o: ['dut', 'duzu', 'du', 'ditut'],
        a: 0,
      },
      {
        q: "Aukeratu aditz zuzena: 'Zuk koadernoan marrazki guztiak egin _________.'",
        o: ['dituzu', 'duzu', 'dute', 'du'],
        a: 0,
      },
      {
        q: "Aukeratu aditz zuzena: 'Guk eskolako kideak gonbidatu _________.'",
        o: ['ditugu', 'dugu', 'duzue', 'dute'],
        a: 0,
      },
      {
        q: "Aukeratu aditz zuzena: 'Ikasleek motxilak gelan utzi _________.'",
        o: ['dituzte', 'dute', 'dutez', 'dugu'],
        a: 0,
      },
    ],
  },
  {
    id: 'eu-aditzak-nornorinork-1',
    label: '🟢 Euskara · Aditzak (Nor-Nori-Nork & Trinkoak)',
    subject: 'euskera',
    activityType: 'grammar',
    level: 4,
    title: 'Aditzak · Nor-Nori-Nork eta Aditz Trinkoak',
    description: 'diot, didazu, digu, dizkiozu eta Joan, Etorri, Ibili, Jakin aditz trinkoak.',
    passage:
      'NOR-NORI-NORK ETA ADITZ TRINKOAK:\n\n1. Nor-Nori-Nork (Oraina):\n• Nik zuri mezua bidali DIZUT (nik / zuri / hura)\n• Zuk niri arkatza eman DIDAZU (zuk / niri / hura)\n• Hark guri abestia irakatsi DIGU (hark / guri / hura)\n• Irakasleak ikasleei fitxak banatu DIZKIE (hark / haiei / haiek)\n\n2. Aditz Trinkoak (Oraina):\n• JOAN: Ni mendira NOA, zu eskolara ZOAZ, laguna DOA.\n• ETORRI: Ni etxera NATOR, zu berandu ZATOZ, trena DATOR.\n• JAKIN: Nik erantzuna DAKIT, zuk egia DAKIZU.',
    questions: [
      {
        q: "Nor-Nori-Nork: 'Nik amari lore sorta bat oparitu _________.'",
        o: ['diot', 'dizut', 'didat', 'digu'],
        a: 0,
      },
      {
        q: "Nor-Nori-Nork: 'Zuk niri zure liburua utzi _________ mesedez?'",
        o: ['didazu', 'dizut', 'digu', 'diot'],
        a: 0,
      },
      {
        q: "Aditz Trinkoa (JOAN): 'Gaur goizean ni basora perretxikotara _________.'",
        o: ['noa', 'zoaz', 'doa', 'goaz'],
        a: 0,
      },
      {
        q: "Aditz Trinkoa (JAKIN): 'Nik galdera guztien azalpena ondo _________.'",
        o: ['dakit', 'dakizu', 'daki', 'dakigu'],
        a: 0,
      },
    ],
  },
  {
    id: 'eu-aditzak-lehena-1',
    label: '🟢 Euskara · Aditzak (Lehena / Iragana)',
    subject: 'euskera',
    activityType: 'grammar',
    level: 4,
    title: 'Aditzak · Lehenaldia (Iragana: nuen, zenuen, zuen...)',
    description: 'Iraganeko Nor-Nork aditzak lantzeko ariketa praktikoa.',
    passage:
      'NOR-NORK LEHENALDIA (IRAGANA):\n\n• Atzo nik afari goxoa prestatu NUEN (nik / hura -> NUEN)\n• Zuk gutun luze bat idatzi ZENUEN (zuk / hura -> ZENUEN)\n• Anek gola sartu ZUEN (hark / hura -> ZUEN)\n• Guk partida irabazi GENUEN (guk / hura -> GENUEN)\n• Haiek autobusa hartu ZUTEN (haiek / hura -> ZUTEN)',
    questions: [
      {
        q: "Aukeratu lehenaldiko aditza: 'Atzo nik pelikula dibertigarri bat ikusi _________.'",
        o: ['nuen', 'zenuen', 'zuen', 'genuen'],
        a: 0,
      },
      {
        q: "Aukeratu lehenaldiko aditza: 'Zuk eskolako atea itxi _________.'",
        o: ['zenuen', 'nuen', 'zuten', 'zenuten'],
        a: 0,
      },
      {
        q: "Aukeratu lehenaldiko aditza: 'Guk ibilbide guztia oinez egin _________.'",
        o: ['genuen', 'zenuten', 'zuten', 'nuen'],
        a: 0,
      },
    ],
  },
  // EUSKARA AHOZKOA
  {
    id: 'eu-ahozko-1',
    label: '🟢 Euskara · Ahozko ulermena',
    subject: 'euskera',
    activityType: 'audio',
    level: 4,
    title: 'Ahozko ulermena · Basoko sekretuak eta ekologia',
    description: 'Entzun arretaz natura zaintzeko elkarrizketa eta erantzun galderei.',
    audioUrl: 'https://www.ivoox.com/player_ej_10072002_6_1.html?c1=978e2b',
    questions: [
      {
        q: 'Zein da entzute honetako ideia nagusia?',
        o: ['Natura errespetatzea eta hondakinak murriztea', 'Kirol berri bat ikastea', 'Bidaia luze bat antolatzea', 'Etxe berri bat eraikitzea'],
        a: 0,
      },
      {
        q: 'Zer aholku ematen zaie ikasleei basoan ibiltzean?',
        o: ['Bidezidorretatik ibiltzea eta zaborrik ez uztea', 'Sua egitea berotzeko', 'Lore guztiak moztea', 'Oihu ozenak egitea'],
        a: 0,
      },
      {
        q: 'Nola lagundu dezakegu eskolatik ingurumena zaintzen?',
        o: ['Materialak birziklatuz eta ura aurreztuz', 'Argiak piztuta utziz', 'Janaria botaz', 'Plastiko gehiago erabiliz'],
        a: 0,
      },
    ],
  },
  // LENGUA CASTELLANA TEMPLATES
  {
    id: 'es-oral-1',
    label: '🇪🇸 Lengua · Comprensión oral',
    subject: 'lengua',
    activityType: 'audio',
    level: 4,
    title: 'Comprensión oral · La leyenda del valle encantado',
    description: 'Escucha el relato tradicional y responde a las preguntas sobre los guardianes del valle.',
    audioUrl: 'https://www.ivoox.com/player_ej_10072033_6_1.html?c1=978e2b',
    questions: [
      {
        q: '¿Quiénes eran los protectores del valle según la narración?',
        o: ['Las águilas reales de las cumbres', 'Los duendes del bosque', 'Un gigante dormido', 'Un dragón marino'],
        a: 0,
      },
      {
        q: '¿Qué fenómeno anunciaba la llegada de la primavera?',
        o: ['El deshielo cristalino de las cascadas', 'Un eclipse solar', 'Una gran tormenta', 'El florecer de los cactus'],
        a: 0,
      },
      {
        q: '¿Cuál es la moraleja que transmite la leyenda?',
        o: ['Cuidar y respetar la naturaleza como nuestro mayor tesoro', 'Buscar riquezas en las montañas', 'Navegar sin rumbo', 'No alejarse nunca de casa'],
        a: 0,
      },
    ],
  },
  {
    id: 'es-reading-1',
    label: '🇪🇸 Lengua · Comprensión escrita y lectura',
    subject: 'lengua',
    activityType: 'reading',
    level: 4,
    title: 'Comprensión escrita · El desván de los inventos secretos',
    description: 'Lectura comprensiva sobre Marina y el diario de inventos de su bisabuela.',
    passage:
      'Marina subió en silencio las crujientes escaleras de madera que llevaban al desván de su casa de campo. Allí, entre baúles antiguos y telas de araña, descubrió una caja de latón con un cuaderno amarillento. En su primera página ponía: "Cuaderno de inventos de Clara Soler, año 1935". Entre sus dibujos había un paraguas con recolector de agua para regar plantas y un telescopio con filtros de colores.',
    questions: [
      {
        q: '¿Dónde se encontraba el cuaderno de inventos?',
        o: ['En una caja de latón en el desván', 'Bajo la cama de Marina', 'En la biblioteca municipal', 'En el garaje'],
        a: 0,
      },
      {
        q: '¿Quién era la autora original del cuaderno?',
        o: ['Clara Soler, bisabuela de Marina', 'El maestro de la escuela', 'Un científico desconocido', 'La vecina del pueblo'],
        a: 0,
      },
      {
        q: '¿En qué año fue escrito el cuaderno según la portada?',
        o: ['En 1935', 'En 2005', 'En 1890', 'En 1970'],
        a: 0,
      },
      {
        q: '¿Qué invento dibujado servía para regar plantas?',
        o: ['Un paraguas con recolector de agua', 'Una manguera automática', 'Una regadera solar', 'Un molino de viento'],
        a: 0,
      },
    ],
  },
  // ENGLISH TEMPLATES
  {
    id: 'en-listening-1',
    label: '🇬🇧 English · Oral Comprehension (Listening)',
    subject: 'ingles',
    activityType: 'audio',
    level: 4,
    title: 'Oral Comprehension · The Lost Golden Key',
    description: 'Listen to the audio adventure about Lucy and Peter exploring an old manor house.',
    audioUrl: 'https://www.ivoox.com/player_ej_10072002_6_1.html?c1=978e2b',
    questions: [
      {
        q: 'Where did Lucy and Peter find the golden key?',
        o: ['In the secret garden drawer', 'Under the stairs', 'In the kitchen table', 'At the library'],
        a: 0,
      },
      {
        q: 'What color was the chest opened by the key?',
        o: ['Old dark mahogany with brass carvings', 'Bright blue plastic', 'Silver and glass', 'Green stone'],
        a: 0,
      },
      {
        q: 'How did the children feel during their exploration?',
        o: ['Excited and curious', 'Frightened and weeping', 'Bored', 'Angry'],
        a: 0,
      },
    ],
  },
  {
    id: 'en-reading-1',
    label: '🇬🇧 English · Reading Comprehension',
    subject: 'ingles',
    activityType: 'reading',
    level: 4,
    title: 'Reading Comprehension · The Treehouse Mystery',
    description: 'A captivating short story about Oliver, Sam, and an unexpected message.',
    passage:
      'Oliver and Sam built a wooden treehouse at the edge of the maple woods. One sunny afternoon, they discovered a folded paper pinned to the wall with a green ribbon. It read: "Meet by the old stone bridge when the church bells chime four times." Excited and curious, they packed a torch and a notebook.',
    questions: [
      {
        q: 'Where was the treehouse located?',
        o: ['At the edge of the maple woods', 'On the beach', 'In the school yard', 'On a mountain top'],
        a: 0,
      },
      {
        q: 'What color was the ribbon pinning the message?',
        o: ['Green ribbon', 'Red ribbon', 'Yellow ribbon', 'Black ribbon'],
        a: 0,
      },
      {
        q: 'What time did the church bells chime in the message?',
        o: ['Four times (4:00)', 'Twelve times (12:00)', 'Six times (6:00)', 'Two times (2:00)'],
        a: 0,
      },
      {
        q: 'What items did the children pack?',
        o: ['A torch and a notebook', 'Sandwiches and juice', 'A bicycle and helmet', 'Raincoats'],
        a: 0,
      },
    ],
  },
  // MATEMATIKA TEMPLATES
  {
    id: 'mat-buruketa-1',
    label: '🟡 Matematika · Buruketak eta kalkulua',
    subject: 'matematika',
    activityType: 'math',
    level: 4,
    title: 'Buruketak · Eskolako baratzea eta uztaren salmenta',
    description: 'Ebazpen matematikoa, biderketak eta eragiketa konbinatuak baratzeko produktuekin.',
    passage:
      'Gure eskolako baratzean 15 kaxa tomate eta 10 kaxa letxuga jaso ditugu. Tomate kaxa bakoitza 5 euroan saldu dugu, eta letxuga kaxa bakoitza 3 euroan. Lortutako diruaren erdia erreminta berriak erosteko erabiliko dugu.',
    questions: [
      {
        q: 'Zenbat diru lortu dugu tomate kaxa guztiekin (15 kaxa × 5 €)?',
        o: ['75 euro (15 × 5 = 75)', '60 euro', '70 euro', '80 euro'],
        a: 0,
      },
      {
        q: 'Zenbat diru lortu dugu letxuga kaxa guztiekin (10 kaxa × 3 €)?',
        o: ['30 euro (10 × 3 = 30)', '25 euro', '35 euro', '40 euro'],
        a: 0,
      },
      {
        q: 'Zenbat diru lortu dugu guztira tomate eta letxugekin?',
        o: ['105 euro (75 + 30 = 105)', '95 euro', '110 euro', '100 euro'],
        a: 0,
      },
      {
        q: 'Erremintetarako diruaren erdia erabiliko badugu, zenbat euro gastatuko ditugu?',
        o: ['52,5 euro (105 ÷ 2 = 52,5)', '50 euro', '45 euro', '60 euro'],
        a: 0,
      },
    ],
  },
];

export const FitxaCreator: React.FC<FitxaCreatorProps> = ({
  onSaveFitxa,
  onCancel,
  existingCustomFitxak,
  onDeleteCustomFitxa,
}) => {
  const [level, setLevel] = useState<number>(4);
  const [subject, setSubject] = useState<GradeSubject>('euskera');
  const [activityType, setActivityType] = useState<'audio' | 'reading' | 'math' | 'grammar'>('grammar');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passage, setPassage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isIframe, setIsIframe] = useState<boolean>(true);

  // Questions builder with Basque Aditzak default
  const [questions, setQuestions] = useState<NewQuestionForm[]>([
    {
      q: "Aukeratu aditz egokia: 'Nik atzo liburu berri bat irakurri _________.'",
      o: ['dut', 'duzu', 'du', 'ditut'],
      a: 0,
    },
    {
      q: "Aukeratu aditz egokia: 'Zuk gaur goizean sagar goxo guztiak jan _________.'",
      o: ['dituzu', 'duzu', 'dute', 'du'],
      a: 0,
    },
  ]);

  const [previewAudio, setPreviewAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Apply template preset
  const handleApplyTemplate = (tpl: TemplatePreset) => {
    sounds.playChirp();
    setSubject(tpl.subject);
    setActivityType(tpl.activityType);
    setLevel(tpl.level);
    setTitle(tpl.title);
    setDescription(tpl.description);
    setPassage(tpl.passage || '');
    setAudioUrl(tpl.audioUrl || '');
    setQuestions(JSON.parse(JSON.stringify(tpl.questions)));
    setErrorMessage('');
  };

  // Add question
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        q: '',
        o: ['Aukera 1', 'Aukera 2', 'Aukera 3'],
        a: 0,
      },
    ]);
  };

  // Remove question
  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      setErrorMessage('Gutxienez galdera bat behar da fitxan.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Update question text
  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], q: text };
      return copy;
    });
  };

  // Update option text
  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const newOptions = [...copy[qIndex].o];
      newOptions[optIndex] = text;
      copy[qIndex] = { ...copy[qIndex], o: newOptions };
      return copy;
    });
  };

  // Add option to question
  const handleAddOptionToQuestion = (qIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      if (copy[qIndex].o.length >= 5) return copy;
      copy[qIndex] = {
        ...copy[qIndex],
        o: [...copy[qIndex].o, `Aukera ${copy[qIndex].o.length + 1}`],
      };
      return copy;
    });
  };

  // Remove option from question
  const handleRemoveOptionFromQuestion = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      if (copy[qIndex].o.length <= 2) return copy;
      const newOptions = copy[qIndex].o.filter((_, i) => i !== optIndex);
      let newA = copy[qIndex].a;
      if (newA >= newOptions.length) newA = newOptions.length - 1;
      copy[qIndex] = {
        ...copy[qIndex],
        o: newOptions,
        a: newA,
      };
      return copy;
    });
  };

  // Set correct option
  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], a: optIndex };
      return copy;
    });
  };

  // Submit new fitxa
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Idatzi fitxaren izenburua.');
      sounds.playWarning();
      return;
    }

    // Require either passage or audioUrl or description
    if (activityType === 'audio' && !audioUrl.trim()) {
      setErrorMessage('Audio bidezko ariketan sartu audioaren URLa edo erreproduzitzailearen esteka.');
      sounds.playWarning();
      return;
    }

    if ((activityType === 'reading' || activityType === 'math' || activityType === 'grammar') && !passage.trim() && !description.trim()) {
      setErrorMessage('Idatzi aditz taula, azalpena edo irakurgaiaren testua.');
      sounds.playWarning();
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].q.trim()) {
        setErrorMessage(`${i + 1}. galderaren testua hutsik dago.`);
        sounds.playWarning();
        return;
      }
      if (questions[i].o.some((opt) => !opt.trim())) {
        setErrorMessage(`${i + 1}. galderako aukera bat hutsik dago.`);
        sounds.playWarning();
        return;
      }
    }

    const key = `c_${Date.now()}`;
    const cleanQuestions: Question[] = questions.map((q) => ({
      q: q.q.trim(),
      o: q.o.map((opt) => opt.trim()),
      a: q.a,
    }));

    const newFitxa: CustomFitxa = {
      k: key,
      t: title.trim(),
      subject,
      level,
      u: audioUrl.trim() || undefined,
      description: description.trim() || `${SUBJECT_CONFIGS[subject].label} fitxa berria.`,
      passage: passage.trim() || undefined,
      activityType,
      f: isIframe && audioUrl ? 1 : 0,
      questions: cleanQuestions,
      createdAt: new Date().toISOString().split('T')[0],
    };

    sounds.playSuccess();
    onSaveFitxa(newFitxa);
    setSavedSuccess(true);
    setErrorMessage('');

    // Reset fields after a moment
    setTimeout(() => {
      setTitle('');
      setDescription('');
      setPassage('');
      setAudioUrl('');
      setSavedSuccess(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top title header */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-stone-800 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl shadow-inner">
            <FilePlus2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <span>Fitxa eta Ariketa Berria Sortu</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-mono">
                Irakaslea
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Sortu ariketak edozein hizkuntzatan: <b>English</b>, <b>Lengua</b>, <b>Euskara</b> edo <b>Matematika</b>
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Itzuli Arbelara</span>
        </button>
      </div>

      {/* QUICK TEMPLATES BANNER */}
      <div className="bg-gradient-to-r from-amber-500/10 via-stone-50 to-blue-500/10 dark:from-stone-900 dark:to-stone-900 border-2 border-amber-300/80 dark:border-amber-800/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-100">
          <Wand2 className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm sm:text-base font-bold">
            Txantiloi azkarrak (1-klikarekin bete eta argitaratu):
          </h3>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Aukeratu txantiloi bat English, Lengua, Euskara edo Matematikako ariketa oso bat prestaturik kargatzeko:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="p-2.5 rounded-xl border text-left bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600">
                  {tpl.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-mono">
                  LH {tpl.level}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 font-medium">
                {tpl.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
          <div>
            <p className="font-bold text-sm">Fitxa ondo gorde da!</p>
            <p className="text-xs">
              Fitxa berria Arbelan agertuko da <b>{SUBJECT_CONFIGS[subject].label}</b> atalean (LH {level}) eta ikasleak berehala egin ahal izango du.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-5 sm:p-8 shadow-md space-y-6">
        {/* Section 1: Metadata */}
        <div>
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-4 pb-2 border-b border-stone-100 dark:border-stone-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">1</span>
            Asignatura eta Oinarrizko Datuak
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Aukeratu Asignatura / Hizkuntza *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSubject('euskera')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    subject === 'euskera'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-stone-800'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base">🟢</span>
                  <span>Euskara</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubject('lengua')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    subject === 'lengua'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-400 ring-offset-2 dark:ring-offset-stone-800'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base">🔴</span>
                  <span>Lengua Castellana</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubject('ingles')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    subject === 'ingles'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-stone-800'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base">🔵</span>
                  <span>English</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubject('matematika')}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    subject === 'matematika'
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-stone-800'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base">🟡</span>
                  <span>Matematika</span>
                </button>
              </div>
            </div>

            {/* Activity Type */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Ariketa Mota / Tipo de Actividad
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setActivityType('grammar')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    activityType === 'grammar'
                      ? 'bg-emerald-700 text-white dark:bg-emerald-600 border-transparent shadow'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>🔤 Aditzak / Gramatika</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivityType('reading')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    activityType === 'reading'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>📖 Irakurgaia / Testua</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivityType('audio')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    activityType === 'audio'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Headphones className="w-4 h-4 text-amber-500" />
                  <span>🎧 Audioa (Entzutea)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivityType('math')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    activityType === 'math'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-blue-500" />
                  <span>🔢 Buruketak / Mate</span>
                </button>
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Maila / Nivel *
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      level === l
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    LH {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Fitxaren Izenburua *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="adibidez: Aditzak · Nor-Nork laguntzaileak eta ariketak"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Azalpena / Ikasleentzako oharra (Aukerakoa)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ikasleentzako testuingurua edo argibideak..."
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Content (Passage or Audio) */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700 mb-3 flex-wrap gap-2">
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">2</span>
              Ariketaren Edukia: Aditz Taula, Testua edo Audioa
            </h3>

            {/* Quick Verb Chart Helpers */}
            {(activityType === 'grammar' || subject === 'euskera') && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-stone-400 font-semibold">💡 Txertatu:</span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playChirp();
                    setPassage(
                      'NOR-NORK ADITZ LAGUNTZAILEAK (ORAINA):\n\n' +
                      '• Nik liburua irakurri DUT (nik / hura -> DUT)\n' +
                      '• Nik liburuak irakurri DITUT (nik / haiek -> DITUT)\n' +
                      '• Zuk sagarra jan DUZU (zuk / hura -> DUZU)\n' +
                      '• Zuk sagarrak jan DITUZU (zuk / haiek -> DITUZU)\n' +
                      '• Hark pilota bota DU (hark / hura -> DU)\n' +
                      '• Guk ariketak egin DITUGU (guk / haiek -> DITUGU)\n' +
                      '• Zuek musika entzun DUZUE (zuek / hura -> DUZUE)\n' +
                      '• Haiek txangoa egin DUTE (haiek / hura -> DUTE)'
                    );
                    if (!title) setTitle('Aditzak · Nor-Nork aditz laguntzaileak');
                  }}
                  className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                >
                  Nor-Nork Taula
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playChirp();
                    setPassage(
                      'NOR-NORI-NORK ADITZAK (ORAINA):\n\n' +
                      '• Nik zuri oparia eman DIZUT (nik / zuri / hura -> DIZUT)\n' +
                      '• Zuk niri arkatza eman DIDAZU (zuk / niri / hura -> DIDAZU)\n' +
                      '• Hark guri mezua bidali DIGU (hark / guri / hura -> DIGU)\n' +
                      '• Irakasleak ikasleei fitxak banatu DIZKIE (hark / haiei / haiek -> DIZKIE)'
                    );
                    if (!title) setTitle('Aditzak · Nor-Nori-Nork ariketak');
                  }}
                  className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                >
                  Nor-Nori-Nork Taula
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playChirp();
                    setPassage(
                      'ADITZ TRINKOAK (ORAINA):\n\n' +
                      '• JOAN: Ni NOA, zu ZOAZ, hura DOA, gu GOAZ, haiek DOAZ\n' +
                      '• ETORRI: Ni NATOR, zu ZATOZ, hura DATOR, haiek DATOZ\n' +
                      '• IBILI: Ni NABIL, zu ZABILTZA, hura DABIL, haiek DABILTZAT\n' +
                      '• JAKIN: Nik DAKIT, zuk DAKIZU, hark DAKI, guk DAKIGU'
                    );
                    if (!title) setTitle('Aditzak · Aditz trinkoak');
                  }}
                  className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                >
                  Aditz Trinkoak
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Reading / Problem / Grammar text passage */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Aditz-taula, irakurgaiaren testua edo buruketen azalpena
              </label>
              <textarea
                rows={4}
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                placeholder="Idatzi hemen aditz taulak, istorioa, artikulua edo ariketa matematikoen egoera..."
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed font-mono"
              />
            </div>

            {/* Audio URL (Optional or required for audio mode) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Audioaren URLa edo erreproduzitzaile esteka {activityType === 'audio' ? '*' : '(Aukerakoa)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://www.ivoox.com/player_ej_... edo https://soundcloud.com/..."
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                />
                {audioUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewAudio(!previewAudio)}
                    className="px-3 py-2 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{previewAudio ? 'Itxi' : 'Probatu'}</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Ivoox, SoundCloud edo MP3 audio fitxategi zuzena onartzen da.
              </p>
            </div>

            {/* Audio Preview Box */}
            {previewAudio && audioUrl && (
              <div className="p-3 bg-stone-900 rounded-2xl border border-stone-700">
                <p className="text-xs text-stone-400 mb-2 font-mono flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  Erreproduzitzailearen aurrebista:
                </p>
                <AudioEmbed url={audioUrl} title={title || 'Aurrebista'} isIvoox={isIframe} />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Questions Builder */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-700">
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">3</span>
              Galdetegia ({questions.length} galdera)
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-semibold text-xs rounded-xl border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Gehitu Galdera</span>
            </button>
          </div>

          <div className="space-y-5">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {qIndex + 1}. GALDERA
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-stone-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Ezabatu galdera hau"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={q.q}
                    onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                    placeholder="Idatzi galderaren testua (adib. What did the boy paint?)..."
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                    Erantzun aukerak (markatu zirkulua erantzun ZUZENA hautatzeko):
                  </p>

                  {q.o.map((opt, optIndex) => {
                    const isCorrect = q.a === optIndex;
                    return (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_opt_${qIndex}`}
                          checked={isCorrect}
                          onChange={() => handleSetCorrectOption(qIndex, optIndex)}
                          title="Markatu erantzun zuzen bezala"
                          className="w-4 h-4 ml-2 accent-emerald-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          placeholder={`Aukera ${optIndex + 1}`}
                          className="flex-1 px-2.5 py-1.5 bg-transparent border-0 text-xs sm:text-sm text-stone-800 dark:text-stone-100 focus:outline-none font-medium"
                        />
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full mr-1 shrink-0">
                            ZUZENA
                          </span>
                        )}
                        {q.o.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionFromQuestion(qIndex, optIndex)}
                            className="p-1 text-stone-400 hover:text-red-500 transition-colors mr-1 cursor-pointer"
                            title="Kendu aukera hau"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {q.o.length < 5 && (
                    <button
                      type="button"
                      onClick={() => handleAddOptionToQuestion(qIndex)}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium pt-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Gehitu beste erantzun aukera bat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-700 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Utzi
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Gorde Fitxa eta Argitaratu ({SUBJECT_CONFIGS[subject].label})
          </button>
        </div>
      </form>

      {/* Existing Custom Fitxak list */}
      {existingCustomFitxak.length > 0 && (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-100 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Zuk sortutako fitxak ({existingCustomFitxak.length})
          </h3>

          <div className="divide-y divide-stone-100 dark:divide-stone-700">
            {existingCustomFitxak.map((f) => (
              <div key={f.k} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                      LH {f.level} · {SUBJECT_CONFIGS[f.subject]?.label || f.subject}
                    </span>
                    <h4 className="font-semibold text-sm text-stone-800 dark:text-stone-100">
                      {f.t}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {f.questions.length} galdera · Sortua: {f.createdAt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteCustomFitxa(f.k)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Ezabatu fitxa hau"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
