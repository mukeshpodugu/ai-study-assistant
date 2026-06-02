"use client";

import React, { useState } from 'react';
import { 
  Award, 
  HelpCircle, 
  Check, 
  X, 
  Loader2, 
  ChevronRight, 
  ArrowRight,
  BookOpen,
  RefreshCw,
  Trophy
} from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export default function Quizzes() {
  const [topic, setTopic] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('none');
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Active quiz state
  const [questions, setQuestions] = useState<Question[]>([]);

  const documents = [
    { id: '1', title: 'cs_capstone_rag_design.pdf' },
    { id: '2', title: 'spaced_repetition_sm2.txt' }
  ];

  const handleGenerateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setQuizStarted(false);
    setQuizCompleted(false);

    // Simulate quiz construction via API
    setTimeout(() => {
      let generatedQuestions: Question[] = [];
      const queryTopic = topic.toLowerCase() || (selectedDocId === '1' ? 'rag design' : 'spaced repetition');

      if (queryTopic.includes('rag') || queryTopic.includes('vector') || selectedDocId === '1') {
        generatedQuestions = [
          {
            question: "What is the primary role of a Vector Database in a RAG pipeline?",
            options: [
              "Encrypt text documents on local disks",
              "Execute similarity search on text embedding coordinate values",
              "Compile source files into binary executables",
              "Maintain user session access control metrics"
            ],
            correctOptionIndex: 1,
            explanation: "Vector databases index embeddings and compute mathematical similarity scores (like cosine similarity) to extract chunks matching queries."
          },
          {
            question: "How does Retrieval-Augmented Generation prevent LLM hallucinations?",
            options: [
              "By hard-coding neural connection parameters",
              "By expanding the training epochs of the foundation model",
              "By grounding the LLM's prompt context with verified retrieved document chunks",
              "By censoring questions relating to untested subject modules"
            ],
            correctOptionIndex: 2,
            explanation: "RAG retrieves specific context blocks containing facts and instructs the model to rely only on the retrieved facts for final answers."
          },
          {
            question: "What metric is commonly calculated to evaluate text semantic matching?",
            options: [
              "Alphabetical character indexing difference",
              "Cosine Similarity",
              "Line break occurrence count",
              "File format storage volume in kilobytes"
            ],
            correctOptionIndex: 1,
            explanation: "Cosine Similarity evaluates the angular difference between vectors. Close angular alignments represent matching semantic contexts."
          }
        ];
      } else {
        generatedQuestions = [
          {
            question: "In the SM-2 spaced repetition model, what interval maps to repetition count = 1?",
            options: ["1 Day", "6 Days", "14 Days", "Determined entirely by Ease Factor"],
            correctOptionIndex: 1,
            explanation: "The SuperMemo SM-2 algorithm sets repetition index 0 interval to 1 day, index 1 interval to 6 days, and index 2+ intervals calculated via EF."
          },
          {
            question: "What is the consequence of selecting a review grade below 3 on an active card?",
            options: [
              "The ease factor immediately doubles",
              "The repetition count resets to 0 and the schedule interval defaults back to 1 day",
              "The card is deleted from active decks",
              "The scheduling interval extends by a factor of 2.5"
            ],
            correctOptionIndex: 1,
            explanation: "Grades 0-2 mean the student failed to recall the answer. The SM-2 algorithm resets repetitions to zero and schedules it for review next day."
          },
          {
            question: "What is the default Ease Factor index assigned to new cards in the SM-2 algorithm?",
            options: ["1.3", "2.0", "2.5", "3.0"],
            correctOptionIndex: 2,
            explanation: "SuperMemo SM-2 initializes the starting Ease Factor (EF) parameter for all newly created flashcards at 2.5."
          }
        ];
      }

      setQuestions(generatedQuestions.slice(0, questionCount));
      setGenerating(false);
      setQuizStarted(true);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsAnswered(false);
    }, 1500);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    setIsAnswered(true);
    if (selectedOption === questions[currentIndex].correctOptionIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
      setQuizStarted(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  const activeQuestion = questions[currentIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-130px)]">
      
      {/* Sidebar Form Controls */}
      <div className="lg:col-span-1 glass-panel rounded-2xl p-5 flex flex-col justify-between overflow-y-auto">
        <form onSubmit={handleGenerateQuiz} className="space-y-5">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Quiz Generator</h2>
            <span className="text-xs text-slate-400">Instantly generate test mockups</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Generate From Topic</label>
            <input 
              type="text" 
              placeholder="e.g. Operating Systems semaphores"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="glass-input text-xs w-full"
              disabled={generating || quizStarted}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Or Ground in Document</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-slate-900/60 border border-white/5 text-xs text-white rounded-lg px-3 py-2.5 w-full outline-none focus:border-primary"
              disabled={generating || quizStarted}
            >
              <option value="none">-- Select study file --</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Question Volume</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="bg-slate-900/60 border border-white/5 text-xs text-white rounded-lg px-3 py-2.5 w-full outline-none focus:border-primary"
              disabled={generating || quizStarted}
            >
              <option value="3">3 questions</option>
              <option value="5">5 questions</option>
              <option value="10">10 questions</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={generating || (!topic.trim() && selectedDocId === 'none')}
            className="w-full glow-btn py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {generating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Constructing Quiz...
              </>
            ) : (
              <>
                <Award className="h-3.5 w-3.5" />
                Generate Adaptive Quiz
              </>
            )}
          </button>
        </form>

        <div className="border-t border-white/5 pt-5 mt-6 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <BookOpen className="h-4 w-4" />
            <span>Structured JSON Mode</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The platform queries the generative models inside Express endpoints, requesting schema validation output matching JSON quiz targets.
          </p>
        </div>
      </div>

      {/* Main Canvas - Quiz Workspace */}
      <div className="lg:col-span-3 glass-panel rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[450px]">
        
        {quizStarted && activeQuestion ? (
          <div className="w-full max-w-xl space-y-6">
            
            {/* Header statistics info */}
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-white/5 pb-4">
              <span className="font-semibold uppercase tracking-wider text-[10px] bg-slate-900 border border-white/5 px-2.5 py-1 rounded">Question {currentIndex + 1} of {questions.length}</span>
              <span className="font-mono">Current Score: <strong className="text-accent-emerald">{score}/{questions.length}</strong></span>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h3 className="font-display font-bold text-lg md:text-xl text-white leading-relaxed flex items-start gap-2.5">
                <HelpCircle className="h-5.5 w-5.5 text-primary shrink-0 mt-0.5" />
                {activeQuestion.question}
              </h3>
            </div>

            {/* Multiple Choice Options List */}
            <div className="space-y-2.5">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === activeQuestion.correctOptionIndex;
                
                let optionStyle = "bg-white/[0.01] border-white/5 text-slate-300 hover:bg-white/[0.03]";
                if (isSelected) {
                  optionStyle = "bg-primary/10 border-primary/40 text-white font-medium";
                }
                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle = "bg-accent-emerald/10 border-accent-emerald/40 text-accent-emerald font-semibold";
                  } else if (isSelected) {
                    optionStyle = "bg-accent-rose/10 border-accent-rose/40 text-accent-rose";
                  } else {
                    optionStyle = "bg-white/[0.005] border-white/5 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl border text-xs flex items-center justify-between transition-all ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrectOption && <Check className="h-4 w-4 text-accent-emerald" />}
                    {isAnswered && isSelected && !isCorrectOption && <X className="h-4 w-4 text-accent-rose" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation / Footer controller */}
            <div className="pt-4 space-y-4">
              {isAnswered ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 text-xs text-slate-400 leading-relaxed">
                    <strong className="text-white block mb-1">Answer Explanation:</strong>
                    💡 {activeQuestion.explanation}
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full glow-btn py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:scale-[1.01]"
                  >
                    {currentIndex === questions.length - 1 ? 'Finish Quiz Review' : 'Next Question'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50 disabled:pointer-events-none"
                >
                  Submit Answer Choice
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

          </div>
        ) : quizCompleted ? (
          <div className="text-center py-10 max-w-sm space-y-6 animate-fade-in">
            <div className="h-16 w-16 bg-accent-amber/10 border border-accent-amber/20 text-accent-amber rounded-full flex items-center justify-center mx-auto shadow-glow-purple">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">Quiz Completed!</h3>
              <p className="text-slate-400 text-sm mt-1.5">
                Awesome! You scored <strong className="text-accent-emerald">{score} out of {questions.length}</strong> questions correctly ({Math.round((score / questions.length) * 100)}%).
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button 
                onClick={handleRetakeQuiz}
                className="px-5 py-2.5 bg-white text-black hover:scale-105 transition-all text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retake Quiz
              </button>
              <button 
                onClick={() => {
                  setQuizStarted(false);
                  setQuizCompleted(false);
                }}
                className="px-5 py-2.5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-medium rounded-xl"
              >
                Configure New
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-xs space-y-3">
            <Award className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="font-display font-bold text-white">Adaptive Quizzing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use the sidebar form to generate customized exam mockups matching your study requirements.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
