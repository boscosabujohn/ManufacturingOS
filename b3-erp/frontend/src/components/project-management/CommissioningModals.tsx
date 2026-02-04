'use client';

import { useState } from 'react';
import { X, PlayCircle, CheckCircle, XCircle, AlertCircle, FileText, Upload, Calendar, Edit, Users, TrendingUp, ClipboardCheck, Shield, Eye, Award } from 'lucide-react';

// 1. Schedule Commissioning Modal (Blue)
export function ScheduleCommissioningModal({ isOpen, onClose, onSchedule }: any) {
  const [formData, setFormData] = useState({ projectId: '', equipmentSystem: '', type: 'Commissioning', scheduledDate: '', duration: '', engineer: '', clientRep: '' });
  const isValid = formData.projectId && formData.equipmentSystem && formData.scheduledDate && formData.engineer;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg"><Calendar className="h-6 w-6 text-white" /></div>
            <div><h2 className="text-xl font-bold text-white">Schedule Commissioning Activity</h2><p className="text-blue-100 text-sm">Plan system commissioning and testing</p></div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
              <select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select Project</option><option value="PRJ-2025-001">PRJ-2025-001 - Taj Hotels</option><option value="PRJ-2025-002">PRJ-2025-002 - BigBasket</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Commissioning Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="Pre-Commissioning">Pre-Commissioning</option><option value="Commissioning">Commissioning</option><option value="Performance Test">Performance Test</option><option value="Final Acceptance">Final Acceptance</option>
              </select>
            </div>
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Equipment/System *</label>
              <input type="text" value={formData.equipmentSystem} onChange={(e) => setFormData({ ...formData, equipmentSystem: e.target.value })} placeholder="e.g., Gas Cooking Range System" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
              <input type="date" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="4" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Commissioning Engineer *</label>
              <input type="text" value={formData.engineer} onChange={(e) => setFormData({ ...formData, engineer: e.target.value })} placeholder="Engineer name" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Client Representative</label>
              <input type="text" value={formData.clientRep} onChange={(e) => setFormData({ ...formData, clientRep: e.target.value })} placeholder="Client rep name" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={() => isValid && onSchedule(formData)} disabled={!isValid} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">Schedule</button>
        </div>
      </div>
    </div>
  );
}

// 2. Edit Activity Modal (Green)
export function EditActivityModal({ isOpen, onClose, onEdit, activity }: any) {
  const [formData, setFormData] = useState({ type: activity?.commissioningType || 'Commissioning', scheduledDate: activity?.scheduledDate || '', duration: activity?.duration || '', engineer: activity?.engineer || '' });
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3"><div className="bg-white/20 p-2 rounded-lg"><Edit className="h-6 w-6 text-white" /></div><div><h2 className="text-xl font-bold text-white">Edit Activity</h2><p className="text-green-100 text-sm">{activity.activityNumber}</p></div></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="Pre-Commissioning">Pre-Commissioning</option><option value="Commissioning">Commissioning</option><option value="Performance Test">Performance Test</option><option value="Final Acceptance">Final Acceptance</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label><input type="date" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label><input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Engineer</label><input type="text" value={formData.engineer} onChange={(e) => setFormData({ ...formData, engineer: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onEdit(formData)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button></div>
      </div>
    </div>
  );
}

