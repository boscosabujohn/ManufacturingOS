'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  Mail,
  Send,
  Calendar,
  Video,
  MessageSquare,
  FileText,
  CheckSquare,
  Clock,
  User,
  Building2,
  Search,
  X,
  ChevronDown,
  Plus,
  Paperclip,
  Mic,
  MicOff,
  Timer,
  Check,
  AlertCircle
} from 'lucide-react';

// Types
interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface ActivityType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  fields: string[];
}

interface ActivityQuickEntryProps {
  contacts?: Contact[];
  defaultContact?: Contact;
  defaultType?: string;
  onSubmit?: (activity: {
    type: string;
    contact: Contact;
    subject: string;
    notes: string;
    outcome?: string;
    duration?: number;
    scheduledDate?: Date;
  }) => void;
  onCancel?: () => void;
  isFloating?: boolean;
  position?: { x: number; y: number };
}

// Activity types
const activityTypes: ActivityType[] = [
  {
    id: 'call',
    name: 'Log Call',
    icon: PhoneCall,
    color: 'bg-green-500',
    fields: ['outcome', 'duration', 'notes'],
  },
  {
    id: 'email',
    name: 'Log Email',
    icon: Mail,
    color: 'bg-blue-500',
    fields: ['subject', 'notes'],
  },
  {
    id: 'meeting',
    name: 'Schedule Meeting',
    icon: Video,
    color: 'bg-purple-500',
    fields: ['subject', 'datetime', 'attendees', 'notes'],
  },
  {
    id: 'task',
    name: 'Create Task',
    icon: CheckSquare,
    color: 'bg-orange-500',
    fields: ['subject', 'dueDate', 'priority', 'notes'],
  },
  {
    id: 'note',
    name: 'Add Note',
    icon: FileText,
    color: 'bg-yellow-500',
    fields: ['notes'],
  },
];

// Call outcomes
const callOutcomes = [
  { id: 'connected', label: 'Connected', icon: PhoneCall, color: 'text-green-600' },
  { id: 'left-voicemail', label: 'Left Voicemail', icon: PhoneOff, color: 'text-yellow-600' },
  { id: 'no-answer', label: 'No Answer', icon: PhoneOff, color: 'text-gray-600' },
  { id: 'busy', label: 'Busy', icon: PhoneOff, color: 'text-red-600' },
  { id: 'wrong-number', label: 'Wrong Number', icon: AlertCircle, color: 'text-red-600' },
];

// Sample contacts
const sampleContacts: Contact[] = [
  { id: '1', name: 'John Smith', company: 'Marriott Hotels', email: 'jsmith@marriott.com', phone: '+1 301-380-3001' },
  { id: '2', name: 'Emily Chen', company: 'Chipotle', email: 'echen@chipotle.com', phone: '+1 303-595-4000' },
  { id: '3', name: 'Michael Brown', company: 'Google', email: 'mbrown@google.com', phone: '+1 650-253-0000' },
  { id: '4', name: 'Sarah Johnson', company: 'Mayo Clinic', email: 'sjohnson@mayo.edu', phone: '+1 507-284-2511' },
  { id: '5', name: 'David Lee', company: 'Stanford University', email: 'dlee@stanford.edu', phone: '+1 650-723-2300' },
];

/**
 * ActivityQuickEntry - One-click activity logging for CRM
 * Supports calls, emails, meetings, tasks, and notes with minimal friction
 */
