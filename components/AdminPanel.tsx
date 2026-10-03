'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
import { SessionPlanner } from './SessionPlanner';
import {
  ShieldCheck,
  UserCheck,
  Plus,
  Sparkles,
  Award,
  BookOpen,
  Gift,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface AdminPanelProps {
  setActiveTab: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ setActiveTab }) => {
  const { users, homeworks, grades, redemptions, addBonusPoints, resetToDemoData } = useParkours();

  const students = React.useMemo(() => {
    return [...users.filter((u) => u.role === 'student')].sort((a, b) => b.totalXp - a.totalXp);
  }, [users]);

  const [bonusModalStudentId, setBonusModalStudentId] = useState<string | null>(null);
  const [bonusAmount, setBonusAmount] = useState<number>(50);
  const [bonusReason, setBonusReason] = useState<string>('Excellente participation au tutorat');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pendingCorrections = homeworks.reduce((acc, hw) => {
    const pending = Object.values(hw.submissions).filter((s) => s.status === 'submitted');
    return acc + pending.length;
  }, 0);

  const pendingRedemptions = redemptions.filter((r) => r.status === 'pending').length;

  const classAvg = React.useMemo(() => {
    if (grades.length === 0) return null;
    let totalPoints = 0;
    let totalCoeffs = 0;
    grades.forEach((g) => {
      totalPoints += g.grade * g.coeff;
      totalCoeffs += g.coeff;
    });
    return totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : null;
  }, [grades]);

  const handleGiveBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusModalStudentId) return;

    const student = students.find((s) => s.id === bonusModalStudentId);
    if (!student) return;

    addBonusPoints(bonusModalStudentId, Number(bonusAmount), Number(bonusAmount));

    setToastMsg(`+${bonusAmount} POINTS ATTRIBUÉS À ${student.name.toUpperCase()} ! 🎉`);
    setBonusModalStudentId(null);

    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold tracking-widest text-slate-600 block mb-1">
              GESTION PÉDAGOGIQUE • ADMIN
            </span>
            <h1 className="font-semibold tracking-tight text-4xl sm:text-5xl font-bold text-black tracking-wide leading-none">
              ESPACE TUTEUR
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-2 max-w-xl">
              Pilotez la classe de 5ème, attribuez des devoirs, distribuez des points bonus et notez les travaux.
            </p>
          </div>

        </div>
      </div>

      {/* TOAST */}
      {toastMsg && (
        <div className="p-4 bg-[#E8F5E9] border border-slate-200 shadow-sm text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold tracking-wider text-slate-600 block">
            ÉLÈVES EN 5ÈME
          </span>
          <div className="font-semibold tracking-tight text-4xl font-bold text-black mt-1">
            {students.length} ÉLÈVES
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold tracking-wider text-slate-600 block">
            CORRECTIONS EN ATTENTE
          </span>
          <div className="font-semibold tracking-tight text-4xl font-bold text-blue-600 mt-1">
            {pendingCorrections} DEVOIRS
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold tracking-wider text-slate-600 block">
            MOYENNE DE CLASSE
          </span>
          <div className="font-semibold tracking-tight text-4xl font-bold text-emerald-800 mt-1">
            {classAvg ? `${classAvg} / 20` : 'SANS NOTE'}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold tracking-tight text-2xl font-bold text-black">
          ACTIONS RAPIDES TUTEUR
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab('homework')}
            className="border border-slate-200 p-4 bg-slate-50 hover:bg-white transition-all text-left flex items-center justify-between shadow-sm"
          >
            <div>
              <span className="font-semibold tracking-tight text-xl font-bold text-black block">
                📋 DONNER UN DEVOIR
              </span>
              <span className="text-[10px] font-bold text-slate-600">
                CRÉER UNE FICHE OU UN TP
              </span>
            </div>
            <Plus className="w-5 h-5 text-black" />
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className="border border-slate-200 p-4 bg-slate-50 hover:bg-white transition-all text-left flex items-center justify-between shadow-sm"
          >
            <div>
              <span className="font-semibold tracking-tight text-xl font-bold text-black block">
                📊 ENTRER UNE NOTE
              </span>
              <span className="text-[10px] font-bold text-slate-600">
                AJOUTER DANS LE CARNET
              </span>
            </div>
            <Award className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* SESSION PLANNER */}
      <SessionPlanner />

      {/* STUDENT LIST TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold tracking-tight text-2xl font-bold text-black">
          CLASSEMENT DES ÉLÈVES
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-black">
                <th className="pb-3 text-center w-16">RANG</th>
                <th className="pb-3">ÉLÈVE</th>
                <th className="pb-3">CLASSE</th>
                <th className="pb-3 text-center">NIVEAU</th>
                <th className="pb-3 text-center">POINTS DISPO</th>
                <th className="pb-3 text-center">TOTAL XP</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y border-slate-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="py-3 text-center font-semibold tracking-tight text-xl font-bold text-slate-500">
                    #{index + 1}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{student.avatar}</span>
                      <div>
                        <span className="font-semibold text-black">{student.name}</span>
                        <div className="text-[10px] text-slate-600">{student.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-black font-semibold">
                    <span className="neo-badge bg-blue-50">{student.classGroup}</span>
                  </td>

                  <td className="py-3 text-center font-semibold tracking-tight text-xl font-bold">
                    NIV. {student.level}
                  </td>

                  <td className="py-3 text-center font-semibold tracking-tight text-xl font-bold text-black">
                    {student.points} PTS
                  </td>

                  <td className="py-3 text-center font-semibold tracking-tight text-xl font-bold text-blue-600">
                    {student.totalXp} XP
                  </td>

                  <td className="py-3 text-right">
                    <button
                      onClick={() => setBonusModalStudentId(student.id)}
                      className="neo-btn-primary py-1 px-3 text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> BONUS PTS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: BONUS POINTS */}
      {bonusModalStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-semibold tracking-tight text-2xl font-bold text-black">
                ATTRIBUER UN BONUS
              </h2>
              <button
                onClick={() => setBonusModalStudentId(null)}
                className="text-black font-bold text-xl hover:text-blue-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGiveBonus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">ÉLÈVE BÉNÉFICIAIRE</label>
                <div className="border border-slate-200 p-2 bg-slate-50 font-semibold text-sm">
                  {students.find((s) => s.id === bonusModalStudentId)?.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  NOMBRE DE POINTS & XP À AJOUTER *
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  step="10"
                  required
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 font-semibold tracking-tight text-2xl font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">RAISON / REMARQUE</label>
                <input
                  type="text"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setBonusModalStudentId(null)}
                  className="neo-btn-secondary"
                >
                  ANNULER
                </button>
                <button type="submit" className="neo-btn-primary">
                  CONFIRMER LE BONUS 🎉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
