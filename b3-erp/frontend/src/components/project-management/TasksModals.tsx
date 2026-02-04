import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

// 1. Create Task Modal (Blue)
export function CreateTaskModal({ isOpen, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({ taskName: '', projectId: '', assignedTo: '', startDate: '', dueDate: '', priority: 'Medium', status: 'Not Started', description: '' });
  const isValid = formData.taskName && formData.projectId && formData.assignedTo;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create Task</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Task Name *</label><input type="text" value={formData.taskName} onChange={(e) => setFormData({...formData, taskName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Project *</label><input type="text" value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Assigned To *</label><input type="text" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Priority</label><select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>Not Started</option><option>In Progress</option><option>On Hold</option><option>Completed</option></select></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onCreate(formData)} disabled={!isValid} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Create</button>
        </div>
      </div>
    </div>
  );
}

// 2. Edit Task Modal (Green)
export function EditTaskModal({ isOpen, onClose, onEdit, task }: any) {
  const [formData, setFormData] = useState({ taskName: task?.taskName || '', assignedTo: task?.assignedTo || '', startDate: task?.startDate || '', dueDate: task?.dueDate || '', priority: task?.priority || 'Medium', status: task?.status || 'Not Started' });
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Task</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Task Name</label><input type="text" value={formData.taskName} onChange={(e) => setFormData({...formData, taskName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Assigned To</label><input type="text" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Priority</label><select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onEdit(formData)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
}

// 3. Assign Task Modal (Purple)
export function AssignTaskModal({ isOpen, onClose, onAssign, task }: any) {
  const [assignee, setAssignee] = useState('');
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Assign Task</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium mb-2">Assign To</label>
          <input type="text" value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Enter name or email" />
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onAssign({ assignee })} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Assign</button>
        </div>
      </div>
    </div>
  );
}

// 4. Update Status Modal (Orange)
export function UpdateStatusModal({ isOpen, onClose, onUpdate, task }: any) {
  const [status, setStatus] = useState(task?.status || 'Not Started');
  const [progress, setProgress] = useState(task?.progress || 0);
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Status</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div><label className="block text-sm font-medium mb-2">Status</label><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option>Not Started</option><option>In Progress</option><option>On Hold</option><option>Completed</option><option>Cancelled</option></select></div>
          <div><label className="block text-sm font-medium mb-2">Progress (%)</label><input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full" /><p className="text-center text-lg font-bold">{progress}%</p></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onUpdate({ status, progress })} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Update</button>
        </div>
      </div>
    </div>
  );
}

// 5. Add Subtasks Modal (Teal)
export function AddSubtasksModal({ isOpen, onClose, onAdd, task }: any) {
  const [subtasks, setSubtasks] = useState([{ name: '', assignee: '', dueDate: '' }]);
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Subtasks</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-3">
            {subtasks.map((st, i) => (
              <div key={i} className="border rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-xs font-medium mb-1">Subtask Name</label><input type="text" value={st.name} onChange={(e) => { const u = [...subtasks]; u[i].name = e.target.value; setSubtasks(u); }} className="w-full px-2 py-1.5 text-sm border rounded" /></div>
                  <div><label className="block text-xs font-medium mb-1">Assignee</label><input type="text" value={st.assignee} onChange={(e) => { const u = [...subtasks]; u[i].assignee = e.target.value; setSubtasks(u); }} className="w-full px-2 py-1.5 text-sm border rounded" /></div>
                  <div><label className="block text-xs font-medium mb-1">Due Date</label><input type="date" value={st.dueDate} onChange={(e) => { const u = [...subtasks]; u[i].dueDate = e.target.value; setSubtasks(u); }} className="w-full px-2 py-1.5 text-sm border rounded" /></div>
                </div>
              </div>
            ))}
            <button onClick={() => setSubtasks([...subtasks, { name: '', assignee: '', dueDate: '' }])} className="w-full py-2 border-2 border-dashed rounded-lg text-teal-600 hover:bg-teal-50"><Plus className="h-4 w-4 inline mr-2" />Add Subtask</button>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onAdd({ subtasks })} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Add Subtasks</button>
        </div>
      </div>
    </div>
  );
}

// 6. Add Dependencies Modal (Indigo)
export function AddDependenciesModal({ isOpen, onClose, onAdd, task }: any) {
  const [dependencies, setDependencies] = useState([{ taskId: '', type: 'Finish-to-Start' }]);
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Dependencies</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {dependencies.map((dep, i) => (
              <div key={i} className="flex space-x-3">
                <div className="flex-1"><input type="text" value={dep.taskId} onChange={(e) => { const u = [...dependencies]; u[i].taskId = e.target.value; setDependencies(u); }} className="w-full px-3 py-2 border rounded-lg" placeholder="Task ID" /></div>
                <div><select value={dep.type} onChange={(e) => { const u = [...dependencies]; u[i].type = e.target.value; setDependencies(u); }} className="px-3 py-2 border rounded-lg"><option>Finish-to-Start</option><option>Start-to-Start</option><option>Finish-to-Finish</option><option>Start-to-Finish</option></select></div>
                <button onClick={() => setDependencies(dependencies.filter((_, idx) => idx !== i))} className="p-2 text-red-600"><Trash2 className="h-5 w-5" /></button>
              </div>
            ))}
            <button onClick={() => setDependencies([...dependencies, { taskId: '', type: 'Finish-to-Start' }])} className="w-full py-2 border-2 border-dashed rounded-lg text-indigo-600"><Plus className="h-4 w-4 inline mr-2" />Add Dependency</button>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onAdd({ dependencies })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add</button>
        </div>
      </div>
    </div>
  );
}

