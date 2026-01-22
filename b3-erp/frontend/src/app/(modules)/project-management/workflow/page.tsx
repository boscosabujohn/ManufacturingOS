'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowQuickActions } from '@/components/project-management/WorkflowQuickActions';
import { PhaseProgressVisualization } from '@/components/project-management/PhaseProgressVisualization';

export default function WorkflowPage() {
 return (
  <div className="w-full py-6 space-y-6">
   {/* Header */}
   <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
     <Link href="/project-management">
      <Button variant="ghost" className="p-0 hover:bg-transparent">
       <ArrowLeft className="w-6 h-6 text-gray-600" />
      </Button>
     </Link>
     <div>
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
       Manufacturing Workflow
       <span className="inline-flex items-center gap-1 text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-normal">
        <Sparkles className="w-4 h-4" />
        Enhanced Forms
       </span>
      </h1>
      <p className="text-sm text-gray-500">
       Access all 8 phases of the manufacturing workflow with enhanced FormUX features
      </p>
     </div>
    </div>
   </div>

   {/* Phase Progress Overview */}
   <PhaseProgressVisualization variant="horizontal" showDetails={true} />

   {/* Quick Actions - Grid View */}
   <WorkflowQuickActions variant="grid" />

   {/* Quick Actions - List View */}
   <WorkflowQuickActions variant="list" />

   {/* Features Info */}
   <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
     <Sparkles className="w-5 h-5 text-yellow-500" />
     Enhanced Form Features
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
     <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">Multi-Step Wizard</h4>
      <p className="text-sm text-gray-600">
       Break complex forms into manageable steps with visual progress indicators
      </p>
     </div>
     <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">Auto-Save Draft</h4>
      <p className="text-sm text-gray-600">
       Automatically saves your progress every 2 seconds to prevent data loss
      </p>
     </div>
     <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">Draft Recovery</h4>
      <p className="text-sm text-gray-600">
       Resume your work from where you left off with the draft recovery banner
      </p>
     </div>
     <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">Field-Level Help</h4>
      <p className="text-sm text-gray-600">
       Contextual tooltips explain complex fields to guide users
      </p>
     </div>
    </div>
   </div>
  </div>
 );
}
