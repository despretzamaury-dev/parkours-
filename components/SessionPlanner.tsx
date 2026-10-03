'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
import { CheckCircle2, Minus } from 'lucide-react';

const SUBJECTS = [
  'Maths',
  'Français',
  'Histoire-Géo',
  'SVT',
  'Physique',
  'Anglais',
  'Allemand',
  'Techno',
  'Musique'
];

export const SessionPlanner: React.FC = () => {
  const { users, addHomework } = useParkours();
  const students = users.filter((u) => u.role === 'student');

  // No subjects selected by default
  const [activeSubjects, setActiveSubjects] = useState<string[]>([]);
  
  // State: subject -> task string
  const [classTasks, setClassTasks] = useState<Record<string, string>>({});
  
  // State: studentId -> subject -> status ('none' | 'partial' | 'done')
  const [studentProgress, setStudentProgress] = useState<Record<string, Record<string, 'none' | 'partial' | 'done'>>>({});
  
  const [toastMsg, setToastMsg] = useState('');

  const toggleSubject = (sub: string) => {
    setActiveSubjects(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleTaskChange = (subject: string, value: string) => {
    setClassTasks(prev => ({
      ...prev,
      [subject]: value
    }));
  };

  const toggleStudentProgress = (studentId: string, subject: string) => {
    setStudentProgress(prev => {
      const current = prev[studentId]?.[subject] || 'none';
      let next: 'none' | 'partial' | 'done' = 'none';
      if (current === 'none') next = 'partial';
      else if (current === 'partial') next = 'done';
      else next = 'none';

      return {
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [subject]: next
        }
      };
    });
  };

  const handlePlanSession = () => {
    let homeworkCount = 0;
    
    Object.entries(classTasks).forEach(([subject, taskDesc]) => {
      if (taskDesc.trim() && activeSubjects.includes(subject)) {
        addHomework({
          title: `Séance - ${subject}`,
          subject: subject as any, 
          description: taskDesc,
          dueDate: new Date().toISOString().split('T')[0],
          xpReward: 50,
          assignedTo: ['all'],
        });
        homeworkCount++;
      }
    });
    
    setToastMsg(`${homeworkCount} tâche(s) ajoutée(s) aux devoirs de la classe !`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="font-semibold tracking-tight text-2xl font-bold text-black">
          PLANIFICATION & SUIVI DE SÉANCE
        </h3>
        <p className="text-xs text-slate-700 font-bold mt-1">
          1. Sélectionnez les matières. 2. Précisez le programme. 3. Suivez l'avancement des élèves en direct.
        </p>
      </div>

      {toastMsg && (
        <div className="p-3 bg-[#E8F5E9] border border-slate-200 text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ETAPE 1: SELECTION DES MATIERES */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-black">1. Matières de la séance</h4>
        <div className="flex flex-wrap gap-3">
          {SUBJECTS.map(sub => (
            <label key={sub} className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none bg-slate-50 border border-slate-200 px-3 py-1 hover:bg-blue-50 transition-colors">
              <input 
                type="checkbox" 
                checked={activeSubjects.includes(sub)} 
                onChange={() => toggleSubject(sub)}
                className="w-4 h-4 accent-[#FF4D00] cursor-pointer"
              />
              {sub}
            </label>
          ))}
        </div>
      </div>

      {/* ETAPE 2: PROGRAMME (uniquement pour les matières sélectionnées) */}
      {activeSubjects.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-black">2. Programme (Pour toute la classe)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSubjects.map(sub => (
              <div key={sub} className="border border-slate-200 flex flex-col bg-white">
                <div className="bg-slate-50 p-2 border-b border-slate-200 font-semibold text-xs text-center flex items-center justify-between">
                  <span>{sub}</span>
                </div>
                <textarea 
                  placeholder={`Travail à faire en ${sub}...`}
                  className="w-full h-20 p-3 text-xs font-normal bg-transparent focus:bg-blue-50 focus:outline-none resize-none transition-colors"
                  value={classTasks[sub] || ''}
                  onChange={(e) => handleTaskChange(sub, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ETAPE 3: TABLEAU DE SUIVI (Double entrée) */}
      {activeSubjects.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h4 className="text-sm font-bold text-black">3. Suivi des élèves (Tableau)</h4>
            <button onClick={handlePlanSession} className="neo-btn-primary py-1.5 px-4 text-xs">
              VALIDER & AJOUTER AUX DEVOIRS
            </button>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 bg-white">
            <table className="w-full text-left text-xs font-bold border-collapse min-w-max">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 border-r border-slate-200 sticky left-0 bg-slate-50 z-10 w-48">ÉLÈVE</th>
                  {activeSubjects.map(sub => (
                    <th key={sub} className="p-3 border-r border-slate-200 text-center min-w-[120px]">
                      {sub}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b border-slate-200 last:border-b-0 group">
                    <td className="p-3 border-r border-slate-200 sticky left-0 bg-white z-10 group-hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{student.avatar}</span>
                        <span className="font-semibold">{student.name}</span>
                      </div>
                    </td>
                    {activeSubjects.map(sub => {
                      const status = studentProgress[student.id]?.[sub] || 'none';
                      const bgClass = status === 'done' ? 'bg-[#E8F5E9]' : status === 'partial' ? 'bg-blue-50' : 'bg-white hover:bg-slate-50';
                      
                      return (
                        <td 
                          key={sub} 
                          className={`p-0 border-r border-slate-200 last:border-r-0 cursor-pointer transition-colors ${bgClass}`}
                          onClick={() => toggleStudentProgress(student.id, sub)}
                        >
                          <div className="w-full h-full min-h-[3.5rem] flex items-center justify-center">
                            {status === 'done' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                            {status === 'partial' && <Minus className="w-8 h-8 text-blue-600" />}
                            {status === 'none' && <div className="w-5 h-5 border-2 border-slate-300 rounded-sm"></div>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubjects.length === 0 && (
        <div className="text-center text-xs font-bold text-slate-500 py-8 italic border-2 border-dashed border-slate-300">
          Sélectionnez au moins une matière pour commencer la planification.
        </div>
      )}
    </div>
  );
};
