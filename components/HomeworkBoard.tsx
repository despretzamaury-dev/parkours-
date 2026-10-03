'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
import { Homework } from '../lib/types';
import confetti from 'canvas-confetti';
import {
  Plus,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Calendar,
  Send,
  Trash2,
  BookOpen,
} from 'lucide-react';

const SUBJECT_STYLES: Record<string, { badgeBg: string; text: string }> = {
  Mathématiques: {
    badgeBg: 'bg-[#FF4D00]',
    text: 'text-white',
  },
  'Physique-Chimie': {
    badgeBg: 'bg-[#D81B60]',
    text: 'text-white',
  },
  Français: {
    badgeBg: 'bg-[#9C27B0]',
    text: 'text-white',
  },
  Anglais: {
    badgeBg: 'bg-[#2E7D32]',
    text: 'text-white',
  },
  'Histoire-Géo': {
    badgeBg: 'bg-[#ED6C02]',
    text: 'text-white',
  },
  SVT: {
    badgeBg: 'bg-[#0288D1]',
    text: 'text-white',
  },
};

export const HomeworkBoard: React.FC = () => {
  const {
    currentUser,
    users,
    homeworks,
    submitHomework,
    gradeHomework,
    addHomework,
    deleteHomework,
  } = useParkours();

  const isTeacher = currentUser.role === 'teacher';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [gradingInfo, setGradingInfo] = useState<{
    hwId: string;
    studentId: string;
    studentName: string;
    hwTitle: string;
  } | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Homework['subject']>('Mathématiques');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newXp, setNewXp] = useState(50);

  const [submissionText, setSubmissionText] = useState('');
  const [gradeValue, setGradeValue] = useState<number>(16);
  const [feedbackText, setFeedbackText] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const filteredHomeworks = homeworks.filter((hw) => {
    const matchesSearch =
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || hw.subject === selectedSubject;

    let matchesStatus = true;
    if (!isTeacher) {
      const sub = hw.submissions[currentUser.id];
      const status = sub?.status || 'todo';
      if (selectedStatus === 'todo') matchesStatus = status === 'todo';
      else if (selectedStatus === 'submitted') matchesStatus = status === 'submitted';
      else if (selectedStatus === 'graded') matchesStatus = status === 'graded';
    }

    return matchesSearch && matchesSubject && matchesStatus;
  });

  const totalDevoirs = homeworks.length;
  const userSubmissions = !isTeacher
    ? homeworks.filter((h) => (h.submissions[currentUser.id]?.status || 'todo') !== 'todo').length
    : 0;

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;

    addHomework({
      title: newTitle,
      subject: newSubject,
      description: newDesc,
      dueDate: newDueDate,
      xpReward: Number(newXp) || 50,
      assignedTo: ['all'],
    });

    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setIsAddModalOpen(false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHwId) return;

    submitHomework(submittingHwId, currentUser.id, submissionText);
    triggerConfetti();
    setSubmittingHwId(null);
    setSubmissionText('');
  };

  const handleTeacherGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingInfo) return;

    gradeHomework(gradingInfo.hwId, gradingInfo.studentId, Number(gradeValue), feedbackText);
    triggerConfetti();
    setGradingInfo(null);
    setFeedbackText('');
  };

  return (
    <div className="space-y-8">
      {/* HEADER CARD - PURE WHITE */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[5px_5px_0px_#000000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <span className="font-mono-custom text-xs font-bold uppercase tracking-widest text-slate-600 block mb-1">
              RELEVÉ D&apos;ÉTUDIANT·E • 5ÈME
            </span>
            <h1 className="font-bebas text-4xl sm:text-5xl font-black text-black tracking-wide leading-none uppercase">
              BONJOUR, {currentUser.name}
            </h1>
            <p className="font-mono-custom text-xs text-slate-700 mt-2 font-bold flex items-center gap-2">
              Dernière activité : <span className="text-black font-extrabold">Fiche d&apos;exercices</span> • <span className="text-emerald-700 font-extrabold">✓ En attente</span>
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono-custom">
            <div className="bg-white border-2 border-black p-3 text-center shadow-[4px_4px_0px_#FF4D00] min-w-[90px]">
              <span className="font-bebas text-3xl font-black text-black block leading-none">
                {isTeacher ? 'PROF' : currentUser.level}
              </span>
              <span className="text-[9px] font-extrabold uppercase text-slate-700 block mt-1">
                {isTeacher ? 'TUTEUR' : 'NIVEAU'}
              </span>
            </div>

            {isTeacher && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="neo-btn-primary"
              >
                <Plus className="w-5 h-5" /> NOUVEAU DEVOIR
              </button>
            )}
          </div>
        </div>

        {/* 4 Metrics Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 font-mono-custom">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              POINTS DISPONIBLES
            </span>
            <span className="font-bebas text-3xl font-black text-black block mt-0.5">
              {currentUser.points} PTS
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              JOURS CONSÉCUTIFS
            </span>
            <span className="font-bebas text-3xl font-black text-black block mt-0.5">
              {currentUser.streak} JRS 🔥
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              DEVOIRS RENDUS
            </span>
            <span className="font-bebas text-3xl font-black text-black block mt-0.5">
              {userSubmissions} / {totalDevoirs}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              XP ACCUMULÉ
            </span>
            <span className="font-bebas text-3xl font-black text-[#FF4D00] block mt-0.5">
              {currentUser.totalXp} XP
            </span>
          </div>
        </div>

        {/* White & Orange Progress Bar */}
        <div className="mt-6">
          <div className="w-full h-4 bg-white border-2 border-black overflow-hidden p-0.5">
            <div
              className="h-full bg-[#FF4D00] transition-all duration-500"
              style={{ width: `${Math.min(100, (userSubmissions / (totalDevoirs || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000000] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono-custom">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-black absolute left-3 top-3" />
          <input
            type="text"
            placeholder="RECHERCHER UN DEVOIR, MATIÈRE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-black text-xs font-bold text-black placeholder-slate-500 focus:outline-none uppercase"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-black" />
            <span className="text-xs font-bold uppercase">MATIÈRE :</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border-2 border-black text-xs font-bold text-black px-2.5 py-1.5 focus:outline-none cursor-pointer uppercase"
            >
              <option value="all">TOUTES LES MATIÈRES</option>
              <option value="Mathématiques">MATHÉMATIQUES</option>
              <option value="Physique-Chimie">PHYSIQUE-CHIMIE</option>
              <option value="Français">FRANÇAIS</option>
            </select>
          </div>

          {!isTeacher && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase">STATUT :</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border-2 border-black text-xs font-bold text-black px-2.5 py-1.5 focus:outline-none cursor-pointer uppercase"
              >
                <option value="all">TOUS LES DEVOIRS</option>
                <option value="todo">À FAIRE</option>
                <option value="submitted">RENDUS</option>
                <option value="graded">VALIDÉS & NOTÉS</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* CARDS GRID */}
      {filteredHomeworks.length === 0 ? (
        <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_#000000]">
          <BookOpen className="w-12 h-12 text-black mx-auto mb-3" />
          <h3 className="font-bebas text-2xl font-black text-black">AUCUN DEVOIR TROUVÉ</h3>
          <p className="font-mono-custom text-xs text-slate-700 mt-1 font-bold uppercase">
            Ajustez vos filtres pour afficher les devoirs de 5ème.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHomeworks.map((hw) => {
            const subjectStyle = SUBJECT_STYLES[hw.subject] || {
              badgeBg: 'bg-[#FF4D00]',
              text: 'text-white',
            };

            const userSub = hw.submissions[currentUser.id] || { status: 'todo' };

            return (
              <div
                key={hw.id}
                className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#FF4D00] flex flex-col justify-between transition-transform hover:-translate-y-1 relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 font-mono-custom">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 border-2 border-black ${subjectStyle.badgeBg} ${subjectStyle.text}`}
                    >
                      {hw.subject}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000]">
                        +{hw.xpReward} XP
                      </span>

                      {isTeacher && (
                        <button
                          onClick={() => deleteHomework(hw.id)}
                          className="text-black hover:text-[#FF4D00] p-1"
                          title="Supprimer ce devoir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bebas text-2xl font-black text-black tracking-wide leading-tight uppercase">
                    {hw.title}
                  </h3>

                  <p className="font-mono-custom text-xs text-slate-800 mt-3 p-3 border-2 border-black bg-[#FAF7F2] font-semibold">
                    {hw.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 font-mono-custom text-xs font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-black" />
                    <span>À RENDRE LE :</span>
                    <span className="text-black font-black uppercase">
                      {new Date(hw.dueDate).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black font-mono-custom">
                  {!isTeacher && (
                    <div>
                      {userSub.status === 'todo' && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="neo-badge bg-[#FFF3E0] text-[#E65100]">
                            À FAIRE
                          </span>
                          <button
                            onClick={() => {
                              setSubmittingHwId(hw.id);
                              setSubmissionText('');
                            }}
                            className="neo-btn-primary"
                          >
                            <Send className="w-4 h-4" /> RENDRE LE TRAVAIL
                          </button>
                        </div>
                      )}

                      {userSub.status === 'submitted' && (
                        <div className="bg-[#E8F5E9] border-2 border-black p-3 shadow-[3px_3px_0px_#000]">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 uppercase">
                            <span>✓ TRAVAIL RENDU</span>
                            <span className="text-[10px] text-slate-600">EN CORRECTION</span>
                          </div>
                          {userSub.submissionText && (
                            <p className="text-[11px] text-slate-700 italic mt-1">
                              &ldquo;{userSub.submissionText}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {userSub.status === 'graded' && (
                        <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_#10B981]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-black uppercase">
                              ✓ DEVOIR VALIDÉ & NOTÉ
                            </span>
                            <span className="font-bebas text-2xl font-black text-emerald-700 px-2 border-2 border-black bg-[#E8F5E9]">
                              {userSub.grade} / 20
                            </span>
                          </div>
                          {userSub.feedback && (
                            <div className="mt-2 text-xs font-semibold text-slate-800 bg-[#FAF7F2] p-2 border border-black">
                              💬 &ldquo;{userSub.feedback}&rdquo;
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {isTeacher && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase text-slate-700 flex justify-between">
                        <span>SOUMISSIONS ÉLÈVES DE 5ÈME :</span>
                        <span>
                          {Object.values(hw.submissions).filter((s) => s.status !== 'todo').length} / {users.filter((u) => u.role === 'student').length}
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {users
                          .filter((u) => u.role === 'student')
                          .map((student) => {
                            const sub = hw.submissions[student.id] || { status: 'todo' };
                            return (
                              <div
                                key={student.id}
                                className="flex items-center justify-between bg-white border-2 border-black p-2 text-xs font-bold"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{student.avatar}</span>
                                  <span className="uppercase text-black">{student.name}</span>
                                </div>

                                <div>
                                  {sub.status === 'todo' && (
                                    <span className="neo-badge bg-white text-slate-600">
                                      NON RENDU
                                    </span>
                                  )}

                                  {sub.status === 'submitted' && (
                                    <button
                                      onClick={() =>
                                        setGradingInfo({
                                          hwId: hw.id,
                                          studentId: student.id,
                                          studentName: student.name,
                                          hwTitle: hw.title,
                                        })
                                      }
                                      className="neo-btn-primary py-1 px-2.5 text-xs font-bebas"
                                    >
                                      <FileText className="w-3 h-3" /> CORRIGER & NOTER
                                    </button>
                                  )}

                                  {sub.status === 'graded' && (
                                    <span className="font-bebas text-base font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-black">
                                      NOTE : {sub.grade}/20
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREATE HOMEWORK */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-mono-custom">
          <div className="bg-white border-2 border-black w-full max-w-lg p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="font-bebas text-2xl font-black text-black">
                CRÉER UN DEVOIR (5ÈME)
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-black font-bold text-xl hover:text-[#FF4D00]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">
                  TITRE DU DEVOIR *
                </label>
                <input
                  type="text"
                  required
                  placeholder="EX: FRACTIONS & CALCUL MENTAL"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">MATIÈRE *</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as Homework['subject'])}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                  >
                    <option value="Mathématiques">MATHÉMATIQUES</option>
                    <option value="Physique-Chimie">PHYSIQUE-CHIMIE</option>
                    <option value="Français">FRANÇAIS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">DATE LIMITE *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">RÉCOMPENSE XP</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={newXp}
                  onChange={(e) => setNewXp(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Consignes de l'exercice..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  PUBLIER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT */}
      {submittingHwId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-mono-custom">
          <div className="bg-white border-2 border-black w-full max-w-lg p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="font-bebas text-2xl font-black text-black">
                RENDRE MON TRAVAIL
              </h2>
              <button
                onClick={() => setSubmittingHwId(null)}
                className="text-black font-bold text-xl hover:text-[#FF4D00]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <p className="text-xs font-bold text-slate-800 uppercase">
                EXPLICATIONS DE VOTRE TRAVAIL POUR VOTRE TUTEUR :
              </p>

              <textarea
                rows={5}
                required
                placeholder="Rédigez vos explications..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none resize-none"
              />

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setSubmittingHwId(null)}
                  className="neo-btn-secondary"
                >
                  ANNULER
                </button>
                <button type="submit" className="neo-btn-primary">
                  <Send className="w-4 h-4" /> CONFIRMER L&apos;ENVOI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADE */}
      {gradingInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-mono-custom">
          <div className="bg-white border-2 border-black w-full max-w-lg p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <h2 className="font-bebas text-2xl font-black text-black">
                  CORRECTION & NOTATION
                </h2>
                <p className="text-xs font-bold text-slate-600">
                  ÉLÈVE : <span className="text-black uppercase">{gradingInfo.studentName}</span> (5ÈME)
                </p>
              </div>
              <button
                onClick={() => setGradingInfo(null)}
                className="text-black font-bold text-xl hover:text-[#FF4D00]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTeacherGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">
                  NOTE ATTRIBUÉE SUR 20 *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    required
                    value={gradeValue}
                    onChange={(e) => setGradeValue(Number(e.target.value))}
                    className="w-32 px-3 py-2 border-2 border-black font-bebas text-2xl font-black focus:outline-none"
                  />
                  <span className="font-bebas text-2xl font-black">/ 20</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">
                  COMMENTAIRE & CONSEILS DU TUTEUR
                </label>
                <textarea
                  rows={3}
                  placeholder="Remarques et retours d'amélioration..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setGradingInfo(null)}
                  className="neo-btn-secondary"
                >
                  ANNULER
                </button>
                <button type="submit" className="neo-btn-primary">
                  <Check className="w-4 h-4" /> VALIDER LA NOTE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
