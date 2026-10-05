'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
import { Calendar, Trash2, Plus, Clock } from 'lucide-react';

export const Agenda: React.FC = () => {
  const { tutorSchedules, addTutorSchedule, deleteTutorSchedule } = useParkours();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:30');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addTutorSchedule({
      date,
      startTime,
      endTime
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 font-sans">
      <div>
        <h3 className="font-semibold tracking-tight text-2xl font-bold text-black flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          MON AGENDA
        </h3>
        <p className="text-xs text-slate-700 font-bold mt-1">
          Planifiez vos jours et horaires de tutorat pour les semaines à venir.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
          <input 
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm font-semibold focus:outline-none focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Heure de début</label>
          <input 
            type="time" 
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-semibold focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Heure de fin</label>
          <input 
            type="time" 
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-semibold focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="neo-btn-primary py-2 px-4 text-xs h-[38px]">
          <Plus className="w-4 h-4" /> PLANIFIER
        </button>
      </form>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-black">Missions programmées :</h4>
        {tutorSchedules.length === 0 ? (
          <div className="text-center text-xs font-bold text-slate-500 py-6 italic border-2 border-dashed border-slate-300 rounded-xl">
            Aucune mission programmée pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tutorSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(schedule => (
              <div key={schedule.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-black">{new Date(schedule.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                    <div className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Groupe : Tutorat 5ème</div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTutorSchedule(schedule.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors self-start"
                  title="Supprimer la mission"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
