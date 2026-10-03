'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
import {
  Award,
  Plus,
  TrendingUp,
  BookOpen,
  Calendar,
  MessageSquare,
  Trash2,
  X,
  Check,
  BarChart3,
  CheckCircle,
} from 'lucide-react';

export const GradeBook: React.FC = () => {
  const { currentUser, users, grades, addGrade, deleteGrade } = useParkours();

  const isTeacher = currentUser.role === 'teacher';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    isTeacher ? 'student-come' : currentUser.id
  );

  const targetStudentId = isTeacher ? selectedStudentId : currentUser.id;
  const targetStudent = users.find((u) => u.id === targetStudentId) || users[1];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('Mathématiques');
  const [newTitle, setNewTitle] = useState('');
  const [newGradeVal, setNewGradeVal] = useState<number>(15);
  const [newCoeff, setNewCoeff] = useState<number>(2);
  const [newComment, setNewComment] = useState('');

  const studentGrades = grades.filter((g) => g.studentId === targetStudentId);

  const overallAverage = React.useMemo(() => {
    if (studentGrades.length === 0) return null;
    let totalPoints = 0;
    let totalCoeffs = 0;
    studentGrades.forEach((g) => {
      totalPoints += g.grade * g.coeff;
      totalCoeffs += g.coeff;
    });
    return totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : null;
  }, [studentGrades]);

  const subjectAverages = React.useMemo(() => {
    const map: Record<string, { total: number; coeffs: number; count: number }> = {};
    studentGrades.forEach((g) => {
      if (!map[g.subject]) {
        map[g.subject] = { total: 0, coeffs: 0, count: 0 };
      }
      map[g.subject].total += g.grade * g.coeff;
      map[g.subject].coeffs += g.coeff;
      map[g.subject].count += 1;
    });

    return Object.entries(map).map(([subject, data]) => ({
      subject,
      avg: (data.total / data.coeffs).toFixed(2),
      count: data.count,
    }));
  }, [studentGrades]);

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addGrade({
      studentId: targetStudentId,
      subject: newSubject,
      title: newTitle,
      grade: Number(newGradeVal),
      maxGrade: 20,
      coeff: Number(newCoeff) || 1,
      date: new Date().toISOString().split('T')[0],
      teacherComment: newComment,
    });

    setNewTitle('');
    setNewComment('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 font-mono-custom">
      {/* HEADER CARD */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[5px_5px_0px_#000000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-1">
              CARNET ACADÉMIQUE • TUTORAT
            </span>
            <h1 className="font-bebas text-4xl sm:text-5xl font-black text-black tracking-wide leading-none uppercase">
              CARNET DE NOTES
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-2">
              ÉLÈVE CONCERNÉ : <span className="text-black font-extrabold uppercase">{targetStudent.name}</span> ({targetStudent.classGroup})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isTeacher && (
              <div className="flex items-center gap-2 bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000]">
                <span className="text-xs font-bold uppercase">SÉLECTIONNER :</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-white text-xs font-bold text-black focus:outline-none cursor-pointer uppercase"
                >
                  {users
                    .filter((u) => u.role === 'student')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.classGroup})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {isTeacher && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="neo-btn-primary"
              >
                <Plus className="w-5 h-5" /> ENTRER UNE NOTE
              </button>
            )}
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#FF4D00]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              MOYENNE GÉNÉRALE
            </span>
            <div className="font-bebas text-4xl font-black text-black mt-1">
              {overallAverage ? `${overallAverage} / 20` : 'AUCUNE NOTE'}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1 uppercase">
              ÉVALUATION PÉDAGOGIQUE
            </p>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000000]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              TOTAL ÉVALUATIONS
            </span>
            <div className="font-bebas text-4xl font-black text-black mt-1">
              {studentGrades.length} <span className="text-lg text-slate-600">NOTES</span>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1 uppercase">
              ENREGISTRÉES EN BASE
            </p>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#10B981]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              APPRÉCIATION GLOBALE
            </span>
            <div className="font-bebas text-2xl font-black text-emerald-800 mt-1 uppercase">
              {overallAverage
                ? Number(overallAverage) >= 16
                  ? 'EXCELLENT WORK 🎉'
                  : Number(overallAverage) >= 14
                  ? 'TRÈS BON NIVEAU 🚀'
                  : Number(overallAverage) >= 12
                  ? 'ENSEMBLE SATISFAISANT 👍'
                  : 'PROGRESSION EN COURS 💪'
                : 'EN ATTENTE D\'ÉVALUATION'}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1 uppercase">SUIVI PAR LE TUTEUR</p>
          </div>
        </div>
      </div>

      {/* SUBJECT AVERAGES BARS */}
      {subjectAverages.length > 0 && (
        <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000000] space-y-4">
          <h3 className="font-bebas text-2xl font-black text-black uppercase">
            MOYENNES PAR MATIÈRE
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectAverages.map((item) => {
              const numAvg = Number(item.avg);
              const percentage = (numAvg / 20) * 100;
              return (
                <div key={item.subject} className="border-2 border-black p-4 bg-[#FAF7F2]">
                  <div className="flex items-center justify-between text-xs font-bold uppercase mb-2">
                    <span>{item.subject}</span>
                    <span className="font-bebas text-xl font-black text-black">{item.avg} / 20</span>
                  </div>

                  <div className="w-full h-3 bg-white border-2 border-black overflow-hidden">
                    <div
                      className="h-full bg-black"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED TABLE */}
      <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000000] space-y-4">
        <h3 className="font-bebas text-2xl font-black text-black uppercase">
          HISTORIQUE DÉTAILLÉ DES NOTES
        </h3>

        {studentGrades.length === 0 ? (
          <div className="py-8 text-center text-xs font-bold uppercase text-slate-600">
            AUCUNE NOTE ENREGISTRÉE POUR LE MOMENT POUR CET ÉLÈVE.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-black uppercase">
                  <th className="pb-3">DATE</th>
                  <th className="pb-3">MATIÈRE</th>
                  <th className="pb-3">INTITULÉ DE L&apos;ÉVALUATION</th>
                  <th className="pb-3 text-center">COEFF</th>
                  <th className="pb-3 text-center">NOTE / 20</th>
                  <th className="pb-3">COMMENTAIRE TUTEUR</th>
                  {isTeacher && <th className="pb-3 text-right">ACTION</th>}
                </tr>
              </thead>
              <tbody className="divide-y border-black">
                {studentGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FAF7F2]">
                    <td className="py-3 font-mono-custom text-slate-700">
                      {new Date(g.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3">
                      <span className="neo-badge bg-white">{g.subject}</span>
                    </td>
                    <td className="py-3 font-extrabold uppercase text-black">{g.title}</td>
                    <td className="py-3 text-center">x{g.coeff}</td>
                    <td className="py-3 text-center font-bebas text-2xl font-black text-black">
                      {g.grade} / {g.maxGrade}
                    </td>
                    <td className="py-3 italic text-slate-800">
                      {g.teacherComment ? `"${g.teacherComment}"` : '-'}
                    </td>
                    {isTeacher && (
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteGrade(g.id)}
                          className="text-black hover:text-[#FF4D00] p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ADD GRADE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono-custom">
          <div className="bg-white border-2 border-black w-full max-w-lg p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="font-bebas text-2xl font-black text-black">
                SAISIR UNE NOUVELLE NOTE
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-black font-bold text-xl hover:text-[#FF4D00]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">
                  ÉLÈVE CONCERNÉ *
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                >
                  {users
                    .filter((u) => u.role === 'student')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.classGroup})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">MATIÈRE *</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                  >
                    <option value="Mathématiques">MATHÉMATIQUES</option>
                    <option value="Physique-Chimie">PHYSIQUE-CHIMIE</option>
                    <option value="Français">FRANÇAIS</option>
                    <option value="Anglais">ANGLAIS</option>
                    <option value="Histoire-Géo">HISTOIRE-GÉO</option>
                    <option value="SVT">SVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">INTITULÉ *</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: DS CHAPITRE 4"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">NOTE SUR 20 *</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    required
                    value={newGradeVal}
                    onChange={(e) => setNewGradeVal(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-black font-bebas text-2xl font-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">COEFFICIENT *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={newCoeff}
                    onChange={(e) => setNewCoeff(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">COMMENTAIRE</label>
                <textarea
                  rows={3}
                  placeholder="Appréciation du tuteur..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="neo-btn-secondary"
                >
                  ANNULER
                </button>
                <button type="submit" className="neo-btn-primary">
                  ENREGISTRER LA NOTE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
