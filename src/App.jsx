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


function App() {
  // All state hooks must come first
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ name: '', regNo: '', centerNo: '' });
  const [infoSubmitted, setInfoSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour = 3600 seconds
  const [reviewMode, setReviewMode] = useState(false);
  const sigCanvas = useRef();
  const timerRef = useRef();

  // Use randomized questions if available, otherwise allQuestions
  const questions = randomizedQuestions && randomizedQuestions.length ? randomizedQuestions : allQuestions;
  // Export as CSV
  function exportCSV() {
    const rows = [
      ['Name', 'Registration Number', 'Center Number', 'Score', 'Question', 'Your Answer', 'Correct/Expected Answer'],
      ...questions.map((q, idx) => [
        studentInfo.name,
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
    if (!studentInfo.name.trim() || !studentInfo.regNo.trim() || !studentInfo.centerNo.trim()) {
      alert('Please fill in all student information fields.');
      return;
    }
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
          <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              Name:
              <input name="name" value={studentInfo.name} onChange={handleInfoChange} required />
            </label>
            <label>
              Registration Number:
              <input name="regNo" value={studentInfo.regNo} onChange={handleInfoChange} required />
            </label>
            <label>
              Center Number:
              <input name="centerNo" value={studentInfo.centerNo} onChange={handleInfoChange} required />
            </label>
            <button type="submit" className="btn-next">Start Quiz</button>
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
          <h3>Name: {studentInfo.name}</h3>
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
      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'row' }}>
        <nav style={{ minWidth: 120, background: '#f5f5f5', padding: 16, borderRadius: 8, marginRight: 24, height: 'fit-content', alignSelf: 'flex-start', position: 'sticky', top: 24 }} aria-label="Section Navigation">
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
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 18, color: timeLeft < 300 ? 'red' : '#333' }} aria-live="polite">Time Left: {formatTime(timeLeft)}</span>
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
    <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Sidebar navigation */}
      <nav style={{ minWidth: 120, background: '#f5f5f5', padding: 16, borderRadius: 8, marginRight: 24, height: 'fit-content', alignSelf: 'flex-start', position: 'sticky', top: 24 }} aria-label="Section Navigation">
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
            onClick={() => setCurrentStep(i + 1)}
          >
            Section {i + 1}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1 }}>
        {/* Timer at the top */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 18, color: timeLeft < 300 ? 'red' : '#333' }} aria-live="polite">Time Left: {formatTime(timeLeft)}</span>
        </div>
        <div className="progress-container">
          <div className="label-row">
            <span>{totalFilled} / {TOTAL_GOAL} Questions Answered</span>
            <span>{Math.round((totalFilled / TOTAL_GOAL) * 100)}% Complete</span>
          </div>
          <div className="master-bar">
            <div className="fill green-glow" style={{ width: `${(totalFilled / TOTAL_GOAL) * 100}%` }}></div>
          </div>
        </div>
        <div className="glass-card">
          <h2>Section {currentStep}</h2>
          <div className={`input-grid ${stepQuestions.length > 5 ? 'double' : ''}`}>
            {stepQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="input-group"
                ref={el => (questionRefs.current[q.id] = el)}
              >
                <label>{idx + 1}. {q.question}</label>
                {q.type === 'objective' ? (
                  q.options.map(option => (
                    <label key={option} style={{ display: 'block', marginLeft: 10 }}>
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
            ))}
          </div>
          {/* Review button on last section */}
          {currentStep === TOTAL_STEPS && (
            <div className="nav-btns">
              {currentStep > 1 && <button className="btn-back" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
              <button className="btn-next" onClick={() => setReviewMode(true)}>Review Answers</button>
            </div>
          )}
          {currentStep < TOTAL_STEPS && (
            <div className="nav-btns">
              {currentStep > 1 && <button className="btn-back" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
              <button className="btn-next" onClick={() => setCurrentStep(currentStep + 1)}>Next Section</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

// Admin Panel Component
function AdminPanel({ onClose }) {
  const [results, setResults] = useState([]);

  React.useEffect(() => {
    try {
      setResults(JSON.parse(localStorage.getItem("allQuizResults")) || []);
    } catch {
      setResults([]);
    }
  }, []);

  function exportAllCSV() {
    if (!results.length) return alert("No results to export.");
    const rows = [
      ["Name", "Registration Number", "Center Number", "Score", "Date", "Q#", "Question", "Your Answer", "Correct/Expected Answer"]
    ];
    results.forEach(res => {
      allQuestions.forEach((q, idx) => {
        rows.push([
          res.studentInfo?.name || '',
          res.studentInfo?.regNo || '',
          res.studentInfo?.centerNo || '',
          res.score,
          res.date,
          idx + 1,
          q.question,
          res.answers[q.id] || '',
          q.type === 'objective' ? q.correctAnswer : q.answer || ''
        ]);
      });
    });
    const csvContent = rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_quiz_results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="main-wrapper">
      <div className="glass-card">
        <h2>Admin Panel - All Quiz Results</h2>
        <button onClick={onClose} className="btn-next" style={{ float: 'right', marginLeft: 8 }}>Close</button>
        <button onClick={exportAllCSV} className="btn-next" style={{ float: 'right' }}>Export All as CSV</button>
        <div style={{ clear: 'both', marginBottom: 16 }}></div>
        {results.length === 0 ? (
          <div>No results found.</div>
        ) : (
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reg No</th>
                  <th>Center No</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, i) => (
                  <tr key={i}>
                    <td>{res.studentInfo?.name}</td>
                    <td>{res.studentInfo?.regNo}</td>
                    <td>{res.studentInfo?.centerNo}</td>
                    <td>{res.score}</td>
                    <td>{res.date && new Date(res.date).toLocaleString()}</td>
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

function AppWithAdmin() {
  const [showAdmin, setShowAdmin] = useState(false);
  return (
    <>
      <button onClick={() => setShowAdmin(true)} style={{ position: 'fixed', top: 12, right: 12, zIndex: 1000 }} className="btn-next">Admin Panel</button>
      {showAdmin ? <AdminPanel onClose={() => setShowAdmin(false)} /> : <App />}
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