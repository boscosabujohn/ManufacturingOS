'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageToolbar, ConfirmDialog } from '@/components/ui';
import { CollaborativeTimeline } from '@/components/crm';
import type { TimelineActivity } from '@/components/crm';
import { CommentModal, type Comment } from '@/components/modals';
import { ArrowLeft } from 'lucide-react';

const mockTimelineActivities: TimelineActivity[] = [
  {
    id: '1',
    type: 'email',
    title: 'Sent proposal and pricing',
    description: 'Sent comprehensive proposal with custom pricing for 500+ user licenses',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
    metadata: {
      recipients: 'john.smith@techcorp.com, procurement@techcorp.com',
      subject: 'Custom Enterprise Proposal - TechCorp',
    },
    attachments: [
      { name: 'Proposal_TechCorp_2025.pdf', url: '#', type: 'PDF' },
      { name: 'Pricing_Sheet.xlsx', url: '#', type: 'Excel' },
    ],
    comments: [
      {
        id: 'c1',
        user: { id: '2', name: 'Mike Chen', role: 'Sales Manager' },
        text: 'Great proposal! Make sure to follow up in 48 hours.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    likes: ['2', '3'],
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Product demo with decision makers',
    description: 'Conducted 90-minute product demonstration for C-level executives',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
    metadata: {
      attendees: 'John Smith (CTO), Jane Doe (CFO), Internal: Sarah, Mike',
      duration: '90 minutes',
      outcome: 'Positive - requesting POC',
    },
    likes: ['1', '2', '3', '4'],
  },
  {
    id: '3',
    type: 'call',
    title: 'Discovery call completed',
    description: 'Initial discovery call to understand requirements and pain points',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
    metadata: {
      duration: '45 minutes',
      keyPoints: 'Looking to replace legacy CRM, 500+ users, Q4 timeline',
    },
  },
  {
    id: '4',
    type: 'task',
    title: 'Prepare custom POC environment',
    description: 'Set up demo environment with customer-specific data',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: '3', name: 'David Park', role: 'Solutions Engineer' },
    status: 'completed',
  },
];

export default function ActivityTimelinePage() {
  const router = useRouter();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  const handleAddComment = (activityId: string, comment: string, mentions: string[]) => {
    setCurrentActivityId(activityId);
    setShowCommentModal(true);
  };

  const handleSaveComment = (comment: Comment) => {
    console.log('Comment saved:', comment);
    setShowCommentModal(false);
    setCurrentActivityId(undefined);
  };

  const handleLikeActivity = (activityId: string) => {
    console.log('Activity liked:', activityId);
  };

  const handleEditActivity = (activityId: string) => {
    console.log('Editing activity:', activityId);
  };

  const handleDeleteActivity = (activityId: string) => {
    setDeleteTarget({ type: 'activity', id: activityId });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      console.log('Deleted:', deleteTarget);
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">

      <div className="flex-1 px-3 py-2 overflow-auto">
        <button
          onClick={() => router.push('/crm/advanced-features')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced Features
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Collaborative Activity Timeline</h2>
          <p className="text-gray-600 mb-2">
            Complete interaction history with comments, likes, @mentions, and attachments for full team
            collaboration.
          </p>
          <CollaborativeTimeline
            activities={mockTimelineActivities}
            currentUser={{ id: '2', name: 'Mike Chen' }}
            teamMembers={[
              { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
              { id: '2', name: 'Mike Chen', role: 'Sales Manager' },
              { id: '3', name: 'David Park', role: 'Solutions Engineer' },
            ]}
            onAddComment={handleAddComment}
            onLike={handleLikeActivity}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            showComments={true}
            showActions={true}
          />
        </div>
      </div>

      <CommentModal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setCurrentActivityId(undefined);
        }}
        onSave={handleSaveComment}
        mode="add"
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${deleteTarget?.type}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
