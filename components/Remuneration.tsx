'use client';

import React from 'react';
import { useParkours } from '../lib/context';
import { TrendingUp, CreditCard } from 'lucide-react';

export const Remuneration: React.FC = () => {
  const { tutorSessions } = useParkours();

  const totalEarned = tutorSessions.reduce((acc, s) => acc + s.remuneration, 0);
  const totalHours = tutorSessions.reduce((acc, s) => acc + s.durationHours, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 font-sans">
      <div>
        <h3 className="font-semibold tracking-tight text-2xl font-bold text-black flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          SUIVI DE RÉMUNÉRATION
        </h3>
        <p className="text-xs text-slate-700 font-bold mt-1">
          Historique détaillé de vos séances réalisées et estimation de vos gains.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold tracking-wider text-emerald-800 block">
            RÉMUNÉRATION TOTALE
          </span>
          <div className="font-semibold tracking-tight text-4xl font-bold text-emerald-700 mt-1 flex items-center gap-2">
            {totalEarned.toFixed(2)} €
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold tracking-wider text-blue-800 block">
            HEURES EFFECTUÉES
          </span>
          <div className="font-semibold tracking-tight text-4xl font-bold text-blue-700 mt-1">
            {totalHours} h
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-4">
        <h4 className="text-sm font-bold text-black">Historique des séances facturées :</h4>
        
        {tutorSessions.length === 0 ? (
          <div className="text-center text-xs font-bold text-slate-500 py-6 italic border-2 border-dashed border-slate-300 rounded-xl">
            Aucune séance terminée pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3">DATE</th>
                  <th className="p-3">GROUPE</th>
                  <th className="p-3 text-center">DURÉE</th>
                  <th className="p-3 text-center">TAUX HORAIRE</th>
                  <th className="p-3 text-right">MONTANT</th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-200">
                {tutorSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 bg-white">
                    <td className="p-3">{session.date}</td>
                    <td className="p-3 text-slate-600">Tutorat 5ème</td>
                    <td className="p-3 text-center">{session.durationHours} h</td>
                    <td className="p-3 text-center text-slate-500">17,00 € / h</td>
                    <td className="p-3 text-right font-bold text-emerald-600">
                      +{session.remuneration.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg flex items-center gap-4">
        <CreditCard className="w-8 h-8 text-slate-400" />
        <div className="text-xs font-medium text-slate-600 leading-relaxed">
          Le taux horaire standard est fixé à <strong>17€ net / heure</strong>. 
          Les virements sont effectués à la fin de chaque mois sur la base de ce relevé.
        </div>
      </div>
    </div>
  );
};
