'use client';

import { useState, useCallback, useMemo } from 'react';

// Types for workflow nodes and connections
export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'task' | 'decision' | 'approval' | 'notification' | 'delay';
  label: string;
  position: { x: number; y: number };
  data?: Record<string, unknown>;
  config?: NodeConfig;
}

export interface WorkflowConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  condition?: string;
}

export interface NodeConfig {
  assignee?: string;
  dueInDays?: number;
  condition?: string;
  notificationType?: 'email' | 'sms' | 'push';
  delayDays?: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  version: number;
  isActive: boolean;
}

interface WorkflowDesignerProps {
  workflow?: WorkflowDefinition;
  onChange?: (workflow: WorkflowDefinition) => void;
  readOnly?: boolean;
}

const nodeTypes = [
  { type: 'start', label: 'Start', icon: '▶️', color: 'bg-green-500' },
  { type: 'end', label: 'End', icon: '⏹️', color: 'bg-red-500' },
  { type: 'task', label: 'Task', icon: '📋', color: 'bg-blue-500' },
  { type: 'decision', label: 'Decision', icon: '❓', color: 'bg-yellow-500' },
  { type: 'approval', label: 'Approval', icon: '✅', color: 'bg-purple-500' },
  { type: 'notification', label: 'Notify', icon: '🔔', color: 'bg-orange-500' },
  { type: 'delay', label: 'Delay', icon: '⏰', color: 'bg-gray-500' },
] as const;

const defaultWorkflow: WorkflowDefinition = {
  id: 'new-workflow',
  name: 'New Workflow',
  nodes: [
    { id: 'start-1', type: 'start', label: 'Start', position: { x: 100, y: 200 } },
    { id: 'end-1', type: 'end', label: 'End', position: { x: 600, y: 200 } },
  ],
  connections: [],
  version: 1,
  isActive: false,
};

