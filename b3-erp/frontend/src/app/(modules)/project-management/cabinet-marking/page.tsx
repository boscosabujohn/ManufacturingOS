'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Package,
  Camera,
  FileText,
  Download,
  AlertCircle,
  Edit,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface CabinetMarkingTask {
  id: string;
  taskNumber: string;
  projectId: string;
  projectName: string;
  cabinetType: string;
  quantity: number;
  scheduledDate: string;
  assignedTeam: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending Review';
  completionPercentage: number;
  markedItems: number;
  totalItems: number;
  photosUploaded: number;
  reportGenerated: boolean;
}

const mockMarkingTasks: CabinetMarkingTask[] = [
  {
    id: '1',
    taskNumber: 'CM-2025-001',
    projectId: 'PRJ-2025-001',
    projectName: 'Taj Hotels - Commercial Kitchen Setup',
    cabinetType: 'Wall Cabinets - Upper Level',
    quantity: 24,
    scheduledDate: '2025-01-22',
    assignedTeam: 'Installation Team A - 4 members',
    status: 'Completed',
    completionPercentage: 100,
    markedItems: 24,
    totalItems: 24,
    photosUploaded: 12,
    reportGenerated: true,
  },
  {
    id: '2',
    taskNumber: 'CM-2025-002',
    projectId: 'PRJ-2025-001',
    projectName: 'Taj Hotels - Commercial Kitchen Setup',
    cabinetType: 'Base Cabinets - Floor Level',
    quantity: 18,
    scheduledDate: '2025-01-23',
    assignedTeam: 'Installation Team A - 4 members',
    status: 'In Progress',
    completionPercentage: 65,
    markedItems: 12,
    totalItems: 18,
    photosUploaded: 8,
    reportGenerated: false,
  },
  {
    id: '3',
    taskNumber: 'CM-2025-003',
    projectId: 'PRJ-2025-001',
    projectName: 'Taj Hotels - Commercial Kitchen Setup',
    cabinetType: 'Storage Cabinets - Modular',
    quantity: 15,
    scheduledDate: '2025-01-25',
    assignedTeam: 'Installation Team B - 3 members',
    status: 'Scheduled',
    completionPercentage: 0,
    markedItems: 0,
    totalItems: 15,
    photosUploaded: 0,
    reportGenerated: false,
  },
  {
    id: '4',
    taskNumber: 'CM-2025-004',
    projectId: 'PRJ-2025-002',
    projectName: 'BigBasket Cold Storage Facility',
    cabinetType: 'Control Panel Enclosures',
    quantity: 8,
    scheduledDate: '2025-01-26',
    assignedTeam: 'Installation Team C - 2 members',
    status: 'Pending Review',
    completionPercentage: 100,
    markedItems: 8,
    totalItems: 8,
    photosUploaded: 4,
    reportGenerated: false,
  },
];

