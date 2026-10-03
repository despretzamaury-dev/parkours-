'use client';

import React from 'react';
import { useParkours } from '../lib/context';
import { Crown, Trophy, Sparkles, Medal, Zap } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { users, currentUser } = useParkours();

  const sortedStudents = React.useMemo(() => {
    return [...users.filter((u) => u.role === 'student')].sort((a, b) => b.totalXp - a.totalXp);
  }, [users]);

  const top1 = sortedStudents[0];
  const top2 = sortedStudents[1];
  const top3 = sortedStudents[2];

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold tracking-widest text-slate-600 block mb-1">
              GAMIFICATION & PALMARÈS
            </span>
            <h1 className="font-semibold tracking-tight text-4xl sm:text-5xl font-bold text-black tracking-wide leading-none">
              CLASSEMENT DES ÉLÈVES
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-2 max-w-xl">
              Rendez vos devoirs à temps, accumulez de l&apos;expérience (XP) et montez sur le podium des meilleurs élèves !
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 border border-slate-200 bg-[#FF4D00] text-white flex items-center justify-center font-semibold tracking-tight text-2xl font-bold">
              👑
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-600 block">
                LEADER ACTUEL
              </span>
              <span className="font-semibold tracking-tight text-2xl font-bold text-black block leading-none">
                {top1 ? top1.name : 'AUCUN ÉLÈVE'}
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {top1 ? `${top1.totalXp} XP` : '0 XP'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
        {/* 2nd Place */}
        {top2 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center flex flex-col items-center justify-between order-2 md:order-1">
            <div className="neo-badge bg-slate-200 text-black mb-3">
              🥈 2ÈME PLACE
            </div>

            <div className="w-20 h-20 border border-slate-200 bg-white flex items-center justify-center text-4xl shadow-sm">
              {top2.avatar}
            </div>

            <h3 className="font-semibold tracking-tight text-2xl font-bold text-black mt-3">
              {top2.name}
            </h3>
            <p className="text-xs text-slate-600 font-bold">{top2.classGroup}</p>

            <div className="mt-4 border border-slate-200 p-3 bg-slate-50 w-full">
              <span className="font-semibold tracking-tight text-3xl font-bold text-black block leading-none">
                {top2.totalXp} XP
              </span>
              <span className="text-[10px] font-bold text-slate-700">
                {top2.points} POINTS
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (GOLD) */}
        {top1 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center flex flex-col items-center justify-between order-1 md:order-2 z-10 md:transform md:scale-110">
            <div className="neo-badge bg-[#FF4D00] text-black border-slate-200 mb-3">
              🥇 1ÈRE PLACE
            </div>

            <div className="w-24 h-24 border border-slate-200 bg-white flex items-center justify-center text-5xl shadow-sm">
              {top1.avatar}
            </div>

            <h3 className="font-semibold tracking-tight text-3xl font-bold text-black mt-3">
              {top1.name}
            </h3>
            <p className="text-xs text-blue-600 font-bold">{top1.classGroup}</p>

            <div className="mt-4 border border-slate-200 p-3 bg-blue-50 w-full">
              <span className="font-semibold tracking-tight text-4xl font-bold text-blue-600 block leading-none">
                {top1.totalXp} XP
              </span>
              <span className="text-[10px] font-bold text-black">
                {top1.points} POINTS
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center flex flex-col items-center justify-between order-3">
            <div className="neo-badge bg-[#FFE0B2] text-black mb-3">
              🥉 3ÈME PLACE
            </div>

            <div className="w-20 h-20 border border-slate-200 bg-white flex items-center justify-center text-4xl shadow-sm">
              {top3.avatar}
            </div>

            <h3 className="font-semibold tracking-tight text-2xl font-bold text-black mt-3">
              {top3.name}
            </h3>
            <p className="text-xs text-slate-600 font-bold">{top3.classGroup}</p>

            <div className="mt-4 border border-slate-200 p-3 bg-slate-50 w-full">
              <span className="font-semibold tracking-tight text-3xl font-bold text-black block leading-none">
                {top3.totalXp} XP
              </span>
              <span className="text-[10px] font-bold text-slate-700">
                {top3.points} POINTS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold tracking-tight text-2xl font-bold text-black">
          CLASSEMENT COMPLET DES ÉLÈVES
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-black">
                <th className="pb-3 text-center w-16">RANG</th>
                <th className="pb-3">ÉLÈVE</th>
                <th className="pb-3">CLASSE</th>
                <th className="pb-3 text-center">NIVEAU</th>
                <th className="pb-3 text-center">SÉRIEF 🔥</th>
                <th className="pb-3 text-right">POINTS</th>
                <th className="pb-3 text-right">TOTAL XP</th>
              </tr>
            </thead>
            <tbody className="divide-y border-slate-200">
              {sortedStudents.map((student, index) => {
                const isCurrent = student.id === currentUser.id;
                const rank = index + 1;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCurrent ? 'bg-blue-50 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 text-center font-semibold tracking-tight text-2xl font-bold">
                      #{rank}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{student.avatar}</span>
                        <div>
                          <span className="font-semibold text-black">
                            {student.name}
                          </span>
                          {isCurrent && (
                            <span className="ml-2 text-[9px] bg-black text-white px-1.5 py-0.5">
                              VOUS
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-slate-700">{student.classGroup}</td>

                    <td className="py-3 text-center font-semibold tracking-tight text-xl font-bold">
                      NIV. {student.level}
                    </td>

                    <td className="py-3 text-center font-semibold text-blue-600">
                      {student.streak} JRS
                    </td>

                    <td className="py-3 text-right font-bold text-black">
                      {student.points} PTS
                    </td>

                    <td className="py-3 text-right font-semibold tracking-tight text-2xl font-bold text-blue-600">
                      {student.totalXp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
