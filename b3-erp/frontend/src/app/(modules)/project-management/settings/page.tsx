'use client';

import { useState } from 'react';
import {
  Settings,
  Workflow,
  Bell,
  Shield,
  DollarSign,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
} from 'lucide-react';

export default function ProjectSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'workflow' | 'notifications' | 'approvals' | 'integrations'>('general');
  const [hasChanges, setHasChanges] = useState(false);

  // General Settings State
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [fiscalYearStart, setFiscalYearStart] = useState('04-01');
  const [defaultProjectPrefix, setDefaultProjectPrefix] = useState('PRJ');
  const [autoNumbering, setAutoNumbering] = useState(true);
  const [documentRetention, setDocumentRetention] = useState('7');

  // Workflow Settings
  const [projectApprovalRequired, setProjectApprovalRequired] = useState(true);
  const [milestoneApprovalRequired, setMilestoneApprovalRequired] = useState(true);
  const [budgetApprovalThreshold, setBudgetApprovalThreshold] = useState('5000000');
  const [changeOrderApprovalLevels, setChangeOrderApprovalLevels] = useState('2');
  const [documentApprovalRequired, setDocumentApprovalRequired] = useState(true);

  // Notification Settings
  const [projectStartNotification, setProjectStartNotification] = useState(true);
  const [milestoneCompleteNotification, setMilestoneCompleteNotification] = useState(true);
  const [budgetExceededNotification, setBudgetExceededNotification] = useState(true);
  const [scheduleDelayNotification, setScheduleDelayNotification] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Approval Settings
  const [projectManagerApproval, setProjectManagerApproval] = useState(true);
  const [departmentHeadApproval, setDepartmentHeadApproval] = useState(true);
  const [financeApproval, setFinanceApproval] = useState(true);
  const [ceoApprovalThreshold, setCeoApprovalThreshold] = useState('10000000');

  const handleSave = () => {
    // Simulate save
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to defaults
    setHasChanges(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
          {/* Action Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-end">
              {hasChanges && (
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${
            activeTab === 'general'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General Settings
          </div>
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${
            activeTab === 'workflow'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Workflow & Approvals
          </div>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </div>
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Approval Levels
          </div>
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${
            activeTab === 'integrations'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Integrations
          </div>
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-600" />
              Financial Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => {
                    setDefaultCurrency(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Currency used for all project budgets and financial calculations</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiscal Year Start
                </label>
                <input
                  type="text"
                  value={fiscalYearStart}
                  onChange={(e) => {
                    setFiscalYearStart(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="MM-DD"
                  className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Format: MM-DD (e.g., 04-01 for April 1st)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Variance Alert Threshold
                </label>
                <div className="flex items-center gap-2 w-full md:w-1/2">
                  <input
                    type="number"
                    placeholder="10"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <span className="text-gray-700">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Alert when project budget variance exceeds this percentage</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Project Numbering
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project ID Prefix
                </label>
                <input
                  type="text"
                  value={defaultProjectPrefix}
                  onChange={(e) => {
                    setDefaultProjectPrefix(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="PRJ"
                  className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Prefix for auto-generated project IDs (e.g., PRJ001, PRJ002)</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoNumbering"
                  checked={autoNumbering}
                  onChange={(e) => {
                    setAutoNumbering(e.target.checked);
                    setHasChanges(true);
                  }}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="autoNumbering" className="text-sm text-gray-700">
                  Enable auto-numbering for project IDs
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Project Number
                </label>
                <input
                  type="number"
                  placeholder="001"
                  disabled={!autoNumbering}
                  className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Starting number for new projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Document Management
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Retention Period
                </label>
                <div className="flex items-center gap-2 w-full md:w-1/2">
                  <select
                    value={documentRetention}
                    onChange={(e) => {
                      setDocumentRetention(e.target.value);
                      setHasChanges(true);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="3">3 years</option>
                    <option value="5">5 years</option>
                    <option value="7">7 years</option>
                    <option value="10">10 years</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">How long project documents should be retained after project closure</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="versionControl"
                  defaultChecked
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="versionControl" className="text-sm text-gray-700">
                  Enable document version control
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoArchive"
                  defaultChecked
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="autoArchive" className="text-sm text-gray-700">
                  Automatically archive completed projects after 90 days
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow & Approvals Tab */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-600" />
              Project Workflow
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Project Creation Approval</p>
                  <p className="text-sm text-gray-600">Require approval before creating new projects</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectApprovalRequired}
                    onChange={(e) => {
                      setProjectApprovalRequired(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Milestone Approval</p>
                  <p className="text-sm text-gray-600">Require approval for milestone completion</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={milestoneApprovalRequired}
                    onChange={(e) => {
                      setMilestoneApprovalRequired(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Document Approval</p>
                  <p className="text-sm text-gray-600">Require approval for critical project documents</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={documentApprovalRequired}
                    onChange={(e) => {
                      setDocumentApprovalRequired(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-600" />
              Budget & Financial Approvals
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Approval Threshold
                </label>
                <div className="flex items-center gap-2 w-full md:w-1/2">
                  <span className="text-gray-700">₹</span>
                  <input
                    type="text"
                    value={budgetApprovalThreshold}
                    onChange={(e) => {
                      setBudgetApprovalThreshold(e.target.value);
                      setHasChanges(true);
                    }}
                    placeholder="5000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Projects above this budget require additional approval</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Order Approval Levels
                </label>
                <select
                  value={changeOrderApprovalLevels}
                  onChange={(e) => {
                    setChangeOrderApprovalLevels(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="1">1 Level (Project Manager)</option>
                  <option value="2">2 Levels (PM + Department Head)</option>
                  <option value="3">3 Levels (PM + Dept Head + Finance)</option>
                  <option value="4">4 Levels (PM + Dept Head + Finance + CEO)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Number of approval levels required for change orders</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Order Approval Limit
                </label>
                <div className="flex items-center gap-2 w-full md:w-1/2">
                  <span className="text-gray-700">₹</span>
                  <input
                    type="text"
                    placeholder="1000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">POs above this amount require Finance approval</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-cyan-600" />
              Project Lifecycle Stages
            </h3>
            <div className="space-y-3">
              {[
                { stage: 'Planning', color: 'bg-gray-500' },
                { stage: 'In Progress', color: 'bg-blue-500' },
                { stage: 'On Hold', color: 'bg-yellow-500' },
                { stage: 'Completed', color: 'bg-green-500' },
                { stage: 'Cancelled', color: 'bg-red-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="font-medium text-gray-900">{item.stage}</span>
                  </div>
                  <button className="text-sm text-cyan-600 hover:text-cyan-700">Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-600" />
              Project Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Project Start</p>
                  <p className="text-sm text-gray-600">Notify when a new project starts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectStartNotification}
                    onChange={(e) => {
                      setProjectStartNotification(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Milestone Complete</p>
                  <p className="text-sm text-gray-600">Notify when milestones are completed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={milestoneCompleteNotification}
                    onChange={(e) => {
                      setMilestoneCompleteNotification(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Budget Exceeded</p>
                  <p className="text-sm text-gray-600">Alert when project budget is exceeded</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={budgetExceededNotification}
                    onChange={(e) => {
                      setBudgetExceededNotification(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Schedule Delay</p>
                  <p className="text-sm text-gray-600">Alert when projects are behind schedule</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleDelayNotification}
                    onChange={(e) => {
                      setScheduleDelayNotification(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-600" />
              Notification Channels
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Send notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => {
                      setEmailNotifications(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Send critical alerts via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => {
                      setSmsNotifications(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">In-App Notifications</p>
                  <p className="text-sm text-gray-600">Show notifications in the application</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Levels Tab */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-600" />
              Approval Hierarchy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Project Manager</p>
                  <p className="text-sm text-gray-600">First level approval for all project activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectManagerApproval}
                    onChange={(e) => {
                      setProjectManagerApproval(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Department Head</p>
                  <p className="text-sm text-gray-600">Second level approval for critical decisions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={departmentHeadApproval}
                    onChange={(e) => {
                      setDepartmentHeadApproval(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Finance Department</p>
                  <p className="text-sm text-gray-600">Approval for financial and budgetary matters</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={financeApproval}
                    onChange={(e) => {
                      setFinanceApproval(e.target.checked);
                      setHasChanges(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEO Approval Threshold
                </label>
                <div className="flex items-center gap-2 w-full md:w-1/2">
                  <span className="text-gray-700">₹</span>
                  <input
                    type="text"
                    value={ceoApprovalThreshold}
                    onChange={(e) => {
                      setCeoApprovalThreshold(e.target.value);
                      setHasChanges(true);
                    }}
                    placeholder="10000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Projects above this amount require CEO approval</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow Diagram</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Project Manager</p>
                  <p className="text-xs text-gray-600">Level 1</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Department Head</p>
                  <p className="text-xs text-gray-600">Level 2</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Finance</p>
                  <p className="text-xs text-gray-600">Level 3</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">CEO</p>
                  <p className="text-xs text-gray-600">Level 4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Integrations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Finance Module</p>
                    <p className="text-sm text-gray-600">Sync project budgets and costs with finance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                  <button className="text-sm text-cyan-600 hover:text-cyan-700">Configure</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">HR Module</p>
                    <p className="text-sm text-gray-600">Sync resource allocation with HR system</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                  <button className="text-sm text-cyan-600 hover:text-cyan-700">Configure</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Procurement Module</p>
                    <p className="text-sm text-gray-600">Link project materials with procurement</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                  <button className="text-sm text-cyan-600 hover:text-cyan-700">Configure</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Production Module</p>
                    <p className="text-sm text-gray-600">Connect project deliverables with production</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                  <button className="text-sm text-cyan-600 hover:text-cyan-700">Configure</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">External Integrations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Server (SMTP)</p>
                  <p className="text-sm text-gray-600">Configure email notifications</p>
                </div>
                <button className="text-sm text-cyan-600 hover:text-cyan-700">Configure</button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">SMS Gateway</p>
                  <p className="text-sm text-gray-600">Setup SMS notifications</p>
                </div>
                <button className="text-sm text-cyan-600 hover:text-cyan-700">Configure</button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Cloud Storage</p>
                  <p className="text-sm text-gray-600">Connect document storage</p>
                </div>
                <button className="text-sm text-cyan-600 hover:text-cyan-700">Configure</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button (Fixed at bottom when changes exist) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 flex gap-3 shadow-lg">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 shadow-lg"
          >
            <Save className="w-4 h-4" />
            Save All Changes
          </button>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
