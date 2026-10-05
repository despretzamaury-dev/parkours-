'use client';

import React, { useState, useEffect } from 'react';
import { useParkours } from '../lib/context';
import { SessionPlanner } from './SessionPlanner';
import { Play, UserCheck, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  setActiveTab: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ setActiveTab }) => {
  const { users } = useParkours();
  const students = React.useMemo(() => {
    return [...users.filter((u) => u.role === 'student')].sort((a, b) => b.totalXp - a.totalXp);
  }, [users]);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('parkours_student_notes');
    if (saved) {
      try {
        setStudentNotes(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const updateNote = (id: string, note: string) => {
    const newNotes = { ...studentNotes, [id]: note };
    setStudentNotes(newNotes);
    localStorage.setItem('parkours_student_notes', JSON.stringify(newNotes));
  };

  if (isSessionActive) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setIsSessionActive(false)}
          className="text-sm font-bold text-slate-500 hover:text-black mb-4 flex items-center gap-2"
        >
          ← Retour à l'accueil
        </button>
        <SessionPlanner />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-slate-600 block mb-1">
            ACCUEIL TUTEUR
          </span>
          <h1 className="font-semibold tracking-tight text-4xl sm:text-5xl font-bold text-black tracking-wide leading-none">
            VOTRE GROUPE
          </h1>
          <p className="text-xs text-slate-700 font-bold mt-2 max-w-xl">
            Retrouvez le profil de vos élèves et préparez votre séance.
          </p>
        </div>
        <button 
          onClick={() => setIsSessionActive(true)}
          className="neo-btn-primary py-4 px-8 text-lg font-bold flex items-center gap-3 whitespace-nowrap"
        >
          <Play className="w-6 h-6" />
          DÉMARRER LA SÉANCE
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold tracking-tight text-2xl font-bold text-black flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" />
          PROFILS & DIFFICULTÉS
        </h3>
        <p className="text-xs text-slate-700 font-bold">
          Notez ici les particularités de chaque élève pour adapter votre pédagogie (ex: TDAH, difficultés en maths, etc.)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {students.map((student) => (
            <div key={student.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex gap-4">
              <div className="text-4xl">{student.avatar}</div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-black text-lg">{student.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold tracking-wider">NIVEAU {student.level}</div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mb-1">
                    <AlertCircle className="w-3 h-3" />
                    NOTES / DIFFICULTÉS
                  </label>
                  <textarea 
                    value={studentNotes[student.id] || ''}
                    onChange={(e) => updateNote(student.id, e.target.value)}
                    placeholder="Ex: A du mal à se concentrer..."
                    className="w-full text-xs font-medium p-2 border border-slate-200 rounded focus:outline-none focus:border-blue-500 resize-none h-16"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