// 7. Add Comments Modal (Yellow)
export function AddCommentsModal({ isOpen, onClose, onAdd, task }: any) {
  const [comment, setComment] = useState('');
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Comment</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-lg" placeholder="Add your comment..." />
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onAdd({ comment })} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Add Comment</button>
        </div>
      </div>
    </div>
  );
}

// 8. Upload Attachments Modal (Cyan)
export function UploadAttachmentsModal({ isOpen, onClose, onUpload, task }: any) {
  const [files, setFiles] = useState([{ name: '', type: '' }]);
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Upload Attachments</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Choose Files</button>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onUpload({ files })} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Upload</button>
        </div>
      </div>
    </div>
  );
}

// 9. Set Reminder Modal (Pink)
export function SetReminderModal({ isOpen, onClose, onSet, task }: any) {
  const [reminder, setReminder] = useState({ date: '', time: '', type: 'Email' });
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Set Reminder</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" value={reminder.date} onChange={(e) => setReminder({...reminder, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Time</label><input type="time" value={reminder.time} onChange={(e) => setReminder({...reminder, time: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Type</label><select value={reminder.type} onChange={(e) => setReminder({...reminder, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>Email</option><option>SMS</option><option>Push Notification</option></select></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onSet(reminder)} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Set Reminder</button>
        </div>
      </div>
    </div>
  );
}

// 10. Clone Task Modal (Emerald)
export function CloneTaskModal({ isOpen, onClose, onClone, task }: any) {
  const [copies, setCopies] = useState(1);
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Clone Task</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-2">Clone task: {task?.taskName}</p>
          <label className="block text-sm font-medium mb-2">Number of Copies</label>
          <input type="number" min="1" max="10" value={copies} onChange={(e) => setCopies(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onClone({ copies })} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Clone</button>
        </div>
      </div>
    </div>
  );
}

// 11. Move Task Modal (Amber)
export function MoveTaskModal({ isOpen, onClose, onMove, task }: any) {
  const [targetProject, setTargetProject] = useState('');
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Move Task</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium mb-2">Move to Project</label>
          <input type="text" value={targetProject} onChange={(e) => setTargetProject(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Enter project ID" />
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onMove({ targetProject })} className="px-4 py-2 bg-amber-600 text-white rounded-lg">Move</button>
        </div>
      </div>
    </div>
  );
}

// 12. Delete Task Modal (Red)
export function DeleteTaskModal({ isOpen, onClose, onDelete, task }: any) {
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Delete Task</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">Are you sure you want to delete this task?</p>
          <p className="text-sm text-gray-500 mt-2">Task: {task?.taskName}</p>
          <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onDelete()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  );
}

// 13. Filter Tasks Modal (Violet)
export function FilterTasksModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', assignee: 'all', dateRange: 'all' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filter Tasks</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium mb-1">Status</label><select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All</option><option>Not Started</option><option>In Progress</option><option>Completed</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Priority</label><select value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Assignee</label><input type="text" value={filters.assignee} onChange={(e) => setFilters({...filters, assignee: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Date Range</label><select value={filters.dateRange} onChange={(e) => setFilters({...filters, dateRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All Time</option><option>Today</option><option>This Week</option><option>This Month</option></select></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onApply(filters)} className="px-4 py-2 bg-violet-600 text-white rounded-lg">Apply</button>
        </div>
      </div>
    </div>
  );
}

// 14. Bulk Update Modal (Rose)
export function BulkUpdateModal({ isOpen, onClose, onUpdate, selectedTasks }: any) {
  const [updates, setUpdates] = useState({ status: '', priority: '', assignee: '' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Bulk Update</h2>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <p className="text-sm text-gray-600">Update {selectedTasks?.length || 0} selected tasks</p>
          <div><label className="block text-sm font-medium mb-1">Status</label><select value={updates.status} onChange={(e) => setUpdates({...updates, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">No Change</option><option>In Progress</option><option>Completed</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Priority</label><select value={updates.priority} onChange={(e) => setUpdates({...updates, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="">No Change</option><option>Low</option><option>Medium</option><option>High</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Assignee</label><input type="text" value={updates.assignee} onChange={(e) => setUpdates({...updates, assignee: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Leave empty for no change" /></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onUpdate(updates)} className="px-4 py-2 bg-rose-600 text-white rounded-lg">Update All</button>
        </div>
      </div>
    </div>
  );
}

// 15. View Details Modal (Slate)
export function ViewDetailsModal({ isOpen, onClose, task }: any) {
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex justify-between items-center">
          <div><h2 className="text-xl font-bold text-white">{task.taskName}</h2><p className="text-sm text-slate-200">{task.taskId}</p></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg"><p className="text-sm text-blue-600 font-medium">Assigned To</p><p className="text-lg font-bold">{task.assignedTo}</p></div>
            <div className="bg-green-50 p-3 rounded-lg"><p className="text-sm text-green-600 font-medium">Status</p><p className="text-lg font-bold">{task.status}</p></div>
            <div className="bg-purple-50 p-3 rounded-lg"><p className="text-sm text-purple-600 font-medium">Priority</p><p className="text-lg font-bold">{task.priority}</p></div>
            <div className="bg-orange-50 p-3 rounded-lg"><p className="text-sm text-orange-600 font-medium">Progress</p><p className="text-lg font-bold">{task.progress}%</p></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end border-t">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}
