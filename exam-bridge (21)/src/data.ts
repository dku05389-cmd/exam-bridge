/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Note, VideoLesson, LeaderboardEntry } from './types';

export const mockQuestions: Question[] = [
  // --- Natural Science Subjects ---
  // Biology
  {
    id: "Q-BIO-101",
    text: "Which of the following cellular organelles is responsible for cellular respiration and energy production in eukaryotic cells?",
    options: {
      A: "Chloroplast",
      B: "Mitochondrion",
      C: "Ribosome",
      D: "Lysosome"
    },
    correctAnswer: "B",
    explanation: "The mitochondrion is known as the powerhouse of the cell because it generates adenosine triphosphate (ATP), the chemical energy currency of the cell, through cellular respiration.",
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "easy",
    stream: "Natural Science",
    year: "2015"
  },
  {
    id: "Q-BIO-102",
    text: "During which phase of meiosis do homologous chromosomes separate and move toward opposite poles?",
    options: {
      A: "Prophase I",
      B: "Metaphase II",
      C: "Anaphase I",
      D: "Telophase I"
    },
    correctAnswer: "C",
    explanation: "During Anaphase I, homologous chromosomes are pulled apart to opposite poles of the cell, while sister chromatids remain attached at their centromeres.",
    subject: "Biology",
    topic: "Cell Division",
    difficulty: "medium",
    stream: "Natural Science",
    year: "2012"
  },
  {
    id: "Q-BIO-103",
    text: "Which plant hormone is primarily responsible for promoting fruit ripening?",
    options: {
      A: "Auxin",
      B: "Gibberellin",
      C: "Ethylene",
      D: "Abscisic acid"
    },
    correctAnswer: "C",
    explanation: "Ethylene is a gaseous plant hormone that regulates and accelerates fruit ripening, abscission, and aging processes.",
    subject: "Biology",
    topic: "Plant Physiology",
    difficulty: "medium",
    stream: "Natural Science"
  },

  // Physics
  {
    id: "Q-PHY-101",
    text: "What is the speed of an electromagnetic wave in a vacuum?",
    options: {
      A: "3.00 × 10^8 m/s",
      B: "1.50 × 10^8 m/s",
      C: "3.00 × 10^6 m/s",
      D: "3.00 × 10^10 m/s"
    },
    correctAnswer: "A",
    explanation: "In a vacuum, all electromagnetic waves (including light) travel at the constant speed of approximately 3.00 × 10^8 meters per second.",
    subject: "Physics",
    topic: "Electromagnetism",
    difficulty: "easy",
    stream: "Natural Science",
    year: "2014"
  },
  {
    id: "Q-PHY-102",
    text: "A force of 15 N is applied to a 3 kg mass. What is the acceleration produced?",
    options: {
      A: "45 m/s^2",
      B: "0.2 m/s^2",
      C: "5 m/s^2",
      D: "12 m/s^2"
    },
    correctAnswer: "C",
    explanation: "According to Newton's Second Law of Motion, F = ma. Therefore, a = F/m = 15 N / 3 kg = 5 m/s^2.",
    subject: "Physics",
    topic: "Mechanics",
    difficulty: "easy",
    stream: "Natural Science"
  },

  // Chemistry
  {
    id: "Q-CHE-101",
    text: "What is the molecular geometry of a water (H2O) molecule?",
    options: {
      A: "Linear",
      B: "Trigonal planar",
      C: "Bent",
      D: "Tetrahedral"
    },
    correctAnswer: "C",
    explanation: "Water has a bent shape with a bond angle of about 104.5 degrees due to the presence of two lone pairs on the oxygen atom, which exert repulsion according to VSEPR theory.",
    subject: "Chemistry",
    topic: "Chemical Bonding",
    difficulty: "medium",
    stream: "Natural Science",
    year: "2016"
  },
  {
    id: "Q-CHE-102",
    text: "Which of the following is the strongest acid?",
    options: {
      A: "Acetic acid (CH3COOH)",
      B: "Hydrofluoric acid (HF)",
      C: "Hydrochloric acid (HCl)",
      D: "Carbonic acid (H2CO3)"
    },
    correctAnswer: "C",
    explanation: "Hydrochloric acid (HCl) is a strong mineral acid that dissociates completely in water, unlike acetic, hydrofluoric, or carbonic acids which are weak acids.",
    subject: "Chemistry",
    topic: "Acids and Bases",
    difficulty: "medium",
    stream: "Natural Science"
  },

  // --- Social Science Subjects ---
  // History
  {
    id: "Q-HIS-101",
    text: "Which treaty, signed in 1889, led to the Battle of Adwa due to a deliberate discrepancy in Article XVII?",
    options: {
      A: "Treaty of Wuchale",
      B: "Treaty of Addis Ababa",
      C: "Treaty of Hewett",
      D: "Treaty of Antonelli"
    },
    correctAnswer: "A",
    explanation: "The Treaty of Wuchale, signed in May 1889 between Emperor Menelik II of Ethiopia and Italy, had different meanings in Amharic (optional use of Italy's diplomacy) and Italian (obligatory protectorate status), triggering the Battle of Adwa in 1896.",
    subject: "History",
    topic: "Ethiopian History",
    difficulty: "easy",
    stream: "Social Science",
    year: "2008"
  },
  {
    id: "Q-HIS-102",
    text: "In which year did the League of Nations fail to stop the Italian invasion of Ethiopia?",
    options: {
      A: "1896",
      B: "1935",
      C: "1941",
      D: "1914"
    },
    correctAnswer: "B",
    explanation: "Fascist Italy invaded Ethiopia in October 1935. The League of Nations failed to impose effective oil sanctions, proving its collective security model ineffective.",
    subject: "History",
    topic: "Modern History",
    difficulty: "medium",
    stream: "Social Science"
  },
  {
    id: "Q-HIS-103",
    text: "Who was the last Emperor of Ethiopia?",
    options: {
      A: "Emperor Menelik II",
      B: "Emperor Tewodros II",
      C: "Emperor Haile Selassie I",
      D: "Emperor Yohannes IV"
    },
    correctAnswer: "C",
    explanation: "Emperor Haile Selassie I was the last reigning monarch of Ethiopia, serving from 1930 until he was deposed in 1974.",
    subject: "History",
    topic: "Ethiopian History",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-HIS-104",
    text: "What year did the Battle of Adwa take place?",
    options: {
      A: "1889",
      B: "1896",
      C: "1935",
      D: "1941"
    },
    correctAnswer: "B",
    explanation: "The Battle of Adwa took place on March 1, 1896, where Ethiopian forces defeated the Italian army.",
    subject: "History",
    topic: "Ethiopian History",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-HIS-105",
    text: "Which European country attempted to colonize Ethiopia in the late 19th century?",
    options: {
      A: "Britain",
      B: "France",
      C: "Italy",
      D: "Germany"
    },
    correctAnswer: "C",
    explanation: "Italy attempted to colonize Ethiopia twice, first in the late 19th century (Battle of Adwa) and again in the 1930s.",
    subject: "History",
    topic: "Modern History",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-HIS-106",
    text: "What was the ancient capital of the Aksumite Empire?",
    options: {
      A: "Lalibela",
      B: "Gondar",
      C: "Aksum",
      D: "Harar"
    },
    correctAnswer: "C",
    explanation: "Aksum was the capital of the Aksumite Empire, one of the most powerful states in the ancient world.",
    subject: "History",
    topic: "Ancient History",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-HIS-107",
    text: "Who was the Empress who played a key role during the Battle of Adwa?",
    options: {
      A: "Empress Zewditu",
      B: "Empress Taytu Betul",
      C: "Empress Mentewab",
      D: "Empress Eleni"
    },
    correctAnswer: "B",
    explanation: "Empress Taytu Betul, the wife of Emperor Menelik II, was a strategic leader and military commander during the Battle of Adwa.",
    subject: "History",
    topic: "Ethiopian History",
    difficulty: "medium",
    stream: "Social Science"
  },

  // Geography
  {
    id: "Q-GEO-101",
    text: "Which of the following is the longest river in Ethiopia, flowing westward into the Nile?",
    options: {
      A: "Awash River",
      B: "Wabi Shebelle River",
      C: "Abay River (Blue Nile)",
      D: "Omo River"
    },
    correctAnswer: "C",
    explanation: "The Abay River (Blue Nile) is the longest river in Ethiopia, originating from Lake Tana and flowing west to meet the White Nile in Khartoum, Sudan.",
    subject: "Geography",
    topic: "Hydrography of Ethiopia",
    difficulty: "easy",
    stream: "Social Science",
    year: "2010"
  },
  {
    id: "Q-GEO-102",
    text: "What is the traditional agro-ecological zone of Ethiopia characterized by altitudes of 1500 to 2300 meters and moderate temperature?",
    options: {
      A: "Kolla",
      B: "Wurch",
      C: "Dega",
      D: "Weyna Dega"
    },
    correctAnswer: "D",
    explanation: "Weyna Dega refers to the temperate highland zone located between 1500 and 2300 meters above sea level, ideal for the cultivation of teff and other cereals.",
    subject: "Geography",
    topic: "Climatology of Ethiopia",
    difficulty: "medium",
    stream: "Social Science"
  },
  {
    id: "Q-GEO-103",
    text: "Which is the highest mountain in Ethiopia?",
    options: {
      A: "Mount Batu",
      B: "Mount Guna",
      C: "Ras Dashen",
      D: "Mount Abuna Yosef"
    },
    correctAnswer: "C",
    explanation: "Ras Dashen is the highest mountain in Ethiopia, located in the Simien Mountains National Park.",
    subject: "Geography",
    topic: "Topography of Ethiopia",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-GEO-104",
    text: "What is the capital city of Ethiopia?",
    options: {
      A: "Dire Dawa",
      B: "Bahir Dar",
      C: "Addis Ababa",
      D: "Adama"
    },
    correctAnswer: "C",
    explanation: "Addis Ababa is the capital city of Ethiopia and the headquarters of the African Union.",
    subject: "Geography",
    topic: "Settlement and Population",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-GEO-105",
    text: "Which large lake is the source of the Blue Nile?",
    options: {
      A: "Lake Abaya",
      B: "Lake Chamo",
      C: "Lake Tana",
      D: "Lake Ziway"
    },
    correctAnswer: "C",
    explanation: "Lake Tana, located in the Amhara Region, is the source of the Blue Nile (Abay River).",
    subject: "Geography",
    topic: "Hydrography of Ethiopia",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-GEO-106",
    text: "Which country borders Ethiopia to the north?",
    options: {
      A: "Kenya",
      B: "Sudan",
      C: "Eritrea",
      D: "Somalia"
    },
    correctAnswer: "C",
    explanation: "Eritrea borders Ethiopia to the north.",
    subject: "Geography",
    topic: "Location and Borders",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-GEO-107",
    text: "What is the Great Rift Valley known for in Ethiopia?",
    options: {
      A: "Being the source of the Nile",
      B: "Dense tropical rainforests",
      C: "Diverse lakes and volcanic activity",
      D: "Extensive coastal plains"
    },
    correctAnswer: "C",
    explanation: "The Great Rift Valley in Ethiopia is characterized by its series of lakes, tectonic activities, and volcanic formations.",
    subject: "Geography",
    topic: "Physical Geography",
    difficulty: "medium",
    stream: "Social Science"
  },

  // Economics
  {
    id: "Q-ECO-101",
    text: "Which economic indicator measures the total market value of all final goods and services produced within a country's borders in a given year?",
    options: {
      A: "Gross National Product (GNP)",
      B: "Gross Domestic Product (GDP)",
      C: "Consumer Price Index (CPI)",
      D: "Balance of Payments (BOP)"
    },
    correctAnswer: "B",
    explanation: "Gross Domestic Product (GDP) is the standard metric for measuring the value of economic output produced inside a nation's geographical boundaries.",
    subject: "Economics",
    topic: "Macroeconomics",
    difficulty: "easy",
    stream: "Social Science",
    year: "2011"
  },
  {
    id: "Q-ECO-102",
    text: "What occurs when a government's expenditures exceed its tax revenues in a fiscal year?",
    options: {
      A: "Budget Surplus",
      B: "Trade Deficit",
      C: "Budget Deficit",
      D: "Inflationary Gap"
    },
    correctAnswer: "C",
    explanation: "A budget deficit occurs when expenditures exceed tax revenues, requiring the government to borrow money to cover the shortfall.",
    subject: "Economics",
    topic: "Fiscal Policy",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-ECO-103",
    text: "What is the main export product of Ethiopia?",
    options: {
      A: "Oil and Gas",
      B: "Gold",
      C: "Coffee",
      D: "Textiles"
    },
    correctAnswer: "C",
    explanation: "Coffee is Ethiopia's most important export product, accounting for a significant portion of its foreign exchange earnings.",
    subject: "Economics",
    topic: "International Trade",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-ECO-104",
    text: "What does 'Inflation' mean in economics?",
    options: {
      A: "A decrease in the money supply",
      B: "A fall in the general price level",
      C: "A general increase in prices",
      D: "An increase in purchasing power"
    },
    correctAnswer: "C",
    explanation: "Inflation refers to the sustained increase in the general price level of goods and services in an economy over a period of time.",
    subject: "Economics",
    topic: "Macroeconomics",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-ECO-105",
    text: "What is the official currency of Ethiopia?",
    options: {
      A: "Dollar",
      B: "Shilling",
      C: "Ethiopian Birr",
      D: "Pound"
    },
    correctAnswer: "C",
    explanation: "The Ethiopian Birr (ETB) is the official currency of Ethiopia.",
    subject: "Economics",
    topic: "Money and Banking",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-ECO-106",
    text: "What is the primary sector of the Ethiopian economy?",
    options: {
      A: "Manufacturing",
      B: "Services",
      C: "Agriculture",
      D: "Mining"
    },
    correctAnswer: "C",
    explanation: "Agriculture is the backbone of the Ethiopian economy, employing the majority of the population.",
    subject: "Economics",
    topic: "National Economy",
    difficulty: "easy",
    stream: "Social Science"
  },
  {
    id: "Q-ECO-107",
    text: "What is the meaning of 'Scarcity' in economics?",
    options: {
      A: "Having too many resources",
      B: "Low demand for goods",
      C: "Limited resources to meet unlimited wants",
      D: "A state of economic abundance"
    },
    correctAnswer: "C",
    explanation: "Scarcity is the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources.",
    subject: "Economics",
    topic: "Basic Economic Concepts",
    difficulty: "easy",
    stream: "Social Science"
  },

  // --- Shared Subjects (Available to both Streams but categorized appropriately) ---
  // English
  {
    id: "Q-ENG-101",
    text: "Identify the correct form of the verb to complete the sentence: 'If I ______ enough money, I would have traveled around the world.'",
    options: {
      A: "have",
      B: "had",
      C: "had had",
      D: "would have"
    },
    correctAnswer: "C",
    explanation: "This is a Third Conditional sentence describing a hypothetical past situation. The structure is 'If + past perfect (had had), ... would have + past participle.'",
    subject: "English",
    topic: "Conditionals",
    difficulty: "hard",
    stream: "Natural Science" // App will copy to social as well
  },
  {
    id: "Q-ENG-102",
    text: "Which of the following options contains the correct passive voice of: 'The teacher is grading the entrance exam sheets now.'",
    options: {
      A: "The entrance exam sheets were being graded by the teacher now.",
      B: "The entrance exam sheets are being graded by the teacher now.",
      C: "The entrance exam sheets have been graded by the teacher now.",
      D: "The entrance exam sheets are graded by the teacher now."
    },
    correctAnswer: "B",
    explanation: "For the present continuous tense ('is grading'), the passive voice structure is 'is/are + being + past participle (graded).'",
    subject: "English",
    topic: "Voice and Tense",
    difficulty: "medium",
    stream: "Social Science"
  },

  // Mathematics
  {
    id: "Q-MAT-101",
    text: "What is the derivative of f(x) = 3x^2 + 5x - 7 with respect to x?",
    options: {
      A: "6x",
      B: "6x + 5",
      C: "3x + 5",
      D: "6x^2 + 5"
    },
    correctAnswer: "B",
    explanation: "Using the Power Rule of differentiation, d/dx (x^n) = n * x^(n-1). Thus, d/dx (3x^2) = 6x, and d/dx (5x) = 5. The derivative of constant 7 is 0. So, f'(x) = 6x + 5.",
    subject: "Mathematics",
    topic: "Calculus",
    difficulty: "easy",
    stream: "Natural Science",
    year: "2014"
  },
  {
    id: "Q-MAT-102",
    text: "Find the limit: lim(x -> 2) of (x^2 - 4) / (x - 2).",
    options: {
      A: "0",
      B: "2",
      C: "4",
      D: "Undefined"
    },
    correctAnswer: "C",
    explanation: "Factor the numerator: x^2 - 4 = (x - 2)(x + 2). Cancel (x - 2) term: lim(x -> 2) (x + 2). Evaluate by substituting x = 2: 2 + 2 = 4.",
    subject: "Mathematics",
    topic: "Limits",
    difficulty: "medium",
    stream: "Natural Science"
  },

  // Aptitude
  {
    id: "Q-APT-101",
    text: "Complete the pattern: 2, 6, 12, 20, 30, ____.",
    options: {
      A: "40",
      B: "42",
      C: "45",
      D: "38"
    },
    correctAnswer: "B",
    explanation: "The difference between consecutive terms increases by 2: +4, +6, +8, +10. The next difference should be +12. So, 30 + 12 = 42.",
    subject: "Aptitude",
    topic: "Numerical Reasoning",
    difficulty: "easy",
    stream: "Natural Science",
    year: "2013"
  },
  {
    id: "Q-APT-102",
    text: "In a family, a man has 6 sons, and each son has exactly one sister. How many members are in the family (excluding grandparents)?",
    options: {
      A: "9 members",
      B: "14 members",
      C: "8 members",
      D: "13 members"
    },
    correctAnswer: "A",
    explanation: "The family consists of the father, the mother, the 6 sons, and 1 daughter (who is the sister to all 6 sons). Total members = 1 + 1 + 6 + 1 = 9 members.",
    subject: "Aptitude",
    topic: "Logical Reasoning",
    difficulty: "medium",
    stream: "Social Science"
  }
];

