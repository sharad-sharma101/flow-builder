import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  OnConnect,
  ReactFlowProvider,
  ReactFlowInstance,
  OnNodesChange,
  OnEdgesChange,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { NodesPanel } from '@/components/flow/NodesPanel';
import { SettingsPanel } from '@/components/flow/SettingsPanel';
import { TextMessageNode } from '@/components/flow/TextMessageNode';
import { Save, MessageSquare, RotateCcw } from 'lucide-react';

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textMessage',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Welcome! How can I help you today?',
      isValid: true 
    },
  },
];

const initialEdges: Edge[] = [];

// Define custom node types
const nodeTypes = {
  textMessage: TextMessageNode,
};

const STORAGE_KEY = 'flow:state';

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange]: [Node[], any, OnNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange]: [Edge[], any, OnEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { nodes: Node[]; edges: Edge[] };
      if (parsed?.nodes && parsed?.edges) {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      }
    } catch {}
  }, [setNodes, setEdges]);

  /**
   * Handle connection between nodes
   * Ensures only one edge can originate from a source handle
   */
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      // Check if source handle already has an edge
      const existingEdge = edges.find(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );

      if (existingEdge) {
        toast({
          title: "Connection limit reached",
          description: "A source handle can only have one outgoing connection.",
          variant: "destructive",
        });
        return;
      }

      // Create new edge with proper styling
      const newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        style: {
          stroke: 'hsl(var(--flow-edge))',
          strokeWidth: 2,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [edges, setEdges]
  );

  /**
   * Handle node selection
   */
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowSettings(true);
  }, []);

  /**
   * Handle node deletion
   */
  const onNodesDelete = useCallback((deleted: Node[]) => {
    // If deleted node was selected, hide settings panel
    if (selectedNode && deleted.some(node => node.id === selectedNode.id)) {
      setSelectedNode(null);
      setShowSettings(false);
    }
  }, [selectedNode]);

  /**
   * Update selected node data
   */
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );

    // Update selectedNode if it's the one being updated
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, ...data } } : null);
    }
  }, [setNodes, selectedNode]);

  /**
   * Validate flow before saving
   * Check if there are multiple nodes with empty target handles
   */
  const validateFlow = useCallback((): boolean => {
    if (nodes.length <= 1) return true;

    const nodesWithoutIncomingEdges = nodes.filter(node => {
      return !edges.some(edge => edge.target === node.id);
    });

    return nodesWithoutIncomingEdges.length <= 1;
  }, [nodes, edges]);

  /**
   * Save the flow ( currently in localstorage ) 
   */
  const handleSave = useCallback(() => {
    if (!validateFlow()) {
      toast({
        title: "Cannot save Flow",
        description: "More than one node has empty target handles. Please connect all nodes properly.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    
    toast({
      title: "Flow saved successfully!",
      description: "Your chatbot flow has been saved.",
    });
  }, [validateFlow, nodes, edges]);

  /**
   * Reset the flow
   */
  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
    setShowSettings(false);
    localStorage.removeItem(STORAGE_KEY);
    
    toast({
      title: "Flow reset",
      description: "The flow has been reset to initial state.",
    });
  }, [setNodes, setEdges]);

  /**
   * Add a new text message node
   */
  const addTextNode = useCallback(() => {
    if (!reactFlowInstance) return;

    const id = `${Date.now()}`;
    const position = reactFlowInstance.screenToFlowPosition({
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    });

    const newNode: Node = {
      id,
      type: 'textMessage',
      position,
      data: {
        label: 'Enter your message here...',
        isValid: false,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  /**
   * Close settings panel
   */
  const closeSettings = useCallback(() => {
    setShowSettings(false);
    setSelectedNode(null);
  }, []);

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Flow Builder</h1>
            <p className="text-sm text-muted-foreground">Chatbot flow builder</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Nodes Panel */}
        <NodesPanel 
          onAddTextNode={addTextNode}
          isVisible={!showSettings}
        />

        {/* Settings Panel */}
        <SettingsPanel
          isVisible={showSettings}
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
          onClose={closeSettings}
        />

        {/* Flow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onNodesDelete={onNodesDelete}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              deleteKeyCode={['Backspace', 'Delete']}
              multiSelectionKeyCode="Shift"
              panOnScroll
              selectionOnDrag
              panOnDrag={[1, 2]}
              fitView
              className="bg-flow-canvas"
            >
              <Background 
                color="hsl(var(--muted-foreground) / 0.1)" 
                gap={20} 
                size={1}
              />
              <Controls 
                className="bg-card border border-border rounded-lg shadow-lg"
                showInteractive={false}
              />
              <MiniMap 
                nodeColor="hsl(var(--flow-node-header))"
                nodeStrokeColor="hsl(var(--border))"
                nodeStrokeWidth={2}
                maskColor="hsl(var(--background) / 0.8)"
                className="bg-card border border-border rounded-lg shadow-lg"
                position="bottom-left"
              />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;