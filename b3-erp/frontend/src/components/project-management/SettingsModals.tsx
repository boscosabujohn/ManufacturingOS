import { useState } from 'react';
import { X } from 'lucide-react';

export function GeneralSettingsModal({ isOpen, onClose, onSave }: any) {
  const [settings, setSettings] = useState({ projectName: '', defaultCurrency: 'INR', timezone: 'IST' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">General Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Project Name</label><input type="text" value={settings.projectName} onChange={(e) => setSettings({...settings, projectName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Default Currency</label><select value={settings.defaultCurrency} onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>INR</option><option>USD</option><option>EUR</option></select></div><div><label className="block text-sm font-medium mb-1">Timezone</label><select value={settings.timezone} onChange={(e) => setSettings({...settings, timezone: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>IST</option><option>UTC</option><option>EST</option></select></div></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave(settings)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function NotificationSettingsModal({ isOpen, onClose, onSave }: any) {
  const [settings, setSettings] = useState({ emailNotifs: true, smsNotifs: false, pushNotifs: true });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Notification Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-3"><label className="flex items-center"><input type="checkbox" checked={settings.emailNotifs} onChange={(e) => setSettings({...settings, emailNotifs: e.target.checked})} className="mr-2" /><span>Email Notifications</span></label><label className="flex items-center"><input type="checkbox" checked={settings.smsNotifs} onChange={(e) => setSettings({...settings, smsNotifs: e.target.checked})} className="mr-2" /><span>SMS Notifications</span></label><label className="flex items-center"><input type="checkbox" checked={settings.pushNotifs} onChange={(e) => setSettings({...settings, pushNotifs: e.target.checked})} className="mr-2" /><span>Push Notifications</span></label></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave(settings)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function AccessControlModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Access Control</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Manage user roles and permissions</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function IntegrationSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Integration Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Connect with third-party apps</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function WorkflowSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Workflow Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Configure approval workflows</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function CustomFieldsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Custom Fields</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Add custom fields to projects</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function EmailTemplatesModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"><div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Email Templates</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"><p className="text-gray-600">Customize email templates</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function ReportSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Report Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Configure report preferences</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function BudgetSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Budget Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Configure budget tracking settings</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function SecuritySettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Security Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Manage security preferences</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function BackupSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Backup Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Configure automatic backups</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-amber-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function APISettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">API Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Manage API keys and webhooks</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function AdvancedSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Advanced Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Advanced configuration options</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-violet-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function ImportExportModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Import/Export Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Import or export project settings</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-rose-600 text-white rounded-lg">Close</button></div></div></div>);
}

export function ResetSettingsModal({ isOpen, onClose, onReset }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Reset Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-700">Are you sure you want to reset all settings to default?</p><p className="text-sm text-red-600 mt-2">This action cannot be undone.</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onReset()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reset</button></div></div></div>);
}
