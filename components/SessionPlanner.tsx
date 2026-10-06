'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
import { CheckCircle2, Minus, FileText } from 'lucide-react';

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
  const { users, addBonusPoints, addTutorSession } = useParkours();
  const students = users.filter((u) => u.role === 'student');

  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionDuration, setSessionDuration] = useState<number>(1.5); // 1h30

  const [activeSubjects, setActiveSubjects] = useState<string[]>([]);
  const [classTasks, setClassTasks] = useState<Record<string, string>>({});
  const [studentProgress, setStudentProgress] = useState<Record<string, Record<string, 'none' | 'partial' | 'done'>>>({});
  const [studentBehavior, setStudentBehavior] = useState<Record<string, string>>({});
  const [report, setReport] = useState<string | null>(null);
  
  const [toastMsg, setToastMsg] = useState('');

  React.useEffect(() => {
    const saved = localStorage.getItem('parkours_session_planner_state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.activeSubjects) setActiveSubjects(data.activeSubjects);
        if (data.classTasks) setClassTasks(data.classTasks);
        if (data.studentProgress) setStudentProgress(data.studentProgress);
        if (data.studentBehavior) setStudentBehavior(data.studentBehavior);
      } catch (e) {}
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('parkours_session_planner_state', JSON.stringify({
      activeSubjects, classTasks, studentProgress, studentBehavior
    }));
  }, [activeSubjects, classTasks, studentProgress, studentBehavior]);

  const resetPlanner = () => {
    if (confirm('Voulez-vous vraiment effacer le tableau pour préparer une nouvelle séance ?')) {
      setActiveSubjects([]);
      setClassTasks({});
      setStudentProgress({});
      setStudentBehavior({});
      setReport(null);
      localStorage.removeItem('parkours_session_planner_state');
    }
  };

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

  const handleBehaviorChange = (studentId: string, value: string) => {
    setStudentBehavior(prev => ({
      ...prev,
      [studentId]: value
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

  const generateReport = () => {
    let reportText = "Bonjour,\n\nLa séance est terminée.\n\n";
    let totalXpGiven = 0;

    students.forEach(student => {
      const behavior = studentBehavior[student.id] || "Comportement correct";
      const progress = studentProgress[student.id] || {};
      
      const doneSubjects = activeSubjects.filter(sub => progress[sub] === 'done');
      const leftSubjects = activeSubjects.filter(sub => progress[sub] === 'partial' || progress[sub] === 'none');
      
      const doneText = doneSubjects.length > 0 ? doneSubjects.join(", ") : "Aucun devoir finalisé";
      const leftText = leftSubjects.length > 0 ? leftSubjects.join(", ") : "Tout a été terminé !";

      reportText += `• ${student.name} :\n  Comportement : ${behavior}\n  A fait : ${doneText}\n  Reste à faire pour demain : ${leftText}\n\n`;

      // Give 10 XP for each done subject
      if (doneSubjects.length > 0) {
        addBonusPoints(student.id, 0, doneSubjects.length * 10);
        totalXpGiven += doneSubjects.length * 10;
      }
    });

    const remuneration = sessionDuration * 17;

    addTutorSession({
      date: sessionDate,
      durationHours: sessionDuration,
      remuneration: remuneration,
      reportText: reportText
    });

    reportText += "Bien à vous,\nVotre Tuteur.";
    setReport(reportText);
    
    setToastMsg(`Séance terminée ! Le compte rendu est prêt et ${totalXpGiven} XP ont été distribués aux élèves.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold tracking-tight text-2xl font-bold text-black">
            CRÉER UNE SÉANCE
          </h3>
          <p className="text-xs text-slate-700 font-bold mt-1 mb-4">
            Préparez votre séance, suivez les élèves et générez le compte rendu.
          </p>
        </div>
        <button 
          onClick={resetPlanner}
          className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-md px-3 py-2 shrink-0"
        >
          Effacer le tableau
        </button>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Date de la séance</label>
            <input 
              type="date" 
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Durée (en heures)</label>
            <input 
              type="number" 
              step="0.5"
              min="0.5"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(Number(e.target.value))}
              className="px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 w-24"
            />
          </div>
          <div className="flex items-end">
            <div className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-sm font-semibold">
              Rémunération : {(sessionDuration * 17).toFixed(2)} €
            </div>
          </div>
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

      {/* ETAPE 2: PROGRAMME */}
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

      {/* ETAPE 3: TABLEAU DE SUIVI */}
      {activeSubjects.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h4 className="text-sm font-bold text-black">3. Suivi et Comportement</h4>
            <button onClick={generateReport} className="neo-btn-primary py-1.5 px-4 text-xs">
              <FileText className="w-4 h-4" /> TERMINER LA SÉANCE
            </button>
          </div>
          
          <div className="overflow-x-auto border border-slate-200 bg-white">
            <table className="w-full text-left text-xs font-bold border-collapse min-w-max">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 border-r border-slate-200 sticky left-0 bg-slate-50 z-10 w-48">ÉLÈVE</th>
                  <th className="p-3 border-r border-slate-200 w-48">COMPORTEMENT</th>
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
                    <td className="p-2 border-r border-slate-200">
                      <input 
                        type="text" 
                        placeholder="Ex: Agité..."
                        value={studentBehavior[student.id] || ''}
                        onChange={(e) => handleBehaviorChange(student.id, e.target.value)}
                        className="w-full p-2 border border-slate-200 font-normal focus:outline-none focus:border-blue-500 rounded-sm bg-white"
                      />
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
                            {status === 'none' && <div className="w-5 h-5 border-2 border-slate-300 rounded-sm bg-white"></div>}
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

      {/* REPORT MODAL / DISPLAY */}
      {report && (
        <div className="mt-6 p-6 border border-slate-200 rounded-xl bg-slate-50 space-y-4">
          <h4 className="font-semibold text-lg text-black">Compte-rendu de séance généré</h4>
          <textarea 
            className="w-full h-80 p-4 text-sm font-sans border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 resize-none bg-white shadow-sm"
            value={report}
            onChange={(e) => setReport(e.target.value)}
          />
          <p className="text-xs text-slate-500 italic">Vous pouvez modifier ce texte puis le copier pour l'envoyer. L'XP a déjà été attribuée automatiquement aux élèves.</p>
        </div>
      )}

      {activeSubjects.length === 0 && (
        <div className="text-center text-xs font-bold text-slate-500 py-8 italic border-2 border-dashed border-slate-300 rounded-xl">
          Sélectionnez au moins une matière pour préparer la séance.
        </div>
      )}
    </div>
  );
};
