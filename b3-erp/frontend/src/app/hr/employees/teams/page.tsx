'use client';

import { Users, Plus, UserPlus } from 'lucide-react';

export default function TeamsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="h-8 w-8 text-teal-600" />
          Teams
        </h1>
        <p className="text-gray-600 mt-2">Manage team structure and members</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-700">All Teams</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <Plus className="h-4 w-4" />
            Create Team
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Product Development', lead: 'Alex Turner', members: 12, projects: 5 },
          { name: 'Quality Assurance', lead: 'Maria Garcia', members: 8, projects: 3 },
          { name: 'Customer Success', lead: 'James Wilson', members: 15, projects: 8 },
          { name: 'DevOps', lead: 'Sarah Kim', members: 6, projects: 4 },
          { name: 'UI/UX Design', lead: 'Tom Anderson', members: 9, projects: 7 },
          { name: 'Data Analytics', lead: 'Nina Patel', members: 10, projects: 6 },
        ].map((team, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <button className="text-teal-600 hover:text-teal-700">
                <UserPlus className="h-5 w-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{team.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Team Lead: {team.lead}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Members</p>
                <p className="text-lg font-semibold text-gray-900">{team.members}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Projects</p>
                <p className="text-lg font-semibold text-gray-900">{team.projects}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
