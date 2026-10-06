'use client';

import React, { useState, useMemo } from 'react';
import { useParkours } from '../lib/context';
import { Calendar, Trash2, Plus, Clock, ChevronLeft, ChevronRight, Repeat, AlertCircle } from 'lucide-react';
import { TutorSchedule } from '../lib/types';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' }
];

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Calendrier Scolaire Zone C (Paris) - 2026 / 2027
const HOLIDAYS_ZONE_C = [
  { name: 'Toussaint', start: '2026-10-17', end: '2026-11-01' },
  { name: 'Noël', start: '2026-12-19', end: '2027-01-03' },
  { name: 'Hiver', start: '2027-02-13', end: '2027-02-28' },
  { name: 'Printemps', start: '2027-04-10', end: '2027-04-25' },
  { name: 'Été', start: '2027-07-03', end: '2027-08-31' },
];

const getHolidayForDate = (dateObj: Date) => {
  // Fix time zone offset issue by using local date parts
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  for (const h of HOLIDAYS_ZONE_C) {
    if (dateStr >= h.start && dateStr <= h.end) {
      return h.name;
    }
  }
  return null;
};

export const Agenda: React.FC = () => {
  const { tutorSchedules, addTutorSchedule, deleteTutorSchedule } = useParkours();

  // Form State
  const [type, setType] = useState<'mission' | 'remplacement'>('mission');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:30');

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'mission') {
      addTutorSchedule({ type, dayOfWeek, startTime, endTime });
    } else {
      addTutorSchedule({ type, date, startTime, endTime });
    }
  };

  const nextMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    
    // First day of the month (0 = Sunday, 1 = Monday...)
    let firstDayIdx = new Date(year, month, 1).getDay();
    // Adjust to make Monday = 0
    firstDayIdx = firstDayIdx === 0 ? 6 : firstDayIdx - 1; 

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty padding for first week
    for (let i = 0; i < firstDayIdx; i++) {
      days.push(null);
    }
    
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  }, [currentMonthDate]);

  const getEventsForDate = (dateObj: Date, isHoliday: boolean) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayOfWeekObj = dateObj.getDay();

    return tutorSchedules.filter(schedule => {
      if (schedule.type === 'remplacement') {
        return schedule.date === dateStr;
      } else {
        if (isHoliday) return false;
        return schedule.dayOfWeek === dayOfWeekObj;
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold tracking-tight text-2xl font-bold text-black flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            MON AGENDA
          </h3>
          <p className="text-xs text-slate-700 font-bold mt-1">
            Gérez vos missions régulières (toutes les semaines) et vos remplacements ponctuels.
          </p>
        </div>

        <form onSubmit={handleAdd} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input 
                type="radio" 
                name="type" 
                checked={type === 'mission'} 
                onChange={() => setType('mission')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
              />
              Mission (Toutes les semaines)
            </label>
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input 
                type="radio" 
                name="type" 
                checked={type === 'remplacement'} 
                onChange={() => setType('remplacement')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
              />
              Remplacement (Ponctuel)
            </label>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            {type === 'mission' ? (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Jour de la semaine</label>
                <select 
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(Number(e.target.value))}
                  className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-semibold focus:outline-none focus:border-blue-500 bg-white"
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Date exacte</label>
                <input 
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-semibold focus:outline-none focus:border-blue-500 bg-white"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Heure de début</label>
              <input 
                type="time" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-semibold focus:outline-none focus:border-blue-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Heure de fin</label>
              <input 
                type="time" 
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-semibold focus:outline-none focus:border-blue-500 bg-white"
                required
              />
            </div>
            <button type="submit" className="neo-btn-primary py-2 px-4 text-xs h-[38px] ml-auto">
              <Plus className="w-4 h-4" /> AJOUTER
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-[#1E3A5F] text-white flex items-center justify-between">
          <button onClick={prevMonth} className="p-1 hover:bg-[#173354] rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h4 className="text-lg font-bold uppercase tracking-widest">
            {MONTH_NAMES[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
          </h4>
          <button onClick={nextMonth} className="p-1 hover:bg-[#173354] rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 border-r border-slate-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-slate-200 gap-[1px]">
          {calendarDays.map((dateObj, i) => {
            if (!dateObj) {
              return <div key={`empty-${i}`} className="bg-white min-h-[100px]" />;
            }
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const holidayName = getHolidayForDate(dateObj);
            const isHoliday = holidayName !== null;
            const events = getEventsForDate(dateObj, isHoliday);

            return (
              <div key={dateObj.toISOString()} className={`bg-white min-h-[120px] p-2 flex flex-col ${isToday ? 'bg-blue-50/50' : ''} ${isHoliday ? 'bg-orange-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-2 gap-1">
                  <span className={`text-sm font-bold w-7 h-7 shrink-0 flex items-center justify-center rounded-full ${isToday ? 'bg-[#FF4D00] text-white' : 'text-slate-700'}`}>
                    {dateObj.getDate()}
                  </span>
                  {isHoliday && (
                    <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded truncate">
                      {holidayName}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
                  {events.map(ev => (
                    <div key={ev.id} className={`text-[10px] font-bold p-1.5 rounded border ${ev.type === 'mission' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'} relative group`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {ev.type === 'mission' ? <Repeat className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>{ev.startTime} - {ev.endTime}</span>
                        </div>
                        <button 
                          onClick={() => deleteTutorSchedule(ev.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-[9px] mt-0.5 opacity-80 uppercase tracking-wider">
                        {ev.type === 'mission' ? 'Mission (Groupe)' : 'Remplacement'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
