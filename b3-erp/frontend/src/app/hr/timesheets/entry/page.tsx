'use client';

import { useState, useMemo } from 'react';
import { FileText, Plus, Save, Send, Calendar, Clock, AlertCircle, Trash2, Copy } from 'lucide-react';

interface TimesheetEntry {
  id: string;
  projectName: string;
  taskName: string;
  hours: { [key: string]: number };
}

export default function TimesheetEntryPage() {
  const [selectedWeek, setSelectedWeek] = useState('week42');
  const [entries, setEntries] = useState<TimesheetEntry[]>([
    {
      id: '1',
      projectName: 'Kitchen Manufacturing ERP',
      taskName: 'HR Module Development',
      hours: { mon: 8, tue: 8, wed: 8, thu: 8, fri: 6, sat: 0, sun: 0 }
    },
    {
      id: '2',
      projectName: 'Kitchen Manufacturing ERP',
      taskName: 'Payroll Module Testing',
      hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 2, sat: 0, sun: 0 }
    },
    {
      id: '3',
      projectName: 'Quality Control System',
      taskName: 'Dashboard Design',
      hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 4, sun: 0 }
    }
  ]);

  const weekDays = [
    { key: 'mon', label: 'Mon', date: '18' },
    { key: 'tue', label: 'Tue', date: '19' },
    { key: 'wed', label: 'Wed', date: '20' },
    { key: 'thu', label: 'Thu', date: '21' },
    { key: 'fri', label: 'Fri', date: '22' },
    { key: 'sat', label: 'Sat', date: '23' },
    { key: 'sun', label: 'Sun', date: '24' }
  ];

  const updateHours = (entryId: string, day: string, value: number) => {
    setEntries(entries.map(entry =>
      entry.id === entryId
        ? { ...entry, hours: { ...entry.hours, [day]: value } }
        : entry
    ));
  };

  const addNewRow = () => {
    const newEntry: TimesheetEntry = {
      id: Date.now().toString(),
      projectName: '',
      taskName: '',
      hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }
    };
    setEntries([...entries, newEntry]);
  };

  const deleteRow = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const copyLastWeek = () => {
    // In real implementation, this would fetch last week's data
    alert('Last week\'s timesheet copied!');
  };

  const dailyTotals = useMemo(() => {
    return weekDays.reduce((totals, day) => {
      totals[day.key] = entries.reduce((sum, entry) => sum + (entry.hours[day.key] || 0), 0);
      return totals;
    }, {} as { [key: string]: number });
  }, [entries]);

  const weekTotal = useMemo(() => {
    return Object.values(dailyTotals).reduce((sum, hours) => sum + hours, 0);
  }, [dailyTotals]);

  const stats = {
    totalHours: weekTotal,
    regularHours: Math.min(weekTotal, 40),
    overtimeHours: Math.max(0, weekTotal - 40),
    projectCount: new Set(entries.map(e => e.projectName).filter(Boolean)).size
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Timesheet Entry
        </h1>
        <p className="text-gray-600 mt-2">Log your daily project hours and activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
            </div>
            <Clock className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Regular Hours</p>
              <p className="text-2xl font-bold text-green-600">{stats.regularHours}</p>
            </div>
            <Clock className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overtime Hours</p>
              <p className="text-2xl font-bold text-orange-600">{stats.overtimeHours}</p>
            </div>
            <Clock className="h-10 w-10 text-orange-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-purple-600">{stats.projectCount}</p>
            </div>
            <FileText className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Week Selector & Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week42">Week 42: Nov 18 - Nov 24, 2024</option>
              <option value="week41">Week 41: Nov 11 - Nov 17, 2024</option>
              <option value="week40">Week 40: Nov 4 - Nov 10, 2024</option>
            </select>
            <button
              onClick={copyLastWeek}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
              Copy Last Week
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send className="h-4 w-4" />
              Submit for Approval
            </button>
          </div>
        </div>
      </div>

      {/* Alert for incomplete entries */}
      {weekTotal < 40 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">Incomplete Timesheet</h3>
              <p className="text-sm text-yellow-700">
                You have logged {weekTotal} hours out of 40 expected hours this week.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto mb-4">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-64">Project / Task</th>
              {weekDays.map(day => (
                <th key={day.key} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  <div>{day.label}</div>
                  <div className="text-gray-400">{day.date}</div>
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => {
              const rowTotal = Object.values(entry.hours).reduce((sum, h) => sum + h, 0);
              return (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Project name"
                        value={entry.projectName}
                        onChange={(e) => {
                          setEntries(entries.map(e =>
                            e.id === entry.id ? { ...e, projectName: e.target.value } : e
                          ));
                        }}
                        className="w-full px-2 py-1 text-sm font-medium text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Task description"
                        value={entry.taskName}
                        onChange={(e) => {
                          setEntries(entries.map(e =>
                            e.id === entry.id ? { ...e, taskName: e.target.value } : e
                          ));
                        }}
                        className="w-full px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  {weekDays.map(day => (
                    <td key={day.key} className="px-4 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        placeholder="0"
                        value={entry.hours[day.key] || ''}
                        onChange={(e) => updateHours(entry.id, day.key, parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <div className={`text-sm font-bold ${rowTotal > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
                      {rowTotal}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => deleteRow(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                     
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-blue-50 font-semibold border-t-2 border-blue-200">
              <td className="px-6 py-4 text-sm text-gray-900">Daily Totals</td>
              {weekDays.map(day => (
                <td key={day.key} className="px-4 py-4 text-center">
                  <div className={`text-sm font-bold ${
                    dailyTotals[day.key] > 8 ? 'text-orange-700' :
                    dailyTotals[day.key] === 8 ? 'text-green-700' :
                    dailyTotals[day.key] > 0 ? 'text-blue-700' :
                    'text-gray-400'
                  }`}>
                    {dailyTotals[day.key]}
                  </div>
                </td>
              ))}
              <td className="px-6 py-4 text-center">
                <div className="text-sm font-bold text-blue-900">{weekTotal}</div>
              </td>
              <td className="px-4 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <div className="flex gap-3">
        <button
          onClick={addNewRow}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Add Project/Task
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Timesheet Guidelines</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Enter hours in 0.5 hour increments (e.g., 4.5, 8, 8.5)</li>
          <li>• Standard work week is 40 hours (8 hours/day for 5 days)</li>
          <li>• Hours exceeding 40 per week will be automatically marked as overtime</li>
          <li>• Save your timesheet as draft to continue later</li>
          <li>• Submit timesheet by Friday EOD for approval</li>
        </ul>
      </div>
    </div>
  );
}
