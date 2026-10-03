'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
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

  const students = users.filter((u) => u.role === 'student');

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
    <div className="space-y-8 font-mono-custom">
      {/* HEADER CARD */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[5px_5px_0px_#000000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-1">
              GESTION PÉDAGOGIQUE • ADMIN
            </span>
            <h1 className="font-bebas text-4xl sm:text-5xl font-black text-black tracking-wide leading-none uppercase">
              ESPACE PROFESSEUR
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-2 max-w-xl">
              Pilotez la classe de 5ème, attribuez des devoirs, distribuez des points bonus et notez les travaux.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={resetToDemoData} className="neo-btn-secondary text-xs">
              <RotateCcw className="w-4 h-4" /> RÉINITIALISER DÉMO
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toastMsg && (
        <div className="p-4 bg-[#E8F5E9] border-2 border-black shadow-[4px_4px_0px_#000] text-xs font-bold text-emerald-950 flex items-center gap-2 uppercase">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            ÉLÈVES EN 5ÈME
          </span>
          <div className="font-bebas text-4xl font-black text-black mt-1">
            {students.length} ÉLÈVES
          </div>
        </div>

        <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#FF4D00]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            CORRECTIONS EN ATTENTE
          </span>
          <div className="font-bebas text-4xl font-black text-[#FF4D00] mt-1">
            {pendingCorrections} DEVOIRS
          </div>
        </div>

        <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#D81B60]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            RÉCOMPENSES À VALIDER
          </span>
          <div className="font-bebas text-4xl font-black text-black mt-1">
            {pendingRedemptions} DEMANDES
          </div>
        </div>

        <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#10B981]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            MOYENNE DE CLASSE
          </span>
          <div className="font-bebas text-4xl font-black text-emerald-800 mt-1">
            {classAvg ? `${classAvg} / 20` : 'SANS NOTE'}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000000] space-y-4">
        <h3 className="font-bebas text-2xl font-black text-black uppercase">
          ACTIONS RAPIDES TUTEUR
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('homework')}
            className="border-2 border-black p-4 bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between shadow-[3px_3px_0px_#000]"
          >
            <div>
              <span className="font-bebas text-xl font-black text-black block uppercase">
                📋 DONNER UN DEVOIR
              </span>
              <span className="text-[10px] font-bold text-slate-600 uppercase">
                CRÉER UNE FICHE OU UN TP
              </span>
            </div>
            <Plus className="w-5 h-5 text-black" />
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className="border-2 border-black p-4 bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between shadow-[3px_3px_0px_#000]"
          >
            <div>
              <span className="font-bebas text-xl font-black text-black block uppercase">
                📊 ENTRER UNE NOTE
              </span>
              <span className="text-[10px] font-bold text-slate-600 uppercase">
                AJOUTER DANS LE CARNET
              </span>
            </div>
            <Award className="w-5 h-5 text-black" />
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className="border-2 border-black p-4 bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between shadow-[3px_3px_0px_#000]"
          >
            <div>
              <span className="font-bebas text-xl font-black text-black block uppercase">
                🎁 GÉRER RÉCOMPENSES
              </span>
              <span className="text-[10px] font-bold text-slate-600 uppercase">
                VALIDER OU CRÉER DES CADEAUX
              </span>
            </div>
            <Gift className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* STUDENT LIST TABLE */}
      <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000000] space-y-4">
        <h3 className="font-bebas text-2xl font-black text-black uppercase">
          LISTE DES ÉLÈVES DE 5ÈME (POINTS À ZÉRO)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-black uppercase">
                <th className="pb-3">ÉLÈVE</th>
                <th className="pb-3">CLASSE</th>
                <th className="pb-3 text-center">NIVEAU</th>
                <th className="pb-3 text-center">POINTS DISPO</th>
                <th className="pb-3 text-center">TOTAL XP</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y border-black">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{student.avatar}</span>
                      <div>
                        <span className="font-extrabold uppercase text-black">{student.name}</span>
                        <div className="text-[10px] text-slate-600">{student.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 uppercase text-black font-extrabold">
                    <span className="neo-badge bg-[#FFF3E0]">{student.classGroup}</span>
                  </td>

                  <td className="py-3 text-center font-bebas text-xl font-black">
                    NIV. {student.level}
                  </td>

                  <td className="py-3 text-center font-bebas text-xl font-black text-black">
                    {student.points} PTS
                  </td>

                  <td className="py-3 text-center font-bebas text-xl font-black text-[#FF4D00]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono-custom">
          <div className="bg-white border-2 border-black w-full max-w-md p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="font-bebas text-2xl font-black text-black">
                ATTRIBUER UN BONUS
              </h2>
              <button
                onClick={() => setBonusModalStudentId(null)}
                className="text-black font-bold text-xl hover:text-[#FF4D00]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGiveBonus} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">ÉLÈVE BÉNÉFICIAIRE</label>
                <div className="border-2 border-black p-2 bg-[#FAF7F2] font-extrabold text-sm uppercase">
                  {students.find((s) => s.id === bonusModalStudentId)?.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">
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
                  className="w-full px-3 py-2 border-2 border-black font-bebas text-2xl font-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">RAISON / REMARQUE</label>
                <input
                  type="text"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-black">
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
