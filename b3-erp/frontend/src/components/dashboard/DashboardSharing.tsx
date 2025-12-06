'use client';

import React, { useState, useCallback } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  Users,
  Globe,
  Lock,
  Link,
  Mail,
  UserPlus,
  Trash2,
  Eye,
  Edit2,
  Crown,
  Search,
} from 'lucide-react';
import { DashboardConfig } from './DashboardGrid';

// Types
export type SharePermission = 'view' | 'edit' | 'admin';
export type ShareVisibility = 'private' | 'team' | 'organization' | 'public';

export interface ShareRecipient {
  id: string;
  type: 'user' | 'team' | 'email';
  name: string;
  email?: string;
  avatar?: string;
  permission: SharePermission;
  addedAt: Date;
  addedBy?: string;
}

export interface ShareSettings {
  visibility: ShareVisibility;
  recipients: ShareRecipient[];
  shareLink?: string;
  linkEnabled: boolean;
  linkPermission: SharePermission;
  allowCopy: boolean;
  expiresAt?: Date;
}

// Props
interface DashboardSharingProps {
  isOpen: boolean;
  onClose: () => void;
  dashboard: DashboardConfig;
  shareSettings: ShareSettings;
  onUpdateSettings: (settings: ShareSettings) => void;
  onShare: (recipients: { type: 'user' | 'team' | 'email'; value: string; permission: SharePermission }[]) => Promise<void>;
  onRemoveRecipient: (recipientId: string) => void;
  onGenerateLink: () => Promise<string>;
  currentUserId?: string;
  availableUsers?: { id: string; name: string; email: string; avatar?: string }[];
  availableTeams?: { id: string; name: string; memberCount: number }[];
}

const visibilityOptions: { value: ShareVisibility; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'private',
    label: 'Private',
    icon: <Lock className="w-4 h-4" />,
    description: 'Only you can access',
  },
  {
    value: 'team',
    label: 'Team',
    icon: <Users className="w-4 h-4" />,
    description: 'Your team members can access',
  },
  {
    value: 'organization',
    label: 'Organization',
    icon: <Globe className="w-4 h-4" />,
    description: 'Everyone in your organization',
  },
  {
    value: 'public',
    label: 'Public',
    icon: <Globe className="w-4 h-4" />,
    description: 'Anyone with the link',
  },
];

const permissionLabels: Record<SharePermission, { label: string; icon: React.ReactNode; description: string }> = {
  view: {
    label: 'Can view',
    icon: <Eye className="w-4 h-4" />,
    description: 'Can view the dashboard',
  },
  edit: {
    label: 'Can edit',
    icon: <Edit2 className="w-4 h-4" />,
    description: 'Can view and edit widgets',
  },
  admin: {
    label: 'Admin',
    icon: <Crown className="w-4 h-4" />,
    description: 'Full access including sharing',
  },
};