export const mockNotes: Note[] = [
  // Biology
  {
    id: "N-BIO-01",
    title: "Chapter 1: Introduction to Biology & Cell structures",
    subject: "Biology",
    grade: 12,
    chapter: 1,
    category: "Short Notes",
    content: "Biology is the study of living organisms. Eukaryotic cells contain organelles such as the Nucleus, Mitochondria, Endoplasmic Reticulum, and Golgi apparatus. Cell division occurs via mitosis for somatic growth and meiosis for gamete production.",
    fileSize: "1.2 MB",
    isPremiumOnly: false,
    stream: "Natural Science"
  },
  {
    id: "N-BIO-02",
    title: "Chapter 2: Genetics and Inheritance Systems",
    subject: "Biology",
    grade: 12,
    chapter: 2,
    category: "PDF Notes",
    content: "Genetics explores how traits are passed from parents to offspring. Gregor Mendel established the laws of inheritance: Law of Segregation and Law of Independent Assortment. Non-Mendelian genetics include codominance and sex-linked inheritance.",
    fileSize: "3.4 MB",
    isPremiumOnly: true,
    stream: "Natural Science"
  },
  {
    id: "N-BIO-03",
    title: "Formula Sheet: Biology Diagrams & Definitions",
    subject: "Biology",
    grade: 12,
    chapter: 3,
    category: "Formula Sheets",
    content: "Quick review sheet for National Entrance Exam. Contains diagrams of Human Digestive System, Cell Organelle structures, Krebs cycle flowchart, and genetics crosses formulas.",
    fileSize: "850 KB",
    isPremiumOnly: true,
    stream: "Natural Science"
  },

  // Physics
  {
    id: "N-PHY-01",
    title: "Chapter 1: Physical Quantities & Kinematics",
    subject: "Physics",
    grade: 12,
    chapter: 1,
    category: "Short Notes",
    content: "Physics deals with the study of matter and energy. Kinematics describes motion using displacement (s), velocity (v), and acceleration (a). Key equations of motion: v = u + at, s = ut + 0.5at^2, v^2 = u^2 + 2as.",
    fileSize: "2.1 MB",
    isPremiumOnly: false,
    stream: "Natural Science"
  },
  {
    id: "N-PHY-02",
    title: "Chapter 2: Dynamics & Newton's Laws",
    subject: "Physics",
    grade: 12,
    chapter: 2,
    category: "Revision Guides",
    content: "Dynamics examines the forces causing motion. Newton's 1st Law: Inertia. Newton's 2nd Law: F = ma. Newton's 3rd Law: Action and Reaction are equal and opposite. Friction force: f = μ * N.",
    fileSize: "1.8 MB",
    isPremiumOnly: true,
    stream: "Natural Science"
  },

  // History
  {
    id: "N-HIS-01",
    title: "Chapter 1: Human Evolution and Ancient Civilizations",
    subject: "History",
    grade: 12,
    chapter: 1,
    category: "Short Notes",
    content: "Ethiopia is known as the Cradle of Mankind (home of Australopithecus afarensis 'Lucy'). Early kingdoms include Punt, Da'amat, and the Aksumite Empire. Aksum was notable for stelae, currency, trade, and adoption of Christianity and Islam.",
    fileSize: "1.5 MB",
    isPremiumOnly: false,
    stream: "Social Science"
  },
  {
    id: "N-HIS-02",
    title: "Chapter 2: The Battle of Adwa & Italian Aggression",
    subject: "History",
    grade: 12,
    chapter: 2,
    category: "PDF Notes",
    content: "In 1889, Article XVII of the Wuchale Treaty led to conflict. On March 1, 1896, Ethiopian forces led by Emperor Menelik II and Empress Taytu defeated the Italian army at Adwa, preserving Ethiopia's sovereignty.",
    fileSize: "2.8 MB",
    isPremiumOnly: true,
    stream: "Social Science"
  }
];

