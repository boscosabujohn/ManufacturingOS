'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, RotateCcw, AlertTriangle, MessageSquare } from 'lucide-react';

interface ApprovalAction {
    id: string;
    label: string;
    action: 'approve' | 'reject' | 'send-back' | 'escalate';
    requiresComment: boolean;
    buttonClass?: string;
}

interface InContextApprovalProps {
    referenceId: string;
    approvalId?: string;
    title: string;
    description?: string;
    currentStatus?: string;
    onActionComplete?: () => void;
}

export default function InContextApproval({
    referenceId,
    approvalId,
    title,
    description,
    currentStatus = 'pending',
    onActionComplete
}: InContextApprovalProps) {
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const actions: ApprovalAction[] = [
        {
            id: 'approve',
            label: 'Approve',
            action: 'approve',
            requiresComment: false,
            buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
        },
        {
            id: 'reject',
            label: 'Reject',
            action: 'reject',
            requiresComment: true,
            buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
        },
        {
            id: 'send-back',
            label: 'Send Back',
            action: 'send-back',
            requiresComment: true,
            buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        },
    ];

    const handleActionClick = (action: ApprovalAction) => {
        if (action.requiresComment) {
            setSelectedAction(action.id);
            setShowCommentBox(true);
        } else {
            performAction(action.id);
        }
    };

    const performAction = async (actionId: string) => {
        if (!approvalId) {
            setError('No approval ID provided');
            return;
        }

        const action = actions.find(a => a.id === actionId);
        if (!action) return;

        if (action.requiresComment && !comment.trim()) {
            setError('Comment is required for this action');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/workflow/tasks/action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId: approvalId,
                    userId: 'current-user-id', // From auth context
                    action: actionId,
                    comment: comment.trim() || undefined,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Successfully ${action.label.toLowerCase()}ed`);
                setComment('');
                setShowCommentBox(false);
                setSelectedAction(null);

                // Call parent callback
                if (onActionComplete) {
                    onActionComplete();
                }
            } else {
                setError(data.message || 'Action failed');
            }
        } catch (err) {
            setError('Failed to perform action');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (actionId: string) => {
        const icons = {
            approve: <CheckCircle className="h-5 w-5" />,
            reject: <XCircle className="h-5 w-5" />,
            'send-back': <RotateCcw className="h-5 w-5" />,
        };
        return icons[actionId as keyof typeof icons];
    };

    // If already approved/rejected, show readonly status
    if (currentStatus !== 'pending') {
        return (
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                            This item has already been {currentStatus}
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Approval Header */}
            <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-purple-600 mt-1" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-purple-900">{title}</h3>
                            {description && (
                                <p className="text-sm text-purple-700 mt-1">{description}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            {!showCommentBox && (
                <div className="flex gap-3">
                    {actions.map((action) => (
                        <Button
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            disabled={loading}
                            className={action.buttonClass}
                        >
                            {getIcon(action.id)}
                            <span className="ml-2">{action.label}</span>
                        </Button>
                    ))}
                </div>
            )}

            {/* Comment Box */}
            {showCommentBox && selectedAction && (
                <Card>
                    <CardContent className="p-4">
                        <label className="block text-sm font-medium mb-2">
                            Add Comment (Required)
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Please provide a reason..."
                            rows={3}
                            className="mb-3"
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={() => performAction(selectedAction)}
                                disabled={loading || !comment.trim()}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCommentBox(false);
                                    setSelectedAction(null);
                                    setComment('');
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error / Success Messages */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-900">{success}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
