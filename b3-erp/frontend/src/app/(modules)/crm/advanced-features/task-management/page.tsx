'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageToolbar, ConfirmDialog } from '@/components/ui';
import { TaskBoard } from '@/components/crm';
import type { Task as CRMTask } from '@/components/crm';
import { TaskModal, type Task as ModalTask } from '@/components/modals';
import { ArrowLeft } from 'lucide-react';

const mockTasks: CRMTask[] = [
  {
    id: '1',
    title: 'Follow up on proposal with TechCorp',
    description: 'Check if decision makers have reviewed the pricing proposal',
    status: 'todo',
    priority: 'high',
    assignedTo: { id: '1', name: 'Sarah Johnson' },
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '2', name: 'Mike Chen' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    relatedTo: { type: 'opportunity', id: 'opp-1', name: 'TechCorp Enterprise Deal' },
    tags: ['high-value', 'enterprise'],
    comments: 2,
    attachments: 1,
  },
  {
    id: '2',
    title: 'Prepare ROI calculator for manufacturing prospect',
    description: 'Create custom ROI analysis showing cost savings',
    status: 'in_progress',
    priority: 'high',
    assignedTo: { id: '3', name: 'David Park' },
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '1', name: 'Sarah Johnson' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedTo: { type: 'lead', id: 'lead-2', name: 'GlobalMfg Corp' },
    tags: ['roi', 'manufacturing'],
    comments: 5,
  },
  {
    id: '3',
    title: 'Schedule product demo',
    description: 'Book calendar time for comprehensive platform walkthrough',
    status: 'review',
    priority: 'medium',
    assignedTo: { id: '1', name: 'Sarah Johnson' },
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '1', name: 'Sarah Johnson' },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['demo'],
    comments: 1,
  },
  {
    id: '4',
    title: 'Send contract for e-signature',
    description: 'Get final approval and send contract via DocuSign',
    status: 'completed',
    priority: 'high',
    assignedTo: { id: '1', name: 'Sarah Johnson' },
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '2', name: 'Mike Chen' },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    relatedTo: { type: 'opportunity', id: 'opp-3', name: 'FinanceHub Deal' },
    tags: ['contract', 'closing'],
  },
];

export default function TaskManagementPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<CRMTask[]>(mockTasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTask, setEditingTask] = useState<CRMTask | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  // Conversion helpers
  const crmTaskToModalTask = (task: CRMTask): ModalTask => ({
    id: task.id,
    title: task.title,
    description: task.description,
    assignee: task.assignedTo?.name,
    dueDate: task.dueDate,
    priority: task.priority === 'critical' ? 'urgent' : task.priority,
    status: task.status === 'completed' ? 'done' : task.status,
    tags: task.tags,
  });

  const modalTaskToCrmTask = (modalTask: ModalTask, existingTask?: CRMTask): CRMTask => {
    const now = new Date().toISOString();
    return {
      id: modalTask.id || Date.now().toString(),
      title: modalTask.title,
      description: modalTask.description,
      status: modalTask.status === 'done' ? 'completed' : modalTask.status,
      priority: modalTask.priority === 'urgent' ? 'critical' : modalTask.priority,
      assignedTo: modalTask.assignee ? { id: '1', name: modalTask.assignee } : existingTask?.assignedTo,
      dueDate: modalTask.dueDate,
      createdBy: existingTask?.createdBy || { id: '1', name: 'Current User' },
      createdAt: existingTask?.createdAt || now,
      relatedTo: existingTask?.relatedTo,
      tags: modalTask.tags,
      comments: existingTask?.comments || 0,
      attachments: existingTask?.attachments || 0,
    };
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setShowTaskModal(true);
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setShowTaskModal(true);
    }
  };

  const handleDeleteTask = (id: string) => {
    setDeleteTarget({ type: 'task', id });
    setShowDeleteConfirm(true);
  };

  const handleViewTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      console.log('Viewing task:', task);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status: status as CRMTask['status'] } : t
    ));
  };

  const handleSaveTask = (modalTask: ModalTask) => {
    if (editingTask) {
      const updatedCrmTask = modalTaskToCrmTask(modalTask, editingTask);
      setTasks(tasks.map(t => t.id === modalTask.id ? updatedCrmTask : t));
    } else {
      const newCrmTask = modalTaskToCrmTask(modalTask);
      setTasks([...tasks, newCrmTask]);
    }
    setShowTaskModal(false);
    setEditingTask(undefined);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget && deleteTarget.type === 'task') {
      setTasks(tasks.filter(t => t.id !== deleteTarget.id));
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Task Management & Collaboration</h2>
          <p className="text-gray-600 mb-2">
            Kanban-style task board with priorities, assignments, due dates, and integration with CRM
            records.
          </p>
          <TaskBoard
            tasks={tasks}
            currentUser={{ id: '1', name: 'Sarah Johnson' }}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onViewTask={handleViewTask}
            onStatusChange={handleStatusChange}
            showFilters={true}
            viewMode="board"
          />
        </div>
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
        task={editingTask ? crmTaskToModalTask(editingTask) : undefined}
        mode={editingTask ? 'edit' : 'add'}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this task? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