export function ActivityQuickEntry({
  contacts = sampleContacts,
  defaultContact,
  defaultType = 'call',
  onSubmit,
  onCancel,
  isFloating = false,
  position,
}: ActivityQuickEntryProps) {
  const [selectedType, setSelectedType] = useState(defaultType);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(defaultContact || null);
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');
  const [duration, setDuration] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter contacts
  const filteredContacts = contacts.filter(
    c =>
      c.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );

  // Get current activity type
  const currentType = activityTypes.find(t => t.id === selectedType) || activityTypes[0];

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Focus search input when opened
  useEffect(() => {
    if (showContactSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showContactSearch]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedContact) return;

    setIsSubmitting(true);

    const activity = {
      type: selectedType,
      contact: selectedContact,
      subject,
      notes,
      outcome: selectedType === 'call' ? outcome : undefined,
      duration: selectedType === 'call' ? duration : undefined,
      scheduledDate: scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`)
        : undefined,
    };

    try {
      await onSubmit?.(activity);
      setShowSuccess(true);

      // Reset form after short delay
      setTimeout(() => {
        setShowSuccess(false);
        setSubject('');
        setNotes('');
        setOutcome('');
        setDuration(0);
        setIsTimerRunning(false);
        setScheduledDate('');
        setScheduledTime('');
        if (!defaultContact) setSelectedContact(null);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick action buttons
  const quickActions = [
    { type: 'call', icon: Phone, label: 'Call', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { type: 'email', icon: Mail, label: 'Email', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { type: 'meeting', icon: Calendar, label: 'Meeting', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
        isFloating ? 'fixed z-50' : ''
      }`}
      style={isFloating && position ? { top: position.y, left: position.x } : undefined}
    >
      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <Check className="w-12 h-12 mb-2" />
            <p className="font-medium">Activity Logged!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Quick Activity</h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Activity Type Pills */}
        <div className="flex gap-2">
          {activityTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedType === type.id
                  ? `${type.color} text-white`
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              <type.icon className="w-4 h-4" />
              {type.name.replace('Log ', '').replace('Schedule ', '').replace('Create ', '').replace('Add ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Contact Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact *
          </label>
          {selectedContact ? (
            <div
              onClick={() => setShowContactSearch(true)}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {selectedContact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedContact.name}</p>
                  <p className="text-sm text-gray-500">{selectedContact.company}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          ) : (
            <button
              onClick={() => setShowContactSearch(true)}
              className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600"
            >
              <Search className="w-4 h-4" />
              Search for a contact...
            </button>
          )}

          {/* Contact Search Dropdown */}
          {showContactSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-64 overflow-hidden">
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search contacts..."
                    value={contactSearchQuery}
                    onChange={e => setContactSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
              <div className="overflow-y-auto max-h-48">
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowContactSearch(false);
                      setContactSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.company}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 py-1">
                  <Plus className="w-4 h-4" />
                  Create New Contact
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Call-specific: Outcome & Duration */}
        {selectedType === 'call' && (
          <>
            {/* Call Outcome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call Outcome
              </label>
              <div className="grid grid-cols-3 gap-2">
                {callOutcomes.slice(0, 3).map(o => (
                  <button
                    key={o.id}
                    onClick={() => setOutcome(o.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      outcome === o.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    <o.icon className={`w-4 h-4 ${o.color}`} />
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Call Duration Timer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Timer className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-mono font-medium text-gray-900 dark:text-white">
                    {formatDuration(duration)}
                  </span>
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    isTimerRunning
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isTimerRunning ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setDuration(0);
                    setIsTimerRunning(false);
                  }}
                  className="p-3 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        )}

        {/* Subject (for email, meeting, task) */}
        {(selectedType === 'email' || selectedType === 'meeting' || selectedType === 'task') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {selectedType === 'email' ? 'Subject' : selectedType === 'meeting' ? 'Meeting Title' : 'Task Name'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={`Enter ${selectedType === 'email' ? 'subject' : selectedType === 'meeting' ? 'meeting title' : 'task name'}...`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            />
          </div>
        )}

        {/* Date/Time (for meeting, task) */}
        {(selectedType === 'meeting' || selectedType === 'task') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {selectedType === 'meeting' ? 'Date' : 'Due Date'}
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              />
            </div>
            {selectedType === 'meeting' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                />
              </div>
            )}
            {selectedType === 'task' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg" title="Attach file">
            <Paperclip className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!selectedContact || isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              selectedContact && !isSubmitting
                ? `${currentType.color} hover:opacity-90`
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Log {currentType.name.replace('Log ', '').replace('Schedule ', '').replace('Create ', '').replace('Add ', '')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating Quick Entry Button
export function ActivityQuickEntryButton({
  onOpenEntry,
  position = 'bottom-right',
}: {
  onOpenEntry: (type: string) => void;
  position?: 'bottom-right' | 'bottom-left';
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    { type: 'call', icon: Phone, label: 'Log Call', color: 'bg-green-500 hover:bg-green-600' },
    { type: 'email', icon: Mail, label: 'Log Email', color: 'bg-blue-500 hover:bg-blue-600' },
    { type: 'meeting', icon: Calendar, label: 'Schedule', color: 'bg-purple-500 hover:bg-purple-600' },
  ];

  return (
    <div className={`fixed ${position === 'bottom-right' ? 'right-6 bottom-6' : 'left-6 bottom-6'} z-50`}>
      {/* Expanded Actions */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2">
          {quickActions.map(action => (
            <button
              key={action.type}
              onClick={() => {
                onOpenEntry(action.type);
                setIsExpanded(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 ${action.color} text-white rounded-full shadow-lg whitespace-nowrap transform transition-all hover:scale-105`}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 ${
          isExpanded ? 'bg-gray-700 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default ActivityQuickEntry;
