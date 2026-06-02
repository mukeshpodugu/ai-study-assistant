"use client";

import React, { useState } from 'react';
import { 
  Layers, 
  RotateCw, 
  CheckCircle, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  explanation: string;
  interval: number;
  repetition: number;
  easeFactor: number;
}

export default function Flashcards() {
  const [decks, setDecks] = useState([
    { id: '1', title: 'Operating Systems (Semaphores)', cardCount: 5 },
    { id: '2', title: 'Retrieval-Augmented Generation (RAG)', cardCount: 4 }
  ]);
  const [selectedDeckId, setSelectedDeckId] = useState('1');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deckCompleted, setDeckCompleted] = useState(false);
  
  // Custom stateful flashcards to simulate client-side SM-2 calculations
  const [cards, setCards] = useState<{ [key: string]: Flashcard[] }>({
    '1': [
      { id: '101', front: "What is a Semaphore in Operating Systems?", back: "An integer variable used for signaling and solving critical section problems in concurrent threads.", explanation: "It supports wait() (decrement) and signal() (increment) atomic operations.", interval: 1, repetition: 0, easeFactor: 2.5 },
      { id: '102', front: "Explain the difference between Mutex and Semaphore.", back: "Mutex is a locking mechanism (binary) used to synchronize access, whereas a Semaphore is a signaling mechanism (counting).", explanation: "Only the thread that locked the Mutex can unlock it; any thread can signal a Semaphore.", interval: 1, repetition: 0, easeFactor: 2.5 },
      { id: '103', front: "What is a Deadlock?", back: "A state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.", explanation: "Requires 4 conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.", interval: 1, repetition: 0, easeFactor: 2.5 },
      { id: '104', front: "What is the Bankers Algorithm?", back: "A deadlock avoidance algorithm that simulates resource allocation to determine safety states before granting requests.", explanation: "Developed by Edsger Dijkstra, it checks safe execution paths for thread allocations.", interval: 1, repetition: 0, easeFactor: 2.5 },
      { id: '105', front: "Explain CPU Thrashing.", back: "A state where the CPU spends more time swapping virtual memory pages in and out of disk storage than executing actual processes.", explanation: "Occurs when local page working sets are not fully loaded in physical RAM.", interval: 1, repetition: 0, easeFactor: 2.5 }
    ],
    '2': [
      { id: '201', front: "What is Retrieval-Augmented Generation (RAG)?", back: "An architecture that optimizes LLM answers by querying vector storage indexes for context matching user queries.", explanation: "Mitigates hallucinations without retraining weight parameters.", interval: 1, repetition: 0, easeFactor: 2.5 },
      { id: '202', front: "What is the standard dimensionality of Gemini text embeddings?", back: "768 dimensions (for text-embedding-004 model), representing linguistic semantics.", explanation: "Allows accurate distance comparisons inside vector database indexes.", interval: 1, repetition: 0, easeFactor: 2.5 },
      { id: '203', front: "Why chunk text documents with overlap?", back: "Ensures sentence context borders are not broken when splitting paragraphs, preserving indexing accuracy.", explanation: "Typically configured as 500-600 characters with 10-20% overlap margins.", interval: 1, repetition: 0, easeFactor: 2.5 },
      { id: '204', front: "What index distance metric does RAG search prefer?", back: "Cosine Similarity, dot product, or Euclidean distance mapping vector orientations.", explanation: "Cosine captures relative semantic alignment rather than raw word counts.", interval: 1, repetition: 0, easeFactor: 2.5 }
    ]
  });

  const activeCards = cards[selectedDeckId] || [];
  const currentCard = activeCards[currentIndex];

  /**
   * Spaced Repetition SM-2 computation simulation
   */
  const handleReviewFeedback = (grade: number) => {
    if (!currentCard) return;

    let interval = currentCard.interval;
    let repetition = currentCard.repetition;
    let easeFactor = currentCard.easeFactor;

    // SM-2 Spaced Repetition Math Logic
    if (grade >= 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    } else {
      repetition = 0;
      interval = 1;
    }

    // Recalculate ease factor
    easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    // Update active card instance state
    const updatedCards = activeCards.map((c, i) => {
      if (i === currentIndex) {
        return {
          ...c,
          interval,
          repetition,
          easeFactor: Number(easeFactor.toFixed(2))
        };
      }
      return c;
    });

    setCards({
      ...cards,
      [selectedDeckId]: updatedCards
    });

    // Advance index
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < activeCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setDeckCompleted(true);
      }
    }, 200);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setDeckCompleted(false);
    setIsFlipped(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-130px)]">
      
      {/* Sidebar - Decks and Instructions */}
      <div className="lg:col-span-1 glass-panel rounded-2xl p-5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Active Decks</h2>
            <span className="text-xs text-slate-400">Select deck to run active recall</span>
          </div>

          <div className="space-y-2">
            {decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => {
                  setSelectedDeckId(deck.id);
                  setCurrentIndex(0);
                  setDeckCompleted(false);
                  setIsFlipped(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  selectedDeckId === deck.id 
                    ? 'bg-primary/10 border-primary/40 text-white' 
                    : 'bg-white/[0.01] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className={`h-4.5 w-4.5 ${selectedDeckId === deck.id ? 'text-primary' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold block truncate max-w-[150px]">{deck.title}</span>
                </div>
                <span className="text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-slate-300 font-semibold shrink-0">
                  {deck.cardCount} cards
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm metrics documentation panel */}
        <div className="border-t border-white/5 pt-5 mt-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>Spaced Repetition Stats</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Reviews schedule items using the **SuperMemo SM-2** algorithm:
          </p>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-[10px] text-slate-300 font-mono space-y-1">
            <div>reps = 0: interval = 1d</div>
            <div>reps = 1: interval = 6d</div>
            <div>reps &gt; 1: interval = I * EF</div>
            <div className="text-[9px] text-slate-500 pt-1">EF (Ease Factor) adjusts based on grade (0-5).</div>
          </div>
        </div>
      </div>

      {/* Main Workspace - 3D Flashcard Canvas */}
      <div className="lg:col-span-3 glass-panel rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
        
        {deckCompleted ? (
          <div className="text-center py-10 max-w-sm space-y-6 animate-fade-in">
            <div className="h-16 w-16 bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald rounded-full flex items-center justify-center mx-auto shadow-glow-emerald">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">Deck Completed!</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                Fantastic job. The spaced repetition scheduler has updated the next due dates for these active recall cards.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button 
                onClick={handleResetDeck}
                className="px-5 py-2.5 bg-white text-black hover:scale-105 transition-all text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Review Again
              </button>
            </div>
          </div>
        ) : currentCard ? (
          <div className="w-full max-w-xl flex flex-col items-center space-y-8">
            
            {/* Header progress info */}
            <div className="w-full flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px] bg-slate-900 border border-white/5 px-2.5 py-1 rounded">Card {currentIndex + 1} of {activeCards.length}</span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span>Repetitions: <strong className="text-primary">{currentCard.repetition}</strong></span>
                <span>Ease Factor: <strong className="text-secondary">{currentCard.easeFactor}</strong></span>
                <span>Interval: <strong className="text-accent-cyan">{currentCard.interval}d</strong></span>
              </div>
            </div>

            {/* Flashcard 3D structure */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-80 perspective-1000 cursor-pointer select-none group"
            >
              <div className={`relative w-full h-full duration-500 preserve-3d shadow-glass rounded-3xl border border-white/5 bg-slate-900/60 ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden flex flex-col justify-between p-8">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-widest bg-primary/10 px-2 py-0.5 rounded">Active Recall Query</span>
                    <RotateCw className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  
                  <div className="text-center py-4">
                    <h3 className="font-display font-bold text-xl md:text-2xl text-white leading-snug">
                      {currentCard.front}
                    </h3>
                  </div>

                  <span className="text-[11px] text-slate-400 text-center block font-medium">Click card to reveal definition answer</span>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-between p-8 bg-slate-900/40">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-secondary uppercase font-bold tracking-widest bg-secondary/10 px-2 py-0.5 rounded font-display">Grounded Explanation</span>
                    <RotateCw className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>

                  <div className="text-center py-4 space-y-3">
                    <h4 className="font-medium text-base text-white leading-relaxed">
                      {currentCard.back}
                    </h4>
                    {currentCard.explanation && (
                      <p className="text-xs text-slate-400 bg-white/[0.02] border border-white/5 p-2 rounded-xl text-left leading-relaxed">
                        💡 {currentCard.explanation}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 text-center block">Rate your recall accuracy below to update SM-2 schedule</span>
                </div>

              </div>
            </div>

            {/* Spaced Repetition Grading controls */}
            <div className="w-full space-y-4">
              {isFlipped ? (
                <div className="animate-fade-in space-y-3">
                  <div className="grid grid-cols-4 gap-2.5">
                    <button 
                      onClick={() => handleReviewFeedback(1)}
                      className="px-3 py-3 text-xs font-semibold rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose hover:bg-accent-rose hover:text-white transition-all shadow-sm"
                    >
                      Again (Hard)
                    </button>
                    <button 
                      onClick={() => handleReviewFeedback(3)}
                      className="px-3 py-3 text-xs font-semibold rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-accent-amber hover:bg-accent-amber hover:text-white transition-all shadow-sm"
                    >
                      Hard (3)
                    </button>
                    <button 
                      onClick={() => handleReviewFeedback(4)}
                      className="px-3 py-3 text-xs font-semibold rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      Good (4)
                    </button>
                    <button 
                      onClick={() => handleReviewFeedback(5)}
                      className="px-3 py-3 text-xs font-semibold rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald hover:text-white transition-all shadow-sm"
                    >
                      Easy (5)
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center">Selecting a rating will immediately save intervals and prompt next card.</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  Reveal Answer Definition
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          <div className="text-slate-400 text-sm">Loading flashcard deck information...</div>
        )}
      </div>

    </div>
  );
}
