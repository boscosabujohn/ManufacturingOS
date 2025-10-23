'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Download, Trash2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface BulkUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
}

export default function BulkUsersPage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<BulkUserData[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [operation, setOperation] = useState<'import' | 'export' | 'permissions'>('import');
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionSettings, setPermissionSettings] = useState({
    view: true,
    edit: false,
    delete: false,
    export: true
  });

  const departments = ['Operations', 'Sales', 'IT', 'HR', 'Finance', 'Marketing', 'Procurement', 'Production'];
  const roles = ['Administrator', 'Manager', 'Executive', 'Specialist', 'Analyst', 'Technician', 'Operator'];

  // Sample data for preview
  const sampleData: BulkUserData[] = [
    {
      firstName: 'Raj',
      lastName: 'Kumar',
      email: 'raj.kumar@company.com',
      phone: '+91-98765-43210',
      department: 'Operations',
      role: 'Manager',
      joinDate: '2024-01-15'
    },
    {
      firstName: 'Priya',
      lastName: 'Singh',
      email: 'priya.singh@company.com',
      phone: '+91-87654-32109',
      department: 'Sales',
      role: 'Executive',
      joinDate: '2024-01-20'
    },
    {
      firstName: 'Amit',
      lastName: 'Patel',
      email: 'amit.patel@company.com',
      phone: '+91-76543-21098',
      department: 'IT',
      role: 'Specialist',
      joinDate: '2024-01-25'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      // Simulate file reading
      setUploadData(sampleData);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(uploadData.map((_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleImport = async () => {
    if (uploadData.length === 0) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Success - would redirect or show toast
  };

  const handleExport = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Trigger download
    console.log('Exporting users...');
    setIsProcessing(false);
  };

  const handleApplyPermissions = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
  };

  const downloadTemplate = () => {
    const template = 'firstName,lastName,email,phone,department,role,joinDate\nJohn,Doe,john@example.com,+91-98765-43210,Operations,Manager,2024-01-15';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(template));
    element.setAttribute('download', 'users_template.csv');
    element.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bulk User Operations</h1>
            <p className="text-slate-600 mt-1">Import, export, or manage user permissions in bulk</p>
          </div>
        </div>

        {/* Operation Tabs */}
        <div className="flex gap-4 mb-6 bg-white rounded-lg p-1 border border-slate-200 w-fit">
          {(['import', 'export', 'permissions'] as const).map(op => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                operation === op
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}
        </div>

        {/* Import Section */}
        {operation === 'import' && (
          <div className="space-y-6">
            {/* Upload Box */}
            <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload CSV File</h3>
              <p className="text-slate-600 mb-4">Drag and drop your file here or click to browse</p>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer font-medium"
              >
                Choose File
              </label>

              <button
                onClick={downloadTemplate}
                className="ml-3 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
              >
                Download Template
              </button>

              {uploadedFile && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900">{uploadedFile}</p>
                    <p className="text-sm text-blue-800">{uploadData.length} users ready to import</p>
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            {uploadData.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Preview ({uploadData.length} users)</h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                </div>

                {showPreview && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectedRows.size === uploadData.length}
                              onChange={handleSelectAll}
                              className="rounded"
                            />
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Department</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-700">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadData.map((user, i) => (
                          <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedRows.has(i)}
                                onChange={() => handleSelectRow(i)}
                                className="rounded"
                              />
                            </td>
                            <td className="px-4 py-3">{user.firstName} {user.lastName}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {user.department}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                {user.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Import Button */}
                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={() => setUploadData([])}
                    className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={isProcessing || selectedRows.size === 0}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
                  >
                    {isProcessing ? 'Importing...' : `Import ${selectedRows.size} Users`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Section */}
        {operation === 'export' && (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Export Users</h3>
            <p className="text-slate-600 mb-6">Export all active users to CSV format</p>

            <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-slate-700">Include contact information</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-slate-700">Include department & role</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-slate-700">Include join date</span>
              </label>
            </div>

            <button
              onClick={handleExport}
              disabled={isProcessing}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {isProcessing ? 'Exporting...' : 'Export Users (456)'}
            </button>
          </div>
        )}

        {/* Permissions Section */}
        {operation === 'permissions' && (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Manage Bulk Permissions</h3>
            <p className="text-slate-600 mb-6">Apply permissions to multiple users at once</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Select User Group</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Users</option>
                <option>By Department</option>
                <option>By Role</option>
                <option>Recently Added</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissionSettings.view}
                    onChange={(e) => setPermissionSettings(prev => ({...prev, view: e.target.checked}))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">View</span>
                </label>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissionSettings.edit}
                    onChange={(e) => setPermissionSettings(prev => ({...prev, edit: e.target.checked}))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Edit</span>
                </label>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissionSettings.delete}
                    onChange={(e) => setPermissionSettings(prev => ({...prev, delete: e.target.checked}))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Delete</span>
                </label>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissionSettings.export}
                    onChange={(e) => setPermissionSettings(prev => ({...prev, export: e.target.checked}))}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Export</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">These permissions will be applied to <strong>456 selected users</strong></p>
            </div>

            <button
              onClick={handleApplyPermissions}
              disabled={isProcessing}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
            >
              {isProcessing ? 'Applying...' : 'Apply Permissions'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
