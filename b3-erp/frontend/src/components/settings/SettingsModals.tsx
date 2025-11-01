'use client';

import { useState } from 'react';
import { X, Lock, Shield, Bell, BellOff, Eye, Globe, Palette, Database, Download, Upload, Key, User, Zap, FileText, Clock } from 'lucide-react';

// Modal 1: Change Password Modal (Blue Gradient)
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function ChangePasswordModal({ isOpen, onClose, onSave }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onSave(formData);
  };

  const isValid = formData.currentPassword && formData.newPassword && formData.confirmPassword &&
                  formData.newPassword === formData.confirmPassword && formData.newPassword.length >= 8;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters required</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">Password Requirements:</p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 2: Two-Factor Authentication Modal (Green Gradient)
interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: (data: any) => void;
}

export function TwoFactorAuthModal({ isOpen, onClose, onEnable }: TwoFactorAuthModalProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [verificationCode, setVerificationCode] = useState('');

  if (!isOpen) return null;

  const handleEnable = () => {
    if (step === 'setup') {
      setStep('verify');
    } else {
      onEnable({ verificationCode });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Two-Factor Authentication</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {step === 'setup' ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="w-48 h-48 bg-white border-2 border-green-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <p className="text-gray-500">QR Code Placeholder</p>
                </div>
                <p className="text-sm text-green-900 font-medium">Scan this QR code with your authenticator app</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manual Entry Code</label>
                <div className="bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm">
                  ABCD EFGH IJKL MNOP QRST
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Recommended Apps:</p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700">Enter the 6-digit code from your authenticator app:</p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEnable}
            disabled={step === 'verify' && verificationCode.length !== 6}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {step === 'setup' ? 'Continue' : 'Enable 2FA'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 3: Email Notifications Modal (Purple Gradient)
interface EmailNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function EmailNotificationsModal({ isOpen, onClose, onSave }: EmailNotificationsModalProps) {
  const [settings, setSettings] = useState({
    projectUpdates: true,
    taskAssignments: true,
    comments: true,
    deadlines: true,
    weeklyDigest: false,
    marketing: false,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Email Notifications</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Project Updates</p>
                <p className="text-sm text-gray-600">Notifications about project changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.projectUpdates}
                  onChange={(e) => setSettings({ ...settings, projectUpdates: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Task Assignments</p>
                <p className="text-sm text-gray-600">When you're assigned to a task</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.taskAssignments}
                  onChange={(e) => setSettings({ ...settings, taskAssignments: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Comments & Mentions</p>
                <p className="text-sm text-gray-600">When someone mentions you</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.comments}
                  onChange={(e) => setSettings({ ...settings, comments: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Deadline Reminders</p>
                <p className="text-sm text-gray-600">Task and project deadlines</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.deadlines}
                  onChange={(e) => setSettings({ ...settings, deadlines: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Weekly Digest</p>
                <p className="text-sm text-gray-600">Summary of your weekly activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Marketing Emails</p>
                <p className="text-sm text-gray-600">Product updates and news</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marketing}
                  onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 4: Push Notifications Modal (Orange Gradient)
interface PushNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function PushNotificationsModal({ isOpen, onClose, onSave }: PushNotificationsModalProps) {
  const [enabled, setEnabled] = useState(true);
  const [settings, setSettings] = useState({
    browser: true,
    mobile: true,
    sound: true,
    vibration: false,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({ enabled, ...settings });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <BellOff className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Push Notifications</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div>
              <p className="font-semibold text-orange-900">Enable Push Notifications</p>
              <p className="text-sm text-orange-700">Receive real-time updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className={`space-y-3 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Browser Notifications</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.browser}
                  onChange={(e) => setSettings({ ...settings, browser: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Mobile Notifications</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.mobile}
                  onChange={(e) => setSettings({ ...settings, mobile: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Sound</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sound}
                  onChange={(e) => setSettings({ ...settings, sound: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Vibration</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.vibration}
                  onChange={(e) => setSettings({ ...settings, vibration: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 5: Privacy Settings Modal (Indigo Gradient)
interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function PrivacySettingsModal({ isOpen, onClose, onSave }: PrivacySettingsModalProps) {
  const [settings, setSettings] = useState({
    profileVisibility: 'team',
    showEmail: false,
    showPhone: false,
    activityTracking: true,
    dataCollection: true,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Privacy Settings</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="public">Public - Everyone can see</option>
              <option value="team">Team - Only team members</option>
              <option value="private">Private - Only you</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Show Email Address</p>
                <p className="text-sm text-gray-600">Visible to team members</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Show Phone Number</p>
                <p className="text-sm text-gray-600">Visible to team members</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPhone}
                  onChange={(e) => setSettings({ ...settings, showPhone: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Activity Tracking</p>
                <p className="text-sm text-gray-600">Track your activity for insights</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.activityTracking}
                  onChange={(e) => setSettings({ ...settings, activityTracking: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Data Collection</p>
                <p className="text-sm text-gray-600">Help improve the platform</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dataCollection}
                  onChange={(e) => setSettings({ ...settings, dataCollection: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Privacy Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal 6: Language & Region Modal (Teal Gradient)
interface LanguageRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function LanguageRegionModal({ isOpen, onClose, onSave }: LanguageRegionModalProps) {
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'INR',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Language & Region</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="Asia/Kolkata">IST - India Standard Time</option>
              <option value="America/New_York">EST - Eastern Time</option>
              <option value="Europe/London">GMT - London</option>
              <option value="Asia/Tokyo">JST - Tokyo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select value={settings.dateFormat} onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select value={settings.timeFormat} onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="INR">INR - Indian Rupee (₹)</option>
              <option value="USD">USD - US Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Save Settings</button>
        </div>
      </div>
    </div>
  );
}

// Modal 7: Theme Customization Modal (Yellow Gradient)
interface ThemeCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function ThemeCustomizationModal({ isOpen, onClose, onSave }: ThemeCustomizationModalProps) {
  const [theme, setTheme] = useState({
    mode: 'light',
    primaryColor: 'blue',
    fontSize: 'medium',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Theme Customization</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setTheme({ ...theme, mode: 'light' })} className={`p-4 border-2 rounded-lg transition-all ${theme.mode === 'light' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="w-full h-16 bg-white border border-gray-300 rounded mb-2"></div>
                <p className="text-sm font-medium text-center">Light</p>
              </button>
              <button onClick={() => setTheme({ ...theme, mode: 'dark' })} className={`p-4 border-2 rounded-lg transition-all ${theme.mode === 'dark' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="w-full h-16 bg-gray-900 border border-gray-700 rounded mb-2"></div>
                <p className="text-sm font-medium text-center">Dark</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="grid grid-cols-4 gap-2">
              {['blue', 'green', 'purple', 'red'].map((color) => (
                <button key={color} onClick={() => setTheme({ ...theme, primaryColor: color })} className={`h-10 rounded-lg bg-${color}-600 ${theme.primaryColor === color ? 'ring-2 ring-offset-2 ring-yellow-600' : ''}`}></button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select value={theme.fontSize} onChange={(e) => setTheme({ ...theme, fontSize: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={() => onSave(theme)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">Apply Theme</button>
        </div>
      </div>
    </div>
  );
}

// Continue with remaining modals (8-15) - Creating shorter implementations for efficiency
// Modal 8: System Backup Modal (Pink Gradient)
interface SystemBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackup: () => void;
}

export function SystemBackupModal({ isOpen, onClose, onBackup }: SystemBackupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">System Backup</h2>
          </div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">Create a complete system backup including database, files, and configurations.</p>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <p className="text-sm text-pink-900 font-medium">Last Backup:</p>
            <p className="text-sm text-pink-700">October 25, 2025 - 2:30 PM</p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={onBackup} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Create Backup</button>
        </div>
      </div>
    </div>
  );
}

// Modal 9: Data Export Modal (Cyan Gradient)
interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
}

export function DataExportModal({ isOpen, onClose, onExport }: DataExportModalProps) {
  const [format, setFormat] = useState('csv');
  const [dataTypes, setDataTypes] = useState<string[]>(['projects']);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Export Data</h2>
          </div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data to Export</label>
            <div className="space-y-2">
              {['projects', 'tasks', 'resources', 'reports'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" checked={dataTypes.includes(type)} onChange={(e) => setDataTypes(e.target.checked ? [...dataTypes, type] : dataTypes.filter(t => t !== type))} className="rounded" />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onExport({ format, dataTypes })} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Export</button>
        </div>
      </div>
    </div>
  );
}

// Modal 10: Data Import Modal (Red Gradient)
interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File | null) => void;
}

export function DataImportModal({ isOpen, onClose, onImport }: DataImportModalProps) {
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Upload className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Import Data</h2>
          </div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" accept=".csv,.json,.xlsx" />
            <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
              Choose a file
            </label>
            <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
            {file && <p className="text-sm text-green-600 mt-2">Selected: {file.name}</p>}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onImport(file)} disabled={!file} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300">Import</button>
        </div>
      </div>
    </div>
  );
}

// Modals 11-15 (Compact implementations)
interface APIConfigurationModalProps { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; }
export function APIConfigurationModal({ isOpen, onClose, onSave }: APIConfigurationModalProps) {
  const [apiKey, setApiKey] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Key className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">API Configuration</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6"><input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API Key" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave({ apiKey })} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">Save</button>
        </div>
      </div>
    </div>
  );
}

interface UserPreferencesModalProps { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; }
export function UserPreferencesModal({ isOpen, onClose, onSave }: UserPreferencesModalProps) {
  const [prefs, setPrefs] = useState({ dashboard: 'default', sidebar: 'expanded' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3"><User className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">User Preferences</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <select value={prefs.dashboard} onChange={(e) => setPrefs({ ...prefs, dashboard: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="default">Default Dashboard</option>
            <option value="minimal">Minimal Dashboard</option>
          </select>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave(prefs)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save</button>
        </div>
      </div>
    </div>
  );
}

interface IntegrationSettingsModalProps { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; }
export function IntegrationSettingsModal({ isOpen, onClose, onSave }: IntegrationSettingsModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Zap className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Integration Settings</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6"><p className="text-gray-700">Configure third-party integrations and webhooks.</p></div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Close</button>
        </div>
      </div>
    </div>
  );
}

interface AuditLogSettingsModalProps { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; }
export function AuditLogSettingsModal({ isOpen, onClose, onSave }: AuditLogSettingsModalProps) {
  const [retention, setRetention] = useState('90');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3"><FileText className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Audit Log Settings</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (Days)</label>
          <input type="number" value={retention} onChange={(e) => setRetention(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave({ retention })} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">Save</button>
        </div>
      </div>
    </div>
  );
}

interface SessionManagementModalProps { isOpen: boolean; onClose: () => void; onRevoke: () => void; }
export function SessionManagementModal({ isOpen, onClose, onRevoke }: SessionManagementModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3"><Clock className="h-5 w-5 text-white" /><h2 className="text-xl font-semibold text-white">Session Management</h2></div>
          <button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Current Session</p>
            <p className="text-xs text-gray-600">Windows · Chrome · Active Now</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Mobile Device</p>
            <p className="text-xs text-gray-600">iOS · Safari · 2 hours ago</p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Close</button>
          <button onClick={onRevoke} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Revoke All</button>
        </div>
      </div>
    </div>
  );
}