// 3. Update Test Parameters Modal (Purple)
export function UpdateTestParametersModal({ isOpen, onClose, onUpdate, activity }: any) {
  const [parameters, setParameters] = useState(activity?.testParameters || []);
  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3"><div className="bg-white/20 p-2 rounded-lg"><ClipboardCheck className="h-6 w-6 text-white" /></div><div><h2 className="text-xl font-bold text-white">Update Test Parameters</h2><p className="text-purple-100 text-sm">{activity.equipmentSystem}</p></div></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-3">
            {parameters.map((param: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 grid grid-cols-12 gap-3">
                <div className="col-span-4"><p className="text-sm font-medium text-gray-900">{param.parameter}</p><p className="text-xs text-gray-600">Spec: {param.specification}</p></div>
                <div className="col-span-4"><label className="block text-xs font-medium text-gray-700 mb-1">Actual Value</label><input type="text" value={param.actualValue} onChange={(e) => handleChange(index, 'actualValue', e.target.value)} className="w-full px-2 py-1 text-sm border rounded" /></div>
                <div className="col-span-4"><label className="block text-xs font-medium text-gray-700 mb-1">Result</label><select value={param.result} onChange={(e) => handleChange(index, 'result', e.target.value)} className="w-full px-2 py-1 text-sm border rounded"><option value="Pass">Pass</option><option value="Fail">Fail</option><option value="NA">N/A</option></select></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onUpdate({ parameters })} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Save</button></div>
      </div>
    </div>
  );
}

// 4. Update Checklist Modal (Orange)
export function UpdateChecklistModal({ isOpen, onClose, onUpdate, activity }: any) {
  const [checklist, setChecklist] = useState(activity?.checklistItems || []);
  const handleChange = (index: number, status: string) => {
    const updated = [...checklist];
    updated[index].status = status;
    setChecklist(updated);
  };
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3"><div className="bg-white/20 p-2 rounded-lg"><CheckCircle className="h-6 w-6 text-white" /></div><div><h2 className="text-xl font-bold text-white">Update Checklist</h2><p className="text-orange-100 text-sm">{activity.activityNumber}</p></div></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-3">
          {checklist.map((item: any, index: number) => (
            <div key={index} className="border rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-gray-900">{item.item}</p>
              <select value={item.status} onChange={(e) => handleChange(index, e.target.value)} className="px-3 py-1 text-sm border rounded">
                <option value="Complete">Complete</option><option value="Incomplete">Incomplete</option><option value="NA">N/A</option>
              </select>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onUpdate({ checklist })} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Save</button></div>
      </div>
    </div>
  );
}

// 5. Add Observations Modal (Teal)
export function AddObservationsModal({ isOpen, onClose, onAdd, activity }: any) {
  const [observations, setObservations] = useState(activity?.observations || '');
  const [recommendations, setRecommendations] = useState(activity?.recommendations || '');
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3"><div className="bg-white/20 p-2 rounded-lg"><FileText className="h-6 w-6 text-white" /></div><div><h2 className="text-xl font-bold text-white">Add Observations</h2><p className="text-teal-100 text-sm">Document findings and recommendations</p></div></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Observations</label><textarea value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Record your observations during commissioning..." rows={5} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label><textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} placeholder="Recommendations for operation and maintenance..." rows={4} className="w-full px-3 py-2 border rounded-lg" /></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAdd({ observations, recommendations })} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Save</button></div>
      </div>
    </div>
  );
}

// 6-15: Remaining modals in compact format
export function UploadDocumentsModal({ isOpen, onClose, onUpload, activity }: any) {
  const [files, setFiles] = useState<string[]>([]);
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Upload Documents</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div className="border-2 border-dashed rounded-lg p-8 text-center"><Upload className="h-12 w-12 text-gray-400 mb-3" /><p className="text-sm text-gray-600">Test reports, certificates, photos</p><button onClick={() => setFiles(['doc1.pdf', 'doc2.pdf'])} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Select Files</button></div>
          {files.length > 0 && <div className="space-y-2">{files.map((f, i) => <div key={i} className="bg-gray-50 p-3 rounded-lg text-sm">{f}</div>)}</div>}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onUpload({ files })} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Upload</button></div>
      </div>
    </div>
  );
}

export function UpdateStatusModal({ isOpen, onClose, onUpdate, activity }: any) {
  const [status, setStatus] = useState(activity?.status || 'Scheduled');
  const [progress, setProgress] = useState(activity?.progress || 0);
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Status</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="Scheduled">Scheduled</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Failed">Failed</option><option value="Rescheduled">Rescheduled</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Progress: {progress}%</label><input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(parseInt(e.target.value))} className="w-full" /></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onUpdate({ status, progress })} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Update</button></div>
      </div>
    </div>
  );
}

