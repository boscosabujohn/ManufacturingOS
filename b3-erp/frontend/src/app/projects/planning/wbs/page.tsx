'use client';

import { useMemo, useState } from 'react';
import { Network, Search, Filter, Expand, PlusCircle, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';

type WbsNode = {
  id: string;
  name: string;
  owner: string;
  start: string;
  end: string;
  progress: number;
  children?: WbsNode[];
};

const WBS: WbsNode[] = [
  {
    id: '1',
    name: 'Project Initiation',
    owner: 'Amit Singh',
    start: '2025-08-01',
    end: '2025-08-10',
    progress: 100,
    children: [
      { id: '1.1', name: 'Requirements Gathering', owner: 'Amit Singh', start: '2025-08-01', end: '2025-08-05', progress: 100 },
      { id: '1.2', name: 'Scope Definition', owner: 'Priya Patel', start: '2025-08-06', end: '2025-08-10', progress: 100 },
    ],
  },
  {
    id: '2',
    name: 'Design & Engineering',
    owner: 'Rahul Kumar',
    start: '2025-08-11',
    end: '2025-09-05',
    progress: 80,
    children: [
      { id: '2.1', name: 'Kitchen Layouts', owner: 'Design Team', start: '2025-08-11', end: '2025-08-20', progress: 100 },
      { id: '2.2', name: 'Material Selection', owner: 'Procurement', start: '2025-08-15', end: '2025-08-25', progress: 90 },
      { id: '2.3', name: 'Engineering Drawings', owner: 'Rahul Kumar', start: '2025-08-21', end: '2025-09-05', progress: 55 },
    ],
  },
  {
    id: '3',
    name: 'Manufacturing',
    owner: 'Production',
    start: '2025-09-06',
    end: '2025-10-10',
    progress: 60,
    children: [
      { id: '3.1', name: 'Cutting & Edge Banding', owner: 'Floor A', start: '2025-09-06', end: '2025-09-20', progress: 70 },
      { id: '3.2', name: 'Assembly', owner: 'Floor B', start: '2025-09-15', end: '2025-10-01', progress: 55 },
      { id: '3.3', name: 'Quality Checks', owner: 'QC', start: '2025-09-25', end: '2025-10-10', progress: 45 },
    ],
  },
];

export default function WorkBreakdownStructurePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '1': true, '2': true, '3': true });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Network className="h-8 w-8 text-teal-600" />
          Work Breakdown Structure
        </h1>
        <p className="text-gray-600 mt-2">Hierarchical decomposition of project deliverables</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search WBS items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Expand className="h-4 w-4" />
              Expand All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <PlusCircle className="h-4 w-4" />
              Add Work Package
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Work Packages</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">87</p>
            </div>
            <Network className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">WBS Levels</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">5</p>
            </div>
            <Network className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-900 mt-1">52</p>
            </div>
            <Network className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">35</p>
            </div>
            <Network className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3 border-b flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Showing {searchTerm ? 'filtered ' : ''}WBS</span>
          <button
            className="ml-auto px-3 py-1 text-sm border rounded hover:bg-gray-50"
            onClick={() => {
              const all: Record<string, boolean> = {};
              const toggle = (nodes: WbsNode[], v: boolean) => nodes.forEach(n => {
                all[n.id] = v;
                if (n.children) toggle(n.children, v);
              });
              toggle(WBS, true);
              setExpanded(all);
            }}
          >
            Expand All
          </button>
        </div>

        <div className="p-2">
          <Tree nodes={WBS} expanded={expanded} setExpanded={setExpanded} search={searchTerm} />
        </div>
      </div>
    </div>
  );
}

function Tree({ nodes, expanded, setExpanded, search }: { nodes: WbsNode[]; expanded: Record<string, boolean>; setExpanded: (v: Record<string, boolean>) => void; search: string }) {
  const matches = (n: WbsNode) => n.name.toLowerCase().includes(search.toLowerCase());
  const toggle = (id: string) => setExpanded({ ...expanded, [id]: !expanded[id] });

  return (
    <ul className="space-y-1">
      {nodes.map((n) => {
        const hasChildren = !!n.children?.length;
        const isOpen = expanded[n.id];
        const show = !search || matches(n) || n.children?.some(c => matches(c));
        if (!show) return null;
        return (
          <li key={n.id} className="">
            <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50">
              {hasChildren ? (
                <button onClick={() => toggle(n.id)} className="p-1 rounded hover:bg-gray-100">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <span className="inline-flex items-center justify-center h-4 w-4" />
              )}
              <span className="font-medium text-gray-800">{n.name}</span>
              <span className="text-xs text-gray-500">• {n.owner}</span>
              <span className="ml-auto text-xs text-gray-500">{n.start} → {n.end}</span>
              <div className="w-40 ml-4">
                <div className="h-2 w-full bg-gray-100 rounded">
                  <div className="h-2 rounded bg-teal-600" style={{ width: `${n.progress}%` }} />
                </div>
                <div className="mt-1 text-[10px] text-gray-600">{n.progress}%</div>
              </div>
              {n.progress === 100 && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            </div>
            {hasChildren && isOpen && (
              <div className="ml-6 border-l border-gray-200 pl-3">
                <Tree nodes={n.children!} expanded={expanded} setExpanded={setExpanded} search={search} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
