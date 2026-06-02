"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Award, 
  Calendar, 
  User, 
  GraduationCap, 
  Menu, 
  X,
  Code2
} from 'lucide-react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If path is landing page, render without standard dashboard sidebar
  const isLandingPage = pathname === '/';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'PDF Study Room', href: '/pdf-chat', icon: BookOpen },
    { name: 'Active Recall Cards', href: '/flashcards', icon: Layers },
    { name: 'Adaptive Quizzes', href: '/quizzes', icon: Award },
    { name: 'Study Planner', href: '/planner', icon: Calendar },
    { name: 'Developer Space', href: '/portfolio', icon: User },
  ];

  return (
    <html lang="en">
      <head>
        <title>OmniStudy AI | Intelligent Study Assistant Platform</title>
        <meta name="description" content="AI Study Assistant combining PDF parsing, RAG chat, SM-2 Spaced Repetition flashcards, quizzes, and planner scheduling. Built by PODUGU MUKESH." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>"/>
      </head>
      <body className="bg-background text-foreground min-h-screen">
        {isLandingPage ? (
          children
        ) : (
          <div className="flex min-h-screen relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="ambient-glow-1 absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full -z-10" />
            <div className="ambient-glow-2 absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full -z-10" />

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-card-border p-5 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div>
                <div className="flex items-center gap-3 mb-8 border-b border-card-border pb-5">
                  <div className="bg-active-gradient p-2.5 rounded-xl shadow-glow-indigo">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-lg leading-none tracking-tight block">OmniStudy AI</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1 block">Platform Workspace</span>
                  </div>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                          isActive 
                            ? 'bg-active-gradient text-white shadow-glow-indigo' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Developer Info Footer Tag */}
              <div className="border-t border-card-border pt-4 mt-auto">
                <Link href="/portfolio" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
                  <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                    <Code2 className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-semibold text-white block group-hover:text-primary transition-colors">PODUGU MUKESH</span>
                    <span className="text-[10px] text-slate-400 block truncate">Full Stack Developer & AI</span>
                  </div>
                </Link>
              </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex-1 flex flex-col min-w-0">
              <header className="lg:hidden glass-panel border-b border-card-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="font-display font-bold text-md">OmniStudy AI</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 rounded-lg border border-card-border text-slate-400 hover:text-white hover:bg-white/5"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </header>

              {/* Content Panel */}
              <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
