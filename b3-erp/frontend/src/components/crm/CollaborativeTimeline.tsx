'use client';

import React, { useState } from 'react';
import {
  Clock,
  User,
  Mail,
  Phone,
  Video,
  FileText,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  UserPlus,
  Edit,
  Trash2,
  ThumbsUp,
  AtSign,
  Paperclip,
  Send,
  MoreVertical,
} from 'lucide-react';

export interface TimelineUser {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface TimelineComment {
  id: string;
  user: TimelineUser;
  text: string;
  timestamp: string;
  mentions?: string[];
}

export interface TimelineActivity {
  id: string;
  type:
    | 'email'
    | 'call'
    | 'meeting'
    | 'note'
    | 'task'
    | 'status_change'
    | 'assignment'
    | 'document'
    | 'video_call';
  title: string;
  description?: string;
  timestamp: string;
  user: TimelineUser;
  metadata?: Record<string, any>;
  comments?: TimelineComment[];
  likes?: string[]; // user IDs who liked
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  status?: 'completed' | 'pending' | 'cancelled';
}

export interface CollaborativeTimelineProps {
  activities: TimelineActivity[];
  currentUser?: TimelineUser;
  onAddComment?: (activityId: string, comment: string, mentions: string[]) => void;
  onLike?: (activityId: string) => void;
  onEdit?: (activityId: string) => void;
  onDelete?: (activityId: string) => void;
  onMention?: (userId: string) => void;
  teamMembers?: TimelineUser[];
  showComments?: boolean;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

const ActivityIcon: React.FC<{ type: string; status?: string }> = ({ type, status }) => {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'video_call':
        return <Video className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'task':
        return status === 'completed' ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        );
      case 'assignment':
        return <UserPlus className="h-4 w-4" />;
      case 'status_change':
        return <AlertCircle className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600 border-blue-300';
      case 'call':
        return 'bg-green-100 text-green-600 border-green-300';
      case 'meeting':
        return 'bg-purple-100 text-purple-600 border-purple-300';
      case 'video_call':
        return 'bg-indigo-100 text-indigo-600 border-indigo-300';
      case 'note':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      case 'task':
        return status === 'completed'
          ? 'bg-green-100 text-green-600 border-green-300'
          : 'bg-yellow-100 text-yellow-600 border-yellow-300';
      case 'assignment':
        return 'bg-cyan-100 text-cyan-600 border-cyan-300';
      case 'status_change':
        return 'bg-orange-100 text-orange-600 border-orange-300';
      case 'document':
        return 'bg-pink-100 text-pink-600 border-pink-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getColor()}`}>
      {getIcon()}
    </div>
  );
};

const ActivityItem: React.FC<{
  activity: TimelineActivity;
  currentUser?: TimelineUser;
  teamMembers?: TimelineUser[];
  showComments?: boolean;
  showActions?: boolean;
  onAddComment?: (activityId: string, comment: string, mentions: string[]) => void;
  onLike?: (activityId: string) => void;
  onEdit?: (activityId: string) => void;
  onDelete?: (activityId: string) => void;
  onMention?: (userId: string) => void;
}> = ({
  activity,
  currentUser,
  teamMembers = [],
  showComments = true,
  showActions = true,
  onAddComment,
  onLike,
  onEdit,
  onDelete,
  onMention,
}) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');

  const isLiked = currentUser && activity.likes?.includes(currentUser.id);
  const likeCount = activity.likes?.length || 0;
  const commentCount = activity.comments?.length || 0;

  const handleAddComment = () => {
    if (commentText.trim() && onAddComment) {
      // Extract mentions from text (@username)
      const mentions = commentText.match(/@(\w+)/g)?.map((m) => m.substring(1)) || [];
      onAddComment(activity.id, commentText, mentions);
      setCommentText('');
      setShowCommentBox(false);
    }
  };

  const handleMentionSelect = (user: TimelineUser) => {
    setCommentText((prev) => prev + `@${user.name} `);
    setShowMentions(false);
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <div className="relative pb-8">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />

      <div className="relative flex items-start space-x-4">
        {/* Icon */}
        <ActivityIcon type={activity.type} status={activity.status} />

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1">
                {activity.user.avatar ? (
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {activity.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.user.name}</p>
                  {activity.user.role && (
                    <p className="text-xs text-gray-500">{activity.user.role}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center space-x-1 ml-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(activity.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(activity.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
            {activity.description && (
              <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
            )}

            {/* Metadata */}
            {activity.metadata && (
              <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600 space-y-1">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-semibold capitalize">{key}:</span>{' '}
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Attachments */}
            {activity.attachments && activity.attachments.length > 0 && (
              <div className="mb-3 space-y-2">
                {activity.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm"
                  >
                    <Paperclip className="h-4 w-4 text-gray-600" />
                    <a href={attachment.url} className="text-blue-600 hover:underline flex-1">
                      {attachment.name}
                    </a>
                    <span className="text-xs text-gray-500">{attachment.type}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => onLike && onLike(activity.id)}
                className={`flex items-center space-x-1 text-sm ${
                  isLiked
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                } transition-colors`}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount > 0 && likeCount}</span>
                <span>Like</span>
              </button>

              {showComments && (
                <button
                  onClick={() => setShowCommentBox(!showCommentBox)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{commentCount > 0 && commentCount}</span>
                  <span>Comment</span>
                </button>
              )}
            </div>

            {/* Comments */}
            {showComments && activity.comments && activity.comments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {activity.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2">
                    {comment.user.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {comment.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    )}
                    <div className="flex-1 bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-900">{comment.user.name}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            {showComments && showCommentBox && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={commentText}
                      onChange={(e) => {
                        setCommentText(e.target.value);
                        // Show mentions dropdown if @ is typed
                        if (e.target.value.endsWith('@')) {
                          setShowMentions(true);
                          setMentionSearch('');
                        } else if (showMentions) {
                          const lastAt = e.target.value.lastIndexOf('@');
                          if (lastAt !== -1) {
                            setMentionSearch(e.target.value.substring(lastAt + 1));
                          } else {
                            setShowMentions(false);
                          }
                        }
                      }}
                      placeholder="Add a comment... Use @ to mention"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      rows={2}
                    />
                    {/* Mentions Dropdown */}
                    {showMentions && filteredMembers.length > 0 && (
                      <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-40 overflow-y-auto z-10">
                        {filteredMembers.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleMentionSelect(member)}
                            className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                          >
                            <AtSign className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">{member.name}</span>
                            {member.role && (
                              <span className="text-xs text-gray-500">{member.role}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollaborativeTimeline: React.FC<CollaborativeTimelineProps> = ({
  activities,
  currentUser,
  onAddComment,
  onLike,
  onEdit,
  onDelete,
  onMention,
  teamMembers = [],
  showComments = true,
  showActions = true,
  compact = false,
  className = '',
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredActivities =
    filter === 'all' ? activities : activities.filter((a) => a.type === filter);

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'email', label: 'Emails' },
    { value: 'call', label: 'Calls' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'task', label: 'Tasks' },
    { value: 'note', label: 'Notes' },
  ];

  return (
    <div className={className}>
      {/* Filter Bar */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
        {activityTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              currentUser={currentUser}
              teamMembers={teamMembers}
              showComments={showComments}
              showActions={showActions}
              onAddComment={onAddComment}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              onMention={onMention}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};