export function IssueCertificateModal({ isOpen, onClose, onIssue, activity }: any) {
  const [certData, setCertData] = useState({ certificateNumber: '', issuedBy: '', issueDate: new Date().toISOString().split('T')[0] });
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3"><div className="bg-white/20 p-2 rounded-lg"><Award className="h-6 w-6 text-white" /></div><div><h2 className="text-xl font-bold text-white">Issue Commissioning Certificate</h2><p className="text-emerald-100 text-sm">{activity.equipmentSystem}</p></div></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div className="bg-emerald-50 p-3 rounded-lg"><p className="text-sm font-medium">System: {activity.equipmentSystem}</p><p className="text-sm text-gray-600">All tests passed: {activity.passedChecks}/{activity.totalChecks}</p></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Certificate Number *</label><input type="text" value={certData.certificateNumber} onChange={(e) => setCertData({ ...certData, certificateNumber: e.target.value })} placeholder="CERT-2025-XXX" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Issued By *</label><input type="text" value={certData.issuedBy} onChange={(e) => setCertData({ ...certData, issuedBy: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label><input type="date" value={certData.issueDate} onChange={(e) => setCertData({ ...certData, issueDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onIssue(certData)} disabled={!certData.certificateNumber || !certData.issuedBy} className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50">Issue Certificate</button></div>
      </div>
    </div>
  );
}