export function DashboardSharing({
  isOpen,
  onClose,
  dashboard,
  shareSettings,
  onUpdateSettings,
  onShare,
  onRemoveRecipient,
  onGenerateLink,
  currentUserId,
  availableUsers = [],
  availableTeams = [],
}: DashboardSharingProps) {
  const [activeTab, setActiveTab] = useState<'people' | 'link'>('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<SharePermission>('view');
  const [isSharing, setIsSharing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Filter available users/teams
  const filteredUsers = availableUsers.filter(
    u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = availableTeams.filter(
    t => t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Copy link to clipboard
  const copyLink = useCallback(async () => {
    if (shareSettings.shareLink) {
      await navigator.clipboard.writeText(shareSettings.shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [shareSettings.shareLink]);

  // Generate share link
  const handleGenerateLink = useCallback(async () => {
    const link = await onGenerateLink();
    onUpdateSettings({
      ...shareSettings,
      shareLink: link,
      linkEnabled: true,
    });
  }, [onGenerateLink, onUpdateSettings, shareSettings]);

  // Share with user/team
  const handleShare = useCallback(async (type: 'user' | 'team', id: string, name: string) => {
    setIsSharing(true);
    try {
      await onShare([{ type, value: id, permission: selectedPermission }]);
      setSearchQuery('');
      setShowUserSearch(false);
    } finally {
      setIsSharing(false);
    }
  }, [onShare, selectedPermission]);

  // Share via email
  const handleEmailShare = useCallback(async () => {
    if (!emailInput.trim()) return;

    setIsSharing(true);
    try {
      await onShare([{ type: 'email', value: emailInput.trim(), permission: selectedPermission }]);
      setEmailInput('');
    } finally {
      setIsSharing(false);
    }
  }, [emailInput, onShare, selectedPermission]);

  // Update visibility
  const handleVisibilityChange = useCallback((visibility: ShareVisibility) => {
    onUpdateSettings({
      ...shareSettings,
      visibility,
    });
  }, [onUpdateSettings, shareSettings]);

  // Update link permission
  const handleLinkPermissionChange = useCallback((permission: SharePermission) => {
    onUpdateSettings({
      ...shareSettings,
      linkPermission: permission,
    });
  }, [onUpdateSettings, shareSettings]);

  // Toggle link
  const toggleLink = useCallback(() => {
    onUpdateSettings({
      ...shareSettings,
      linkEnabled: !shareSettings.linkEnabled,
    });
  }, [onUpdateSettings, shareSettings]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Share Dashboard
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dashboard.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('people')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'people'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              People
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'link'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Link className="w-4 h-4 inline mr-2" />
              Link Sharing
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'people' && (
              <div className="space-y-4">
                {/* Add People */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add people
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowUserSearch(true);
                        }}
                        onFocus={() => setShowUserSearch(true)}
                        placeholder="Search users or teams..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Search Results Dropdown */}
                      {showUserSearch && searchQuery && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowUserSearch(false)} />
                          <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-48 overflow-y-auto">
                            {filteredUsers.length > 0 && (
                              <div className="p-2">
                                <div className="text-xs font-medium text-gray-500 uppercase px-2 mb-1">Users</div>
                                {filteredUsers.map(user => (
                                  <button
                                    key={user.id}
                                    onClick={() => handleShare('user', user.id, user.name)}
                                    disabled={isSharing}
                                    className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                  >
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                                      {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <UserPlus className="w-4 h-4 text-gray-400" />
                                  </button>
                                ))}
                              </div>
                            )}

                            {filteredTeams.length > 0 && (
                              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-xs font-medium text-gray-500 uppercase px-2 mb-1">Teams</div>
                                {filteredTeams.map(team => (
                                  <button
                                    key={team.id}
                                    onClick={() => handleShare('team', team.id, team.name)}
                                    disabled={isSharing}
                                    className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                  >
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                      <Users className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</p>
                                      <p className="text-xs text-gray-500">{team.memberCount} members</p>
                                    </div>
                                    <UserPlus className="w-4 h-4 text-gray-400" />
                                  </button>
                                ))}
                              </div>
                            )}

                            {filteredUsers.length === 0 && filteredTeams.length === 0 && (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No users or teams found
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <select
                      value={selectedPermission}
                      onChange={(e) => setSelectedPermission(e.target.value as SharePermission)}
                      className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(permissionLabels).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email Invite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Invite by email
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email address..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleEmailShare}
                      disabled={!emailInput.trim() || isSharing}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg"
                    >
                      Invite
                    </button>
                  </div>
                </div>

                {/* Current Recipients */}
                {shareSettings.recipients.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      People with access
                    </label>
                    <div className="space-y-2">
                      {shareSettings.recipients.map(recipient => (
                        <div
                          key={recipient.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              recipient.type === 'team'
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                            }`}>
                              {recipient.type === 'team' ? (
                                <Users className="w-4 h-4" />
                              ) : (
                                recipient.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {recipient.name}
                              </p>
                              {recipient.email && (
                                <p className="text-xs text-gray-500">{recipient.email}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              {permissionLabels[recipient.permission].icon}
                              {permissionLabels[recipient.permission].label}
                            </span>
                            <button
                              onClick={() => onRemoveRecipient(recipient.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'link' && (
              <div className="space-y-4">
                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibility
                  </label>
                  <div className="space-y-2">
                    {visibilityOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleVisibilityChange(option.value)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          shareSettings.visibility === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={shareSettings.visibility === option.value ? 'text-blue-600' : 'text-gray-400'}>
                          {option.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${
                            shareSettings.visibility === option.value
                              ? 'text-blue-600'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                        {shareSettings.visibility === option.value && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Share Link */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Share link
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareSettings.linkEnabled}
                        onChange={toggleLink}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Enable link</span>
                    </label>
                  </div>

                  {shareSettings.linkEnabled && (
                    <div className="space-y-3">
                      {shareSettings.shareLink ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={shareSettings.shareLink}
                            readOnly
                            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                          />
                          <button
                            onClick={copyLink}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                          >
                            {linkCopied ? (
                              <>
                                <Check className="w-4 h-4 text-green-600" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleGenerateLink}
                          className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg"
                        >
                          Generate Share Link
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Anyone with link can:</span>
                        <select
                          value={shareSettings.linkPermission}
                          onChange={(e) => handleLinkPermissionChange(e.target.value as SharePermission)}
                          className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <option value="view">View only</option>
                          <option value="edit">View and edit</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for sharing dialog
export function useDashboardSharing() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
}

export type { DashboardSharingProps };
