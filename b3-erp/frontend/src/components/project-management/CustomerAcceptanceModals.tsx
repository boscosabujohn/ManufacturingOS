import { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

// 1. Schedule Acceptance Modal (Blue)
export function ScheduleAcceptanceModal({ isOpen, onClose, onSchedule }: any) {
  const [formData, setFormData] = useState({ projectId: '', customer: '', customerContact: '', customerEmail: '', acceptanceDate: '', acceptanceType: 'Final', phase: '', deliverables: '' });
  const isValid = formData.projectId && formData.customer && formData.customerContact && formData.acceptanceDate && formData.acceptanceType;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Schedule Customer Acceptance</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project ID *</label><input type="text" value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="PRJ-2025-XXX" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label><input type="text" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Customer Name" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Contact *</label><input type="text" value={formData.customerContact} onChange={(e) => setFormData({...formData, customerContact: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Contact Person" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label><input type="email" value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="email@example.com" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Date *</label><input type="date" value={formData.acceptanceDate} onChange={(e) => setFormData({...formData, acceptanceDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Type *</label><select value={formData.acceptanceType} onChange={(e) => setFormData({...formData, acceptanceType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"><option value="Provisional">Provisional</option><option value="Final">Final</option><option value="Partial">Partial</option><option value="Conditional">Conditional</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phase</label><input type="text" value={formData.phase} onChange={(e) => setFormData({...formData, phase: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Project Handover" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (comma-separated)</label><textarea value={formData.deliverables} onChange={(e) => setFormData({...formData, deliverables: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Equipment A, Equipment B, Training" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSchedule(formData)} disabled={!isValid} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Schedule</button>
        </div>
      </div>
    </div>
  );
}

// 2. Edit Acceptance Modal (Green)
export function EditAcceptanceModal({ isOpen, onClose, onEdit, acceptance }: any) {
  const [formData, setFormData] = useState({ customer: acceptance?.customer || '', customerContact: acceptance?.customerContact || '', acceptanceDate: acceptance?.acceptanceDate || '', acceptanceType: acceptance?.acceptanceType || 'Final', phase: acceptance?.phase || '' });
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Acceptance - {acceptance.acceptanceNumber}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer</label><input type="text" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Contact</label><input type="text" value={formData.customerContact} onChange={(e) => setFormData({...formData, customerContact: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Date</label><input type="date" value={formData.acceptanceDate} onChange={(e) => setFormData({...formData, acceptanceDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Type</label><select value={formData.acceptanceType} onChange={(e) => setFormData({...formData, acceptanceType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"><option value="Provisional">Provisional</option><option value="Final">Final</option><option value="Partial">Partial</option><option value="Conditional">Conditional</option></select></div>
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Phase</label><input type="text" value={formData.phase} onChange={(e) => setFormData({...formData, phase: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onEdit(formData)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// 3. Update Criteria Modal (Purple)
export function UpdateCriteriaModal({ isOpen, onClose, onUpdate, acceptance }: any) {
  const [criteria, setCriteria] = useState(acceptance?.acceptanceCriteria || []);
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Acceptance Criteria</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-3">
            {criteria.map((c: any, i: number) => (
              <div key={i} className="border rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Criterion</label><input type="text" value={c.criterion} onChange={(e) => { const updated = [...criteria]; updated[i].criterion = e.target.value; setCriteria(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-purple-500" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={c.status} onChange={(e) => { const updated = [...criteria]; updated[i].status = e.target.value; setCriteria(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-purple-500"><option value="Met">Met</option><option value="Not Met">Not Met</option><option value="Partially Met">Partially Met</option><option value="Waived">Waived</option></select></div>
                  <div className="col-span-3"><label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label><input type="text" value={c.remarks} onChange={(e) => { const updated = [...criteria]; updated[i].remarks = e.target.value; setCriteria(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-purple-500" /></div>
                </div>
              </div>
            ))}
            <button onClick={() => setCriteria([...criteria, { criterion: '', status: 'Not Met', remarks: '' }])} className="w-full py-2 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 flex items-center justify-center"><Plus className="h-4 w-4 mr-2" />Add Criterion</button>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onUpdate({ criteria })} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Update Criteria</button>
        </div>
      </div>
    </div>
  );
}

// 4. Update Documentation Modal (Orange)
export function UpdateDocumentationModal({ isOpen, onClose, onUpdate, acceptance }: any) {
  const [docs, setDocs] = useState(acceptance?.documentation || []);
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Documentation Status</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-3">
            {docs.map((d: any, i: number) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex-1"><input type="text" value={d.documentName} onChange={(e) => { const updated = [...docs]; updated[i].documentName = e.target.value; setDocs(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-orange-500" placeholder="Document Name" /></div>
                <div className="w-40"><select value={d.status} onChange={(e) => { const updated = [...docs]; updated[i].status = e.target.value; setDocs(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-orange-500"><option value="Pending">Pending</option><option value="Submitted">Submitted</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
                <button onClick={() => setDocs(docs.filter((_: any, idx: number) => idx !== i))} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => setDocs([...docs, { documentName: '', status: 'Pending', submittedDate: new Date().toISOString().split('T')[0] }])} className="w-full py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 flex items-center justify-center"><Plus className="h-4 w-4 mr-2" />Add Document</button>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onUpdate({ docs })} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Update Documentation</button>
        </div>
      </div>
    </div>
  );
}

// 5. Add Punch List Items Modal (Red)
export function AddPunchListItemsModal({ isOpen, onClose, onAdd, acceptance }: any) {
  const [items, setItems] = useState([{ item: '', priority: 'Medium', status: 'Open', assignedTo: '', targetDate: '' }]);
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Punch List Items</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="border rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Item Description</label><input type="text" value={item.item} onChange={(e) => { const updated = [...items]; updated[i].item = e.target.value; setItems(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-red-500" placeholder="Describe the punch list item" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Priority</label><select value={item.priority} onChange={(e) => { const updated = [...items]; updated[i].priority = e.target.value; setItems(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-red-500"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option></select></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={item.status} onChange={(e) => { const updated = [...items]; updated[i].status = e.target.value; setItems(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-red-500"><option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Assigned To</label><input type="text" value={item.assignedTo} onChange={(e) => { const updated = [...items]; updated[i].assignedTo = e.target.value; setItems(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-red-500" placeholder="Engineer Name" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Target Date</label><input type="date" value={item.targetDate} onChange={(e) => { const updated = [...items]; updated[i].targetDate = e.target.value; setItems(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-red-500" /></div>
                </div>
              </div>
            ))}
            <button onClick={() => setItems([...items, { item: '', priority: 'Medium', status: 'Open', assignedTo: '', targetDate: '' }])} className="w-full py-2 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center"><Plus className="h-4 w-4 mr-2" />Add Item</button>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onAdd({ items })} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Add Punch Items</button>
        </div>
      </div>
    </div>
  );
}

// 6. Update Training Status Modal (Teal)
export function UpdateTrainingStatusModal({ isOpen, onClose, onUpdate, acceptance }: any) {
  const [training, setTraining] = useState({ completed: acceptance?.trainingCompleted || false, trainees: '', duration: '', completionDate: '', certificationIssued: false, trainerName: '' });
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Training Status</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2"><input type="checkbox" checked={training.completed} onChange={(e) => setTraining({...training, completed: e.target.checked})} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" /><label className="text-sm font-medium text-gray-700">Training Completed</label></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Number of Trainees</label><input type="text" value={training.trainees} onChange={(e) => setTraining({...training, trainees: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="e.g., 6 staff members" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label><input type="text" value={training.duration} onChange={(e) => setTraining({...training, duration: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="e.g., 3 days" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label><input type="date" value={training.completionDate} onChange={(e) => setTraining({...training, completionDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Trainer Name</label><input type="text" value={training.trainerName} onChange={(e) => setTraining({...training, trainerName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="Trainer Name" /></div>
            </div>
            <div className="flex items-center space-x-2"><input type="checkbox" checked={training.certificationIssued} onChange={(e) => setTraining({...training, certificationIssued: e.target.checked})} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" /><label className="text-sm font-medium text-gray-700">Certification Issued</label></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onUpdate(training)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Update Training</button>
        </div>
      </div>
    </div>
  );
}

// 7. Update Warranty Modal (Indigo)
export function UpdateWarrantyModal({ isOpen, onClose, onUpdate, acceptance }: any) {
  const [warranty, setWarranty] = useState({ warrantyPeriod: acceptance?.warrantyPeriod || '', warrantyStartDate: acceptance?.warrantyStartDate || '', amcOffered: acceptance?.amcOffered || false, amcDuration: acceptance?.amcDuration || '', amcCost: '', terms: '' });
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Warranty & AMC</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Warranty Period</label><input type="text" value={warranty.warrantyPeriod} onChange={(e) => setWarranty({...warranty, warrantyPeriod: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 12 months" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Warranty Start Date</label><input type="date" value={warranty.warrantyStartDate} onChange={(e) => setWarranty({...warranty, warrantyStartDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" /></div>
            </div>
            <div className="border-t pt-4"><div className="flex items-center space-x-2 mb-3"><input type="checkbox" checked={warranty.amcOffered} onChange={(e) => setWarranty({...warranty, amcOffered: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" /><label className="text-sm font-medium text-gray-700">AMC Offered</label></div>
              {warranty.amcOffered && (
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">AMC Duration</label><input type="text" value={warranty.amcDuration} onChange={(e) => setWarranty({...warranty, amcDuration: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 24 months" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">AMC Cost</label><input type="text" value={warranty.amcCost} onChange={(e) => setWarranty({...warranty, amcCost: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="₹" /></div>
                </div>
              )}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label><textarea value={warranty.terms} onChange={(e) => setWarranty({...warranty, terms: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Warranty terms and conditions" /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onUpdate(warranty)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Update Warranty</button>
        </div>
      </div>
    </div>
  );
}

// 8. Sign Acceptance Modal (Emerald)
export function SignAcceptanceModal({ isOpen, onClose, onSign, acceptance }: any) {
  const [signature, setSignature] = useState({ signedBy: '', designation: '', signedDate: new Date().toISOString().split('T')[0], witnessedBy: '', witnessDesignation: '', password: '' });
  const isValid = signature.signedBy && signature.designation && signature.signedDate && signature.password;
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Sign Acceptance - {acceptance.acceptanceNumber}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-2"><p className="text-sm text-emerald-800"><strong>Note:</strong> By signing this acceptance, you confirm that all deliverables meet the specified criteria and documentation is complete.</p></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Signed By *</label><input type="text" value={signature.signedBy} onChange={(e) => setSignature({...signature, signedBy: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your Name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label><input type="text" value={signature.designation} onChange={(e) => setSignature({...signature, designation: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Your Designation" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Signed Date *</label><input type="date" value={signature.signedDate} onChange={(e) => setSignature({...signature, signedDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Witnessed By</label><input type="text" value={signature.witnessedBy} onChange={(e) => setSignature({...signature, witnessedBy: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Witness Name" /></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label><input type="password" value={signature.password} onChange={(e) => setSignature({...signature, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Enter your password to confirm" /></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSign(signature)} disabled={!isValid} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">Sign Acceptance</button>
        </div>
      </div>
    </div>
  );
}

// 9. Update Status Modal (Yellow)
export function UpdateStatusModal({ isOpen, onClose, onUpdate, acceptance }: any) {
  const [status, setStatus] = useState({ overallStatus: acceptance?.overallStatus || 'Pending', remarks: acceptance?.remarks || '' });
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Acceptance Status</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Overall Status</label><select value={status.overallStatus} onChange={(e) => setStatus({...status, overallStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"><option value="Pending">Pending</option><option value="Accepted">Accepted</option><option value="Rejected">Rejected</option><option value="Conditional">Conditional</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label><textarea value={status.remarks} onChange={(e) => setStatus({...status, remarks: e.target.value})} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder="Add any remarks or conditions..." /></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onUpdate(status)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Update Status</button>
        </div>
      </div>
    </div>
  );
}

// 10. Upload Attachments Modal (Cyan)
export function UploadAttachmentsModal({ isOpen, onClose, onUpload, acceptance }: any) {
  const [files, setFiles] = useState([{ fileName: '', fileType: '', category: 'Test Report', uploadDate: new Date().toISOString().split('T')[0] }]);
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Upload Attachments</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-3">
            {files.map((file, i) => (
              <div key={i} className="border rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">File Name</label><input type="text" value={file.fileName} onChange={(e) => { const updated = [...files]; updated[i].fileName = e.target.value; setFiles(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-cyan-500" placeholder="document.pdf" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">File Type</label><input type="text" value={file.fileType} onChange={(e) => { const updated = [...files]; updated[i].fileType = e.target.value; setFiles(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-cyan-500" placeholder="PDF, Image, etc." /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label><select value={file.category} onChange={(e) => { const updated = [...files]; updated[i].category = e.target.value; setFiles(updated); }} className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-cyan-500"><option value="Test Report">Test Report</option><option value="Photo">Photo</option><option value="Certificate">Certificate</option><option value="Manual">Manual</option><option value="Other">Other</option></select></div>
                </div>
                <div className="mt-3"><label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-cyan-300 rounded-lg cursor-pointer hover:bg-cyan-50"><Upload className="h-4 w-4 mr-2 text-cyan-600" /><span className="text-sm text-cyan-600">Choose File</span><input type="file" className="hidden" /></label></div>
              </div>
            ))}
            <button onClick={() => setFiles([...files, { fileName: '', fileType: '', category: 'Test Report', uploadDate: new Date().toISOString().split('T')[0] }])} className="w-full py-2 border-2 border-dashed border-cyan-300 rounded-lg text-cyan-600 hover:bg-cyan-50 flex items-center justify-center"><Plus className="h-4 w-4 mr-2" />Add Another File</button>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onUpload({ files })} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Upload Files</button>
        </div>
      </div>
    </div>
  );
}

// 11. Generate Report Modal (Pink)
export function GenerateReportModal({ isOpen, onClose, onGenerate }: any) {
  const [report, setReport] = useState({ reportType: 'Acceptance Summary', dateRange: 'Last 30 Days', includeDetails: true, includeCriteria: true, includeDocumentation: true, format: 'PDF' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Generate Acceptance Report</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label><select value={report.reportType} onChange={(e) => setReport({...report, reportType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"><option value="Acceptance Summary">Acceptance Summary</option><option value="Detailed Report">Detailed Report</option><option value="Criteria Analysis">Criteria Analysis</option><option value="Documentation Status">Documentation Status</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label><select value={report.dateRange} onChange={(e) => setReport({...report, dateRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"><option value="Last 7 Days">Last 7 Days</option><option value="Last 30 Days">Last 30 Days</option><option value="Last 90 Days">Last 90 Days</option><option value="This Year">This Year</option><option value="All Time">All Time</option></select></div>
            </div>
            <div className="border rounded-lg p-3 bg-gray-50"><label className="block text-sm font-medium text-gray-700 mb-2">Include in Report:</label><div className="space-y-2"><label className="flex items-center"><input type="checkbox" checked={report.includeDetails} onChange={(e) => setReport({...report, includeDetails: e.target.checked})} className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 mr-2" /><span className="text-sm text-gray-700">Project Details</span></label><label className="flex items-center"><input type="checkbox" checked={report.includeCriteria} onChange={(e) => setReport({...report, includeCriteria: e.target.checked})} className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 mr-2" /><span className="text-sm text-gray-700">Acceptance Criteria</span></label><label className="flex items-center"><input type="checkbox" checked={report.includeDocumentation} onChange={(e) => setReport({...report, includeDocumentation: e.target.checked})} className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 mr-2" /><span className="text-sm text-gray-700">Documentation Status</span></label></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label><select value={report.format} onChange={(e) => setReport({...report, format: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"><option value="PDF">PDF</option><option value="Excel">Excel</option><option value="Word">Word</option></select></div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onGenerate(report)} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Generate Report</button>
        </div>
      </div>
    </div>
  );
}

// 12. View Full Details Modal (Slate)
export function ViewFullDetailsModal({ isOpen, onClose, acceptance }: any) {
  if (!isOpen || !acceptance) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex justify-between items-center">
          <div><h2 className="text-xl font-bold text-white">{acceptance.acceptanceNumber}</h2><p className="text-sm text-slate-200">{acceptance.projectName}</p></div>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-blue-50 p-3 rounded-lg"><p className="text-sm text-blue-600 font-medium">Customer</p><p className="text-lg font-bold text-gray-900">{acceptance.customer}</p><p className="text-xs text-gray-600">{acceptance.customerContact}</p></div>
            <div className="bg-green-50 p-3 rounded-lg"><p className="text-sm text-green-600 font-medium">Acceptance Type</p><p className="text-lg font-bold text-gray-900">{acceptance.acceptanceType}</p><p className="text-xs text-gray-600">{acceptance.acceptanceDate}</p></div>
            <div className="bg-purple-50 p-3 rounded-lg"><p className="text-sm text-purple-600 font-medium">Status</p><p className="text-lg font-bold text-gray-900">{acceptance.overallStatus}</p><p className="text-xs text-gray-600">Phase: {acceptance.phase}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><h3 className="text-sm font-semibold text-gray-900 mb-3">Acceptance Criteria ({acceptance.criteriaMet}/{acceptance.totalCriteria} Met)</h3><div className="space-y-2">{acceptance.acceptanceCriteria.map((c: any) => (<div key={c.id} className="flex items-start space-x-2 text-sm"><span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'Met' ? 'bg-green-100 text-green-800' : c.status === 'Not Met' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.status}</span><div><p className="font-medium text-gray-900">{c.criterion}</p><p className="text-xs text-gray-600">{c.remarks}</p></div></div>))}</div></div>
            <div><h3 className="text-sm font-semibold text-gray-900 mb-3">Documentation ({acceptance.docsSubmitted}/{acceptance.totalDocuments} Submitted)</h3><div className="space-y-2">{acceptance.documentation.map((d: any) => (<div key={d.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"><span className="font-medium text-gray-900">{d.documentName}</span><span className={`px-2 py-0.5 rounded text-xs font-medium ${d.status === 'Approved' ? 'bg-green-100 text-green-800' : d.status === 'Rejected' ? 'bg-red-100 text-red-800' : d.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{d.status}</span></div>))}</div></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3"><h3 className="text-sm font-semibold text-gray-900 mb-2">Deliverables</h3><ul className="list-disc list-inside text-sm text-gray-700 space-y-1">{acceptance.deliverables.map((d: string, i: number) => (<li key={i}>{d}</li>))}</ul></div>
            <div className="border rounded-lg p-3"><h3 className="text-sm font-semibold text-gray-900 mb-2">Warranty & Support</h3><div className="text-sm space-y-1"><p><strong>Warranty:</strong> {acceptance.warrantyPeriod} (from {acceptance.warrantyStartDate})</p><p><strong>AMC:</strong> {acceptance.amcOffered ? `${acceptance.amcDuration} offered` : 'Not offered'}</p><p><strong>Training:</strong> {acceptance.trainingCompleted ? 'Completed' : 'Pending'}</p></div></div>
          </div>
          {acceptance.remarks && (<div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3"><p className="text-sm font-semibold text-gray-900 mb-1">Remarks:</p><p className="text-sm text-gray-700">{acceptance.remarks}</p></div>)}
          {acceptance.signedBy && (<div className="mt-4 border-t pt-4"><div className="grid grid-cols-2 gap-2 text-sm"><div><p className="text-gray-600">Signed by:</p><p className="font-semibold text-gray-900">{acceptance.signedBy} ({acceptance.signedByDesignation})</p><p className="text-xs text-gray-500">{acceptance.signedDate}</p></div><div><p className="text-gray-600">Witnessed by:</p><p className="font-semibold text-gray-900">{acceptance.witnessedBy}</p></div></div></div>)}
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">Close</button>
        </div>
      </div>
    </div>
  );
}
