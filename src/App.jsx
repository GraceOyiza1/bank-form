import React from 'react';
import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './index.css';

// 5-10-5 stepper: 5 in step 1, 10 per step for steps 2-10, 5 in step 11
// User's 94 objective and 11 theory questions
const allQuestions = [
  // Step 1: 5 objective
  { id: 'q1', question: 'What is citizenship?', type: 'objective', options: ['A. Living abroad', 'B. Legal membership of a country', 'C. Traveling rights', 'D. Voting only'], correctAnswer: 'B. Legal membership of a country', step: 1 },
  { id: 'q2', question: 'The rule of law means:', type: 'objective', options: ['A. Leaders rule everything', 'B. Law applies to everyone', 'C. Only rich follow law', 'D. Judges make laws'], correctAnswer: 'B. Law applies to everyone', step: 1 },
  { id: 'q3', question: 'Democracy means:', type: 'objective', options: ['A. Rule by king', 'B. Rule by military', 'C. Rule by the people', 'D. Rule by elders'], correctAnswer: 'C. Rule by the people', step: 1 },
  { id: 'q4', question: 'One duty of a citizen is:', type: 'objective', options: ['A. Avoid taxes', 'B. Obey laws', 'C. Break rules', 'D. Ignore voting'], correctAnswer: 'B. Obey laws', step: 1 },
  { id: 'q5', question: 'Human rights are:', type: 'objective', options: ['A. Privileges', 'B. Basic freedoms', 'C. Gifts', 'D. Rewards'], correctAnswer: 'B. Basic freedoms', step: 1 },

  // Steps 2-10: 10 objective per step (q6–q95)
  // Step 2 (q6–q15)
  { id: 'q6', question: 'The constitution is:', type: 'objective', options: ['A. A story book', 'B. Supreme law', 'C. Newspaper', 'D. Speech'], correctAnswer: 'B. Supreme law', step: 2 },
  { id: 'q7', question: 'Voting age in most countries is:', type: 'objective', options: ['A. 10', 'B. 15', 'C. 18', 'D. 25'], correctAnswer: 'C. 18', step: 2 },
  { id: 'q8', question: 'Election is:', type: 'objective', options: ['A. Fighting', 'B. Choosing leaders', 'C. Protesting', 'D. Campaigning'], correctAnswer: 'B. Choosing leaders', step: 2 },
  { id: 'q9', question: 'Corruption means:', type: 'objective', options: ['A. Honesty', 'B. Misuse of power', 'C. Justice', 'D. Discipline'], correctAnswer: 'B. Misuse of power', step: 2 },
  { id: 'q10', question: 'Legislature makes:', type: 'objective', options: ['A. Laws', 'B. Food', 'C. Money', 'D. Rules only'], correctAnswer: 'A. Laws', step: 2 },
  { id: 'q11', question: 'Executive branch:', type: 'objective', options: ['A. Interprets law', 'B. Enforces law', 'C. Writes books', 'D. Votes'], correctAnswer: 'B. Enforces law', step: 2 },
  { id: 'q12', question: 'Judiciary:', type: 'objective', options: ['A. Makes laws', 'B. Enforces laws', 'C. Interprets laws', 'D. Votes'], correctAnswer: 'C. Interprets laws', step: 2 },
  { id: 'q13', question: 'National symbols represent:', type: 'objective', options: ['A. Culture & identity', 'B. Money', 'C. Leaders', 'D. Only flag'], correctAnswer: 'A. Culture & identity', step: 2 },
  { id: 'q14', question: 'Good governance includes:', type: 'objective', options: ['A. Corruption', 'B. Accountability', 'C. Bias', 'D. Secrecy'], correctAnswer: 'B. Accountability', step: 2 },
  { id: 'q15', question: 'Tax is:', type: 'objective', options: ['A. Gift', 'B. Payment to government', 'C. Loan', 'D. Donation'], correctAnswer: 'B. Payment to government', step: 2 },

  // Step 3 (q16–q25)
  { id: 'q16', question: 'Rights come with:', type: 'objective', options: ['A. Fun', 'B. Responsibilities', 'C. Freedom only', 'D. Power'], correctAnswer: 'B. Responsibilities', step: 3 },
  { id: 'q17', question: 'Patriotism means:', type: 'objective', options: ['A. Hate country', 'B. Love country', 'C. Ignore country', 'D. Travel'], correctAnswer: 'B. Love country', step: 3 },
  { id: 'q18', question: 'Lawlessness leads to:', type: 'objective', options: ['A. Peace', 'B. Chaos', 'C. Growth', 'D. Unity'], correctAnswer: 'B. Chaos', step: 3 },
  { id: 'q19', question: 'Civic education teaches:', type: 'objective', options: ['A. Cooking', 'B. Citizenship', 'C. Driving', 'D. Singing'], correctAnswer: 'B. Citizenship', step: 3 },
  { id: 'q20', question: 'Justice means:', type: 'objective', options: ['A. Fairness', 'B. Punishment', 'C. Revenge', 'D. Power'], correctAnswer: 'A. Fairness', step: 3 },
  { id: 'q21', question: 'Electoral commission organizes elections', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 3 },
  { id: 'q22', question: 'Constitution protects rights', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 3 },
  { id: 'q23', question: 'Bribery is corruption', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 3 },
  { id: 'q24', question: 'Freedom of speech is a right', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 3 },
  { id: 'q25', question: 'Military rule is not democracy', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 3 },

  // Step 4 (q26–q35)
  { id: 'q26', question: 'National anthem promotes unity', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 4 },
  { id: 'q27', question: 'Good citizens vote', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 4 },
  { id: 'q28', question: 'Rule of law prevents abuse', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 4 },
  { id: 'q29', question: 'Government serves people', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 4 },
  { id: 'q30', question: 'Civic duties include paying tax', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 4 },
  { id: 'q31', question: 'Cell is:', type: 'objective', options: ['A. Tissue', 'B. Basic unit of life', 'C. Organ', 'D. System'], correctAnswer: 'B. Basic unit of life', step: 4 },
  { id: 'q32', question: 'Human heart pumps:', type: 'objective', options: ['A. Water', 'B. Blood', 'C. Air', 'D. Food'], correctAnswer: 'B. Blood', step: 4 },
  { id: 'q33', question: 'Photosynthesis occurs in:', type: 'objective', options: ['A. Root', 'B. Leaf', 'C. Stem', 'D. Flower'], correctAnswer: 'B. Leaf', step: 4 },
  { id: 'q34', question: 'Chlorophyll is:', type: 'objective', options: ['A. Red pigment', 'B. Green pigment', 'C. Enzyme', 'D. Gas'], correctAnswer: 'B. Green pigment', step: 4 },
  { id: 'q35', question: 'Respiration releases:', type: 'objective', options: ['A. Oxygen', 'B. Energy', 'C. Water', 'D. Food'], correctAnswer: 'B. Energy', step: 4 },

  // Step 5 (q36–q45)
  { id: 'q36', question: 'Skeleton supports:', type: 'objective', options: ['A. Movement', 'B. Body', 'C. Digestion', 'D. Blood'], correctAnswer: 'B. Body', step: 5 },
  { id: 'q37', question: 'Blood contains:', type: 'objective', options: ['A. Cells', 'B. Stones', 'C. Oil', 'D. Sand'], correctAnswer: 'A. Cells', step: 5 },
  { id: 'q38', question: 'Brain controls:', type: 'objective', options: ['A. Thinking', 'B. Walking only', 'C. Eating', 'D. Sleeping'], correctAnswer: 'A. Thinking', step: 5 },
  { id: 'q39', question: 'Digestion starts in:', type: 'objective', options: ['A. Stomach', 'B. Mouth', 'C. Intestine', 'D. Liver'], correctAnswer: 'B. Mouth', step: 5 },
  { id: 'q40', question: 'Lungs help in:', type: 'objective', options: ['A. Digestion', 'B. Breathing', 'C. Movement', 'D. Thinking'], correctAnswer: 'B. Breathing', step: 5 },
  { id: 'q41', question: 'DNA carries genetic info', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 5 },
  { id: 'q42', question: 'Plants make food', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 5 },
  { id: 'q43', question: 'Kidney filters blood', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 5 },
  { id: 'q44', question: 'Bones protect organs', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 5 },
  { id: 'q45', question: 'Heart is a muscle', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 5 },

  // Step 6 (q46–q55)
  { id: 'q46', question: 'Oxygen is needed for respiration', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q47', question: 'Cells form tissues', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q48', question: 'Tissues form organs', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q49', question: 'Organs form systems', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q50', question: 'Reproduction produces offspring', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q51', question: 'Bacteria are microorganisms', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q52', question: 'Virus causes disease', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q53', question: 'Nutrition is food intake', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q54', question: 'Growth is increase in size', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },
  { id: 'q55', question: 'Excretion removes waste', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 6 },

  // Step 7 (q56–q65)
  { id: 'q56', question: 'Plants need sunlight', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 7 },
  { id: 'q57', question: 'Root absorbs water', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 7 },
  { id: 'q58', question: 'Stem transports water', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 7 },
  { id: 'q59', question: 'Leaf makes food', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 7 },
  { id: 'q60', question: 'Blood transports oxygen', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 7 },
  { id: 'q61', question: 'Hormones regulate body', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 7 },
  { id: 'q62', question: 'Skin protects body', type: 'objective', options: ['A. True', 'B. False'], correctAnswer: 'A. True', step: 7 },
  { id: 'q63', question: '2 + 3 =', type: 'objective', options: ['A. 4', 'B. 5', 'C. 6', 'D. 7'], correctAnswer: 'B. 5', step: 7 },
  { id: 'q64', question: '10 ÷ 2 =', type: 'objective', options: ['A. 4', 'B. 5', 'C. 6', 'D. 7'], correctAnswer: 'B. 5', step: 7 },
  { id: 'q65', question: '7 × 6 =', type: 'objective', options: ['A. 42', 'B. 36', 'C. 48', 'D. 40'], correctAnswer: 'A. 42', step: 7 },

  // Step 8 (q66–q75)
  { id: 'q66', question: '9 – 4 =', type: 'objective', options: ['A. 3', 'B. 4', 'C. 5', 'D. 6'], correctAnswer: 'C. 5', step: 8 },
  { id: 'q67', question: 'Square of 5 =', type: 'objective', options: ['A. 10', 'B. 15', 'C. 20', 'D. 25'], correctAnswer: 'D. 25', step: 8 },
  { id: 'q68', question: '1/2 + 1/2 =', type: 'objective', options: ['A. 1', 'B. 2', 'C. 1/2', 'D. 0'], correctAnswer: 'A. 1', step: 8 },
  { id: 'q69', question: '100 ÷ 10 =', type: 'objective', options: ['A. 5', 'B. 10', 'C. 20', 'D. 50'], correctAnswer: 'B. 10', step: 8 },
  { id: 'q70', question: '3² =', type: 'objective', options: ['A. 6', 'B. 9', 'C. 12', 'D. 3'], correctAnswer: 'B. 9', step: 8 },
  { id: 'q71', question: '15 + 5 =', type: 'objective', options: ['A. 10', 'B. 15', 'C. 20', 'D. 25'], correctAnswer: 'C. 20', step: 8 },
  { id: 'q72', question: '20 – 10 =', type: 'objective', options: ['A. 5', 'B. 10', 'C. 15', 'D. 20'], correctAnswer: 'B. 10', step: 8 },
  { id: 'q73', question: '4 × 4 =', type: 'objective', options: ['A. 8', 'B. 12', 'C. 16', 'D. 20'], correctAnswer: 'C. 16', step: 8 },
  { id: 'q74', question: '12 ÷ 3 =', type: 'objective', options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'], correctAnswer: 'C. 4', step: 8 },
  { id: 'q75', question: '6 + 7 =', type: 'objective', options: ['A. 11', 'B. 12', 'C. 13', 'D. 14'], correctAnswer: 'C. 13', step: 8 },

  // Step 9 (q76–q85)
  { id: 'q76', question: '8 × 2 =', type: 'objective', options: ['A. 12', 'B. 14', 'C. 16', 'D. 18'], correctAnswer: 'C. 16', step: 9 },
  { id: 'q77', question: '50 ÷ 5 =', type: 'objective', options: ['A. 5', 'B. 10', 'C. 15', 'D. 20'], correctAnswer: 'B. 10', step: 9 },
  { id: 'q78', question: '9 + 1 =', type: 'objective', options: ['A. 8', 'B. 9', 'C. 10', 'D. 11'], correctAnswer: 'C. 10', step: 9 },
  { id: 'q79', question: '14 – 4 =', type: 'objective', options: ['A. 8', 'B. 10', 'C. 12', 'D. 14'], correctAnswer: 'B. 10', step: 9 },
  { id: 'q80', question: '3 × 3 =', type: 'objective', options: ['A. 6', 'B. 9', 'C. 12', 'D. 15'], correctAnswer: 'B. 9', step: 9 },
  { id: 'q81', question: '11 + 11 =', type: 'objective', options: ['A. 20', 'B. 21', 'C. 22', 'D. 23'], correctAnswer: 'C. 22', step: 9 },
  { id: 'q82', question: '16 ÷ 4 =', type: 'objective', options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'], correctAnswer: 'C. 4', step: 9 },
  { id: 'q83', question: '5 × 6 =', type: 'objective', options: ['A. 25', 'B. 30', 'C. 35', 'D. 40'], correctAnswer: 'B. 30', step: 9 },
  { id: 'q84', question: '7 + 8 =', type: 'objective', options: ['A. 13', 'B. 14', 'C. 15', 'D. 16'], correctAnswer: 'C. 15', step: 9 },
  { id: 'q85', question: '18 ÷ 2 =', type: 'objective', options: ['A. 7', 'B. 8', 'C. 9', 'D. 10'], correctAnswer: 'C. 9', step: 9 },

  // Step 10 (q86–q94)
  { id: 'q86', question: '10 × 10 =', type: 'objective', options: ['A. 10', 'B. 50', 'C. 100', 'D. 200'], correctAnswer: 'C. 100', step: 10 },
  { id: 'q87', question: '2³ =', type: 'objective', options: ['A. 4', 'B. 6', 'C. 8', 'D. 10'], correctAnswer: 'C. 8', step: 10 },
  { id: 'q88', question: '100 – 50 =', type: 'objective', options: ['A. 25', 'B. 50', 'C. 75', 'D. 100'], correctAnswer: 'B. 50', step: 10 },
  { id: 'q89', question: '6 × 7 =', type: 'objective', options: ['A. 36', 'B. 42', 'C. 48', 'D. 54'], correctAnswer: 'B. 42', step: 10 },
  { id: 'q90', question: '25 ÷ 5 =', type: 'objective', options: ['A. 4', 'B. 5', 'C. 6', 'D. 7'], correctAnswer: 'B. 5', step: 10 },
  { id: 'q91', question: '13 + 7 =', type: 'objective', options: ['A. 15', 'B. 18', 'C. 20', 'D. 25'], correctAnswer: 'C. 20', step: 10 },
  { id: 'q92', question: '9 × 9 =', type: 'objective', options: ['A. 72', 'B. 81', 'C. 90', 'D. 99'], correctAnswer: 'B. 81', step: 10 },
  { id: 'q93', question: '30 ÷ 3 =', type: 'objective', options: ['A. 5', 'B. 8', 'C. 10', 'D. 12'], correctAnswer: 'C. 10', step: 10 },
  { id: 'q94', question: '4² =', type: 'objective', options: ['A. 8', 'B. 12', 'C. 14', 'D. 16'], correctAnswer: 'D. 16', step: 10 },

  // Step 11: 11 theory
  { id: 'q95', question: 'What is democracy?', type: 'theory', step: 11, answer: 'Government where people choose their leaders through voting.' },
  { id: 'q96', question: 'Explain rule of law.', type: 'theory', step: 11, answer: 'Everyone is equal before the law, including leaders.' },
  { id: 'q97', question: 'What is a cell?', type: 'theory', step: 11, answer: 'The smallest unit of life that carries out functions.' },
  { id: 'q98', question: 'Describe photosynthesis.', type: 'theory', step: 11, answer: 'Process where plants make food using sunlight, water, and carbon dioxide.' },
  { id: 'q99', question: 'What is respiration?', type: 'theory', step: 11, answer: 'Process of releasing energy from food.' },
  { id: 'q100', question: 'Define citizenship.', type: 'theory', step: 11, answer: 'Legal membership of a country with rights and duties.' },
  { id: 'q101', question: 'What is an organ?', type: 'theory', step: 11, answer: 'A group of tissues working together.' },
  { id: 'q102', question: 'Explain digestion.', type: 'theory', step: 11, answer: 'Breaking down food into simpler substances.' },
  { id: 'q103', question: 'What is a fraction?', type: 'theory', step: 11, answer: 'A part of a whole.' },
  { id: 'q104', question: 'Define multiplication.', type: 'theory', step: 11, answer: 'Repeated addition of numbers.' },
  { id: 'q105', question: 'What is human rights?', type: 'theory', step: 11, answer: 'Basic freedoms all humans are entitled to.' },
];
const TOTAL_GOAL = 105;
const TOTAL_STEPS = 11;


function App({ onQuizStart }) {
  // All state hooks must come first
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ firstName: '', secondName: '', regNo: '', centerNo: '', hasSigned: false });
  const [infoSubmitted, setInfoSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour = 3600 seconds
  const [reviewMode, setReviewMode] = useState(false);
  const [theoryPageIndex, setTheoryPageIndex] = useState(0);
  const [isDoubleView, setIsDoubleView] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const loginSigCanvas = useRef();
  const sigCanvas = useRef();
  const timerRef = useRef();

  // Use randomized questions if available, otherwise allQuestions
  const questions = randomizedQuestions && randomizedQuestions.length ? randomizedQuestions : allQuestions;
  // Export as CSV
  function exportCSV() {
    const rows = [
      ['Name', 'Registration Number', 'Center Number', 'Score', 'Question', 'Your Answer', 'Correct/Expected Answer'],
      ...questions.map((q, idx) => [
        `${studentInfo.firstName} ${studentInfo.secondName}`,
        studentInfo.regNo,
        studentInfo.centerNo,
        score,
        `Q${idx + 1}: ${q.question}`,
        answers[q.id] || '',
        q.type === 'objective' ? q.correctAnswer : q.answer || ''
      ])
    ];
    const csvContent = rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_result_${studentInfo.regNo || 'student'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Export as PDF (simple: print dialog)
  function exportPDF() {
    window.print();
  }
  // Refs for auto-scroll
  const questionRefs = React.useRef({});

  // Scroll to next unanswered question in section
  const scrollToNextUnanswered = (qid) => {
    const sectionQs = stepQuestions;
    const idx = sectionQs.findIndex(q => q.id === qid);
    for (let i = idx + 1; i < sectionQs.length; i++) {
      if (!answers[sectionQs[i].id] || answers[sectionQs[i].id].toString().trim() === '') {
        const ref = questionRefs.current[sectionQs[i].id];
        if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
  };
  // Start timer on quiz start
  React.useEffect(() => {
    if (!infoSubmitted || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!submitted) handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [infoSubmitted, submitted]);

  // Format timer as HH:MM:SS
  function formatTime(secs) {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
  // Simple similarity function (Jaccard index on lowercased word sets)
  function getSimilarity(a, b) {
    if (!a || !b) return 0;
    const setA = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
    const setB = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : Math.round((intersection.size / union.size) * 100);
  }

  const handleAnswerChange = (qid, option) => {
    setAnswers((prev) => {
      const updated = { ...prev, [qid]: option };
      setTimeout(() => scrollToNextUnanswered(qid), 100); // scroll after state update
      return updated;
    });
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!studentInfo.firstName.trim() || !studentInfo.secondName.trim() || !studentInfo.regNo.trim() || !studentInfo.centerNo.trim()) {
      alert('Please fill in all student information fields.');
      return;
    }
    
    // RegNo Validation
    const regNum = parseInt(studentInfo.regNo, 10);
    if (isNaN(regNum) || regNum < 1 || regNum > 50) {
      alert('Registration Number must be between 001 and 050.');
      return;
    }
    
    // Signature Validation
    if (!loginSigCanvas.current || loginSigCanvas.current.isEmpty()) {
      alert('Please sign before starting the quiz.');
      return;
    }
    
    const signatureData = loginSigCanvas.current.toDataURL();
    setStudentInfo(prev => ({ ...prev, loginSignature: signatureData }));
    // Randomize questions and options per section
    const grouped = {};
    allQuestions.forEach(q => {
      if (!grouped[q.step]) grouped[q.step] = [];
      grouped[q.step].push(q);
    });
    const randomized = [];
    Object.keys(grouped).sort((a, b) => a - b).forEach(step => {
      let qs = grouped[step];
      // Shuffle questions in this step
      qs = shuffleArray(qs);
      // Shuffle options for objective questions
      qs = qs.map(q =>
        q.type === 'objective'
          ? { ...q, options: shuffleArray(q.options) }
          : q
      );
      randomized.push(...qs);
    });
    setRandomizedQuestions(randomized);
    setInfoSubmitted(true);
    if (onQuizStart) onQuizStart();
  };

  const handleSubmit = () => {
    // 1. Check all questions answered
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions!");
      return;
    }

    // 2. Check if signature is drawn
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert("Please sign before submitting!");
      return;
    }

    // 3. Optional confirm
    if (!window.confirm("Are you sure you want to submit?")) return;

    // 4. Calculate score
    let totalScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) totalScore++;
    });
    setScore(totalScore);

    // 5. Save signature as base64
    const signatureData = sigCanvas.current.toDataURL();

    // 6. Store result locally (or send to backend)
    const result = {
      studentInfo,
      answers,
      score: totalScore,
      signature: signatureData,
      date: new Date().toISOString(),
      randomizedQuestions: questions,
    };
    localStorage.setItem("quizResult", JSON.stringify(result));
    // Store in allQuizResults array
    let allResults = [];
    try {
      allResults = JSON.parse(localStorage.getItem("allQuizResults")) || [];
    } catch (e) { allResults = []; }
    allResults.push(result);
    localStorage.setItem("allQuizResults", JSON.stringify(allResults));

    // 7. Show result
    setSubmitted(true);
  };

  const clearSignature = () => sigCanvas.current.clear();

  if (!infoSubmitted) {
    return (
      <div className="main-wrapper">
        <div className="glass-card">
          <h2>Enter Student Information</h2>
          <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="student-info-row">
              <label>First Name:</label>
              <input name="firstName" value={studentInfo.firstName} onChange={handleInfoChange} required />
            </div>
            <div className="student-info-row">
              <label>Second Name:</label>
              <input name="secondName" value={studentInfo.secondName} onChange={handleInfoChange} required />
            </div>
            <div className="student-info-row">
              <label>Registration Number:</label>
              <input name="regNo" value={studentInfo.regNo} onChange={handleInfoChange} min="1" max="50" type="number" required />
            </div>
            <div className="student-info-row">
              <label>Center Number:</label>
              <input name="centerNo" value={studentInfo.centerNo} onChange={handleInfoChange} placeholder="e.g., 234 for Nigeria, 233 for Ghana" required />
            </div>
            <div className="signature-section" style={{ marginTop: 10 }}>
              <label>DIGITAL SIGNATURE:</label>
              <div className="sig-wrapper">
                <SignatureCanvas
                  ref={loginSigCanvas}
                  penColor='white'
                  canvasProps={{ className: 'sigCanvas', height: 100 }}
                  onEnd={() => setStudentInfo(prev => ({...prev, hasSigned: true}))}
                />
              </div>
              <button type="button" className="btn-clear" onClick={() => { loginSigCanvas.current.clear(); setStudentInfo(prev => ({...prev, hasSigned: false})); }}>Clear Signature</button>
            </div>
            <button type="submit" className="btn-next" disabled={!studentInfo.hasSigned} style={{ opacity: studentInfo.hasSigned ? 1 : 0.5, cursor: studentInfo.hasSigned ? 'pointer' : 'not-allowed' }}>Start Quiz</button>
          </form>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="main-wrapper">
        <div className="glass-card">
          <h1>Quiz Results</h1>
          <h3>Name: {studentInfo.firstName} {studentInfo.secondName}</h3>
          <h3>Registration Number: {studentInfo.regNo}</h3>
          <h3>Center Number: {studentInfo.centerNo}</h3>
          <h2>Score: {score} / {allQuestions.length}</h2>
          <h3>Your Signature:</h3>
          <img src={localStorage.getItem("quizResult") && JSON.parse(localStorage.getItem("quizResult")).signature} alt="Signature" style={{ border: "1px solid #000" }} />
          <div style={{ margin: '24px 0', display: 'flex', gap: 16 }}>
            <button onClick={exportPDF} className="btn-next">Export as PDF</button>
            <button onClick={exportCSV} className="btn-next">Export as CSV</button>
          </div>
          <hr style={{ margin: '24px 0' }} />
          <h2>Question Review</h2>
          {allQuestions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: 16, padding: 8, border: '1px solid #eee', borderRadius: 6 }}>
              <div><strong>Q{idx + 1}:</strong> {q.question}</div>
              {q.type === 'objective' ? (
                <>
                  <div>Your Answer: <b>{answers[q.id] || <span style={{ color: 'red' }}>No answer</span>}</b></div>
                  <div>Correct Answer: <b>{q.correctAnswer}</b></div>
                  {answers[q.id] === q.correctAnswer ? <span style={{ color: 'green' }}>Correct</span> : <span style={{ color: 'red' }}>Incorrect</span>}
                </>
              ) : (
                <>
                  <div>Your Answer: <b>{answers[q.id] || <span style={{ color: 'red' }}>No answer</span>}</b></div>
                  <div>Expected Answer: <b>{q.answer}</b></div>
                  <div>Similarity Score: <b>{getSimilarity(answers[q.id], q.answer)}%</b></div>
                  <div style={{ color: 'orange', fontWeight: 500 }}>Manual review required</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Group questions by step
  const stepQuestions = questions.filter(q => q.step === currentStep);
  const totalFilled = Object.keys(answers).filter(key => answers[key] && answers[key].toString().trim() !== '').length;
  const TOTAL_STEPS = Math.max(...questions.map(q => q.step));

  // Review screen
  if (reviewMode) {
    return (
      <div className="main-wrapper quiz-layout">
        <nav className="sidebar-nav" aria-label="Section Navigation">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Sections</div>
          {[...Array(TOTAL_STEPS)].map((_, i) => (
            <button
              key={i + 1}
              style={{
                display: 'block',
                marginBottom: 8,
                background: '#fff',
                color: '#333',
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '6px 12px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 400
              }}
              onClick={() => { setCurrentStep(i + 1); setReviewMode(false); }}
            >
              Section {i + 1}
            </button>
          ))}
        </nav>
        <div className="quiz-main-area">
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 18, color: timeLeft < 300 ? '#ff4757' : '#fff' }} aria-live="polite">Time Left: {formatTime(timeLeft)}</span>
          </div>
          <div className="glass-card">
            <h2>Review Your Answers</h2>
            {allQuestions.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: 16, padding: 8, border: '1px solid #eee', borderRadius: 6 }}>
                <div><strong>Q{idx + 1}:</strong> {q.question}</div>
                <div>Your Answer: <b>{answers[q.id] || <span style={{ color: 'red' }}>No answer</span>}</b></div>
              </div>
            ))}
            <div className="signature-section" style={{ marginTop: 32 }}>
              <label>DIGITAL SIGNATURE (DRAW BELOW)</label>
              <div className="sig-wrapper">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor='white'
                  canvasProps={{ className: 'sigCanvas' }}
                />
              </div>
              <button className="btn-clear" onClick={clearSignature}>Clear Signature</button>
            </div>
            <div className="nav-btns">
              <button className="btn-next" onClick={handleSubmit}>Final Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz UI
  return (
    <div className="main-wrapper quiz-layout">
      {/* Sidebar navigation */}
      <nav className="sidebar-nav" aria-label="Section Navigation">
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Sections</div>
        {[...Array(TOTAL_STEPS)].map((_, i) => (
          <button
            key={i + 1}
            style={{
              display: 'block',
              marginBottom: 8,
              background: currentStep === i + 1 ? '#4caf50' : '#fff',
              color: currentStep === i + 1 ? '#fff' : '#333',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '6px 12px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: currentStep === i + 1 ? 700 : 400
            }}
            aria-current={currentStep === i + 1 ? 'step' : undefined}
            onClick={() => {
              setCurrentStep(i + 1);
              setTheoryPageIndex(0);
            }}
          >
            Section {i + 1}
          </button>
        ))}
      </nav>
      <div className="quiz-main-area">
        <div className="progress-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Quiz Progress</span>
            <span style={{ fontWeight: 600, fontSize: 18, color: timeLeft < 300 ? '#ff4757' : '#fff' }} aria-live="polite">Time Left: {formatTime(timeLeft)}</span>
          </div>
          <div className="label-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>
            <span>{totalFilled} / {TOTAL_GOAL} Questions Answered</span>
            <span>{Math.round((totalFilled / TOTAL_GOAL) * 100)}% Complete</span>
          </div>
          <div className="master-bar">
            <div className="fill green-glow" style={{ width: `${(totalFilled / TOTAL_GOAL) * 100}%` }}></div>
          </div>
        </div>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Section {currentStep}</h2>
            {!isMobile && (
              <button 
                onClick={() => {
                  setIsDoubleView(!isDoubleView);
                  setTheoryPageIndex(0);
                }}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12
                }}
              >
                {isDoubleView ? 'Switch to Single View' : 'Switch to 2-Column View'}
              </button>
            )}
          </div>
          <div className={`input-grid ${(!isMobile && isDoubleView) ? 'double' : ''}`}>
            {(() => {
              const viewCount = (isDoubleView && !isMobile) ? 2 : 1;
              return stepQuestions.slice(theoryPageIndex, theoryPageIndex + viewCount);
            })().map((q, idx) => {
              const displayIdx = theoryPageIndex + idx;
              return (
              <div
                key={q.id}
                className="input-group"
                ref={el => (questionRefs.current[q.id] = el)}
              >
                <label>{displayIdx + 1}. {q.question}</label>
                {q.type === 'objective' ? (
                  q.options.map(option => (
                    <label key={option} className="radio-option">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleAnswerChange(q.id, option)}
                      />
                      {option}
                    </label>
                  ))
                ) : (
                  <textarea
                    name={`question-${q.id}`}
                    value={answers[q.id] || ''}
                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={3}
                    style={{ width: '100%', marginTop: 8 }}
                  />
                )}
              </div>
            )})}
          </div>
          {/* Navigation for all sections */}
          {(() => {
            const viewCount = (isDoubleView && !isMobile) ? 2 : 1;
            const isLastPage = theoryPageIndex + viewCount >= stepQuestions.length;
            const isFirstPage = theoryPageIndex === 0;
            return (
              <div className="nav-btns">
                {/* Back button: go to prev page or prev section */}
                {!isFirstPage ? (
                  <button className="btn-back" onClick={() => setTheoryPageIndex(p => p - viewCount)}>Previous</button>
                ) : (
                  currentStep > 1 && <button className="btn-back" onClick={() => { setCurrentStep(currentStep - 1); setTheoryPageIndex(0); }}>Back</button>
                )}
                {/* Next: paginate within section, or advance section, or review */}
                {!isLastPage ? (
                  <button className="btn-next" onClick={() => setTheoryPageIndex(p => p + viewCount)}>Next</button>
                ) : currentStep < TOTAL_STEPS ? (
                  <button className="btn-next" onClick={() => { setCurrentStep(currentStep + 1); setTheoryPageIndex(0); }}>Next Section</button>
                ) : (
                  <button className="btn-next" onClick={() => setReviewMode(true)}>Review Answers</button>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );

}

// Helper: Get or initialize teachers list
function getTeachers() {
  try {
    return JSON.parse(localStorage.getItem("teachers")) || [];
  } catch {
    return [];
  }
}

function saveTeachers(teachers) {
  localStorage.setItem("teachers", JSON.stringify(teachers));
}

// Helper: Always read fresh results from localStorage
function getStoredResults() {
  try {
    return JSON.parse(localStorage.getItem("allQuizResults")) || [];
  } catch {
    return [];
  }
}

// One-time: ensure the results array has capacity for 50 students (slots 001-050).
// This does NOT overwrite existing data — it only initialises localStorage if it
// has never been touched before.
function initStudentCapacity() {
  const existing = getStoredResults();
  if (existing.length === 0) {
    // Leave empty — real entries will be pushed when students submit.
    // The capacity label (001-050) is enforced by the reg-number validation.
  }
}

// Admin Login Component
function AdminLogin({ onAuthenticate, onBack }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const ADMIN_PASSWORD = 'admin123'; // Master admin password

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthenticate();
      setPassword('');
    } else {
      setError('Invalid admin password');
      setPassword('');
    }
  };

  return (
    <div className="main-wrapper">
      <div className="glass-card" style={{ maxWidth: 400 }}>
        <div 
          onClick={onBack} 
          style={{ color: '#71717a', cursor: 'pointer', marginBottom: '16px', fontSize: '14px', display: 'inline-block' }}
        >
          ← Back to Landing Page
        </div>
        <h2>Admin Login</h2>
        <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>Master Administrator Account</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="admin-pwd">Admin Password:</label>
            <input
              id="admin-pwd"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
          <button type="submit" className="btn-next">Login as Admin</button>
        </form>
      </div>
    </div>
  );
}

// Teacher Login Component
function TeacherLogin({ onAuthenticate, onBackToMenu }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const teachers = getTeachers();

  const handleSubmit = (e) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.username === username && t.password === password);
    if (teacher) {
      onAuthenticate(teacher);
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid username or password');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="main-wrapper">
      <div className="glass-card" style={{ maxWidth: 400 }}>
        <h2>Teacher Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="teacher-user">Username:</label>
            <input
              id="teacher-user"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label htmlFor="teacher-pwd">Password:</label>
            <input
              id="teacher-pwd"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
          <button type="submit" className="btn-next">Login</button>
          <button type="button" onClick={onBackToMenu} className="btn-back">Back</button>
        </form>
      </div>
    </div>
  );
}

// Access Menu Component
function AccessMenu({ onAdminClick, onTeacherClick, onStudentClick, onBack }) {
  return (
    <div className="main-wrapper">
      <div className="glass-card" style={{ maxWidth: 500 }}>
        {onBack && (
          <button 
            onClick={onBack} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#71717a', 
              cursor: 'pointer', 
              fontSize: '14px',
              padding: 0,
              marginBottom: '16px',
              display: 'inline-block'
            }}
          >
            ← Back to Landing Page
          </button>
        )}
        <h2>Access Portal</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Select your role:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={onAdminClick}
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: 'none',
              borderLeft: '4px solid #2563eb',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ color: '#2563eb' }}>Admin</div>
            <div style={{ fontSize: 12, fontWeight: 'normal', marginTop: 4, color: '#a1a1aa' }}>Manage teachers and view all results</div>
          </button>
          <button
            onClick={onTeacherClick}
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: 'none',
              borderLeft: '4px solid #059669',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ color: '#059669' }}>Teacher</div>
            <div style={{ fontSize: 12, fontWeight: 'normal', marginTop: 4, color: '#a1a1aa' }}>Score student responses and publish results</div>
          </button>
          <button
            onClick={onStudentClick}
            style={{
              padding: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: 'none',
              borderLeft: '4px solid #f97316',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ color: '#f97316' }}>Student</div>
            <div style={{ fontSize: 12, fontWeight: 'normal', marginTop: 4, color: '#a1a1aa' }}>View your quiz results and feedback</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Student Results Portal
