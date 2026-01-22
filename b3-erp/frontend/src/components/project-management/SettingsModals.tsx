import { useState } from 'react';

import { X, Shield, Users, Lock, Key, Eye, EyeOff, Edit2, Trash2, Plus, Smartphone, Globe, AlertTriangle, Code, Copy, Upload, Download } from 'lucide-react';

export function GeneralSettingsModal({ isOpen, onClose, onSave }: any) {
  const [settings, setSettings] = useState({ projectName: '', defaultCurrency: 'INR', timezone: 'IST' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">General Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Project Name</label><input type="text" value={settings.projectName} onChange={(e) => setSettings({ ...settings, projectName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Default Currency</label><select value={settings.defaultCurrency} onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>INR</option><option>USD</option><option>EUR</option></select></div><div><label className="block text-sm font-medium mb-1">Timezone</label><select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>IST</option><option>UTC</option><option>EST</option></select></div></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave(settings)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function NotificationSettingsModal({ isOpen, onClose, onSave }: any) {
  const [settings, setSettings] = useState({ emailNotifs: true, smsNotifs: false, pushNotifs: true });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Notification Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-3"><label className="flex items-center"><input type="checkbox" checked={settings.emailNotifs} onChange={(e) => setSettings({ ...settings, emailNotifs: e.target.checked })} className="mr-2" /><span>Email Notifications</span></label><label className="flex items-center"><input type="checkbox" checked={settings.smsNotifs} onChange={(e) => setSettings({ ...settings, smsNotifs: e.target.checked })} className="mr-2" /><span>SMS Notifications</span></label><label className="flex items-center"><input type="checkbox" checked={settings.pushNotifs} onChange={(e) => setSettings({ ...settings, pushNotifs: e.target.checked })} className="mr-2" /><span>Push Notifications</span></label></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave(settings)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function AccessControlModal({ isOpen, onClose, onSave }: any) {
  const [activeRole, setActiveRole] = useState('project_manager');

  if (!isOpen) return null;

  const roles = [
    { id: 'admin', name: 'Administrator', users: 2, description: 'Full system access' },
    { id: 'project_manager', name: 'Project Manager', users: 5, description: 'Manage projects, tasks, and team' },
    { id: 'site_supervisor', name: 'Site Supervisor', users: 8, description: 'Field updates and daily logs' },
    { id: 'viewer', name: 'Viewer', users: 12, description: 'Read-only access' },
  ];

  const permissions = [
    { category: 'Projects', items: ['Create Projects', 'Edit Projects', 'Delete Projects', 'Archive Projects'] },
    { category: 'Financials', items: ['View Budget', 'Edit Budget', 'Approve Expenses', 'View Invoices'] },
    { category: 'Team', items: ['Invite Members', 'Remove Members', 'Assign Roles', 'View Analytics'] },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Control & Permissions
          </h2>
          <button onClick={onClose} className="text-white hover:bg-purple-600/50 p-1 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Roles</h3>
              <button className="text-purple-600 hover:bg-purple-100 p-1 rounded"><Plus className="w-4 h-4" /></button>
            </div>
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center justify-between p-3 rounded-lg text-left transition-colors ${activeRole === role.id ? 'bg-white shadow-sm ring-1 ring-purple-600' : 'hover:bg-gray-100'}`}
              >
                <div>
                  <div className={`font-medium ${activeRole === role.id ? 'text-purple-700' : 'text-gray-900'}`}>{role.name}</div>
                  <div className="text-xs text-gray-500">{role.users} Users</div>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Manager Permissions</h3>
                <p className="text-sm text-gray-600">Manage permissions for project managers across the organization.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">Duplicate Role</button>
                <button className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">Delete Role</button>
              </div>
            </div>

            <div className="space-y-6">
              {permissions.map((group, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">{group.category}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {group.items.map((perm, pIdx) => (
                      <label key={pIdx} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={Math.random() > 0.3} className="rounded text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-gray-700">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave()} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export function IntegrationSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;

  const integrations = [
    { id: 'slack', name: 'Slack', category: 'Communication', connected: true, icon: 'https://cdn.iconscout.com/icon/free/png-256/free-slack-logo-icon-download-in-svg-png-gif-file-formats--social-media-communication-pack-logos-icons-493158.png?f=webp&w=256' },
    { id: 'jira', name: 'Jira Software', category: 'Project Management', connected: false, icon: 'https://cdn.iconscout.com/icon/free/png-256/free-jira-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-4-pack-logos-icons-3030282.png?f=webp&w=256' },
    { id: 'github', name: 'GitHub', category: 'Development', connected: true, icon: 'https://cdn.iconscout.com/icon/free/png-256/free-github-logo-icon-download-in-svg-png-gif-file-formats--social-media-company-brand-vol-3-pack-logos-icons-3030248.png?f=webp&w=256' },
    { id: 'drive', name: 'Google Drive', category: 'Storage', connected: true, icon: 'https://cdn.iconscout.com/icon/free/png-256/free-google-drive-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-2-pack-logos-icons-3030116.png?f=webp&w=256' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Third-Party Integrations
          </h2>
          <button onClick={onClose} className="text-white hover:bg-orange-600/50 p-1 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((app) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                    {/* Using text fallback if image fails, but usually these are SVGs */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.name}</h3>
                    <p className="text-xs text-gray-600">{app.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={app.connected} readOnly className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                  <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">Configure</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-orange-800">API Access Required</h4>
              <p className="text-sm text-orange-700 mt-1">Some integrations require generating specific API keys in the external service. Check documentation for setup guides.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
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
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Configuration
          </h2>
          <button onClick={onClose} className="text-white hover:bg-pink-600/50 p-1 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* 2FA Section */}
          <div className="flex items-start justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-gray-600 mt-1">Require 2FA for all project managers and admins.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          {/* Password Policy */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-gray-500" />
              Password Policy
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Minimum Length</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>8 Characters</option>
                  <option>10 Characters</option>
                  <option>12 Characters</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Complexity</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Alphanumeric</option>
                  <option>Alpha + Special Chars</option>
                  <option>Strict (Upper + Lower + Num + Symbol)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Session Settings */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              Session Management
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Session Timeout (Inactivity)</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="240">4 Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* IP Whitelist */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              IP Restrictions
            </h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex gap-2">
                <input type="text" placeholder="Scanning allowed IP ranges..." className="flex-1 bg-white border border-gray-300 rounded px-3 py-1 text-sm" disabled />
                <button className="text-pink-600 text-sm font-medium">Add IP</button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Restrict access to corporate network only
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave()} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Update Security Settings</button>
        </div>
      </div>
    </div>
  );
}

export function BackupSettingsModal({ isOpen, onClose, onSave }: any) {
  const [autoBackup, setAutoBackup] = useState(true);
  const [frequency, setFrequency] = useState('daily');

  if (!isOpen) return null;

  const recentBackups = [
    { id: 1, date: 'Oct 24, 2023 02:00 AM', size: '1.2 GB', status: 'Success' },
    { id: 2, date: 'Oct 23, 2023 02:00 AM', size: '1.2 GB', status: 'Success' },
    { id: 3, date: 'Oct 22, 2023 02:00 AM', size: '1.1 GB', status: 'Success' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Backup & Restoration
          </h2>
          <button onClick={onClose} className="text-white hover:bg-amber-600/50 p-1 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Configuration */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Automatic Backups</h3>
                <p className="text-sm text-gray-600">Schedule regular system backups</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {autoBackup && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                    <option value="daily">Daily (At 02:00 AM)</option>
                    <option value="weekly">Weekly (Sundays)</option>
                    <option value="monthly">Monthly (1st Day)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Retention</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                    <option>30 Days</option>
                    <option>60 Days</option>
                    <option>90 Days</option>
                    <option>1 Year</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Recent Backups List */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Recent Backups</h3>
              <button className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded hover:bg-amber-200 transition-colors">
                Backup Now
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBackups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{backup.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{backup.size}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {backup.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button className="text-amber-600 hover:text-amber-900 text-xs font-medium">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
          <button onClick={() => onSave()} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Save Configuration</button>
        </div>
      </div>
    </div>
  );
}

export function APISettingsModal({ isOpen, onClose, onSave }: any) {
  const [showKey, setShowKey] = useState(false);
  const apiKey = 'pk_live_51Nx...x8s9'; // Mock masked key

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5" />
            API Configuration
          </h2>
          <button onClick={onClose} className="text-white hover:bg-red-600/50 p-1 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* API Keys */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">API Keys</h3>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">Production Key</p>
                  <p className="text-xs text-gray-500">Created on Oct 12, 2023</p>
                </div>
                <button className="text-red-600 text-sm hover:text-red-700 font-medium">Revoke</button>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 font-mono text-sm text-gray-600 flex justify-between items-center">
                  <span>{showKey ? 'pk_live_51NxM2aL9z0kPqR7vX8s9' : apiKey}</span>
                  <button onClick={() => setShowKey(!showKey)} className="text-gray-400 hover:text-gray-600">
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button className="text-sm text-red-600 font-medium flex items-center gap-1">
              <Plus className="w-3 h-3" /> Generate New Key
            </button>
          </div>

          {/* Webhooks */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900">Webhooks</h3>
            <p className="text-sm text-gray-600">Receive real-time updates for project events.</p>

            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <input type="text" placeholder="https://api.yourdomain.com/webhook" className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Add Endpoint</button>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="text-red-600 rounded focus:ring-red-500" />
                  <span className="text-sm text-gray-700">Project Created</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="text-red-600 rounded focus:ring-red-500" />
                  <span className="text-sm text-gray-700">Task Completed</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="text-red-600 rounded focus:ring-red-500" />
                  <span className="text-sm text-gray-700">Budget Warning</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
          <button onClick={() => onSave()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export function AdvancedSettingsModal({ isOpen, onClose, onSave }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Advanced Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Advanced configuration options</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSave()} className="px-4 py-2 bg-violet-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function ImportExportModal({ isOpen, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('export');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import / Export Data
          </h2>
          <button onClick={onClose} className="text-white hover:bg-rose-600/50 p-1 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'export' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Export Data
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'import' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Import Data
            </button>
          </div>

          {activeTab === 'export' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Scope</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="scope" defaultChecked className="text-rose-600 focus:ring-rose-500" />
                    <span className="text-sm text-gray-700">Current Project Only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="scope" className="text-rose-600 focus:ring-rose-500" />
                    <span className="text-sm text-gray-700">All Projects (Administrator Only)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>JSON (Complete Backup)</option>
                  <option>CSV (Excel Compatible)</option>
                  <option>PDF (Report Format)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" />
                  <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-200 mt-2">
                <div>
                  <p className="font-semibold text-gray-900">Ready to Export</p>
                  <p className="text-xs text-gray-500">Estimated file size: 24 MB</p>
                </div>
                <button className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rose-400 transition-colors cursor-pointer bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">JSON or CSV files only (Max 50MB)</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Import Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="text-rose-600 rounded focus:ring-rose-500" />
                    <span className="text-sm text-gray-700">Skip duplicates</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-rose-600 rounded focus:ring-rose-500" />
                    <span className="text-sm text-gray-700">Overwrite existing records</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
}

export function ResetSettingsModal({ isOpen, onClose, onReset }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Reset Settings</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-700">Are you sure you want to reset all settings to default?</p><p className="text-sm text-red-600 mt-2">This action cannot be undone.</p></div><div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onReset()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reset</button></div></div></div>);
}
