
import { useState } from 'react';
import {
  X,
  FileText,
  TrendingUp,
  Shield,
  Target,
  CheckCircle,
  Clock,
  Edit,
  AlertCircle,
  Download,
  BarChart2,
  PieChart,
  Calendar,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

export function UpdateProgressModal({ isOpen, onClose, onUpdate }: any) {
  const [progress, setProgress] = useState(0);
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Update Progress</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Progress (%)</label><input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full" /><p className="text-center text-2xl font-bold mt-4">{progress}%</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onUpdate({ progress })} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Update</button></div></div></div>);
}

export function AddMilestoneProgressModal({ isOpen, onClose, onAdd }: any) {
  const [data, setData] = useState({ milestone: '', status: 'Not Started', completionDate: '' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Add Milestone Progress</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-2"><div><label className="block text-sm font-medium mb-1">Milestone</label><input type="text" value={data.milestone} onChange={(e) => setData({ ...data, milestone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Status</label><select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>Not Started</option><option>In Progress</option><option>Completed</option></select></div><div><label className="block text-sm font-medium mb-1">Completion Date</label><input type="date" value={data.completionDate} onChange={(e) => setData({ ...data, completionDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAdd(data)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Add</button></div></div></div>);
}

export function LogActivityModal({ isOpen, onClose, onLog }: any) {
  const [activity, setActivity] = useState('');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Log Activity</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Activity Description</label><textarea value={activity} onChange={(e) => setActivity(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-lg" placeholder="Describe the work completed..." /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onLog({ activity })} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Log</button></div></div></div>);
}

export function ViewProgressReportModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex justify-between items-center shrink-0 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Project Progress Report</h2>
              <p className="text-orange-100 text-sm">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-orange-600/50 p-2 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Overall Progress</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">73%</span>
                <span className="text-sm text-green-600 font-medium mb-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +5%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Budget Utilized</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">₹45.2L</span>
                <span className="text-xs text-gray-400 mb-1">/ ₹85L</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '53%' }}></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Planned vs Actual</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">-2 Days</span>
                <span className="text-sm text-red-600 font-medium mb-1">Delayed</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Critical path impacted by weather</p>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Safety Score</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">98/100</span>
                <Shield className="w-6 h-6 text-green-500 mb-1" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Zero incidents last 30 days</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">

              {/* Milestone Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Key Milestones
                </h3>
                <div className="space-y-3 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
                  {[
                    { title: 'Foundation Complete', date: 'Jan 15', status: 'completed' },
                    { title: 'Structural Framework', date: 'Feb 28', status: 'completed' },
                    { title: 'MEP Rough-in', date: 'Mar 15', status: 'in-progress' },
                    { title: 'Interior Finishes', date: 'Apr 30', status: 'pending' },
                  ].map((milestone, idx) => (
                    <div key={idx} className="relative flex items-start pl-10">
                      <div className={`absolute left - 0 top - 1 w - 10 h - 10 rounded - full border - 4 border - white flex items - center justify - center shadow - sm z - 10
                            ${milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                          milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                        } `}>
                        {milestone.status === 'completed' && <CheckCircle className="w-5 h-5" />}
                        {milestone.status === 'in-progress' && <Clock className="w-5 h-5" />}
                        {milestone.status === 'pending' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                            <p className="text-sm text-gray-500">Target: {milestone.date}</p>
                          </div>
                          <span className={`text - xs font - medium px - 2 py - 1 rounded - full capitalize
                                ${milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                              milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                            } `}>
                            {milestone.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-purple-600" />
                  Recent Site Activities
                </h3>
                <div className="space-y-2">
                  {[
                    { activity: 'HVAC Duct Installation', user: 'Mike Chen', time: '2 hours ago', type: 'Construction' },
                    { activity: 'Safety Inspection Passed', user: 'Sarah Jones', time: '5 hours ago', type: 'Safety' },
                    { activity: 'Concrete Pouring - Zone B', user: 'Dave Wilson', time: 'Yesterday', type: 'Construction' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={`w - 10 h - 10 rounded - full flex items - center justify - center text - white
                             ${act.type === 'Safety' ? 'bg-green-500' : 'bg-blue-500'} `}>
                          {act.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{act.activity}</p>
                          <p className="text-xs text-gray-500">Reported by {act.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-3">
              {/* Resource Utilization */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <h3 className="font-bold text-gray-900 mb-2">Resource Usage</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Manpower</span>
                      <span className="font-medium">45 / 50</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Equipment</span>
                      <span className="font-medium">12 / 15</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Radar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <h3 className="font-bold text-gray-900 mb-2">Risk Assessment</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Material Delay</p>
                      <p className="text-xs mt-1">Steel shipment delayed by 3 days due to port congestion.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-100 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Weather Alert</p>
                      <p className="text-xs mt-1">Forecast shows heavy rain next week.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approvals */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <h3 className="font-bold text-gray-900 mb-2">Pending Approvals</h3>
                <ul className="space-y-3">
                  {[
                    'Change Order #12',
                    'Safety Plan Rev 3',
                    'Material Sample B'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                      <span className="text-gray-700">{item}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Review</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-3 py-2 flex justify-between items-center rounded-b-lg shrink-0">
          <div className="text-xs text-gray-500">
            Report generated automatically by OptiForge AI
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompareProgressModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;

  const comparisonData = [
    { category: 'Site Preparation', planned: 100, actual: 100, status: 'On Track' },
    { category: 'Foundation', planned: 100, actual: 95, status: 'At Risk' },
    { category: 'Structural', planned: 75, actual: 60, status: 'Delayed' },
    { category: 'Mechanical', planned: 40, actual: 45, status: 'Ahead' },
    { category: 'Electrical', planned: 30, actual: 30, status: 'On Track' },
    { category: 'Plumbing', planned: 25, actual: 20, status: 'At Risk' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 flex justify-between items-center shrink-0 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Progress Comparison</h2>
              <p className="text-teal-100 text-sm">Planned vs Actual Metrics</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-teal-600/50 p-2 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Schedule Variance</span>
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">-5 Days</span>
                <span className="text-xs text-red-500 font-medium mb-1.5">Behind Schedule</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Cost Variance</span>
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">+2.4%</span>
                <span className="text-xs text-red-500 font-medium mb-1.5">Over Budget</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Resource Efficiency</span>
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">94%</span>
                <span className="text-xs text-green-500 font-medium mb-1.5">Optimal</span>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Work Package Completion</h3>
            <div className="space-y-3">
              {comparisonData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{item.category}</span>
                    <span className={`text - xs font - medium px - 2 py - 0.5 rounded
                             ${item.status === 'On Track' || item.status === 'Ahead' ? 'bg-green-100 text-green-700' :
                        item.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      } `}>
                      {item.status} ({item.actual}%)
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    {/* Planned Marker (Background Striped or similar to indicate target) */}
                    <div className="absolute top-0 bottom-0 bg-gray-200 border-r-2 border-gray-400 z-10" style={{ width: `${item.planned}% ` }}></div>
                    {/* Actual Progress */}
                    <div className={`absolute top - 0 bottom - 0 rounded - full transition - all duration - 1000 z - 20 opacity - 80
                             ${item.status === 'Delayed' ? 'bg-red-500' :
                        item.status === 'At Risk' ? 'bg-yellow-500' : 'bg-teal-500'
                      } `}
                      style={{ width: `${item.actual}% ` }}>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Actual: {item.actual}%</span>
                    <span>Planned: {item.planned}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 px-3 py-2 flex justify-end shrink-0 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Close</button>
        </div>
      </div>
    </div>
  );
}

export function SetKPIsModal({ isOpen, onClose, onSet }: any) {
  const [kpis, setKpis] = useState({ targetProgress: 80, taskCompletion: 90, budgetVariance: 5 });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center shrink-0 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Target className="text-white h-5 w-5" />
            <h2 className="text-xl font-bold text-white">Set KPIs</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-indigo-600/50 p-1 rounded transition-colors"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-8 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Progress (%)</label>
            <input type="number" value={kpis.targetProgress} onChange={(e) => setKpis({ ...kpis, targetProgress: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            <p className="text-xs text-gray-500 mt-1">Weekly progress target</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Completion Target (%)</label>
            <input type="number" value={kpis.taskCompletion} onChange={(e) => setKpis({ ...kpis, taskCompletion: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Variance Threshold (%)</label>
            <input type="number" value={kpis.budgetVariance} onChange={(e) => setKpis({ ...kpis, budgetVariance: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            <p className="text-xs text-gray-500 mt-1">Max allowed deviation before alert</p>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t shrink-0 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSet(kpis)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">Set KPIs</button>
        </div>
      </div>
    </div>
  );
}

export function FilterProgressModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({ dateRange: 'all', status: 'all' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex justify-between items-center shrink-0 rounded-t-lg">
          <div className="flex items-center gap-2">
            <MoreHorizontal className="text-white h-5 w-5" />
            <h2 className="text-xl font-bold text-white">Filter Progress</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-yellow-600/50 p-1 rounded transition-colors"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select value={filters.dateRange} onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500">
                <option value="all">All Statuses</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t shrink-0 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onApply(filters)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 shadow-sm">Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

export function ExportProgressModal({ isOpen, onClose, onExport }: any) {
  const [format, setFormat] = useState('PDF');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 flex justify-between items-center shrink-0 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Download className="text-white h-5 w-5" />
            <h2 className="text-xl font-bold text-white">Export Progress</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-emerald-600/50 p-1 rounded transition-colors"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
            <option value="PDF">PDF Report</option>
            <option value="Excel">Excel Spreadsheet</option>
            <option value="CSV">CSV Data</option>
            <option value="PPT">PowerPoint Presentation</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">The report will include all currently filtered data.</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t shrink-0 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onExport({ format })} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddPhotoModal({ isOpen, onClose, onAdd }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Add Progress Photos</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><div className="border-2 border-dashed rounded-lg p-8 text-center"><button className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Choose Photos</button></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAdd()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Upload</button></div></div></div>);
}

export function ViewTimelineModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;

  const timelineEvents = [
    { date: 'Jan 10', title: 'Project Kickoff', type: 'Milestone', desc: 'Initial team meeting and site handover.', status: 'Done' },
    { date: 'Jan 15', title: 'Site Preparation', type: 'Phase', desc: 'Clearing and leveling of the construction site.', status: 'Done' },
    { date: 'Feb 01', title: 'Foundation Work', type: 'Phase', desc: 'Excavation and concrete pouring for foundation.', status: 'Done' },
    { date: 'Mar 15', title: 'Structural Framework', type: 'Milestone', desc: 'Steel structure erection complete.', status: 'Active' },
    { date: 'Apr 01', title: 'MEP Installation', type: 'Phase', desc: 'Mechanical, Electrical, and Plumbing rough-ins.', status: 'Pending' },
    { date: 'May 15', title: 'Interior Finishes', type: 'Phase', desc: 'Drywall, painting, and flooring.', status: 'Pending' },
    { date: 'Jun 30', title: 'Project Handover', type: 'Milestone', desc: 'Final inspection and client handover.', status: 'Pending' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-2 flex justify-between items-center shrink-0 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Project Timeline</h2>
              <p className="text-pink-100 text-sm">Visual Roadmap</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-pink-600/50 p-2 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex items-start gap-3 group">
                  {/* Date Bubble */}
                  <div className="flex flex-col items-center shrink-0 w-16 z-10">
                    <div className={`w - 4 h - 4 rounded - full border - 4 border - white shadow - sm mb - 2
                             ${event.status === 'Done' ? 'bg-green-500' :
                        event.status === 'Active' ? 'bg-blue-500' : 'bg-gray-300'
                      } `}>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{event.date}</span>
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                    {/* Arrow pointing to line */}
                    <div className="absolute top-4 -left-2 w-4 h-4 bg-white transform rotate-45 border-l border-b border-gray-100"></div>

                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                        {event.type === 'Milestone' && <Target className="w-4 h-4 text-pink-600" />}
                        {event.type === 'Phase' && <BarChart2 className="w-4 h-4 text-blue-600 transform rotate-90" />}
                      </div>
                      <span className={`px - 2 py - 1 rounded text - xs font - medium uppercase
                                ${event.status === 'Done' ? 'bg-green-50 text-green-700' :
                          event.status === 'Active' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                        } `}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{event.desc}</p>

                    {/* Progress Line for Active/Done items */}
                    {event.status !== 'Pending' && (
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h - full rounded - full ${event.status === 'Done' ? 'bg-green-500 w-full' : 'bg-blue-500 w-1/2'} `}></div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-end">
                      <button className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 px-3 py-2 flex justify-end shrink-0 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Close</button>
        </div>
      </div>
    </div>
  );
}

export function ShareProgressModal({ isOpen, onClose, onShare }: any) {
  const [email, setEmail] = useState('');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Share Progress</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Share with</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="email@example.com" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onShare({ email })} className="px-4 py-2 bg-amber-600 text-white rounded-lg">Share</button></div></div></div>);
}

export function ViewDetailsModal({ isOpen, onClose, progress }: any) {
  if (!isOpen || !progress) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full "><div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Progress Details</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Detailed progress information</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Close</button></div></div></div>);
}
