"use client";

import React, { useState } from 'react';
import { 
  User, 
  Terminal, 
  Settings, 
  Award, 
  Sparkles, 
  ArrowUpRight, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  Database,
  Code2,
  ChevronRight,
  Workflow
} from 'lucide-react';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<'bio' | 'challenges' | 'resume'>('bio');

  const challenges = [
    {
      id: "pdf",
      title: "PDF Text Extraction & Parsing Quirks",
      problem: "Standard top-to-bottom text parsing of academic papers was extracting page numbers, headers, side columns, and bibliography footnotes as a single running stream of sentences, splitting paragraphs in non-linear order and injecting junk characters.",
      solution: "Implemented bounding-box coordinate tracking to filter out header/footer boundaries. Set up paragraph rebuilding heuristics to ignore line-wrap hyphenations. Wrote custom sanitizers to ignore large bibliography segments to preserve generative tokens.",
      icon: BookOpen,
      iconColor: "text-accent-cyan",
      bgGlow: "rgba(6, 182, 212, 0.05)"
    },
    {
      id: "rag",
      title: "RAG Implementation Design",
      problem: "Long chapters exceeded foundation model prompt context bounds. Sending raw unchunked textbooks triggered high API latency, token limit failures, and caused models to hallucinate answers matching unrelated sections.",
      solution: "Slipped texts into 600-character segments utilizing a sliding overlap window of 120 characters. The overlap ensures phrases near boundaries (like formulas) stay intact. Chunks are converted to float arrays using Gemini text-embedding-004 to create unified coordinate vectors.",
      icon: Workflow,
      iconColor: "text-primary",
      bgGlow: "rgba(99, 102, 241, 0.05)"
    },
    {
      id: "vector",
      title: "Vector Search Distance Tuning",
      problem: "Semantic search was returning chunks from different modules that shared keywords but were contextually irrelevant, resulting in dilution of the generated answer.",
      solution: "Configured metadata category indexing in Pinecone (filtering by userId and documentId). Switched from Euclidean L2 distance calculations to Cosine Similarity metrics, focusing search on angular semantic orientation rather than keyword volume. Calibrated retrieval count limit top-k = 3.",
      icon: Cpu,
      iconColor: "text-accent-emerald",
      bgGlow: "rgba(16, 185, 129, 0.05)"
    },
    {
      id: "auth",
      title: "Authentication Security Heuristics",
      problem: "API routes for RAG queries and quiz results were vulnerable to resource theft. Malicious queries could scrape another user's processed vector database index by altering ID payloads.",
      solution: "Integrated stateless JWT auth signatures stored in secure HTTP-only cookies on the backend. Implemented server-side verify layers matching request headers with relational Prisma queries, ensuring documentId ownership matches request token sub prior to vector database lookups.",
      icon: ShieldCheck,
      iconColor: "text-accent-rose",
      bgGlow: "rgba(244, 63, 94, 0.05)"
    },
    {
      id: "perf",
      title: "Performance & Rendering Optimization",
      problem: "Simultaneous rendering of charts, interactive quiz loops, and 3D card calculations was causing page load lag and visual layouts shift (CLS) under slow mobile environments.",
      solution: "Enforced lazy loading boundaries in Next.js for Recharts modules. Implemented local state pagination for document indices to limit DOM node complexity. Optimized Tailwind transitions by targeting transforms instead of layout layouts.",
      icon: Settings,
      iconColor: "text-accent-amber",
      bgGlow: "rgba(245, 158, 11, 0.05)"
    },
    {
      id: "db",
      title: "Relational Database Design Decisions",
      problem: "Tracking spaced repetition spacing (intervals, confidence repetitions, ease factors) required complex join lookups, overloading relational tables when querying flashcards.",
      solution: "Created strict indexes in PostgreSQL via Prisma models for deckId and dueDate keys. Modeled questions as a single JSON column in the Quiz schema, avoiding unnecessary join statements for secondary options while ensuring optimal schema consistency.",
      icon: Database,
      iconColor: "text-secondary",
      bgGlow: "rgba(139, 92, 246, 0.05)"
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Developer Header Banner Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden bg-gradient-radial from-indigo-950/20 to-transparent">
        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-2xl -z-10" />
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="h-20 w-20 rounded-2xl bg-active-gradient flex items-center justify-center text-white text-3xl font-bold font-display shadow-glow-indigo">
            PM
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-none">PODUGU MUKESH</h1>
              <span className="inline-block text-[10px] bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-semibold uppercase tracking-wider mx-auto sm:mx-0">
                AI Integration Engineer
              </span>
            </div>
            <span className="text-sm text-slate-300 font-semibold block">Full Stack Developer & AI Solutions Architect</span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Specializing in robust Next.js environments, vector databases, Express systems, and pipeline orchestration. Focused on building state-of-the-art interactive platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="flex border-b border-white/5 p-1 gap-2 bg-slate-950/20 rounded-xl max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('bio')}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'bio' 
              ? 'bg-white text-black font-bold shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Project Vision
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'challenges' 
              ? 'bg-white text-black font-bold shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Technical Challenges
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'resume' 
              ? 'bg-white text-black font-bold shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Resume Ready Specs
        </button>
      </div>

      {/* Main Tabs Workspace Canvas */}
      <div className="space-y-6">
        
        {/* Tab 1: Project Vision & Details */}
        {activeTab === 'bio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <Sparkles className="h-4.5 w-4.5" />
                <span>Underlying Project Vision</span>
              </div>
              <blockquote className="text-base md:text-lg text-slate-200 italic border-l-2 border-primary pl-4 py-1 leading-relaxed">
                "To help students learn more effectively by combining modern AI technologies with practical study tools such as note generation, document analysis, quizzes, flashcards, and personalized study planning."
              </blockquote>
              <p className="text-xs text-slate-400 leading-relaxed">
                This platform was conceptualized to address the fragmentation of learning aids. By designing a cohesive local monorepo that encapsulates document chunking, semantic similarity metrics, spaced repetition algorithms, and interactive widgets, the tool operates as a comprehensive, AI-assisted companion for computer science students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-sm text-white">System Architecture Overview</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The architecture comprises a Next.js client communicating with a modular Node/Express server. Text streams parsed from documents are converted to mathematical embeddings via Gemini and persisted into Pinecone namespaces. Generative queries pull these chunks as grounding prompts to prevent hallucinations.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-sm text-white">Key Engineering Highlights</h3>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li>Custom text parsers with coordinate filters.</li>
                  <li>Spaced repetition mathematically modeled via SuperMemo SM-2.</li>
                  <li>Prisma ORM schema matching PostgreSQL targets.</li>
                  <li>Recharts-driven dynamic learning speed tracking.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Challenges Walkthrough (Crucial requirement!) */}
        {activeTab === 'challenges' && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-l-2 border-white/5 pl-4 pb-2">
              <h2 className="font-display font-bold text-lg text-white">Engineering Decisions & Challenges</h2>
              <p className="text-xs text-slate-400 mt-1">Realistic summaries of problems resolved during the platform's multi-stage development cycles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((chal, idx) => {
                const Icon = chal.icon;
                return (
                  <div 
                    key={chal.id}
                    className="glass-panel p-5 rounded-xl space-y-3 relative overflow-hidden flex flex-col justify-between"
                    style={{ background: `linear-gradient(135deg, ${chal.bgGlow} 0%, rgba(17, 17, 28, 0.45) 100%)` }}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg bg-slate-900 border border-white/5 ${chal.iconColor}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">{chal.title}</h3>
                      </div>
                      
                      <div className="text-[11px] space-y-2">
                        <p className="text-slate-300">
                          <strong className="text-accent-rose">Problem: </strong>
                          {chal.problem}
                        </p>
                        <p className="text-slate-400">
                          <strong className="text-accent-emerald">Solution: </strong>
                          {chal.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Resume Ready Specifications */}
        {activeTab === 'resume' && (
          <div className="glass-panel p-6 rounded-2xl space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">AI Study Assistant Platform</h2>
              <span className="text-[11px] text-primary font-mono block mt-1">
                Tech Stack: Next.js, TypeScript, Node.js, Express.js, PostgreSQL, Prisma, Gemini API, Pinecone, Tailwind CSS
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-white/5 pb-2">Key Achievements</h3>
              
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <strong>AI-Powered PDF Summarization & Document Chat:</strong> Implemented a robust RAG (Retrieval-Augmented Generation) pipeline using Gemini API for vector embeddings (text-embedding-004) and text generation, backed by a Pinecone vector index for high-speed similarity search context fetching.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <strong>Active Recall & Spaced Repetition Modules:</strong> Built an automated flashcard engine that leverages SuperMemo SM-2 algorithms to schedule study intervals dynamically based on student recall metrics, flattening the forgetting curve.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <strong>Relational Schema Design & API Services:</strong> Designed and deployed standard backend structures featuring express controllers and TypeScript decorators with a structured PostgreSQL schema using Prisma ORM models.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <strong>Student Analytics Dashboard:</strong> Created an interactive frontend using Recharts analytics tracking focus logs, subject mastery indexes, and progress tracking visualizations in a premium glassmorphic dashboard layout.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="text-xs text-slate-400">Ready to add directly to your professional CV!</span>
              </div>
              <button 
                onClick={() => alert("Copied Resume details to clipboard! (Simulated)")}
                className="px-3.5 py-1.5 bg-white text-black hover:bg-slate-200 transition-colors text-[10px] font-bold rounded-lg shrink-0"
              >
                Copy Content
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