function StudentResultsPortal({ onClose }) {
  const [searchName, setSearchName] = useState('');
  const [searchReg, setSearchReg] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const allResults = JSON.parse(localStorage.getItem("allQuizResults")) || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const nameInput = searchName.trim();
    const regInput = searchReg.trim();

    if (!nameInput || !regInput) {
      setNotFound(false);
      return;
    }

    // Reload results from localStorage to get latest published status
    const currentResults = JSON.parse(localStorage.getItem("allQuizResults")) || [];

    // Debug: log what we're looking for
    console.log('Searching for:', { name: nameInput, reg: regInput });
    console.log('Available results:', currentResults.map(r => ({
      name: r.studentInfo?.name,
      reg: r.studentInfo?.regNo,
      published: r.published
    })));

    const found = currentResults.find(r => {
      const storedName = r.studentInfo?.name
        ? r.studentInfo.name.trim().toLowerCase()
        : `${r.studentInfo?.firstName || ''} ${r.studentInfo?.secondName || ''}`.trim().toLowerCase();
      const storedReg = r.studentInfo?.regNo?.toString().trim().toLowerCase();
      const isPublished = r.isApproved === true || r.published === true;
      return storedName === nameInput.toLowerCase() && storedReg === regInput.toLowerCase() && isPublished;
    });

    if (found) {
      console.log('Result found:', found);
      setResult(found);
      setNotFound(false);
    } else {
      console.log('No result found');
      setResult(null);
      setNotFound(true);
    }
  };

  const calculateTheoryScore = (result) => {
    const scores = result.theoryScores || {};
    const theoriesCount = allQuestions.filter(q => q.type === 'theory').length;
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    return theoriesCount > 0 ? Math.round((totalScore / (theoriesCount * 10)) * 100) : null;
  };

  const calculateTotalScore = (result) => {
    const objectiveCorrect = result.score || 0;
    const theoryScore = calculateTheoryScore(result) || 0;
    const objectiveQuestions = allQuestions.filter(q => q.type === 'objective').length;
    const objectiveWeight = 75;
    const theoryWeight = 25;
    return Math.round((objectiveCorrect / objectiveQuestions) * objectiveWeight + (theoryScore / 100) * theoryWeight);
  };

  const theoryQuestions = allQuestions.filter(q => q.type === 'theory');

  if (result) {
    return (
      <div className="main-wrapper">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2>Your Quiz Results</h2>
            <button onClick={onClose} className="btn-back">Back</button>
          </div>

          <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2196f3' }}>
                  {result.score}/{allQuestions.filter(q => q.type === 'objective').length}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Objective Score</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800' }}>
                  {calculateTheoryScore(result)}%
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Theory Score</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#4caf50' }}>
                  {calculateTotalScore(result)}%
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Overall</div>
              </div>
            </div>
          </div>

          <h3>Theory Question Feedback</h3>
          {theoryQuestions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: 20, padding: 16, border: '1px solid #eee', borderRadius: 6 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>
                Q{idx + 1}: {q.question}
              </div>
              <div style={{ marginBottom: 12, padding: 12, background: '#f9f9f9', borderRadius: 4 }}>
                <strong>Your Answer:</strong>
                <p style={{ margin: '8px 0 0 0', fontStyle: 'italic' }}>
                  {result.answers[q.id] || <span style={{ color: 'red' }}>No answer provided</span>}
                </p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Expected Answer:</strong>
                <p style={{ margin: '8px 0 0 0', fontStyle: 'italic' }}>{q.answer}</p>
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Your Score:</strong> <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {result.theoryScores?.[q.id] ?? '–'}/10
                </span>
              </div>
              {result.theoryComments?.[q.id] && (
                <div style={{ marginTop: 12, padding: 12, background: '#e3f2fd', borderRadius: 4 }}>
                  <strong>Teacher Feedback:</strong>
                  <p style={{ margin: '8px 0 0 0' }}>{result.theoryComments[q.id]}</p>
                </div>
              )}
            </div>
          ))}

          <button onClick={onClose} className="btn-back" style={{ marginTop: 24 }}>Back to Search</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="glass-card" style={{ maxWidth: 500 }}>
        <h2>View Your Results</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: 24 }}>
          <div className="student-info-row">
            <label htmlFor="student-name">Full Name:</label>
            <input
              id="student-name"
              type="text"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setNotFound(false);
              }}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="student-info-row">
            <label htmlFor="student-reg">Registration Number:</label>
            <input
              id="student-reg"
              type="text"
              value={searchReg}
              onChange={(e) => {
                setSearchReg(e.target.value);
                setNotFound(false);
              }}
              placeholder="Enter your registration number"
              required
            />
          </div>
          {notFound && (
            <div style={{ color: 'red', fontSize: 14 }}>
              Results not found. Your results may not be published yet.
            </div>
          )}
          <button type="submit" className="btn-next">Search Results</button>
          <button type="button" onClick={onClose} className="btn-back">Back</button>
        </form>
      </div>
    </div>
  );
}

