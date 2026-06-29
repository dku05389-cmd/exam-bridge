/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft, MessageSquare, ExternalLink, Languages } from 'lucide-react';
import { AppTheme, LanguageType } from '../types';

interface FAQViewProps {
  theme?: AppTheme;
  language?: LanguageType;
  onChangeLanguage?: (lang: LanguageType) => void;
  onNavigate: (view: string) => void;
}

export default function FAQView({
  theme = 'dark',
  language = 'am',
  onChangeLanguage,
  onNavigate,
}: FAQViewProps) {
  const isLight = theme === 'light';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Multilingual labels for FAQ layout
  const labels: Record<LanguageType, {
    title: string;
    subtitle: string;
    needHelp: string;
    helpDesc: string;
    getSupport: string;
    joinCommunity: string;
    selectLanguage: string;
  }> = {
    en: {
      title: "Frequently Asked Questions (FAQs)",
      subtitle: "Common questions and their answers",
      needHelp: "Need More Help?",
      helpDesc: "You can get direct Telegram support or join our community.",
      getSupport: "Get Support",
      joinCommunity: "Join Community",
      selectLanguage: "Language"
    },
    am: {
      title: "ተደጋግመው የሚጠየቁ ጥያቄዎች (FAQs)",
      subtitle: "የተለመዱ ጥያቄዎች እና መልሶቻቸው",
      needHelp: "ተጨማሪ እርዳታ ይፈልጋሉ?",
      helpDesc: "በቀጥታ የቴሌግራም ድጋፍ ማግኘት ወይም ማህበረሰባችንን መቀላቀል ይችላሉ።",
      getSupport: "ድጋፍ አግኝ",
      joinCommunity: "ማህበረሰቡን ተቀላቀል",
      selectLanguage: "ቋንቋ"
    },
    om: {
      title: "Gaaffilee Yeroo Baay'ee Gaafataman (FAQs)",
      subtitle: "Gaaffilee beekamoo fi deebii isaanii",
      needHelp: "Gargaarsa Dabalataa Barbaadduu?",
      helpDesc: "Kallattiin deeggarsa Telegram argachuu ykn hawaasa keenya tti makamuu dandeessu.",
      getSupport: "Deeggarsa Argadhu",
      joinCommunity: "Hawaasa Tti Makami",
      selectLanguage: "Afaan"
    },
    ti: {
      title: "ተደጋጋሚ ሕቶታትን መልስታትን (FAQs)",
      subtitle: "ልሙዳት ሕቶታትን መልስታቶምን",
      needHelp: "ተወሳኺ ሓገዝ ትደልዩ ዲኹም?",
      helpDesc: "ብቐጥታ ናይ ቴሌግራም ደገፍ ክትረኽቡ ወይ ማሕበረሰብና ክትጽንበሩ ትኽእሉ ኢኹም።",
      getSupport: "ደገፍ ምርካብ",
      joinCommunity: "ማሕበረሰብ ተጸንበር",
      selectLanguage: "ቋንቋ"
    }
  };

  const currentLabels = labels[language] || labels.am;

  // Multilingual FAQ Content list
  const faqsByLanguage: Record<LanguageType, Array<{ id: number; question: string; answer: string }>> = {
    en: [
      {
        id: 1,
        question: "1. What is Exam Bridge?",
        answer: "✅ Exam Bridge is a modern exam preparation platform designed for Ethiopian Grade 12 students. Our main goal is to help students prepare for national exams with confidence, easily practice core subjects (Mathematics, English, Aptitude, Chemistry, Biology, Physics, Geography, History, and Economics) and improve their exam results with an all-inclusive application.",
      },
      {
        id: 2,
        question: "2. What does the application include?",
        answer: "✅ Exam Bridge includes entrance and Matric questions from 2007 to 2018, clear Short Notes, and chapter-by-chapter self-assessment questions from Grades 9-12.\n\n✅ Additionally, it features an Artificial Intelligence (AI) Tutor that explains and simplifies unclear concepts for students.",
      }
    ],
    am: [
      {
        id: 1,
        question: "1, Exam Bridge ምንድን ነው?",
        answer: "✅ Exam Bridge ለኢትዮጵያ የ12ኛ ክፍል ተማሪዎች የተዘጋጀ ዘመናዊ የፈተና ዝግጅት መድረክ ነው። ዋና አላማችን ተማሪዎች በልበ ሙሉነት ለብሄራዊ ፈተና እንዲዘጋጁ፣ መሰረታዊ የትምህርት ክፍሎችን (ሒሳብ፣ እንግሊዝኛ፣ አፕቲቱድ፣ ኬሚስትሪ ፣ ባዮሎጂ፣ ፊዚክስ ፣ ጂኦግራፊ፣ ታሪክ እና ኢኮኖሚክስ) በቀላሉ እንዲለማመዱ እና የፈተና ውጤታቸውን እንዲያሻሽሉ ለማገዝ ሁሉንም የትምህርት አይነቶች ያካተተ መተግበሪያ ነው።",
      },
      {
        id: 2,
        question: "2, መተግበሪያው በውስጡ ምን አካትቷል ?",
        answer: "✅ Exam Bridge በ ውስጡ ከ 2007-2018 ያሉ የ entrance እና Matric ጥያቄዎችን, ግልፅ የሆኑ Short Notes እና ከ 9-12 ኛ ክፍል በየ ምዕራፉ የግንዛቤ መለኪያ ጥያቄችን ያካተተ ነው።\n\n✅ በተጨማሪም ለተማሪዎች ግልፅ ያልሆነ የትምህርት ክፍል ግል አድርጎ የሚያቀርብ Artificial Intelligence (AI) Tutor ያካተተ ነው።",
      }
    ],
    om: [
      {
        id: 1,
        question: "1, Exam Bridge Maali?",
        answer: "✅ Exam Bridge jiddu-gala qophii qormaataa ammayyaa barattoota kutaa 12ffaa Itoophiyaatiif qophaa'eedha. Kaayyoon keenya guddaan barattoonni of-koltummaadhan qormaata biyyaalessaatiif akka qophaa'an, barannoowwan bu'uuraa (Herrega, Afaan Ingilizii, Aptitude, Keemistrii, Baayoloojii, Fiiziksii, Ji'ogiraafii, Seenaa fi Ikonomiksii) salphaatti akka shaakalan fi qabxii qormaata isaanii akka fooyyessan gargaaruuf appilikeeshinii barnoota hundaa of-keessaa qabudha.",
      },
      {
        id: 2,
        question: "2, Appilikeeshinichi maalfaa of keessaa qaba?",
        answer: "✅ Exam Bridge gaaffilee seensaa fi Matric bara 2007-2018 jiran, yaadannoo gabaabaa ifa ta'an fi gaaffilee madaallii hubannoo boqonnaa boqonnaadhan kutaa 9-12 jiran of keessaa qaba.\n\n✅ Dabalataan barattootaaf qabiyyee barnootaa ifa hin taane gargaarsa Artificial Intelligence (AI) Tutor tiin garmalee ifa godhee dhiyeessa.",
      }
    ],
    ti: [
      {
        id: 1,
        question: "1, ኤግዛም ብሪጅ (Exam Bridge) እንታይ እዩ?",
        answer: "✅ ኤግዛም ብሪጅ ንናይ ኢትዮጵያ መበል 12 ክፍሊ ተምሃሮ ዝተዳለወ ዘመናዊ ናይ ፈተና መዳልዊ መድረኽ እዩ። ቀንዲ ዕላማና ተምሃሮ ብሙሉእ ተኣማንነት ንሃገራዊ ፈተና ክዳለዉ፣ መሰረታውያን ዓውድታት ትምህርቲ (ሒሳብ፣ እንግሊዘኛ፣ ክእለት (Aptitude)፣ ኬሚስትሪ፣ ባዮሎጂ፣ ፊዚክስ፣ ጂኦግራፊ፣ ታሪክን ኢኮኖሚክስን) ብቐሊሉ ክለማመዱን ናይ ፈተና ውጽኢቶም ከዕብዩን ንምሕጋዝ ኩሎም ዓይነታት ትምህርቲ ዘጠቓለለ መተግበሪያ እዩ።",
      },
      {
        id: 2,
        question: "2, እቲ መተግበሪያ ኣብ ውሽጡ እንታይ ሒዙ ኣሎ?",
        answer: "✅ ኤግዛም ብሪጅ ኣብ ውሽጡ ካብ 2007-2018 ዓ.ም ዘለዉ ናይ መእተውን ማትሪክን ሕቶታት፣ ንጹራት ሓጸርቲ ማስታወሻታትን ካብ 9-12 ክፍሊ ኣብ ነፍሲ ወከፍ ምዕራፍ ናይ ምርዳእ ዓቐን መምዘኒ ሕቶታትን ዝሓዘ እዩ።\n\n✅ ብተወሳኺ ንተምሃሮ ንጹር ዘይኮነ ናይ ትምህርቲ ክፋል ብንጹር ዘቕርብ ናይ መለማመዲ ሓጋዚ Artificial Intelligence (AI) Tutor ዘጠቓለለ እዩ።",
      }
    ]
  };

  const currentFaqs = faqsByLanguage[language] || faqsByLanguage.am;

  const languagesList: Array<{ code: LanguageType; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ' },
    { code: 'om', name: 'Oromoo' },
    { code: 'ti', name: 'ትግርኛ' }
  ];

  return (
    <div className={`pb-6 ${isLight ? 'text-slate-800' : 'text-white'} transition-all duration-300 w-full`}>
      {/* Language Selector at the top of content */}
      <div className="flex items-center justify-end mb-4 px-4">
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl ${isLight ? 'bg-slate-100' : 'bg-slate-800/80'}`}>
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {languagesList.map((langOption) => {
            const isActive = language === langOption.code;
            return (
              <button
                key={langOption.code}
                onClick={() => onChangeLanguage && onChangeLanguage(langOption.code)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : isLight
                    ? 'hover:bg-slate-200 text-slate-600'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                {langOption.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-0">
        {currentFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id}
              className={`border-b overflow-hidden transition-all duration-300 ${
                isLight 
                  ? 'border-slate-100 bg-white' 
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold transition cursor-pointer"
              >
                <span className="text-sm md:text-base pr-4">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-sky-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? 'max-h-96 opacity-100 border-t' : 'max-h-0 opacity-0 pointer-events-none'
                } ${isLight ? 'border-slate-100' : 'border-slate-800'}`}
              >
                <div className={`p-4 text-sm leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Telegram Contacts at the bottom */}
      <div className={`mt-8 p-6 ${isLight ? 'bg-sky-50/50 border-y border-sky-100/50' : 'bg-sky-500/5 border-y border-sky-500/10'}`}>
        <h4 className="font-bold text-sm mb-2 flex items-center gap-1.5 text-sky-500">
          <MessageSquare className="w-4 h-4" />
          {currentLabels.needHelp}
        </h4>
        <p className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          {currentLabels.helpDesc}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href="https://t.me/ExamBridgeSupport"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {currentLabels.getSupport} <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://t.me/ExamBridgeCommunity"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${isLight ? 'border-slate-200 hover:bg-slate-50 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'}`}
          >
            {currentLabels.joinCommunity} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
