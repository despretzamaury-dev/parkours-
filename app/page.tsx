'use client';

import React, { useState } from 'react';
import { ParkoursProvider, useParkours } from '../lib/context';
import { Navbar } from '../components/Navbar';
import { HomeworkBoard } from '../components/HomeworkBoard';
import { GradeBook } from '../components/GradeBook';
import { Leaderboard } from '../components/Leaderboard';
import { AdminPanel } from '../components/AdminPanel';

function MainContent() {
  const [activeTab, setActiveTab] = useState<string>('homework');
  const { currentUser } = useParkours();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#1E3A5F] selection:text-white">
      {/* Header Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'homework' && <HomeworkBoard />}
        {activeTab === 'grades' && <GradeBook />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'admin' && <AdminPanel setActiveTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-600 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">T. Parkours</span>
            <span>• Plateforme de Tutorat</span>
          </div>
          <div>
            Connecté en tant que : <span className="font-semibold text-[#1E3A5F] bg-slate-100 px-2 py-1 rounded-md">{currentUser.name}</span> ({currentUser.role === 'teacher' ? 'Tuteur' : 'Élève'})
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