export const mockVideos: VideoLesson[] = [
  {
    id: "V-BIO-01",
    title: "Cell Respiration and ATP Cycle Demystified",
    subject: "Biology",
    duration: "18:45",
    youtubeId: "00jbG_cfGuQ",
    isPremiumOnly: false,
    stream: "Natural Science"
  },
  {
    id: "V-BIO-02",
    title: "How to Solve Meiosis Punnett Squares Fast",
    subject: "Biology",
    duration: "22:10",
    youtubeId: "Prr7-3vSTh8",
    isPremiumOnly: true,
    stream: "Natural Science"
  },
  {
    id: "V-PHY-01",
    title: "Mastering Projectile Motion Equations",
    subject: "Physics",
    duration: "15:30",
    youtubeId: "H-M_8A072E8",
    isPremiumOnly: false,
    stream: "Natural Science"
  },
  {
    id: "V-HIS-01",
    title: "Ethiopian History: Aksum to Battle of Adwa",
    subject: "History",
    duration: "30:15",
    youtubeId: "r2YgH6X6H_Y",
    isPremiumOnly: false,
    stream: "Social Science"
  },
  {
    id: "V-HIS-02",
    title: "WWII & The Italian Occupation of Ethiopia (1936-1941)",
    subject: "History",
    duration: "25:40",
    youtubeId: "W9oXQzVfV_E",
    isPremiumOnly: true,
    stream: "Social Science"
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Yared Kebede", points: 4850, badge: "Master", avatar: "👨‍🎓" },
  { rank: 2, name: "Helena Tadesse", points: 4620, badge: "Elite", avatar: "👩‍🎓" },
  { rank: 3, name: "Abdi Mohammed", points: 4300, badge: "Expert", avatar: "👨‍🎓" },
  { rank: 4, name: "Selamawit Girma", points: 4120, badge: "Expert", avatar: "👩‍🎓" },
  { rank: 5, name: "Tewodros Bekele", points: 3950, badge: "Pro", avatar: "👨‍🎓" },
  { rank: 6, name: "Chala Tolossa", points: 3780, badge: "Pro", avatar: "👨‍🎓" },
  { rank: 7, name: "Aster Solomon", points: 3600, badge: "Pro", avatar: "👩‍🎓" },
  { rank: 8, name: "Meron Hailu", points: 3420, badge: "Champion", avatar: "👩‍🎓" },
  { rank: 9, name: "Samuel Tesfaye", points: 3100, badge: "Rising Star", avatar: "👨‍🎓" },
  { rank: 10, name: "Tsion Assefa", points: 2950, badge: "Rising Star", avatar: "👩‍🎓" }
];
