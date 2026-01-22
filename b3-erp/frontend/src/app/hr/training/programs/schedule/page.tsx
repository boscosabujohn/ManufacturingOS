'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  trainer: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: 'workshop' | 'webinar';
  conflict?: boolean;
}

export default function ProgramSchedulePage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState('April 2024');

  const sessions: Session[] = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      trainer: 'Sarah Drasner',
      date: '2024-04-10',
      time: '10:00 AM - 12:00 PM',
      location: 'Conference Room A',
      attendees: 15,
      type: 'workshop'
    },
    {
      id: '2',
      title: 'Effective Communication',
      trainer: 'Simon Sinek',
      date: '2024-04-12',
      time: '02:00 PM - 04:00 PM',
      location: 'Zoom Meeting',
      attendees: 45,
      type: 'webinar'
    },
    {
      id: '3',
      title: 'Security Compliance 101',
      trainer: 'InfoSec Team',
      date: '2024-04-12',
      time: '02:00 PM - 03:00 PM', // Conflict
      location: 'Training Hall',
      attendees: 30,
      type: 'workshop',
      conflict: true
    }
  ];

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            Program Schedule
          </h1>
          <p className="text-gray-500 mt-1">Manage training sessions and availability.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            List View
          </button>
        </div>
      </div>

      {view === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{currentMonth}</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="h-5 w-5 text-gray-500" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="h-5 w-5 text-gray-500" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center border-b border-gray-200 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-sm font-medium text-gray-500">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map(day => {
              const daySessions = sessions.filter(s => new Date(s.date).getDate() === day);
              return (
                <div key={day} className="min-h-[120px] p-2 border-b border-r border-gray-100 hover:bg-gray-50 transition-colors relative">
                  <span className="text-sm font-medium text-gray-400 block mb-2">{day}</span>
                  <div className="space-y-1">
                    {daySessions.map(session => (
                      <div
                        key={session.id}
                        className={`text-xs p-1.5 rounded border truncate cursor-pointer ${session.conflict
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                      >
                        {session.conflict && <AlertCircle className="h-3 w-3 inline mr-1" />}
                        {session.time.split(' ')[0]} {session.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sessions.map(session => (
              <div key={session.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${session.conflict ? 'bg-red-50' : 'bg-purple-50'}`}>
                    {session.conflict ? (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : (
                      <Calendar className="h-6 w-6 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {session.title}
                      {session.conflict && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Conflict</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Trainer: {session.trainer}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.date} • {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {session.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-900 font-medium justify-center">
                      <Users className="h-4 w-4 text-gray-400" />
                      {session.attendees}
                    </div>
                    <span className="text-xs text-gray-500">Attendees</span>
                  </div>
                  <button className="px-4 py-2 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors bg-white">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
