"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Clock, 
  AlertTriangle,
  Info,
  ChevronRight,
  Lightbulb,
  Loader2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  isCompleted: boolean;
  aiTips: string;
}

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Study Semaphore synchronization & mutual exclusions', 
      subject: 'Operating Systems', 
      dueDate: '2026-06-05', 
      priority: 'HIGH', 
      isCompleted: false,
      aiTips: 'Practice writing mutual exclusion pseudocode with Semaphores. Review safety states using dining philosophers models.'
    },
    { 
      id: '2', 
      title: 'Implement Pinecone vector indexing integration', 
      subject: 'RAG Design Capstone', 
      dueDate: '2026-06-08', 
      priority: 'HIGH', 
      isCompleted: false,
      aiTips: 'Run sample queries on Pinecone indices first to verify metadata filter configurations before coding endpoints.'
    },
    { 
      id: '3', 
      title: 'Review SuperMemo SM-2 intervals calculations', 
      subject: 'Algorithms', 
      dueDate: '2026-06-12', 
      priority: 'MEDIUM', 
      isCompleted: false,
      aiTips: 'Perform a manual walkthrough of changing intervals given consecutive review responses: grade=2 vs grade=5.'
    },
    { 
      id: '4', 
      title: 'Submit database design final report outline', 
      subject: 'DBMS', 
      dueDate: '2026-06-03', 
      priority: 'LOW', 
      isCompleted: true,
      aiTips: 'Make sure your entity relationship schema defines primary-foreign indexes explicitly for faster queries.'
    }
  ]);

  // Form input states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [aiSuggestions, setAiSuggestions] = useState(
    "Coordinate tasks by due dates. Start with the Operating Systems Semaphore study task immediately, as it is high priority and due in 3 days. Dedicate 45 minutes to coding vector embeddings for RAG thereafter."
  );
  const [updatingTips, setUpdatingTips] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    // Simulate AI tips creation
    const generatedTips = `Focus on active retrieval methods for ${subject}. Allocate 30 minutes to conceptual testing and review errors immediately.`;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      subject,
      dueDate,
      priority,
      isCompleted: false,
      aiTips: generatedTips
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setDueDate('');
    
    // Trigger simulated reload of central AI scheduler suggestions
    triggerAISuggestionsUpdate([...tasks, newTask]);
  };

  const triggerAISuggestionsUpdate = (currentTasks: Task[]) => {
    setUpdatingTips(true);
    setTimeout(() => {
      const active = currentTasks.filter(t => !t.isCompleted);
      if (active.length === 0) {
        setAiSuggestions("You have completed all pending tasks! Add upcoming exam dates or project checklists to trigger personalized study roadmaps.");
      } else {
        const topTask = active.find(t => t.priority === 'HIGH') || active[0];
        setAiSuggestions(`Dynamic Roadmap updated: Prioritize "${topTask.title}" (${topTask.subject}). Set aside two 25-minute Pomodoro focus blocks to test your active recall. Next, prepare for "${active[active.length-1].title}" scheduled due by ${active[active.length-1].dueDate}.`);
      }
      setUpdatingTips(false);
    }, 1000);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, isCompleted: !t.isCompleted };
      }
      return t;
    });
    setTasks(updated);
    triggerAISuggestionsUpdate(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    triggerAISuggestionsUpdate(updated);
  };

  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-130px)]">
      
      {/* Left side panel - Add task form & AI Roadmap advice */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Add task form */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="font-display font-bold text-base text-white">Create Task</h2>
            <span className="text-xs text-slate-400">Schedule a new study module checklist</span>
          </div>

          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Task / Chapter Title</label>
              <input 
                type="text" 
                placeholder="e.g. Study Dining Philosophers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Class Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-slate-900/60 border border-white/5 text-xs text-white rounded-lg px-3 py-2.5 w-full outline-none focus:border-primary"
              >
                <option value="Operating Systems">Operating Systems</option>
                <option value="DBMS">Database Systems</option>
                <option value="Algorithms">Data Structures & Algos</option>
                <option value="RAG Design Capstone">RAG Design Capstone</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-900/60 border border-white/5 text-xs text-white rounded-lg px-3 py-2 w-full outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="bg-slate-900/60 border border-white/5 text-xs text-white rounded-lg px-3 py-2.5 w-full outline-none focus:border-primary"
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full glow-btn py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Schedule Study Task
            </button>
          </form>
        </div>

        {/* AI study roadmap advisor panel */}
        <div className="glass-panel rounded-2xl p-5 border border-primary/20 bg-gradient-radial from-indigo-950/20 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <h3 className="font-display font-bold text-sm text-white">AI Roadmap Advisor</h3>
          </div>
          
          <div className="relative bg-slate-950/40 p-4 rounded-xl border border-white/5 min-h-[120px]">
            {updatingTips ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 rounded-xl">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>
            ) : null}
            <p className="text-xs text-slate-300 leading-relaxed">
              {aiSuggestions}
            </p>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-primary" />
            <span>Updated live based on due schedules.</span>
          </div>
        </div>

      </div>

      {/* Right side panel - Task Kanban List columns */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-5 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Study Planner Board</h2>
            <span className="text-xs text-slate-400">Track and manage daily study schedules</span>
          </div>
          <span className="text-xs bg-slate-900 border border-white/5 px-2.5 py-1 rounded text-slate-300 font-semibold font-mono">
            {activeTasks.length} pending • {completedTasks.length} completed
          </span>
        </div>

        {/* Task lists split panels */}
        <div className="space-y-6 flex-1">
          {/* Active columns */}
          <div>
            <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent-cyan" />
              <span>In Progress / Study Required</span>
            </h3>

            {activeTasks.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-xl py-8 text-center text-xs text-slate-500">
                All study blocks complete! Add tasks to begin.
              </div>
            ) : (
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative group"
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className="text-slate-400 hover:text-white shrink-0 mt-0.5"
                      >
                        <Square className="h-5.5 w-5.5" />
                      </button>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-200">{task.title}</span>
                          <span className="text-[9px] bg-slate-900 border border-white/5 text-slate-400 px-1.5 py-0.5 rounded font-semibold">{task.subject}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            task.priority === 'HIGH' 
                              ? 'bg-accent-rose/10 text-accent-rose border border-accent-rose/25' 
                              : task.priority === 'MEDIUM' 
                                ? 'bg-primary/10 text-primary border border-primary/25' 
                                : 'bg-slate-800 text-slate-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          Due: {task.dueDate}
                        </span>

                        {/* AI Tips toggle details */}
                        <div className="mt-2.5 bg-slate-950/20 p-2.5 rounded-lg border border-white/5 text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                          <Lightbulb className="h-3.5 w-3.5 text-accent-amber shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-300">AI study tips: </strong>
                            {task.aiTips}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-500 hover:text-accent-rose p-1 rounded transition-colors"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed column */}
          <div>
            <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-accent-emerald" />
              <span>Completed / Mastery Achieved</span>
            </h3>

            {completedTasks.length === 0 ? (
              <div className="border border-dashed border-white/5 rounded-xl py-6 text-center text-xs text-slate-600">
                No completed items logged yet. Finish tasks to populate.
              </div>
            ) : (
              <div className="space-y-2 opacity-60">
                {completedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-3 rounded-xl border border-white/5 bg-slate-900/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className="text-accent-emerald hover:text-white shrink-0"
                      >
                        <CheckSquare className="h-5.5 w-5.5 text-accent-emerald" />
                      </button>
                      <div>
                        <span className="text-xs text-slate-400 font-medium line-through block">{task.title}</span>
                        <span className="text-[9px] text-slate-500 block">{task.subject} • Completed</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-600 hover:text-accent-rose p-1 rounded"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