export function WorkflowDesigner({
  workflow = defaultWorkflow,
  onChange,
  readOnly = false,
}: WorkflowDesignerProps) {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowDefinition>(workflow);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  const updateWorkflow = useCallback(
    (updates: Partial<WorkflowDefinition>) => {
      const updated = { ...currentWorkflow, ...updates };
      setCurrentWorkflow(updated);
      onChange?.(updated);
    },
    [currentWorkflow, onChange],
  );

  const addNode = useCallback(
    (type: WorkflowNode['type'], position: { x: number; y: number }) => {
      const nodeType = nodeTypes.find((n) => n.type === type);
      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type,
        label: nodeType?.label || type,
        position,
        data: {},
      };

      updateWorkflow({
        nodes: [...currentWorkflow.nodes, newNode],
      });
    },
    [currentWorkflow.nodes, updateWorkflow],
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      updateWorkflow({
        nodes: currentWorkflow.nodes.filter((n) => n.id !== nodeId),
        connections: currentWorkflow.connections.filter(
          (c) => c.sourceId !== nodeId && c.targetId !== nodeId,
        ),
      });
      setSelectedNode(null);
    },
    [currentWorkflow, updateWorkflow],
  );

  const addConnection = useCallback(
    (sourceId: string, targetId: string) => {
      // Check if connection already exists
      const exists = currentWorkflow.connections.some(
        (c) => c.sourceId === sourceId && c.targetId === targetId,
      );
      if (exists) return;

      const newConnection: WorkflowConnection = {
        id: `conn-${Date.now()}`,
        sourceId,
        targetId,
      };

      updateWorkflow({
        connections: [...currentWorkflow.connections, newConnection],
      });
    },
    [currentWorkflow.connections, updateWorkflow],
  );

  const removeConnection = useCallback(
    (connectionId: string) => {
      updateWorkflow({
        connections: currentWorkflow.connections.filter((c) => c.id !== connectionId),
      });
    },
    [currentWorkflow.connections, updateWorkflow],
  );

  const handleNodeClick = (nodeId: string) => {
    if (connecting) {
      addConnection(connecting, nodeId);
      setConnecting(null);
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };

  const handleStartConnection = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnecting(nodeId);
  };

  const handleCanvasClick = () => {
    setSelectedNode(null);
    setConnecting(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeType || readOnly) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left - 50,
      y: e.clientY - rect.top - 25,
    };

    addNode(draggedNodeType as WorkflowNode['type'], position);
    setDraggedNodeType(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getNodeColor = (type: WorkflowNode['type']) => {
    return nodeTypes.find((n) => n.type === type)?.color || 'bg-gray-500';
  };

  const getNodeIcon = (type: WorkflowNode['type']) => {
    return nodeTypes.find((n) => n.type === type)?.icon || '📦';
  };

  const selectedNodeData = useMemo(
    () => currentWorkflow.nodes.find((n) => n.id === selectedNode),
    [currentWorkflow.nodes, selectedNode],
  );

  return (
    <div className="flex h-[700px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Node Palette */}
      {!readOnly && (
        <div className="w-48 bg-white border-r p-3">
          <h3 className="font-semibold text-gray-800 mb-2">Node Types</h3>
          <div className="space-y-2">
            {nodeTypes.map((node) => (
              <div
                key={node.type}
                draggable
                onDragStart={() => setDraggedNodeType(node.type)}
                onDragEnd={() => setDraggedNodeType(null)}
                className={`p-3 rounded-lg cursor-move flex items-center gap-2 hover:opacity-80 transition-opacity ${node.color} text-white`}
              >
                <span>{node.icon}</span>
                <span className="text-sm font-medium">{node.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Instructions</h4>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Drag nodes to canvas</li>
              <li>• Click node + icon to connect</li>
              <li>• Click node to select</li>
              <li>• Delete key to remove</li>
            </ul>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        className="flex-1 relative overflow-auto"
        onClick={handleCanvasClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {currentWorkflow.connections.map((conn) => {
            const source = currentWorkflow.nodes.find((n) => n.id === conn.sourceId);
            const target = currentWorkflow.nodes.find((n) => n.id === conn.targetId);
            if (!source || !target) return null;

            const x1 = source.position.x + 100;
            const y1 = source.position.y + 25;
            const x2 = target.position.x;
            const y2 = target.position.y + 25;

            return (
              <g key={conn.id}>
                <path
                  d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                {!readOnly && (
                  <circle
                    cx={(x1 + x2) / 2}
                    cy={(y1 + y2) / 2}
                    r="8"
                    fill="#EF4444"
                    className="cursor-pointer pointer-events-auto opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeConnection(conn.id);
                    }}
                  />
                )}
              </g>
            );
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
            </marker>
          </defs>
        </svg>

        {/* Nodes */}
        {currentWorkflow.nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute w-[100px] h-[50px] rounded-lg flex items-center justify-center cursor-pointer transition-all ${getNodeColor(
              node.type,
            )} text-white shadow-lg ${
              selectedNode === node.id ? 'ring-4 ring-blue-300 scale-105' : ''
            } ${connecting === node.id ? 'ring-4 ring-green-300' : ''}`}
            style={{
              left: node.position.x,
              top: node.position.y,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(node.id);
            }}
          >
            <div className="text-center">
              <div className="text-lg">{getNodeIcon(node.type)}</div>
              <div className="text-xs font-medium truncate max-w-[90px]">{node.label}</div>
            </div>

            {/* Connection point */}
            {!readOnly && node.type !== 'end' && (
              <button
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-400 hover:border-green-500 hover:bg-green-100 transition-colors"
                onClick={(e) => handleStartConnection(node.id, e)}
                title="Connect to another node"
              />
            )}
          </div>
        ))}

        {/* Connecting indicator */}
        {connecting && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm">
            Click a node to connect
          </div>
        )}
      </div>

      {/* Properties Panel */}
      {selectedNode && selectedNodeData && !readOnly && (
        <div className="w-64 bg-white border-l p-3">
          <h3 className="font-semibold text-gray-800 mb-2">Node Properties</h3>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedNodeData.label}
                onChange={(e) => {
                  const updated = currentWorkflow.nodes.map((n) =>
                    n.id === selectedNode ? { ...n, label: e.target.value } : n,
                  );
                  updateWorkflow({ nodes: updated });
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="text-sm text-gray-600 capitalize">{selectedNodeData.type}</div>
            </div>

            {selectedNodeData.type === 'approval' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <select className="w-full px-3 py-2 border rounded-md text-sm">
                  <option>Manager</option>
                  <option>Department Head</option>
                  <option>Finance Team</option>
                  <option>HR Team</option>
                </select>
              </div>
            )}

            {selectedNodeData.type === 'delay' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delay (days)</label>
                <input type="number" className="w-full px-3 py-2 border rounded-md text-sm" min="1" />
              </div>
            )}

            {selectedNodeData.type !== 'start' && selectedNodeData.type !== 'end' && (
              <button
                onClick={() => removeNode(selectedNode)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                Delete Node
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowDesigner;
