export interface AudioItem {
  t: string; // Title
  k: string; // Key
  u?: string; // URL (optional for text-based worksheets)
  f?: number; // 1 = embed iframe available
  own?: number;
  description?: string;
  passage?: string; // Reading text or math problem scenario
  activityType?: 'audio' | 'reading' | 'math' | 'grammar' | 'mixed';
}

export interface Question {
  q: string;
  o: string[];
  a: number; // 0-indexed correct answer
  explanation?: string;
}

export type AppSubject = 'euskera' | 'lengua' | 'ingles' | 'matematika';

export interface LanguageData {
  ext: Record<string, AudioItem[]>;
  own: Record<string, string>;
}

export const D: Record<AppSubject, LanguageData> = {
  euskera: {
    ext: {
      "4": [
        {
          t: "Audioa 1",
          k: "e4a1",
          u: "https://www.ivoox.com/player_ej_10072033_6_1.html?c1=978e2b",
          f: 1,
          activityType: 'audio',
          description: "Albiste laburrak: Madrilgo gertakaria, Everesta eta Txinako maskoten jatetxea."
        },
        {
          t: "Audioa 2 · Ahozko ulermena",
          k: "e4a2",
          u: "https://www.ivoox.com/player_ej_10072002_6_1.html?c1=978e2b",
          f: 1,
          activityType: 'audio',
          description: "Naturaren berriak eta ingurumenaren zaintza (Ahozko ulermeneko 10 galdera)."
        },
        {
          t: "Audioa 3",
          k: "e4a3",
          u: "https://www.ivoox.com/player_ej_10071981_6_1.html?c1=978e2b",
          f: 1,
          activityType: 'audio',
          description: "Kultura eta kirol berriak ikasleentzat."
        }
      ],
      "6": [
        {
          t: "Izarra opari",
          k: "e6a1",
          u: "https://soundcloud.com/jonvigi/izarra-opari",
          activityType: 'audio',
          description: "Istorio poetiko eta liluragarria opari berezi bati buruz."
        },
        {
          t: "Kukubel",
          k: "e6a2",
          u: "https://soundcloud.com/jonvigi/kukubel",
          activityType: 'audio',
          description: "Kukubel pertsonaiari buruzko kontakizun bizia."
        },
        {
          t: "Casting",
          k: "e6a3",
          u: "https://soundcloud.com/jonvigi/casting",
          activityType: 'audio',
          description: "Aktoreen proba baten inguruko elkarrizketa eta egoera dibertigarria."
        },
        {
          t: "Albiste bitxia",
          k: "e6a4",
          u: "https://soundcloud.com/jonvigi/a",
          activityType: 'audio',
          description: "Munduan zehar gertatutako berri harrigarri baten kronika."
        }
      ]
    },
    own: {
      "1": "https://claude.ai/artifact/CLVULVWjsgfN5wSmXBGd5B",
      "2": "https://claude.ai/artifact/JmiXt3YmwXEcoYMkrQsLh8",
      "3": "https://claude.ai/artifact/Qucvmic3NenVgtx5aqyCmp",
      "4": "https://claude.ai/artifact/GFiGg4CJ3ZhdoANJ3sqmb8",
      "5": "https://claude.ai/artifact/MtwakeX5nmbdoYgpQ83JYs",
      "6": "https://claude.ai/artifact/Keo8BePr4QR2X9NG958bg2"
    }
  },
  ingles: {
    ext: {
      "3": [
        {
          t: "Reading Story · The Magic Paintbrush",
          k: "i3a1",
          activityType: 'reading',
          description: "Read the story about Leo and his miraculous paintbrush that brings paintings to life.",
          passage: "Once upon a time, a kind boy named Leo found an old wooden paintbrush near the riverbank. When he painted an apple on paper, the apple turned into real food! Instead of keeping the brush for himself, Leo decided to paint warm coats and fresh bread for everyone in his village."
        }
      ],
      "4": [
        {
          t: "Oral Comprehension · The School Trip to the Wildlife Sanctuary",
          k: "i4a1",
          u: "https://www.ivoox.com/player_ej_10072002_6_1.html?c1=978e2b",
          f: 1,
          activityType: 'audio',
          description: "Listen to the guide explaining the animal rescue program and answer the 5 questions.",
          passage: "Transcript: Welcome to Green Oak Wildlife Sanctuary! Today we are observing rescued barn owls and red foxes. Remember: stay on the wooden trails, keep your voices calm, and do not feed wild animals."
        },
        {
          t: "Reading Comprehension · The Secret of the Old Clockmaker",
          k: "i4a2",
          activityType: 'reading',
          description: "Read the mysterious story of Oliver visiting grandfather's antique workshop.",
          passage: "Oliver stepped into his grandfather's clockmaker shop on a rainy afternoon. Hundreds of clocks were ticking with different rhythms. In the back corner stood a tall mahogany grandfather clock that didn't have numbers—instead, it had golden stars. Inside its wooden cabinet, Oliver found an old parchment map leading to a forgotten garden behind the town library."
        },
        {
          t: "Everyday English · Planning a Birthday Surprise",
          k: "i4a3",
          activityType: 'reading',
          description: "Read the dialogue between Sophie and Daniel organizing a party.",
          passage: "Sophie: 'Hi Daniel! Saturday is Lucas's birthday. Have you bought the decorations yet?'\nDaniel: 'Not yet! I will buy blue and green balloons tomorrow after school. Can you ask Maya to bake chocolate cupcakes?'\nSophie: 'Great idea! I will also prepare a playlist with his favorite summer songs.'"
        }
      ],
      "5": [
        {
          t: "Oral & Written · Space Mission to Mars",
          k: "i5a1",
          u: "https://soundcloud.com/jonvigi/casting",
          activityType: 'audio',
          description: "Listen to the astronaut interview about preparing for interplanetary exploration."
        }
      ],
      "6": [
        {
          t: "Reading Comprehension · The Great Ocean Cleanup",
          k: "i6a1",
          activityType: 'reading',
          description: "An article about young marine scientists building solar barriers to remove plastic from oceans.",
          passage: "Marine scientist Maya Lin designed a 600-meter floating barrier powered entirely by solar panels. The barrier moves naturally with ocean currents to concentrate floating plastic without harming marine turtles and fish."
        }
      ]
    },
    own: {
      "1": "https://claude.ai/artifact/Txj6iK6Dgsuzmvhwbefvuy",
      "2": "https://claude.ai/artifact/MxxcNB9q5dSUgZYHbrhZu4",
      "3": "https://claude.ai/artifact/UQrJsKEB9itY2UdFTnAxZi",
      "4": "https://claude.ai/artifact/SxXvKodnsWGkuVLTuvWg9m",
      "5": "https://claude.ai/artifact/2cU86uz4XA6dgaW739L8FW",
      "6": "https://claude.ai/artifact/1wrx8RJG5gGjjkB18ewNei"
    }
  },
  lengua: {
    ext: {
      "3": [
        {
          t: "Comprensión lectora · El dragón que temía a la oscuridad",
          k: "l3a1",
          activityType: 'reading',
          description: "Cuento sobre Chispitas, un pequeño dragón que descubrió el valor de las luciérnagas.",
          passage: "Chispitas era un dragón muy simpático con escamas color esmeralda. Sin embargo, cuando caía la noche en la cueva, tenía mucho miedo a la oscuridad. Su abuela le regaló un farolillo de cristal y le enseñó a llamar a las luciérnagas cantando una dulce canción."
        }
      ],
      "4": [
        {
          t: "Comprensión oral · La leyenda del delfín de plata",
          k: "l4a1",
          u: "https://www.ivoox.com/player_ej_10072033_6_1.html?c1=978e2b",
          f: 1,
          activityType: 'audio',
          description: "Escucha el relato sonoro sobre la bahía protegida y responde las 5 preguntas.",
          passage: "Transcripción: Cuentan los viejos pescadores de la costa cantábrica que un delfín de lomo plateado siempre acompaña a los barcos cuando hay niebla espesa para guiarlos sanos y salvos hasta el muelle."
        },
        {
          t: "Comprensión escrita · El misterio del faro abandonado",
          k: "l4a2",
          activityType: 'reading',
          description: "Lectura de intriga sobre Clara y Mateo explorando el acantilado rocoso.",
          passage: "Clara y Mateo subieron por el sendero empinado que conducía al viejo faro blanco. Aunque llevaba más de veinte años en desuso, los vecinos aseguraban haber visto destellos dorados en lo alto de la torre durante las noches de tormenta. Al empujar la puerta de roble, hallaron una libreta con tapas de cuero donde un astrónomo anotaba el paso de las estrellas fugaces."
        },
        {
          t: "Lectura y vocabulario · Guardianes del bosque cantábrico",
          k: "l4a3",
          activityType: 'reading',
          description: "Texto informativo sobre robles milenarios, fauna autóctona y sinónimos.",
          passage: "Los bosques de robles y hayas albergan una rica biodiversidad. Animales como el corzo, la lechuza común y el pájaro carpintero encuentran alimento y cobijo entre su densa vegetación. Proteger este ecosistema es imprescindible para evitar la erosión del suelo y purificar el aire."
        }
      ],
      "5": [
        {
          t: "Comprensión oral y escrita · Expedición a la selva",
          k: "l5a1",
          u: "https://soundcloud.com/jonvigi/casting",
          activityType: 'audio',
          description: "Crónica de dos naturalistas investigando especies de mariposas tropicales."
        }
      ],
      "6": [
        {
          t: "Lectura crítica · El enigma de la cápsula del tiempo",
          k: "l6a1",
          activityType: 'reading',
          description: "Relato sobre una caja enterrada en el patio del colegio en el año 1924.",
          passage: "Bajo las raíces del gran ciprés del colegio apareció una caja metálica sellada con cera. En su interior había cartas escritas con pluma y tinta por alumnos de cuarto de primaria de hace cien años, describiendo sus sueños sobre el futuro."
        }
      ]
    },
    own: {}
  },
  matematika: {
    ext: {
      "3": [
        {
          t: "Buruketa errazak · Jostailuen denda",
          k: "m3a1",
          activityType: 'math',
          description: "Batuketak, kenketak eta zenbakiak jostailu dendako egoeretan.",
          passage: "Jostailuen dendan 45 puzzle daude apalean. Goizean 18 saldu dira eta arratsaldean beste 12. Zenbat puzzle geratu dira saltzeko?"
        }
      ],
      "4": [
        {
          t: "Buruketak · Herriko azokako erosketak",
          k: "m4a1",
          activityType: 'math',
          description: "Arrazoiketa matematikoa, biderketak eta eragiketa konbinatuak baserritarren azokan.",
          passage: "Larunbatean herriko azokan postu bat jarri dugu. Sagarren kaxak 3 euro balio du eta madarien kaxak 4 euro. 12 sagar kaxa eta 8 madari kaxa saldu baditugu, zenbat diru lortu dugu guztira?"
        },
        {
          t: "Eragiketak eta Planoak · Altxorraren mapa eta koordenatuak",
          k: "m4a2",
          activityType: 'math',
          description: "Koordenatu kartesiarrak, biderketa-taulak eta neurketa problemak.",
          passage: "Piraten uharteko planoan, itsasargia (2, 4) posizioan dago eta gaztelua (6, 4) posizioan. Posizio bakoitzaren arteko distantzia eta pauso kopuruak kalkulatu behar dituzu."
        }
      ],
      "5": [
        {
          t: "Zatiketak eta frakzioak · Okindegiko gozoak",
          k: "m5a1",
          activityType: 'math',
          description: "Zatiketak eta zatikiak pastelak banatzeko problemak ebatziz.",
          passage: "Pastel erraldoi bat 8 zati berdinetan moztu dugu. Lehenik 3 zati jan ditugu eta gero beste 2. Zenbat zati geratzen dira?"
        }
      ],
      "6": [
        {
          t: "Buruketa konplexuak · Bidaiaren aurrekontua",
          k: "m6a1",
          activityType: 'math',
          description: "Ehunekoak, distantziak eta aurrekontu kalkuluak ikasturte amaierako bidaian.",
          passage: "Autobuseko bidaia 480 euro kostatzen da 24 ikaslerentzat. Horrez gain, aterpetxeak %10eko deskontua eskaini du 30 euroko gaueko prezioan."
        }
      ]
    },
    own: {}
  }
};

