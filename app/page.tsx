'use client';

import React, { useState } from 'react';
import { ParkoursProvider, useParkours } from '../lib/context';
import { Navbar } from '../components/Navbar';
import { HomeworkBoard } from '../components/HomeworkBoard';
import { GradeBook } from '../components/GradeBook';
import { Leaderboard } from '../components/Leaderboard';
import { RewardsStore } from '../components/RewardsStore';
import { AdminPanel } from '../components/AdminPanel';

function MainContent() {
  const [activeTab, setActiveTab] = useState<string>('homework');
  const { currentUser } = useParkours();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'homework' && <HomeworkBoard />}
        {activeTab === 'grades' && <GradeBook />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'rewards' && <RewardsStore />}
        {activeTab === 'admin' && <AdminPanel setActiveTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Parkours Hub</span>
            <span>• Plateforme de Tutorat & Suivi des Devoirs</span>
          </div>
          <div className="text-slate-400">
            Connecté en tant que : <span className="text-indigo-400 font-semibold">{currentUser.name}</span> ({currentUser.role === 'teacher' ? 'Prof' : 'Élève'})
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <ParkoursProvider>
      <MainContent />
    </ParkoursProvider>
  );
}
