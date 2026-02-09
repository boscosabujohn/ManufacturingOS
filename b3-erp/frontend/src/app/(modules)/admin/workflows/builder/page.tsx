"use client";

import React, { useState, useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import { useUserPreference } from '@/contexts/UserPreferenceContext'; // Use theme

const initialNodes: Node[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' }, type: 'input' },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'Approval Step' } },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

export default function WorkflowBuilder() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { preferences } = useUserPreference(); // For theme aware styling if needed

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const addNode = () => {
        const id = `${nodes.length + 1}`;
        const newNode: Node = {
            id,
            data: { label: `Step ${id}` },
            position: {
                x: Math.random() * 400,
                y: Math.random() * 400,
            },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const saveWorkflow = () => {
        console.log('Saving workflow:', { nodes, edges });
        // TODO: Call backend API to save
        // POST /api/workflows
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Workflow Designer</h1>
                <div className="flex gap-2">
                    <Button onClick={addNode} variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Add Node
                    </Button>
                    <Button onClick={saveWorkflow}>
                        <Save className="mr-2 h-4 w-4" /> Save Workflow
                    </Button>
                </div>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden bg-background">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}
