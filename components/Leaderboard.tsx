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
    <div className="space-y-8 font-mono-custom">
      {/* HEADER CARD */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[5px_5px_0px_#000000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-1">
              GAMIFICATION & PALMARÈS
            </span>
            <h1 className="font-bebas text-4xl sm:text-5xl font-black text-black tracking-wide leading-none uppercase">
              CLASSEMENT DES ÉLÈVES
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-2 max-w-xl">
              Rendez vos devoirs à temps, accumulez de l&apos;expérience (XP) et montez sur le podium des meilleurs élèves !
            </p>
          </div>

          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#FF4D00] flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-black bg-[#FF4D00] text-white flex items-center justify-center font-bebas text-2xl font-black">
              👑
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                LEADER ACTUEL
              </span>
              <span className="font-bebas text-2xl font-black text-black block leading-none">
                {top1 ? top1.name : 'AUCUN ÉLÈVE'}
              </span>
              <span className="text-xs font-extrabold text-[#FF4D00]">
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
          <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000000] text-center flex flex-col items-center justify-between order-2 md:order-1">
            <div className="neo-badge bg-slate-200 text-black mb-3">
              🥈 2ÈME PLACE
            </div>

            <div className="w-20 h-20 border-2 border-black bg-white flex items-center justify-center text-4xl shadow-[3px_3px_0px_#000]">
              {top2.avatar}
            </div>

            <h3 className="font-bebas text-2xl font-black text-black mt-3 uppercase">
              {top2.name}
            </h3>
            <p className="text-xs text-slate-600 font-bold uppercase">{top2.classGroup}</p>

            <div className="mt-4 border-2 border-black p-3 bg-[#FAF7F2] w-full">
              <span className="font-bebas text-3xl font-black text-black block leading-none">
                {top2.totalXp} XP
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-700">
                {top2.points} PTS DISPONIBLES
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (GOLD) */}
        {top1 && (
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#FF4D00] text-center flex flex-col items-center justify-between order-1 md:order-2 transform scale-105">
            <div className="neo-badge bg-[#FF4D00] text-white border-black mb-3">
              🥇 1ÈRE PLACE • CHAMPION
            </div>

            <div className="w-24 h-24 border-2 border-black bg-white flex items-center justify-center text-5xl shadow-[4px_4px_0px_#000]">
              {top1.avatar}
            </div>

            <h3 className="font-bebas text-3xl font-black text-black mt-3 uppercase">
              {top1.name}
            </h3>
            <p className="text-xs text-[#FF4D00] font-bold uppercase">{top1.classGroup}</p>

            <div className="mt-4 border-2 border-black p-3 bg-[#FFF3E0] w-full">
              <span className="font-bebas text-4xl font-black text-[#FF4D00] block leading-none">
                {top1.totalXp} XP
              </span>
              <span className="text-[10px] font-bold uppercase text-black">
                {top1.points} POINTS RÉCOMPENSES
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000000] text-center flex flex-col items-center justify-between order-3">
            <div className="neo-badge bg-[#FFE0B2] text-black mb-3">
              🥉 3ÈME PLACE
            </div>

            <div className="w-20 h-20 border-2 border-black bg-white flex items-center justify-center text-4xl shadow-[3px_3px_0px_#000]">
              {top3.avatar}
            </div>

            <h3 className="font-bebas text-2xl font-black text-black mt-3 uppercase">
              {top3.name}
            </h3>
            <p className="text-xs text-slate-600 font-bold uppercase">{top3.classGroup}</p>

            <div className="mt-4 border-2 border-black p-3 bg-[#FAF7F2] w-full">
              <span className="font-bebas text-3xl font-black text-black block leading-none">
                {top3.totalXp} XP
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-700">
                {top3.points} PTS DISPONIBLES
              </span>
            </div>
          </div>
        )}
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#000000] space-y-4">
        <h3 className="font-bebas text-2xl font-black text-black uppercase">
          CLASSEMENT COMPLET DES ÉLÈVES
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-black uppercase">
                <th className="pb-3 text-center w-16">RANG</th>
                <th className="pb-3">ÉLÈVE</th>
                <th className="pb-3">CLASSE</th>
                <th className="pb-3 text-center">NIVEAU</th>
                <th className="pb-3 text-center">SÉRIEF 🔥</th>
                <th className="pb-3 text-right">POINTS</th>
                <th className="pb-3 text-right">TOTAL XP</th>
              </tr>
            </thead>
            <tbody className="divide-y border-black">
              {sortedStudents.map((student, index) => {
                const isCurrent = student.id === currentUser.id;
                const rank = index + 1;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCurrent ? 'bg-[#FFF3E0] font-black' : 'hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <td className="py-3 text-center font-bebas text-2xl font-black">
                      #{rank}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{student.avatar}</span>
                        <div>
                          <span className="font-extrabold text-black uppercase">
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

                    <td className="py-3 uppercase text-slate-700">{student.classGroup}</td>

                    <td className="py-3 text-center font-bebas text-xl font-black">
                      NIV. {student.level}
                    </td>

                    <td className="py-3 text-center font-extrabold text-[#FF4D00]">
                      {student.streak} JRS
                    </td>

                    <td className="py-3 text-right font-black text-black">
                      {student.points} PTS
                    </td>

                    <td className="py-3 text-right font-bebas text-2xl font-black text-[#FF4D00]">
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
