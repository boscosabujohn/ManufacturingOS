"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Download,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  BarChart3,
  Calendar,
  TrendingUp,
  UserMinus,
  Award,
  Clock,
  Zap,
} from "lucide-react";
import { AssignToProjectModal } from "@/components/project-management/ResourceModals";
import { AdvancedFilterModal } from "@/components/project-management/ProjectListModals";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import {
  AllocateResourceModal,
  BulkAllocationModal,
  ResourceDetailsModal,
  EditAllocationModal,
  TransferResourceModal,
  ResourceAvailabilityModal,
  WorkloadBalancingModal,
  RequestResourceModal,
  ReleaseResourceModal,
  ResourceSkillsModal,
  TimeTrackingModal,
  ResourceForecastModal,
} from "@/components/projects/ProjectResourcesModals";

type Res = { id: string; name: string; role: string; dept: string; utilization: number };
const TOP_OVER: Res[] = [
  { id: 'E-307', name: 'Rahul Kumar', role: 'Engineer', dept: 'Engineering', utilization: 92 },
  { id: 'E-101', name: 'Amit Singh', role: 'Project Manager', dept: 'Projects', utilization: 88 },
  { id: 'E-512', name: 'Vikram Reddy', role: 'Developer', dept: 'IT', utilization: 86 },
];

