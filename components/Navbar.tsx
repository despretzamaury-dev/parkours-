'use client';

import React from 'react';
import { useParkours } from '../lib/context';
import { RotateCcw, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, users, setCurrentUserId, resetToDemoData } = useParkours();

  const navItems = [
    { id: 'admin', label: 'Espace Tuteur' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'remuneration', label: 'Rémunération' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1E3A5F] border-b border-[#173354] shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:h-16 md:py-0">
          
          <div className="flex items-center gap-8 w-full md:w-auto mb-4 md:mb-0 justify-between md:justify-start">
            {/* Logo Brand */}
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="font-bold text-2xl tracking-tight">T. Parkours</span>
            </div>

            {/* Navigation Items (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#173354] text-white'
                        : 'text-slate-300 hover:bg-[#173354] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Profile Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#173354] rounded-full px-4 py-2 text-sm border border-[#1E3A5F]">
              <span className="text-lg">{currentUser.avatar}</span>
              <span className="font-semibold">{currentUser.name}</span>
            </div>

            <div className="relative group">
              <button
                className="p-2 rounded-full hover:bg-[#173354] text-slate-300 hover:text-white transition-colors"
                aria-label="Réglages"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button
                  onClick={resetToDemoData}
                  className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser Démo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto gap-1 pb-3 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#173354] text-white'
                    : 'text-slate-300 hover:bg-[#173354] hover:text-white'
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