export function AssignEngineerModal({ isOpen, onClose, onAssign, activity }: any) {
  const [engineer, setEngineer] = useState({ name: '', id: '' });
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Assign Engineer</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Engineer Name</label><input type="text" value={engineer.name} onChange={(e) => setEngineer({ ...engineer, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Engineer ID</label><input type="text" value={engineer.id} onChange={(e) => setEngineer({ ...engineer, id: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAssign(engineer)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Assign</button></div>
      </div>
    </div>
  );
}

export function AddTestParameterModal({ isOpen, onClose, onAdd, activity }: any) {
  const [param, setParam] = useState({ parameter: '', specification: '', actualValue: '', result: 'Pass' });
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Test Parameter</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Parameter Name</label><input type="text" value={param.parameter} onChange={(e) => setParam({ ...param, parameter: e.target.value })} placeholder="e.g., Gas Pressure" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Specification</label><input type="text" value={param.specification} onChange={(e) => setParam({ ...param, specification: e.target.value })} placeholder="e.g., 17-20 mbar" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Actual Value</label><input type="text" value={param.actualValue} onChange={(e) => setParam({ ...param, actualValue: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Result</label><select value={param.result} onChange={(e) => setParam({ ...param, result: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="Pass">Pass</option><option value="Fail">Fail</option><option value="NA">N/A</option></select></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAdd(param)} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Add</button></div>
      </div>
    </div>
  );
}

export function GenerateReportModal({ isOpen, onClose, onGenerate, activity }: any) {
  const [options, setOptions] = useState({ includeTests: true, includeChecklist: true, includeObservations: true, format: 'pdf' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Generate Report</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-2"><input type="checkbox" checked={options.includeTests} onChange={(e) => setOptions({ ...options, includeTests: e.target.checked })} className="h-4 w-4" /><label className="text-sm">Include Test Parameters</label></div>
          <div className="flex items-center space-x-2"><input type="checkbox" checked={options.includeChecklist} onChange={(e) => setOptions({ ...options, includeChecklist: e.target.checked })} className="h-4 w-4" /><label className="text-sm">Include Checklist</label></div>
          <div className="flex items-center space-x-2"><input type="checkbox" checked={options.includeObservations} onChange={(e) => setOptions({ ...options, includeObservations: e.target.checked })} className="h-4 w-4" /><label className="text-sm">Include Observations</label></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Format</label><select value={options.format} onChange={(e) => setOptions({ ...options, format: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="pdf">PDF Document</option><option value="excel">Excel Spreadsheet</option></select></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onGenerate(options)} className="px-4 py-2 bg-violet-600 text-white rounded-lg">Generate</button></div>
      </div>
    </div>
  );
}

export function ExportDataModal({ isOpen, onClose, onExport }: any) {
  const [format, setFormat] = useState('excel');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Export Data</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6"><select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="excel">Excel (.xlsx)</option><option value="csv">CSV (.csv)</option><option value="pdf">PDF Report</option></select></div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onExport({ format })} className="px-4 py-2 bg-amber-600 text-white rounded-lg">Export</button></div>
      </div>
    </div>
  );
}

export function RescheduleModal({ isOpen, onClose, onReschedule, activity }: any) {
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Reschedule Activity</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div className="bg-rose-50 p-3 rounded-lg"><p className="text-sm">Current: {activity.scheduledDate}</p></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">New Date</label><input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Reason</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onReschedule({ newDate, reason })} className="px-4 py-2 bg-rose-600 text-white rounded-lg">Reschedule</button></div>
      </div>
    </div>
  );
}

export function AddDependenciesModal({ isOpen, onClose, onAdd, activity }: any) {
  const [dependency, setDependency] = useState('');
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Dependencies</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Dependency Activity</label><input type="text" value={dependency} onChange={(e) => setDependency(e.target.value)} placeholder="COM-2025-XXX" className="w-full px-3 py-2 border rounded-lg" /></div>
          {activity.dependencies && activity.dependencies.length > 0 && (<div><p className="text-sm font-medium text-gray-700 mb-2">Current Dependencies:</p>{activity.dependencies.map((d: string, i: number) => <div key={i} className="bg-gray-50 p-2 rounded text-sm">{d}</div>)}</div>)}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onAdd({ dependency })} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Add</button></div>
      </div>
    </div>
  );
}

export function ViewFullDetailsModal({ isOpen, onClose, activity }: any) {
  if (!isOpen || !activity) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{activity.activityNumber} - {activity.equipmentSystem}</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-green-50 p-3 rounded"><p className="text-xs text-gray-600">Passed</p><p className="text-2xl font-bold text-green-600">{activity.passedChecks}</p></div>
            <div className="bg-red-50 p-3 rounded"><p className="text-xs text-gray-600">Failed</p><p className="text-2xl font-bold text-red-600">{activity.failedChecks}</p></div>
            <div className="bg-blue-50 p-3 rounded"><p className="text-xs text-gray-600">Progress</p><p className="text-2xl font-bold text-blue-600">{activity.progress}%</p></div>
            <div className="bg-purple-50 p-3 rounded"><p className="text-xs text-gray-600">Duration</p><p className="text-2xl font-bold text-purple-600">{activity.duration}h</p></div>
          </div>
          <div><h3 className="font-semibold mb-2">Test Parameters</h3>{activity.testParameters?.map((p: any, i: number) => <div key={i} className="border-b py-2"><p className="text-sm font-medium">{p.parameter}: {p.actualValue}</p><p className="text-xs text-gray-600">Result: <span className={p.result === 'Pass' ? 'text-green-600' : 'text-red-600'}>{p.result}</span></p></div>)}</div>
          {activity.observations && <div className="bg-gray-50 p-3 rounded"><h3 className="font-semibold mb-2">Observations</h3><p className="text-sm text-gray-700">{activity.observations}</p></div>}
          {activity.certificateIssued && <div className="bg-emerald-50 p-3 rounded border border-emerald-200"><p className="text-sm font-semibold text-emerald-900">✓ Certificate Issued: {activity.certificateNumber}</p></div>}
        </div>
        <div className="bg-gray-50 px-3 py-2 border-t flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Close</button></div>
      </div>
    </div>
  );
}
