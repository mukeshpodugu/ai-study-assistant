"use client";

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Award, 
  Calendar, 
  ArrowRight, 
  BrainCircuit,
  Database,
  Search,
  Sparkles,
  GitBranch,
  Terminal
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: "PDF Study Room (RAG)",
      desc: "Upload complex study materials or text lectures and chat with them. AI extracts semantically matching segments dynamically to ground responses.",
      icon: BookOpen,
      color: "text-accent-cyan",
      bgGlow: "rgba(6, 182, 212, 0.06)"
    },
    {
      title: "Active Recall Decks",
      desc: "Practice active recall with automatically generated flashcards. Spaced repetition engine computes optimized review cycles utilizing the SM-2 algorithm.",
      icon: Layers,
      color: "text-primary",
      bgGlow: "rgba(99, 102, 241, 0.06)"
    },
    {
      title: "Adaptive Quiz Workspace",
      desc: "Instantly compile customized multiple-choice tests from text files. Get instantaneous marking summaries alongside detailed answer explanations.",
      icon: Award,
      color: "text-secondary",
      bgGlow: "rgba(139, 92, 246, 0.06)"
    },
    {
      title: "Study Planner Roadmap",
      desc: "Coordinate upcoming syllabus exams. AI analyzes study deadlines to generate structured study path templates and active revision schedules.",
      icon: Calendar,
      color: "text-accent-emerald",
      bgGlow: "rgba(16, 185, 129, 0.06)"
    }
  ];

  const technologies = [
    { name: "Next.js", desc: "React Framework", icon: Sparkles },
    { name: "Express.js", desc: "API Service Layer", icon: Terminal },
    { name: "PostgreSQL", desc: "Database Schema", icon: Database },
    { name: "Pinecone", desc: "Vector Index Store", icon: Search },
    { name: "Gemini AI", desc: "Generative Models", icon: BrainCircuit },
    { name: "Git Control", desc: "Milestone Commits", icon: GitBranch }
  ];

  return (
    <div className="min-h-screen relative bg-[#06060c] text-white flex flex-col justify-between overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-radial-gradient from-indigo-900/20 to-transparent blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-radial-gradient from-violet-900/15 to-transparent blur-3xl -z-10" />
      
      {/* Header bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-active-gradient p-2 rounded-xl shadow-glow-indigo">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl leading-none">OmniStudy AI</span>
        </div>
        <Link 
          href="/dashboard" 
          className="px-4 py-2 text-sm rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
        >
          Developer Hub
        </Link>
      </header>

      {/* Hero section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col items-center text-center relative z-10 flex-1 justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-slow">
          <Sparkles className="h-3 w-3" />
          Full-Stack Capstone Project
        </div>
        
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight leading-[1.1] max-w-4xl mb-6">
          The Intelligent Learning Platform for <span className="glow-text">Modern Students</span>
        </h1>
        
        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Unlock maximum study efficiency. Generate smart revision notes, run semantic searches, test yourself with active recall cards, and map your exam path in one interactive hub.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full justify-center px-4">
          <Link href="/dashboard" className="glow-btn px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-base font-semibold group">
            Launch Workspace Dashboard
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="/portfolio" 
            className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-base font-medium text-slate-300 hover:text-white"
          >
            Review Developer Portfolio
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left mb-24">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${feat.bgGlow} 0%, rgba(17, 17, 28, 0.45) 100%)` }}
              >
                <div className={`p-3 rounded-xl bg-slate-900 border border-white/5 inline-flex ${feat.color} mb-5`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Technology stack presentation */}
        <div className="w-full border-t border-white/5 pt-16">
          <h2 className="font-display font-bold text-2xl mb-4">Under the Hood Architecture</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-10">
            Designed as a high-fidelity academic project reflecting real full-stack software development and vector query search parameters.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 w-full">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={idx} className="glass-panel py-5 px-3 rounded-xl flex flex-col items-center justify-center border border-white/5">
                  <Icon className="h-5 w-5 text-primary mb-2.5" />
                  <span className="text-sm font-semibold text-white block">{tech.name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{tech.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-8 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>OmniStudy AI - Developed as an Academic Portfolio Project</span>
          <div className="flex items-center gap-2.5 font-medium text-slate-300">
            <span>Developer:</span>
            <Link href="/portfolio" className="text-primary hover:underline">PODUGU MUKESH</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