export const FX: Record<string, Question[]> = {
  // Euskara LH 4 - Aditzak (Nor-Nork eta Nor-Nori-Nork Oraina)
  eu_aditzak_1: [
    {
      q: "Aukeratu aditz egokia: 'Nik atzo liburu berri bat erosi _________.'",
      o: ["dut", "duzu", "du", "ditugu"],
      a: 0,
      explanation: "Nik / hura (liburu bat) orainean: DUT."
    },
    {
      q: "Aukeratu aditz egokia: 'Zuk sagar goxo guztiak jan _________.'",
      o: ["dituzu", "duzu", "dute", "du"],
      a: 0,
      explanation: "Zuk / haiek (sagar goxo guztiak, pluralean) orainean: DITUZU."
    },
    {
      q: "Aukeratu aditz egokia: 'Guk eskolako ariketak garaiz amaitu _________.'",
      o: ["ditugu", "duzue", "dute", "dut"],
      a: 0,
      explanation: "Guk / haiek (ariketak, pluralean): DITUGU."
    },
    {
      q: "Nor-Nori-Nork: 'Nik zuri opari polit bat ekarri _________.'",
      o: ["dizut", "didazu", "digu", "diot"],
      a: 0,
      explanation: "Nik (nork) zuri (nori) hura (nor): DIZUT."
    },
    {
      q: "Nor-Nori-Nork: 'Irakasleak guri etxeko lanak zuzendu _________.'",
      o: ["dizkigu", "dizut", "didate", "zaigu"],
      a: 0,
      explanation: "Hark (irakasleak) guri (nori) haiek (etxeko lanak, pluralean): DIZKIGU."
    },
    {
      q: "Nor-Nori-Nork: 'Zuk niri zure arkatza utzi _________ mesedez?'",
      o: ["didazu", "dizut", "digu", "diot"],
      a: 0,
      explanation: "Zuk (nork) niri (nori) hura (arkatza): DIDAZU."
    }
  ],

  // Euskara LH 4 - Aditzak (Iragana eta Aditz Trinkoak)
  eu_aditzak_2: [
    {
      q: "Nor-Nork Iragana: 'Atzo guk mendira bidaia zoragarria egin _________.'",
      o: ["genuen", "zenuen", "zuten", "nuen"],
      a: 0,
      explanation: "Guk / hura iraganean (lehenean): GENUEN."
    },
    {
      q: "Nor-Nork Iragana: 'Mirenek eta Mikelek txakur polita ikusi _________ kalean.'",
      o: ["zuten", "zuen", "genuen", "zenuten"],
      a: 0,
      explanation: "Haiek (Mirenek eta Mikelek) / hura iraganean: ZUTEN."
    },
    {
      q: "Aditz Trinkoa (JOAN): 'Gaur goizean ni aitona-amonen etxera _________.'",
      o: ["noa", "zoaz", "doa", "goaz"],
      a: 0,
      explanation: "Ni joan orainean trinkoan: NOA."
    },
    {
      q: "Aditz Trinkoa (ETORRI): 'Zu oso goiz _________ eskolara gaur!'",
      o: ["zatoz", "nator", "dator", "zatozte"],
      a: 0,
      explanation: "Zu etorri orainean trinkoan: ZATOZ."
    },
    {
      q: "Aditz Trinkoa (JAKIN): 'Nik galdera guztien erantzun zuzena _________.'",
      o: ["dakit", "dakizu", "daki", "dakigu"],
      a: 0,
      explanation: "Nik jakin orainean trinkoan: DAKIT."
    },
    {
      q: "Aditz Trinkoa (IBILI): 'Haurrak oso pozik _________ parkean jolasean.'",
      o: ["dabiltza", "dabil", "zabiltza", "gabiltza"],
      a: 0,
      explanation: "Haiek (haurrak, pluralean) ibili orainean: DABILTZAZ / DABILTZAT / DABILTZA."
    }
  ],

  // Official questions from original code
  e4a1: [
    {
      q: "Ze egun da?",
      o: ["Igandea", "Ostirala", "Larunbata", "Asteazkena"],
      a: 2
    },
    {
      q: "Zein da Aritz Urmeneta?",
      o: ["Medikua", "Interneteko arrantzalea", "Ile apaintzailea", "Informatikoa"],
      a: 1
    },
    {
      q: "Zer egin du Madrilgo neskak?",
      o: ["Etxeari sua eman", "Parkera joan", "Bere amari koxka egin", "Ezer ez"],
      a: 0
    },
    {
      q: "Zer egin du Tenba atxeri?",
      o: ["Everestera heldu eta record-a ezarri", "Record bat ezarri", "16 urte bete", "Everest-a igo"],
      a: 0
    },
    {
      q: "Zer dago Txinan?",
      o: ["Maskotentzat etxe bat", "Zerbitzari txakur bat", "Maskotak jateko jatetxe bat", "Maskotentzat jatetxe bat"],
      a: 3
    },
    {
      q: "Nola deitzen da jatetxea?",
      o: ["Zerbitzari maskotak", "Txakurren paralisua", "Maskoten paralisua", "Maskoten etxea"],
      a: 2
    },
    {
      q: "Noiz izango da hurrengo albistegia?",
      o: ["Bihar", "Gaur", "Hurrengo hilabetean", "Hurrengo astean"],
      a: 3
    },
    {
      q: "Nolakoa da entzun duzun audioa?",
      o: ["Audioa", "Albistegia", "Liburu bat", "Narrazio bat"],
      a: 1
    }
  ],
  // Extension questions for Audioa 2 (Ahozko ulermena - 10 galdera)
  e4a2: [
    {
      q: "Zein da entzute honen gai nagusia?",
      o: ["Naturaren zaintza eta ekologia", "Kirol txapelketa bat", "Eskolako jaia", "Sukaldaritza errezeta"],
      a: 0
    },
    {
      q: "Nork parte hartzen du elkarrizketan?",
      o: ["Bi irakaslek", "Aurkezleak eta gonbidatu batek", "Ume talde batek bakarrik", "Ezezagun batek"],
      a: 1
    },
    {
      q: "Zer gomendio ematen da entzutean?",
      o: ["Bizikletaz gehiago ibiltzea", "Ura eta energia aurreztea", "Zuhaitzak landatzea", "Aurreko guztiak"],
      a: 3
    },
    {
      q: "Non gertatzen dira aipatutako ekintzak?",
      o: ["Euskal Herriko herri batean", "Itsasontzi batean", "Mendirantz bidean", "Liburutegian"],
      a: 0
    },
    {
      q: "Zergatik da garrantzitsua zuhaitzak zaintzea?",
      o: ["Itzala eta aire garbia ematen dutelako", "Txoriak uxatzeko", "Egurra erretzeko bakarrik", "Ez dira garrantzitsuak"],
      a: 0
    },
    {
      q: "Zer egiten dute ikasleek ingurumen astean?",
      o: ["Hondakinak biltzen dituzte eta tailerrak egin", "Etxean geratzen dira", "Telebista ikusten dute", "Azterketa luzea egiten dute"],
      a: 0
    },
    {
      q: "Nola bidaia daiteke modu ekologikoagoan?",
      o: ["Oinez edo bizikletaz", "Hegazkin pribatuan", "Auto zahar batean bakarrik", "Motor kutsagarriarekin"],
      a: 0
    },
    {
      q: "Zer proposamen egiten da eskolako jantokirako?",
      o: ["Bertako eta sasoiko elikagaiak kontsumitzea", "Plastikozko platerak erabiltzea", "Janaria botatzea", "Gozokiak bakarrik jatea"],
      a: 0
    },
    {
      q: "Zer jarrera gomendatzen da hondakinen aurrean?",
      o: ["Birziklatzea eta berrerabiltzea", "Lurrean botata uztea", "Ibaian behera botatzea", "Zabortegian erretzea"],
      a: 0
    },
    {
      q: "Zein da entzutearen azken mezua?",
      o: ["Guztion artean planeta zaindu dezakegula", "Berandu dela ezer konpontzeko", "Ez dela ezer aldatu behar", "Udan bakarrik zaintzea ingurunea"],
      a: 0
    }
  ],
  // Extension questions for Audioa 3
  e4a3: [
    {
      q: "Zer nabarmentzen da albiste honetan?",
      o: ["Kultur astea", "Liburu azoka berria", "Herriko jaietako ekitaldiak", "Txango berezi bat"],
      a: 1
    },
    {
      q: "Zein adinetako ikasleei zuzenduta dago?",
      o: ["Helduentzat bakarrik", "Lehen hezkuntzako ikasleentzat", "Unibertsitatekoentzat", "Txikientzat"],
      a: 1
    },
    {
      q: "Zer sari banatuko dute?",
      o: ["Margo kaxa", "Irakurketa lehiaketako liburu sorta", "Ordenagailu bat", "Txartel bat zinemarako"],
      a: 1
    }
  ],
  // Questions for 6th grade audios
  e6a1: [
    {
      q: "Zer oparitu nahi diote protagonistari?",
      o: ["Izar bat", "Marrazki bat", "Liburu zahar bat", "Jostailu bat"],
      a: 0
    },
    {
      q: "Nola sentitzen da pertsonaia opari horren aurrean?",
      o: ["Haserre", "Harrituta eta hunkituta", "Beldurrez", "Axolagabe"],
      a: 1
    },
    {
      q: "Zer mezu transmititzen du istorioak?",
      o: ["Maitasuna eta ametsak gauza materialak baino handiagoak direla", "Gauean ez dela ibili behar", "Zientzia garrantzitsuena dela", "Izarrak urrun daudela"],
      a: 0
    }
  ],
  e6a2: [
    {
      q: "Nor da Kukubel?",
      o: ["Mendiko txoria", "Karakter handiko pertsonaia", "Itsasoko marinel bat", "Basoko ipotxa"],
      a: 1
    },
    {
      q: "Zer gertatzen zaio istorioaren hasieran?",
      o: ["Bidaia bati ekiten dio", "Galduta dabil", "Lagun berri bat ezagutzen du", "Lo geratu da"],
      a: 0
    },
    {
      q: "Zer tonu dauka kontakizunak?",
      o: ["Beldurrezkoa", "Umoretsua eta dinamikoa", "Tristea", "Historiko hutsa"],
      a: 1
    }
  ],
  e6a3: [
    {
      q: "Zertarako antolatu da casting-a?",
      o: ["Antzezlan bateko aktore nagusia hautatzeko", "Koru baterako abeslari bila", "Telesail labur baterako", "Iragarki bat grabatzeko"],
      a: 0
    },
    {
      q: "Zer zailtasun sortzen da proban?",
      o: ["Testua ahaztu zaio hautagaiari", "Urduritasun handia eta egoera barregarriak", "Musika ez dabil", "Gela itxita dago"],
      a: 1
    },
    {
      q: "Nola amaitzen da eszena?",
      o: ["Barre algarekin", "Negarrez", "Epaileak alde egiten dute", "Biharamunera arte atzeratzen da"],
      a: 0
    }
  ],
  e6a4: [
    {
      q: "Zergatik da bitxia albiste hau?",
      o: ["Ohiz kanpoko gertaera harrigarri bat delako", "Ez delako egia", "Duela 100 urte gertatu zelako", "Espazioan gertatu delako"],
      a: 0
    },
    {
      q: "Zein lekutan gertatu da?",
      o: ["Nazioarteko hiri batean", "Basamortuan", "Ozeano erdian", "Aireportuan"],
      a: 0
    },
    {
      q: "Zein izan da jendearen erreakzioa?",
      o: ["Harrituta geratu dira", "Inori ez zaio inporta", "Beldurtu dira", "Protesta egin dute"],
      a: 0
    }
  ],
  // ENGLISH WORKSHEETS
  i3a1: [
    {
      q: "Where did Leo find the wooden paintbrush?",
      o: ["Near the riverbank", "In his attic", "Under his bed", "At school"],
      a: 0
    },
    {
      q: "What happened when Leo painted an apple?",
      o: ["It turned into real food", "It disappeared", "It turned blue", "The paper tore"],
      a: 0
    },
    {
      q: "What did Leo decide to paint for the villagers?",
      o: ["Warm coats and fresh bread", "Golden coins", "Toy cars", "A new castle"],
      a: 0
    },
    {
      q: "What kind of personality does Leo show?",
      o: ["Generous and caring", "Selfish and greedy", "Frightened and lazy", "Angry"],
      a: 0
    }
  ],
  i4a1: [
    {
      q: "Which animals are visitors observing today?",
      o: ["Rescued barn owls and red foxes", "Monkeys and lions", "Dolphins and whales", "Elephants and giraffes"],
      a: 0
    },
    {
      q: "What is an essential rule mentioned in the sanctuary?",
      o: ["Stay on the wooden trails and keep calm", "Run and shout as loud as possible", "Climb the big trees", "Bring pets along"],
      a: 0
    },
    {
      q: "Are visitors allowed to feed the wild animals?",
      o: ["No, they must not feed wild animals", "Yes, anytime with sweets", "Only after lunchtime", "Only with sandwiches"],
      a: 0
    },
    {
      q: "What is the primary mission of the sanctuary?",
      o: ["Rescuing and protecting wildlife", "Selling exotic animals", "Training circus performers", "Building houses"],
      a: 0
    },
    {
      q: "What kind of activity is this worksheet?",
      o: ["Oral comprehension (Listening)", "Math problem", "Grammar test only", "Drawing contest"],
      a: 0
    }
  ],
  i4a2: [
    {
      q: "What kind of shop did Oliver enter?",
      o: ["His grandfather's clockmaker shop", "A bakery", "A shoe store", "A flower market"],
      a: 0
    },
    {
      q: "What was special about the grandfather clock in the corner?",
      o: ["It had golden stars instead of numbers", "It was painted pink", "It didn't tick at all", "It had a video screen"],
      a: 0
    },
    {
      q: "What did Oliver discover inside the wooden cabinet?",
      o: ["An old parchment map", "A bag of gold", "A sleeping kitten", "An umbrella"],
      a: 0
    },
    {
      q: "Where does the secret map lead to?",
      o: ["A forgotten garden behind the town library", "The railway station", "The top of the mountain", "The harbour"],
      a: 0
    },
    {
      q: "What is the overall atmosphere of the story?",
      o: ["Mysterious and enchanting", "Scary and tragic", "Boring", "Violent"],
      a: 0
    }
  ],
  i4a3: [
    {
      q: "Whose birthday are Sophie and Daniel planning?",
      o: ["Lucas's birthday", "Maya's birthday", "The teacher's birthday", "Daniel's birthday"],
      a: 0
    },
    {
      q: "What will Daniel buy after school?",
      o: ["Blue and green balloons", "A new computer game", "A chocolate cake", "Party invitations"],
      a: 0
    },
    {
      q: "What will Maya bake for the celebration?",
      o: ["Chocolate cupcakes", "Apple pie", "Pancakes", "Biscuits"],
      a: 0
    },
    {
      q: "What will Sophie prepare for the party?",
      o: ["A music playlist with summer songs", "Magic tricks", "A film screening", "Fireworks"],
      a: 0
    }
  ],
  i5a1: [
    {
      q: "What is the objective of the space mission described?",
      o: ["Scientific exploration and research on Mars", "Finding water on the Moon", "Building a space hotel", "Launching a television satellite"],
      a: 0
    },
    {
      q: "What skills do the astronauts need the most?",
      o: ["Teamwork, resilience, and science knowledge", "Running very fast", "Singing songs", "Speaking only one language"],
      a: 0
    },
    {
      q: "How do astronauts train for low gravity?",
      o: ["In specialized underwater pools and simulators", "By jumping on trampolines", "By sleeping in tents", "On bicycles"],
      a: 0
    },
    {
      q: "Why is communication with Earth challenging?",
      o: ["Because radio signals take minutes to travel the distance", "Because of bad weather", "Because they have no radios", "Because they speak in code"],
      a: 0
    },
    {
      q: "What is the tone of the astronaut interview?",
      o: ["Inspiring and educational", "Pessimistic", "Aggressive", "Humorous only"],
      a: 0
    }
  ],
  i6a1: [
    {
      q: "What did marine scientist Maya Lin design?",
      o: ["A 600-meter floating barrier powered by solar panels", "A submarine", "A giant fishing net", "A cruise ship"],
      a: 0
    },
    {
      q: "How does the barrier move across the ocean?",
      o: ["Naturally with ocean currents", "Pulled by motorboats", "Flying in the air", "Stationary anchored in port"],
      a: 0
    },
    {
      q: "Does the barrier harm marine turtles and fish?",
      o: ["No, it does not harm marine turtles and fish", "Yes, severely", "Only during the night", "It catches all fish"],
      a: 0
    },
    {
      q: "What problem is the invention solving?",
      o: ["Ocean plastic pollution", "Overfishing", "Noise pollution", "Oil transport"],
      a: 0
    },
    {
      q: "What value does this scientific project inspire?",
      o: ["Environmental responsibility and ecological innovation", "Financial greed", "Giving up on nature", "Isolation"],
      a: 0
    }
  ],
  // LENGUA CASTELLANA WORKSHEETS
  l3a1: [
    {
      q: "¿De qué color eran las escamas del dragón Chispitas?",
      o: ["Color esmeralda", "Rojas como el fuego", "Negras", "Doradas"],
      a: 0
    },
    {
      q: "¿A qué le tenía miedo Chispitas?",
      o: ["A la oscuridad de la noche en la cueva", "Al agua del río", "A las alturas", "A otros dragones"],
      a: 0
    },
    {
      q: "¿Qué le regaló su abuela para ayudarle?",
      o: ["Un farolillo de cristal", "Una espada", "Un reloj", "Un mapa del bosque"],
      a: 0
    },
    {
      q: "¿Cómo llamaba Chispitas a las luciérnagas?",
      o: ["Cantando una dulce canción", "Dando palmadas fuertes", "Encendiendo una hoguera", "Silbando fuerte"],
      a: 0
    }
  ],
  l4a1: [
    {
      q: "¿Quién acompaña a los barcos cuando hay niebla espesa según la leyenda?",
      o: ["Un delfín de lomo plateado", "Una gaviota gigante", "Un barco fantasma", "Un pez espada"],
      a: 0
    },
    {
      q: "¿En qué costa transcurre la narración?",
      o: ["En la costa cantábrica", "En el océano Índico", "En el mar Caribe", "En el Mediterráneo sur"],
      a: 0
    },
    {
      q: "¿Cuál es el propósito del delfín al guiar a los barcos?",
      o: ["Guiarlos sanos y salvos hasta el muelle", "Pedirles comida", "Jugar con las olas", "Alejarlos de la costa"],
      a: 0
    },
    {
      q: "¿Qué tipo de texto es este ejercicio?",
      o: ["Comprensión oral basada en una leyenda popular", "Una receta de cocina", "Una noticia deportiva", "Un poema lírico breve"],
      a: 0
    },
    {
      q: "¿Qué sentimiento despierta la leyenda entre los pescadores?",
      o: ["Gratitud y respeto hacia el mar y su fauna", "Miedo a navegar", "Desconfianza", "Enfado"],
      a: 0
    }
  ],
  l4a2: [
    {
      q: "¿Quiénes son los dos protagonistas que suben al faro?",
      o: ["Clara y Mateo", "Lucas y Sara", "El abuelo y el capitán", "Dos policías"],
      a: 0
    },
    {
      q: "¿Cuánto tiempo llevaba en desuso el viejo faro blanco?",
      o: ["Más de veinte años", "Solo dos meses", "Un año", "Cincuenta siglos"],
      a: 0
    },
    {
      q: "¿Qué afirmaban haber visto los vecinos en las noches de tormenta?",
      o: ["Destellos dorados en lo alto de la torre", "Fantasmas flotando", "Fuegos artificiales", "Luces de aviones"],
      a: 0
    },
    {
      q: "¿Qué encontraron Clara y Mateo tras la puerta de roble?",
      o: ["Una libreta con tapas de cuero de un astrónomo", "Un baúl lleno de monedas", "Una colección de llaves", "Un catalejo roto"],
      a: 0
    },
    {
      q: "¿Qué anotaba el dueño de la libreta?",
      o: ["El paso de las estrellas fugaces", "El precio del pescado", "Recetas antiguas", "Nombres de barcos piratas"],
      a: 0
    }
  ],
  l4a3: [
    {
      q: "¿Qué árboles forman principalmente el bosque descrito?",
      o: ["Robles y hayas", "Palmeras y cactus", "Pinos piñoneros solamente", "Olivos centenarios"],
      a: 0
    },
    {
      q: "¿Qué animales encuentran refugio en su densa vegetación?",
      o: ["El corzo, la lechuza común y el pájaro carpintero", "El león y el guepardo", "El pingüino y la foca", "El camello y el lince"],
      a: 0
    },
    {
      q: "¿Por qué es imprescindible proteger este ecosistema?",
      o: ["Para evitar la erosión del suelo y purificar el aire", "Para construir autopistas", "Para vender leña en invierno", "Para cazar"],
      a: 0
    },
    {
      q: "¿Cuál de estas palabras es un sinónimo de 'cobijo' en el texto?",
      o: ["Refugio", "Peligro", "Alimento", "Distancia"],
      a: 0
    }
  ],
  l5a1: [
    {
      q: "¿Cuál es el objetivo de los dos naturalistas en la selva?",
      o: ["Investigar especies de mariposas tropicales", "Buscar petróleo", "Construir una cabaña", "Cazar mamíferos"],
      a: 0
    },
    {
      q: "¿Qué instrumento utilizan para observar sin dañar a los insectos?",
      o: ["Lupas de campo y cámaras fotográficas con macro", "Redes de alambre", "Linternas potentes", "Jaulas de hierro"],
      a: 0
    },
    {
      q: "¿Qué clima predomina en la zona explorada?",
      o: ["Cálido y muy húmedo con lluvias frecuentes", "Frío polar", "Seco y desértico", "Mediterráneo templado"],
      a: 0
    },
    {
      q: "¿Qué valor transmiten los expedicionarios?",
      o: ["Conservación y respeto por la biodiversidad", "Conquista de la naturaleza", "Uso indiscriminado de recursos", "Comercio de plantas"],
      a: 0
    },
    {
      q: "¿Qué significa en el texto la expresión 'especies autóctonas'?",
      o: ["Especies propias y originarias de esa región", "Especies traídas de otros continentes", "Animales domesticados", "Especies extinguidas"],
      a: 0
    }
  ],
  l6a1: [
    {
      q: "¿Dónde fue encontrada la caja metálica?",
      o: ["Bajo las raíces del gran ciprés del colegio", "En el desván del ayuntamiento", "En el fondo de un pozo", "En la biblioteca"],
      a: 0
    },
    {
      q: "¿En qué año fue enterrada la cápsula del tiempo?",
      o: ["En 1924 (hace cien años)", "En 1980", "En 1850", "En 2010"],
      a: 0
    },
    {
      q: "¿Con qué estaban escritas las cartas de los alumnos de cuarto?",
      o: ["Con pluma y tinta", "Con bolígrafo azul", "A máquina de escribir", "Con rotulador"],
      a: 0
    },
    {
      q: "¿Cuál era el contenido principal de sus cartas?",
      o: ["Describían sus sueños y esperanzas sobre el futuro", "Quejas sobre los deberes", "Cuentas de matemáticas", "Un mapa del tesoro"],
      a: 0
    },
    {
      q: "¿Qué lección histórica aporta este descubrimiento?",
      o: ["Conectar generaciones y valorar el paso del tiempo", "Que la tecnología actual es lo único válido", "Que antes no se estudiaba", "Que las cartas ya no sirven"],
      a: 0
    }
  ],
  // MATEMATIKA WORKSHEETS
  m3a1: [
    {
      q: "Dendan 45 puzzle zeuden. Goizean 18 saldu ziren eta arratsaldean 12. Zenbat puzzle saldu dira guztira?",
      o: ["30 puzzle (18 + 12 = 30)", "25 puzzle", "40 puzzle", "35 puzzle"],
      a: 0
    },
    {
      q: "Hasieran 45 puzzle bazeuden eta 30 saldu badira, zenbat geratu dira dendan?",
      o: ["15 puzzle (45 - 30 = 15)", "10 puzzle", "20 puzzle", "12 puzzle"],
      a: 0
    },
    {
      q: "Puzzle bakoitzak 5 euro balio badu, zenbat balio dute geratzen diren 15 puzzleek?",
      o: ["75 euro (15 × 5 = 75)", "60 euro", "50 euro", "100 euro"],
      a: 0
    },
    {
      q: "Nola egiaztatu dezakegu eragiketa zuzen dagoela?",
      o: ["Saldutakoak eta geratutakoak batuz: 30 + 15 = 45", "Biderketa eginez bakarrik", "Eragiketa guztiak ezabatuz", "Ausaz zenbaki bat esanez"],
      a: 0
    }
  ],
  m4a1: [
    {
      q: "12 sagar kaxa saldu ditugu, bakoitza 3 euroan. Zenbat diru lortu dugu sagarrekin?",
      o: ["36 euro (12 × 3 = 36)", "30 euro", "24 euro", "42 euro"],
      a: 0
    },
    {
      q: "8 madari kaxa saldu ditugu, bakoitza 4 euroan. Zenbat diru lortu dugu madariekin?",
      o: ["32 euro (8 × 4 = 32)", "30 euro", "28 euro", "36 euro"],
      a: 0
    },
    {
      q: "Zenbat diru lortu dugu guztira sagar eta madari guztiekin?",
      o: ["68 euro (36 + 32 = 68)", "60 euro", "72 euro", "65 euro"],
      a: 0
    },
    {
      q: "Bezero batek 50 euroko billete batekin ordaindu badu 32 euroko erosketa, zenbat itzuli behar diogu?",
      o: ["18 euro (50 - 32 = 18)", "20 euro", "15 euro", "12 euro"],
      a: 0
    },
    {
      q: "Datorren asterako salmentak bikoiztu nahi baditugu (68 €), zein da helburua?",
      o: ["136 euro (68 × 2 = 136)", "120 euro", "150 euro", "100 euro"],
      a: 0
    }
  ],
  m4a2: [
    {
      q: "Planoan itsasargia (2, 4) puntuan dago eta gaztelua (6, 4) puntuan. Zenbat unitateko distantzia dago bien artean?",
      o: ["4 unitate (6 - 2 = 4)", "2 unitate", "8 unitate", "6 unitate"],
      a: 0
    },
    {
      q: "Pauso bakoitzak 5 metro neurtzen baditu planoan, zenbat metro dira 4 unitateak (unitate bakoitza = pauso bat)?",
      o: ["20 metro (4 × 5 = 20)", "15 metro", "25 metro", "10 metro"],
      a: 0
    },
    {
      q: "Altxorra (4, 1) puntuan badago, zein da bere ardatz horizontaleko (X) balioa?",
      o: ["4", "1", "5", "0"],
      a: 0
    },
    {
      q: "Gazteluko dorreak 12 leiho ditu maila bakoitzean. Dorreak 4 maila baditu, zenbat leiho ditu guztira?",
      o: ["48 leiho (12 × 4 = 48)", "40 leiho", "36 leiho", "52 leiho"],
      a: 0
    },
    {
      q: "Altxorraren kutxan 90 urrezko txanpon daude eta 3 piraten artean berdin banatu behar dira. Zenbat jasoko du bakoitzak?",
      o: ["30 txanpon (90 ÷ 3 = 30)", "25 txanpon", "35 txanpon", "20 txanpon"],
      a: 0
    }
  ],
  m5a1: [
    {
      q: "Pastela 8 zati berdinetan moztu dugu. 3 zati jan ditugu. Zein frakzio adierazten du jandako zatia?",
      o: ["3/8", "5/8", "8/3", "1/2"],
      a: 0
    },
    {
      q: "Ondoren beste 2 zati jan baditugu, guztira zenbat zati jan dira zortzirenetan?",
      o: ["5/8 (3/8 + 2/8 = 5/8)", "4/8", "6/8", "2/8"],
      a: 0
    },
    {
      q: "Zenbat zati geratzen dira oraindik pasteletik?",
      o: ["3 zati (8 - 5 = 3 zati, alegia 3/8)", "2 zati", "4 zati", "1 zati"],
      a: 0
    },
    {
      q: "Pastel osoak 24 euro balio badu, zenbat balio du zati bakar batek (1/8)?",
      o: ["3 euro (24 ÷ 8 = 3)", "4 euro", "2 euro", "5 euro"],
      a: 0
    },
    {
      q: "Zenbat balio dute geratzen diren 3 zatientzat?",
      o: ["9 euro (3 × 3 = 9)", "6 euro", "12 euro", "8 euro"],
      a: 0
    }
  ],
  m6a1: [
    {
      q: "Autobusa 480 euro kostatzen bada eta 24 ikasle badoaz, zenbat ordainduko du bakoitzak autobusagatik?",
      o: ["20 euro (480 ÷ 24 = 20)", "25 euro", "18 euro", "30 euro"],
      a: 0
    },
    {
      q: "Aterpetxearen gaua 30 euro da, baina %10eko deskontua eskaini dute. Zenbat da deskontua?",
      o: ["3 euro (30eko %10 = 3)", "5 euro", "2 euro", "6 euro"],
      a: 0
    },
    {
      q: "Zenbat ordainduko du ikasle bakoitzak aterpetxearen gauagatik deskontuarekin?",
      o: ["27 euro (30 - 3 = 27)", "25 euro", "28 euro", "26 euro"],
      a: 0
    },
    {
      q: "Autobusa (20 €) + aterpetxeko gaua (27 €) batuz, zenbat ordainduko du ikasle bakoitzak guztira?",
      o: ["47 euro (20 + 27 = 47)", "45 euro", "50 euro", "52 euro"],
      a: 0
    },
    {
      q: "Eskolak 240 euroko diru-laguntza ematen badu talde osoarentzat (24 ikasle), ikasle bakoitzari zenbat murriztuko zaio prezioa?",
      o: ["10 euro (240 ÷ 24 = 10)", "15 euro", "5 euro", "12 euro"],
      a: 0
    }
  ]
};

export const SUBJECT_COLORS: Record<
  AppSubject,
  {
    hex: string;
    name: string;
    badge: string;
    border: string;
    ring: string;
    text: string;
  }
> = {
  euskera: {
    hex: '#27ae60',
    name: 'Euskara',
    badge: 'bg-emerald-600',
    border: 'border-emerald-600',
    ring: 'ring-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  lengua: {
    hex: '#e11d48',
    name: 'Lengua',
    badge: 'bg-rose-600',
    border: 'border-rose-600',
    ring: 'ring-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
  },
  ingles: {
    hex: '#2e86de',
    name: 'English',
    badge: 'bg-blue-600',
    border: 'border-blue-600',
    ring: 'ring-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
  },
  matematika: {
    hex: '#f59e0b',
    name: 'Matematika',
    badge: 'bg-amber-500',
    border: 'border-amber-500',
    ring: 'ring-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
  },
};
