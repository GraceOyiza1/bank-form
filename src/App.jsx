
import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './index.css';

// 5-10-5 stepper: 5 in step 1, 10 per step for steps 2-10, 5 in step 11
// Mix of objective and theory questions for demonstration
const allQuestions = [
  // Step 1: 3 objective, 2 theory
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `q${i + 1}`,
    question: `Objective Question ${i + 1}`,
    type: 'objective',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'A',
    step: 1,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `q${3 + i + 1}`,
    question: `Theory Question ${3 + i + 1}`,
    type: 'theory',
    step: 1,
  })),
  // Steps 2-10: 7 objective, 3 theory each
  ...Array.from({ length: 9 }, (_, stepIdx) =>
    [
      ...Array.from({ length: 7 }, (_, qIdx) => ({
        id: `q${5 + stepIdx * 10 + qIdx + 1}`,
        question: `Objective Question ${5 + stepIdx * 10 + qIdx + 1}`,
        type: 'objective',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        step: stepIdx + 2,
      })),
      ...Array.from({ length: 3 }, (_, qIdx) => ({
        id: `q${5 + stepIdx * 10 + 7 + qIdx + 1}`,
        question: `Theory Question ${5 + stepIdx * 10 + 7 + qIdx + 1}`,
        type: 'theory',
        step: stepIdx + 2,
      })),
    ]
  ).flat(),
  // Step 11: 3 objective, 2 theory
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `q${100 + i + 1}`,
    question: `Objective Question ${100 + i + 1}`,
    type: 'objective',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'A',
    step: 11,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `q${100 + 3 + i + 1}`,
    question: `Theory Question ${100 + 3 + i + 1}`,
    type: 'theory',
    step: 11,
  })),
];
const TOTAL_GOAL = 105;
const TOTAL_STEPS = 11;


function App() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const sigCanvas = useRef();

  const handleAnswerChange = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = () => {
    // 1. Check all questions answered
    if (Object.keys(answers).length < allQuestions.length) {
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
    allQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) totalScore++;
    });
    setScore(totalScore);

    // 5. Save signature as base64
    const signatureData = sigCanvas.current.toDataURL();

    // 6. Store result locally (or send to backend)
    localStorage.setItem(
      "quizResult",
      JSON.stringify({
        answers,
        score: totalScore,
        signature: signatureData,
        date: new Date(),
      })
    );

    // 7. Show result
    setSubmitted(true);
  };

  const clearSignature = () => sigCanvas.current.clear();

  if (submitted) {
    return (
      <div className="main-wrapper">
        <div className="glass-card">
          <h1>Quiz Results</h1>
          <h2>Score: {score} / {allQuestions.length}</h2>
          <h3>Your Signature:</h3>
          <img src={localStorage.getItem("quizResult") && JSON.parse(localStorage.getItem("quizResult")).signature} alt="Signature" style={{ border: "1px solid #000" }} />
          <br />
          <button onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); sigCanvas.current.clear(); setCurrentStep(1); }}>Retry Quiz</button>
        </div>
      </div>
    );
  }

  // Sectioned questions for current step
  const stepQuestions = allQuestions.filter(q => q.step === currentStep);
  // Count only answered questions for progress
  const totalFilled = Object.keys(answers).filter(key => answers[key] && answers[key].toString().trim() !== '').length;

  return (
    <div className="main-wrapper">
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
          {stepQuestions.map(q => (
            <div key={q.id} className="input-group">
              <label>{q.question}</label>
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
        {/* Signature and submit only on last step */}
        {currentStep === TOTAL_STEPS && (
          <>
            <div className="signature-section">
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
              {currentStep > 1 && <button className="btn-back" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
              <button className="btn-next" onClick={handleSubmit}>Final Submit</button>
            </div>
          </>
        )}
        {currentStep < TOTAL_STEPS && (
          <div className="nav-btns">
            {currentStep > 1 && <button className="btn-back" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
            <button className="btn-next" onClick={() => setCurrentStep(currentStep + 1)}>Next Section</button>
          </div>
        )}
      </div>
    </div>
  );

}

export default App;