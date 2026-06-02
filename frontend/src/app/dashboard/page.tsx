"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  FileText, 
  Layers, 
  Award, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  Play, 
  Plus, 
  CheckCircle,
  FileQuestion,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [studySessions, setStudySessions] = useState([
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 4.0 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 3.5 },
    { name: 'Fri', hours: 5.0 },
    { name: 'Sat', hours: 2.0 },
    { name: 'Sun', hours: 4.5 },
  ]);
  const [courseData, setCourseData] = useState([
    { subject: 'OS', score: 88 },
    { subject: 'DBMS', score: 95 },
    { subject: 'AI', score: 78 },
    { subject: 'Networks', score: 85 },
    { subject: 'Automata', score: 72 },
  ]);

  // Simulated live Pomodoro tracker
  const [isStudying, setIsStudying] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 minutes
  const [sessionSubject, setSessionSubject] = useState('Operating Systems');
  const [studyLogs, setStudyLogs] = useState([
    { id: 1, subject: 'Operating Systems', duration: 25, focusScore: 8, date: 'Today' },
    { id: 2, subject: 'Database Indexes', duration: 50, focusScore: 9, date: 'Yesterday' },
    { id: 3, subject: 'RAG Semantic Search', duration: 90, focusScore: 10, date: '2 days ago' },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isStudying && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      // Completed session
      setIsStudying(false);
      setTimerSeconds(1500);
      
      // Append completed log
      const newLog = {
        id: studyLogs.length + 1,
        subject: sessionSubject,
        duration: 25,
        focusScore: Math.floor(Math.random() * 3) + 8, // Score between 8-10
        date: 'Just Now'
      };
      setStudyLogs([newLog, ...studyLogs]);
      
      // Update charts hours
      const dayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDayName = days[dayIndex];
      setStudySessions(prev => prev.map(day => {
        if (day.name === currentDayName) {
          return { ...day, hours: Number((day.hours + 0.42).toFixed(1)) };
        }
        return day;
      }));
      
      alert(`🎉 Excellent session! Added 25 minutes study focus log for ${sessionSubject}.`);
    }
    return () => clearInterval(interval);
  }, [isStudying, timerSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartStudy = () => {
    setIsStudying(!isStudying);
  };

  return (
    <div className="space-y-8">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Student Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, Mukes! Here is your learning progress for today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/pdf-chat" className="glow-btn px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Upload Document
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl text-primary">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Focus Hours</span>
            <span className="text-2xl font-bold font-display mt-0.5 block">24.5h</span>
            <span className="text-[10px] text-accent-emerald flex items-center mt-0.5 font-medium">
              +12% this week
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-accent-cyan/10 border border-accent-cyan/20 p-3.5 rounded-xl text-accent-cyan">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Documents Indexed</span>
            <span className="text-2xl font-bold font-display mt-0.5 block">12 Files</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">3 active PDF workspaces</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-secondary/10 border border-secondary/20 p-3.5 rounded-xl text-secondary">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Flashcards</span>
            <span className="text-2xl font-bold font-display mt-0.5 block">85 Cards</span>
            <span className="text-[10px] text-accent-rose flex items-center mt-0.5 font-medium">
              15 review cards due
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-accent-amber/10 border border-accent-amber/20 p-3.5 rounded-xl text-accent-amber">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Average Quiz Score</span>
            <span className="text-2xl font-bold font-display mt-0.5 block">83.6%</span>
            <span className="text-[10px] text-accent-emerald flex items-center mt-0.5 font-medium">
              Top 10% of class
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Charts Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study focus hours chart */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Focus Time Analytics</h3>
                <span className="text-xs text-slate-400">Total minutes studied day-by-day</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/5 font-semibold text-slate-300">Weekly</span>
            </div>
            
            <div className="h-64 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studySessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-slate-900/50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading graphs...</div>
              )}
            </div>
          </div>

          {/* Academic subject performance chart */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Subject Mastery Rating</h3>
                <span className="text-xs text-slate-400">Mock quiz correct percentile tracking by class module</span>
              </div>
            </div>

            <div className="h-60 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}
                      itemStyle={{ color: '#c084fc' }}
                    />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-slate-900/50 animate-pulse rounded-lg" />
              )}
            </div>
          </div>
        </div>

        {/* Right Side Control Panel */}
        <div className="space-y-6">
          {/* Active Pomodoro Timer Workspace */}
          <div className="glass-panel p-6 rounded-2xl border border-primary/20 bg-gradient-radial from-indigo-950/20 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <h3 className="font-display font-bold text-md text-white">Active Focus Session</h3>
            </div>
            
            <div className="text-center py-6">
              <div className="text-5xl font-mono font-bold tracking-tight text-white select-none">
                {formatTime(timerSeconds)}
              </div>
              
              <div className="mt-4">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1.5">Focus Module Subject</label>
                <select 
                  disabled={isStudying}
                  value={sessionSubject}
                  onChange={(e) => setSessionSubject(e.target.value)}
                  className="bg-slate-900/60 border border-white/5 text-xs text-white rounded-lg px-2.5 py-1.5 w-full text-center outline-none focus:border-primary"
                >
                  <option value="Operating Systems">Operating Systems (Semaphores)</option>
                  <option value="Database Indexes">Database Indexes (B-Trees)</option>
                  <option value="RAG Semantic Search">RAG Semantic Search (Cosine)</option>
                  <option value="Artificial Intelligence">Gemini LLM Prompting</option>
                </select>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button 
                  onClick={handleStartStudy}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isStudying 
                      ? 'bg-accent-rose text-white hover:scale-95 shadow-lg shadow-accent-rose/25' 
                      : 'bg-white text-black hover:scale-105 shadow-lg shadow-white/10'
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {isStudying ? 'Pause Focus' : 'Start Focus Session'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick study recommendation cards */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-display font-bold text-md text-white mb-4">Study Pathway Tips</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 border-b border-white/5 pb-3">
                <div className="h-8 w-8 rounded-lg bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center shrink-0 text-accent-amber">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Review Due Flashcards</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">15 active recall cards are due for SM-2 scheduling.</p>
                  <Link href="/flashcards" className="text-[11px] text-primary font-semibold flex items-center gap-0.5 mt-1 hover:underline">
                    Start review session <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="flex gap-3 border-b border-white/5 pb-3">
                <div className="h-8 w-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0 text-accent-cyan">
                  <FileQuestion className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Take Operating Systems Mock</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Test your comprehension on Semaphores and Deadlocks.</p>
                  <Link href="/quizzes" className="text-[11px] text-accent-cyan font-semibold flex items-center gap-0.5 mt-1 hover:underline">
                    Generate quiz <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center shrink-0 text-accent-emerald">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">AI Planner Schedule</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Next priority: Study 'B-Trees' indexed database chapters.</p>
                  <Link href="/planner" className="text-[11px] text-accent-emerald font-semibold flex items-center gap-0.5 mt-1 hover:underline">
                    Open planner <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Study logs timeline */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-display font-bold text-md text-white mb-4">Focus Activity Logs</h3>
            <div className="space-y-3">
              {studyLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2.5 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{log.subject}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{log.date} • Rating: {log.focusScore}/10</span>
                  </div>
                  <span className="font-semibold text-primary">+{log.duration} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