export default function ResourceAllocationPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const list = useMemo(() => TOP_OVER, []);

  // Modal state
  const [showFilter, setShowFilter] = useState(false);
  const [showAllocate, setShowAllocate] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Res | null>(null);

  // New modal states
  const [isBulkAllocationModalOpen, setIsBulkAllocationModalOpen] = useState(false);
  const [isResourceDetailsModalOpen, setIsResourceDetailsModalOpen] = useState(false);
  const [isEditAllocationModalOpen, setIsEditAllocationModalOpen] = useState(false);
  const [isTransferResourceModalOpen, setIsTransferResourceModalOpen] = useState(false);
  const [isResourceAvailabilityModalOpen, setIsResourceAvailabilityModalOpen] = useState(false);
  const [isWorkloadBalancingModalOpen, setIsWorkloadBalancingModalOpen] = useState(false);
  const [isRequestResourceModalOpen, setIsRequestResourceModalOpen] = useState(false);
  const [isReleaseResourceModalOpen, setIsReleaseResourceModalOpen] = useState(false);
  const [isResourceSkillsModalOpen, setIsResourceSkillsModalOpen] = useState(false);
  const [isTimeTrackingModalOpen, setIsTimeTrackingModalOpen] = useState(false);
  const [isResourceForecastModalOpen, setIsResourceForecastModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);

  // Modal Handlers
  const handleAllocateResource = (data: any) => {
    console.log('Allocate Resource:', data);
    setShowAllocate(false);
    toast?.({ title: "Resource allocated", description: `Resource allocated successfully` });
  };

  const handleBulkAllocation = (data: any) => {
    console.log('Bulk Allocation:', data);
    setIsBulkAllocationModalOpen(false);
    toast?.({ title: "Resources allocated", description: `${data.selectedResources.length} resources allocated` });
  };

  const handleEditAllocation = (data: any) => {
    console.log('Edit Allocation:', data);
    setIsEditAllocationModalOpen(false);
    toast?.({ title: "Allocation updated", description: "Allocation updated successfully" });
  };

  const handleTransferResource = (data: any) => {
    console.log('Transfer Resource:', data);
    setIsTransferResourceModalOpen(false);
    toast?.({ title: "Resource transferred", description: "Resource transferred successfully" });
  };

  const handleWorkloadBalancing = (data: any) => {
    console.log('Workload Balancing:', data);
    setIsWorkloadBalancingModalOpen(false);
    toast?.({ title: "Workload balanced", description: "Workload rebalanced successfully" });
  };

  const handleRequestResource = (data: any) => {
    console.log('Request Resource:', data);
    setIsRequestResourceModalOpen(false);
    toast?.({ title: "Request submitted", description: "Resource request submitted for approval" });
  };

  const handleReleaseResource = (data: any) => {
    console.log('Release Resource:', data);
    setIsReleaseResourceModalOpen(false);
    toast?.({ title: "Resource released", description: "Resource released successfully" });
  };

  const handleSaveSkills = (data: any) => {
    console.log('Save Skills:', data);
    setIsResourceSkillsModalOpen(false);
    toast?.({ title: "Skills updated", description: `${data.skills.length} skills saved` });
  };

  const handleLogTime = (data: any) => {
    console.log('Log Time:', data);
    setIsTimeTrackingModalOpen(false);
    toast?.({ title: "Time logged", description: `${data.hours} hours logged successfully` });
  };

  return (
    <div className="p-6">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="h-8 w-8 text-teal-600" />
          Resource Allocation
        </h1>
        <p className="text-gray-600 mt-2">Allocate and manage project resources</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-2 justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilter(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => {
                  setSelectedResource(null);
                  setShowAllocate(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <PlusCircle className="h-4 w-4" />
                Allocate Resource
              </button>
            </div>
          </div>

          {/* Additional Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setIsBulkAllocationModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <UserCheck className="h-4 w-4" />
              Bulk Allocate
            </button>
            <button
              onClick={() => setIsWorkloadBalancingModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <BarChart3 className="h-4 w-4" />
              Balance Workload
            </button>
            <button
              onClick={() => setIsResourceAvailabilityModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              Check Availability
            </button>
            <button
              onClick={() => setIsRequestResourceModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <UserCheck className="h-4 w-4" />
              Request Resource
            </button>
            <button
              onClick={() => setIsResourceForecastModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Zap className="h-4 w-4" />
              View Forecast
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Total Resources</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">142</p>
            </div>
            <Users className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Allocated</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">98</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold text-green-900 mt-1">44</p>
            </div>
            <Users className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Over-allocated</p>
              <p className="text-3xl font-bold text-red-900 mt-1">6</p>
            </div>
            <Users className="h-12 w-12 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <a href="/projects/resources/utilization" className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">78%</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Avg. across active resources</p>
        </a>
        <a href="/projects/resources/team" className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">68</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Across 12 departments</p>
        </a>
        <a href="/projects/resources/calendar" className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bookings This Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">112</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Meetings, installs, surveys</p>
        </a>
      </div>

      {/* Overutilized list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h3 className="font-semibold text-gray-800">Top Overutilized Resources</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Utilization</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {list.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{r.name} <span className="text-gray-400">({r.id})</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.dept}</td>
                  <td className="px-4 py-3">
                    <div className="w-40">
                      <div className="h-2 w-full bg-gray-100 rounded"><div className={`h-2 rounded ${r.utilization>85?'bg-red-500':'bg-yellow-500'}`} style={{ width: `${r.utilization}%` }} /></div>
                      <div className="mt-1 text-xs text-gray-600">{r.utilization}%</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedResource(r);
                          setIsResourceDetailsModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResource(r);
                          setIsTransferResourceModalOpen(true);
                        }}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Transfer"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResource(r);
                          setIsResourceSkillsModalOpen(true);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Manage Skills"
                      >
                        <Award className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResource(r);
                          setIsTimeTrackingModalOpen(true);
                        }}
                        className="p-1.5 text-violet-600 hover:bg-violet-50 rounded transition-colors"
                        title="Log Time"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResource(r);
                          setIsReleaseResourceModalOpen(true);
                        }}
                        className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                        title="Release"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AdvancedFilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(filters: any) => {
          setShowFilter(false);
          toast?.({ title: "Filters applied", description: JSON.stringify(filters) });
        }}
      />

      <AssignToProjectModal
        isOpen={showAllocate}
        onClose={() => setShowAllocate(false)}
        resource={selectedResource as any}
        onSubmit={(data: any) => {
          setShowAllocate(false);
          toast?.({ title: "Resource allocated", description: `${data?.resourceName || 'Resource'} → ${data?.project || 'Project'}` });
        }}
      />

      <ConfirmDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        onConfirm={() => {
          setShowExport(false);
          toast?.({ title: "Export started", description: "Generating resource allocation report..." });
        }}
        title="Export Resource Allocation"
        message="Do you want to export the current view as CSV?"
        confirmLabel="Export CSV"
        variant="info"
      />

      {/* New Modals */}
      <AllocateResourceModal
        isOpen={showAllocate}
        onClose={() => setShowAllocate(false)}
        onAllocate={handleAllocateResource}
        resource={selectedResource}
      />

      <BulkAllocationModal
        isOpen={isBulkAllocationModalOpen}
        onClose={() => setIsBulkAllocationModalOpen(false)}
        onAllocate={handleBulkAllocation}
      />

      <ResourceDetailsModal
        isOpen={isResourceDetailsModalOpen}
        onClose={() => setIsResourceDetailsModalOpen(false)}
        resource={selectedResource}
      />

      <EditAllocationModal
        isOpen={isEditAllocationModalOpen}
        onClose={() => setIsEditAllocationModalOpen(false)}
        onUpdate={handleEditAllocation}
        allocation={selectedAllocation}
      />

      <TransferResourceModal
        isOpen={isTransferResourceModalOpen}
        onClose={() => setIsTransferResourceModalOpen(false)}
        onTransfer={handleTransferResource}
        resource={selectedResource}
      />

      <ResourceAvailabilityModal
        isOpen={isResourceAvailabilityModalOpen}
        onClose={() => setIsResourceAvailabilityModalOpen(false)}
        startDate="2025-02-01"
        endDate="2025-02-28"
      />

      <WorkloadBalancingModal
        isOpen={isWorkloadBalancingModalOpen}
        onClose={() => setIsWorkloadBalancingModalOpen(false)}
        onBalance={handleWorkloadBalancing}
      />

      <RequestResourceModal
        isOpen={isRequestResourceModalOpen}
        onClose={() => setIsRequestResourceModalOpen(false)}
        onRequest={handleRequestResource}
      />

      <ReleaseResourceModal
        isOpen={isReleaseResourceModalOpen}
        onClose={() => setIsReleaseResourceModalOpen(false)}
        onRelease={handleReleaseResource}
        resource={selectedResource}
      />

      <ResourceSkillsModal
        isOpen={isResourceSkillsModalOpen}
        onClose={() => setIsResourceSkillsModalOpen(false)}
        onSave={handleSaveSkills}
        resource={selectedResource}
      />

      <TimeTrackingModal
        isOpen={isTimeTrackingModalOpen}
        onClose={() => setIsTimeTrackingModalOpen(false)}
        onSubmit={handleLogTime}
        resource={selectedResource}
      />

      <ResourceForecastModal
        isOpen={isResourceForecastModalOpen}
        onClose={() => setIsResourceForecastModalOpen(false)}
        startDate="2025-02-01"
        endDate="2025-05-31"
      />
    </div>
  );
}