// Theory Question Scoring Modal
function ScoringModal({ studentResult, onClose, onSave, isAdmin, onPublish }) {
  const [scores, setScores] = useState(() => {
    const saved = studentResult.theoryScores || {};
    return saved;
  });
  const [comments, setComments] = useState(() => {
    const saved = studentResult.theoryComments || {};
    return saved;
  });

  const theoryQuestions = allQuestions.filter(q => q.type === 'theory');

  const handleScoreChange = (qId, score) => {
    setScores(prev => ({ ...prev, [qId]: parseInt(score) || 0 }));
  };

  const handleCommentChange = (qId, comment) => {
    setComments(prev => ({ ...prev, [qId]: comment }));
  };

  const handleSave = () => {
    onSave({ theoryScores: scores, theoryComments: comments });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div className="glass-card" style={{ maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
        <h2>Score Theory Questions</h2>
        <div style={{ padding: 12, background: 'rgba(33, 150, 243, 0.1)', borderRadius: 6, marginBottom: 20, borderLeft: '4px solid #2196f3' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#90caf9' }}>
            <strong>📋 Workflow:</strong> {isAdmin ? 'Review the teacher\'s scores and click "Approve & Publish" to complete.' : 'After scoring, the Admin will review your score before it is published.'}
          </p>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: 20 }}>
          <strong>Student:</strong> {studentResult.studentInfo.name || `${studentResult.studentInfo.firstName} ${studentResult.studentInfo.secondName}`} |
          <strong style={{ marginLeft: 16 }}>Reg No:</strong> {studentResult.studentInfo.regNo}
        </p>

        {theoryQuestions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Q{idx + 1}: {q.question}</strong>
            </div>
            <div style={{ marginBottom: 8, padding: 8, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 4 }}>
              <div>
                <strong>Student Answer:</strong>
                <p style={{ margin: '8px 0 0 0', fontStyle: 'italic' }}>
                  {studentResult.answers[q.id] || <span style={{ color: 'red' }}>No answer</span>}
                </p>
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>Expected Answer:</strong>
                <p style={{ margin: '8px 0 0 0', fontStyle: 'italic' }}>{q.answer}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: '0 0 100px' }}>
                <label htmlFor={`score-${q.id}`}>Score (0-10):</label>
                <input
                  id={`score-${q.id}`}
                  type="number"
                  min="0"
                  max="10"
                  value={scores[q.id] || 0}
                  onChange={(e) => handleScoreChange(q.id, e.target.value)}
                  style={{ width: '100%' }}
                  disabled={isAdmin}
                />
              </div>
            </div>

            <div>
              <label htmlFor={`comment-${q.id}`}>Comments:</label>
              <textarea
                id={`comment-${q.id}`}
                value={comments[q.id] || ''}
                onChange={(e) => handleCommentChange(q.id, e.target.value)}
                placeholder="Add feedback for the student..."
                rows={3}
                style={{ width: '100%', marginTop: 4 }}
                disabled={isAdmin}
              />
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          {isAdmin ? (
            <button onClick={onPublish} className="btn-next" style={{ background: '#4caf50' }}>Approve & Publish</button>
          ) : (
            <button onClick={handleSave} className="btn-next">Save Scores</button>
          )}
          <button onClick={onClose} className="btn-back">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// Admin Panel Component - Teacher Management
function AdminManagementPanel({ onClose, currentTeacher }) {
  const [teachers, setTeachers] = useState(getTeachers());
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Always sync from localStorage when the panel mounts
  React.useEffect(() => {
    setTeachers(getTeachers());
  }, []);

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setError('Username and password are required');
      return;
    }

    if (teachers.find(t => t.username === newUsername)) {
      setError('Username already exists');
      return;
    }

    const newTeacher = {
      id: Date.now().toString(),
      username: newUsername,
      password: newPassword,
      createdAt: new Date().toISOString()
    };

    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    saveTeachers(updated);
    setSuccess(`Teacher "${newUsername}" created successfully`);
    setNewUsername('');
    setNewPassword('');
    setError('');
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('Delete this teacher? This cannot be undone.')) {
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      saveTeachers(updated);
      setSuccess('Teacher deleted');
    }
  };

  return (
    <div className="main-wrapper">
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2>Admin Panel - Manage Teachers</h2>
          <button onClick={onClose} className="btn-back">Exit</button>
        </div>

        {/* Add New Teacher Form */}
        <div style={{ marginBottom: 32, padding: 20, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Add New Teacher</h3>
          <form onSubmit={handleAddTeacher} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
            <div>
              <label htmlFor="new-username">Username:</label>
              <input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  setError('');
                }}
                placeholder="e.g., teacher1"
                required
              />
            </div>
            <div>
              <label htmlFor="new-password">Password:</label>
              <input
                id="new-password"
                type="text"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                placeholder="e.g., secure123"
                required
              />
            </div>
            <button type="submit" className="btn-next">Add Teacher</button>
          </form>
          {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
        </div>

        {/* Teachers List */}
        <h3>Active Teachers ({teachers.length})</h3>
        {teachers.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No teachers yet</div>
        ) : (
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Username</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Password</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Created</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>{t.username}</td>
                    <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 12 }}>••••••••</td>
                    <td style={{ padding: 12, fontSize: 12 }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteTeacher(t.id)}
                        style={{
                          padding: '4px 8px',
                          background: '#ff5252',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Admin Panel Component
function AdminPanel({ onClose, currentTeacher }) {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [filter, setFilter] = useState('all');
  const [managingTeachers, setManagingTeachers] = useState(false);

  React.useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    setResults(getStoredResults());
  };

  const saveTheoryScores = (resultIndex, scores) => {
    // Always read the freshest data from localStorage before mutating
    const fresh = getStoredResults();
    fresh[resultIndex] = {
      ...fresh[resultIndex],
      theoryScores: scores.theoryScores,
      theoryComments: scores.theoryComments,
      scoredAt: new Date().toISOString(),
      scoredBy: currentTeacher?.username || 'teacher'
    };
    localStorage.setItem("allQuizResults", JSON.stringify(fresh));
    setResults([...fresh]);
    setSelectedResult(null);
  };

  const publishResults = (resultIndex) => {
    // Always read fresh from localStorage to prevent stale-state overwrite
    const fresh = getStoredResults();
    const studentInfo = fresh[resultIndex]?.studentInfo || {};
    const studentName = studentInfo.name || `${studentInfo.firstName || ''} ${studentInfo.secondName || ''}`.trim();
    fresh[resultIndex] = {
      ...fresh[resultIndex],
      published: true,
      isApproved: true,
      publishedAt: new Date().toISOString(),
      publishedBy: currentTeacher?.username || 'admin'
    };
    localStorage.setItem("allQuizResults", JSON.stringify(fresh));
    setResults([...fresh]);

    alert(
      `✓ Results Published!\n\n` +
      `Student: ${studentName}\n` +
      `Status: Pending → Published\n\n` +
      `The student can now view their results and feedback.`
    );
  };

  const calculateTheoryScore = (result) => {
    const scores = result.theoryScores || {};
    const theoriesCount = allQuestions.filter(q => q.type === 'theory').length;
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    return theoriesCount > 0 ? Math.round((totalScore / (theoriesCount * 10)) * 100) : null;
  };

  const calculateTotalScore = (result) => {
    const objectiveCorrect = result.score || 0;
    const theoryScore = calculateTheoryScore(result) || 0;
    const objectiveQuestions = allQuestions.filter(q => q.type === 'objective').length;
    return Math.round((objectiveCorrect / objectiveQuestions) * 75 + (theoryScore / 100) * 25);
  };

  const isTheoryScoringPending = (result) => {
    const theoryQuestions = allQuestions.filter(q => q.type === 'theory');
    const scores = result.theoryScores || {};
    return theoryQuestions.length > Object.keys(scores).length;
  };

  const filteredResults = results.filter(r => {
    if (filter === 'theory-pending') return isTheoryScoringPending(r);
    if (filter === 'theory-scored') return !isTheoryScoringPending(r);
    if (filter === 'published') return r.published;
    return true;
  });

  if (managingTeachers) {
    return <AdminManagementPanel onClose={() => setManagingTeachers(false)} />;
  }

  return (
    <div className="main-wrapper">
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2>{currentTeacher ? 'Teacher Dashboard' : 'Admin Dashboard'}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {!currentTeacher && (
              <button
                onClick={() => setManagingTeachers(true)}
                className="btn-next"
                style={{ padding: '8px 16px' }}
              >
                Manage Teachers
              </button>
            )}
            <button onClick={onClose} className="btn-back">Exit</button>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 16, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4ade80' }}>{results.length}</div>
            <div style={{ fontSize: 12, color: '#bbf7d0', marginTop: 4 }}>Total Submissions</div>
          </div>
          <div style={{ padding: 16, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#fb923c' }}>
              {results.filter(r => isTheoryScoringPending(r)).length}
            </div>
            <div style={{ fontSize: 12, color: '#fed7aa', marginTop: 4 }}>Pending Scoring</div>
          </div>
          <div style={{ padding: 16, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#60a5fa' }}>
              {results.filter(r => !isTheoryScoringPending(r) && !r.published).length}
            </div>
            <div style={{ fontSize: 12, color: '#bfdbfe', marginTop: 4 }}>Ready to Publish</div>
          </div>
          <div style={{ padding: 16, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4ade80' }}>
              {results.filter(r => r.published).length}
            </div>
            <div style={{ fontSize: 12, color: '#bbf7d0', marginTop: 4 }}>Published</div>
          </div>
        </div>

        {/* Filter Options */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              background: filter === 'all' ? '#4caf50' : 'transparent',
              color: '#fff',
              border: filter === 'all' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            All ({results.length})
          </button>
          <button
            onClick={() => setFilter('theory-pending')}
            style={{
              padding: '8px 16px',
              background: filter === 'theory-pending' ? '#ff9800' : 'transparent',
              color: '#fff',
              border: filter === 'theory-pending' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            Pending ({results.filter(r => isTheoryScoringPending(r)).length})
          </button>
          <button
            onClick={() => setFilter('theory-scored')}
            style={{
              padding: '8px 16px',
              background: filter === 'theory-scored' ? '#2196f3' : 'transparent',
              color: '#fff',
              border: filter === 'theory-scored' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            Scored ({results.filter(r => !isTheoryScoringPending(r)).length})
          </button>
          <button
            onClick={() => setFilter('published')}
            style={{
              padding: '8px 16px',
              background: filter === 'published' ? '#4caf50' : 'transparent',
              color: '#fff',
              border: filter === 'published' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            Published ({results.filter(r => r.published).length})
          </button>
        </div>

        {/* Results Table */}
        <div style={{ maxHeight: 500, overflow: 'auto' }}>
          {filteredResults.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>No results found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Student</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Reg No</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Objective</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Theory</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Overall</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((res, idx) => {
                  const theoryScore = calculateTheoryScore(res);
                  const isPending = isTheoryScoringPending(res);
                  const totalScore = calculateTotalScore(res);
                  const actualIndex = results.indexOf(res);
                  return (
                    <tr key={actualIndex} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: 12 }}>{res.studentInfo?.name || `${res.studentInfo?.firstName} ${res.studentInfo?.secondName}`}</td>
                      <td style={{ padding: 12 }}>{res.studentInfo?.regNo}</td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        {res.score}/{allQuestions.filter(q => q.type === 'objective').length}
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        {theoryScore !== null ? `${theoryScore}%` : '–'}
                      </td>
                      <td style={{ padding: 12, textAlign: 'center', fontWeight: 'bold' }}>
                        {totalScore}%
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: res.published ? '#c8e6c9' : isPending ? '#fff3e0' : '#e3f2fd',
                          color: res.published ? '#1b5e20' : isPending ? '#e65100' : '#0d47a1'
                        }}>
                          {res.published ? '✓ Published' : isPending ? 'Pending' : 'Scored'}
                        </span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          {!currentTeacher ? (
                            <>
                              {!isPending && !res.published && (
                                <button
                                  onClick={() => setSelectedResult(actualIndex)}
                                  className="btn-next"
                                  style={{ padding: '4px 8px', fontSize: 11, background: '#4caf50' }}
                                >
                                  Review
                                </button>
                              )}
                              {res.published && <span style={{ fontSize: 11, color: '#94a3b8' }}>Locked</span>}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setSelectedResult(actualIndex)}
                                disabled={res.published}
                                className="btn-next"
                                style={{
                                  padding: '4px 8px',
                                  fontSize: 11,
                                  opacity: res.published ? 0.5 : 1,
                                  cursor: res.published ? 'not-allowed' : 'pointer'
                                }}
                                title={res.published ? 'Results are published and locked' : 'Score theory questions'}
                              >
                                {res.published ? 'Locked' : 'Score'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
          }
        </div >
      </div >

      {/* Scoring Modal */}
      {
        selectedResult !== null && (
          <ScoringModal
            studentResult={results[selectedResult]}
            onClose={() => setSelectedResult(null)}
            onSave={(scores) => saveTheoryScores(selectedResult, scores)}
            isAdmin={!currentTeacher}
            onPublish={() => {
              publishResults(selectedResult);
              setSelectedResult(null);
            }}
          />
        )
      }
    </div >
  );
}

function AppWithAdmin() {
  const [view, setView] = useState('quiz'); // 'quiz', 'menu', 'admin-login', 'admin-panel', 'teacher-login', 'teacher-panel', 'student-results'
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [quizActive, setQuizActive] = useState(false);

  const showMenu = () => {
    setView('menu');
    setCurrentTeacher(null);
  };

  if (view === 'menu') {
    return (
      <AccessMenu
        onAdminClick={() => setView('admin-login')}
        onTeacherClick={() => setView('teacher-login')}
        onStudentClick={() => setView('student-results')}
        onBack={() => setView('quiz')}
      />
    );
  }

  if (view === 'admin-login') {
    return (
      <AdminLogin
        onAuthenticate={() => setView('admin-panel')}
        onBack={() => setView('menu')}
      />
    );
  }

  if (view === 'admin-panel') {
    return (
      <AdminPanel
        onClose={showMenu}
        currentTeacher={null}
      />
    );
  }

  if (view === 'teacher-login') {
    return (
      <TeacherLogin
        onAuthenticate={(teacher) => {
          setCurrentTeacher(teacher);
          setView('teacher-panel');
        }}
        onBackToMenu={() => setView('menu')}
      />
    );
  }

  if (view === 'teacher-panel') {
    return (
      <AdminPanel
        onClose={showMenu}
        currentTeacher={currentTeacher}
      />
    );
  }

  if (view === 'student-results') {
    return <StudentResultsPortal onClose={showMenu} />;
  }

  return (
    <>
      {!quizActive && (
        <button
          onClick={() => setView('menu')}
          style={{ position: 'fixed', top: 12, right: 12, zIndex: 1000 }}
          className="btn-next"
        >
          Access Portal
        </button>
      )}
      <App onQuizStart={() => setQuizActive(true)} />
    </>
  );
}

export default AppWithAdmin;

// Utility: shuffle array (Fisher-Yates)
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}