'use client';

import React from 'react';
import { useParkours } from '../lib/context';
import { RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, users, setCurrentUserId, resetToDemoData } = useParkours();

  const isTeacher = currentUser.role === 'teacher';

  const navItems = [
    { id: 'homework', label: 'DEVOIRS' },
    { id: 'grades', label: 'CARNET DE NOTES' },
    { id: 'leaderboard', label: 'CLASSEMENT' },
    { id: 'rewards', label: 'RÉCOMPENSES' },
    ...(isTeacher ? [{ id: 'admin', label: 'ESPACE PROF' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FF4D00] border-2 border-black flex items-center justify-center font-bebas text-2xl font-black text-white shadow-[3px_3px_0px_#000000]">
              PH
            </div>
            <div>
              <span className="font-bebas text-3xl font-black tracking-wide text-black block leading-none">
                PARKOURS HUB
              </span>
              <span className="font-mono-custom text-[10px] uppercase tracking-widest text-slate-600 font-bold block mt-0.5">
                CLASSE DE 5ÈME • TUTORAT
              </span>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`font-bebas text-lg tracking-wider transition-all relative py-2 ${
                    isActive
                      ? 'text-black font-black border-b-4 border-[#FF4D00]'
                      : 'text-slate-600 hover:text-black font-bold'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Profile Selector */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-white border-2 border-black shadow-[3px_3px_0px_#000000] px-3 py-1.5 font-mono-custom text-xs font-bold">
              <span className="mr-2 text-base">{currentUser.avatar}</span>
              <div className="mr-3">
                <span className="font-bebas text-base font-black tracking-wide uppercase text-black block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-[#FF4D00] font-mono-custom font-extrabold uppercase block">
                  {isTeacher ? 'PROFESSEUR' : `5ÈME • ${currentUser.points} PTS`}
                </span>
              </div>

              <select
                value={currentUser.id}
                onChange={(e) => setCurrentUserId(e.target.value)}
                aria-label="Changer de profil élève ou professeur"
                className="bg-white text-xs font-mono-custom font-bold text-black border-l-2 border-black pl-2 py-1 focus:outline-none cursor-pointer"
              >
                <optgroup label="👨‍🏫 ENSEIGNANT">
                  {users
                    .filter((u) => u.role === 'teacher')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (Tuteur)
                      </option>
                    ))}
                </optgroup>
                <optgroup label="🎓 ÉLÈVES DE 5ÈME">
                  {users
                    .filter((u) => u.role === 'student')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (5ème - {u.points} pts)
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <button
              onClick={resetToDemoData}
              title="Réinitialiser les données"
              className="p-2 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#FF4D00] hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto gap-2 py-2 border-t-2 border-black no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-bebas text-sm whitespace-nowrap px-3 py-1 border-2 border-black ${
                  isActive
                    ? 'bg-[#FF4D00] text-white shadow-[2px_2px_0px_#000000]'
                    : 'bg-white text-black'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