export default function CabinetMarkingPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<CabinetMarkingTask[]>(mockMarkingTasks);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    projectName: '',
    cabinetType: '',
    quantity: '',
    assignedTeam: '',
  });

  const handleScheduleTask = () => {
    if (!newTask.projectName || !newTask.cabinetType || !newTask.quantity || !newTask.assignedTeam) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields to schedule a task.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: CabinetMarkingTask = {
      id: Math.random().toString(36).substring(7),
      taskNumber: `CM-2025-${(tasks.length + 1).toString().padStart(3, '0')}`,
      projectId: 'PRJ-2025-NEW',
      projectName: newTask.projectName,
      cabinetType: newTask.cabinetType,
      quantity: parseInt(newTask.quantity),
      scheduledDate: new Date().toISOString().split('T')[0],
      assignedTeam: newTask.assignedTeam,
      status: 'Scheduled',
      completionPercentage: 0,
      markedItems: 0,
      totalItems: parseInt(newTask.quantity),
      photosUploaded: 0,
      reportGenerated: false,
    };

    setTasks([newEntry, ...tasks]);
    setIsScheduleOpen(false);
    setNewTask({ projectName: '', cabinetType: '', quantity: '', assignedTeam: '' });
    toast({
      title: "Task Scheduled",
      description: `${newEntry.taskNumber} has been scheduled successfully.`,
    });
  };

  const filteredTasks = tasks.filter(
    (t) => statusFilter === 'All' || t.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending Review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Pending Review':
        return <AlertCircle className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const stats = {
    total: tasks.length,
    scheduled: tasks.filter((t) => t.status === 'Scheduled').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    pendingReview: tasks.filter((t) => t.status === 'Pending Review').length,
    totalCabinets: tasks.reduce((sum, t) => sum + t.quantity, 0),
    markedCabinets: tasks.reduce((sum, t) => sum + t.markedItems, 0),
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/project-management"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Cabinet Marking Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Phase 2: Coordinate and execute cabinet marking before installation
                </p>
              </div>
            </div>
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Schedule Marking
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule Marking Task</DialogTitle>
                  <DialogDescription>
                    Create a new cabinet marking task.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project" className="text-right">
                      Project
                    </Label>
                    <Select
                      onValueChange={(value) => setNewTask({ ...newTask, projectName: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Taj Hotels - Commercial Kitchen Setup">Taj Hotels</SelectItem>
                        <SelectItem value="BigBasket Cold Storage Facility">BigBasket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Input
                      id="type"
                      value={newTask.cabinetType}
                      onChange={(e) => setNewTask({ ...newTask, cabinetType: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Wall Cabinets"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newTask.quantity}
                      onChange={(e) => setNewTask({ ...newTask, quantity: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="team" className="text-right">
                      Team
                    </Label>
                    <Input
                      id="team"
                      value={newTask.assignedTeam}
                      onChange={(e) => setNewTask({ ...newTask, assignedTeam: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Team A"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleScheduleTask}>Schedule Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cabinets Marked</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.markedCabinets}/{stats.totalCabinets}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Overall Marking Progress</h3>
            <span className="text-2xl font-bold text-gray-900">
              {Math.round((stats.markedCabinets / stats.totalCabinets) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(stats.markedCabinets / stats.totalCabinets) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.markedCabinets} of {stats.totalCabinets} cabinets marked across all projects
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Marking Tasks List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Cabinet Marking Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {task.taskNumber} - {task.cabinetType}
                        </h3>
                        <p className="text-sm text-gray-600">{task.projectName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Scheduled Date</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.scheduledDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="text-sm font-medium text-gray-900">{task.quantity} cabinets</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Assigned Team</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {task.assignedTeam}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Photos</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          {task.photosUploaded} uploaded
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Marking Progress</span>
                        <span className="font-medium text-gray-900">
                          {task.markedItems}/{task.totalItems} items marked ({task.completionPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${task.completionPercentage === 100
                            ? 'bg-green-600'
                            : task.completionPercentage > 0
                              ? 'bg-yellow-600'
                              : 'bg-gray-400'
                            }`}
                          style={{ width: `${task.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Task"
                        onClick={() => toast({ title: "Edit Task", description: `Editing task ${task.taskNumber}` })}
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
                        <DialogTrigger asChild>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Checklist"
                          >
                            <FileText className="w-4 h-4 text-gray-600" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Marking Checklist</DialogTitle>
                            <DialogDescription>Standard procedure for cabinet marking.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {[
                              "Verify cabinet dimensions against drawings",
                              "Check for surface defects or damage",
                              "Apply identification label to visible surface",
                              "Mark installation height and position",
                              "Photograph marked cabinet",
                              "Update tracking sheet"
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-gray-300" />
                                <span className="text-sm text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button onClick={() => setIsChecklistOpen(false)}>Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {task.reportGenerated && (
                        <button
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          title="Download Report"
                          onClick={() => toast({ title: "Download Report", description: "Downloading marking report..." })}
                        >
                          <Download className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">About Cabinet Marking</h3>
              <p className="text-sm text-blue-700 mt-1">
                Step 2.9: Schedule and execute cabinet marking tasks before installation.
                Teams mark cabinets with identifying labels, take photos for documentation, and
                generate marking reports for the installation team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
