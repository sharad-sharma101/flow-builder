import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus } from 'lucide-react';

interface NodesPanelProps {
  onAddTextNode: () => void;
  isVisible: boolean;
}

/**
 * NodesPanel Component
 * Displays available node types that can be added to the flow
 * Made extensible for future node types
 */
export const NodesPanel: React.FC<NodesPanelProps> = ({ onAddTextNode, isVisible }) => {
  if (!isVisible) return null;

  // Node type definitions - easily extensible for future node types
  const nodeTypes = [
    {
      id: 'textMessage',
      name: 'Message',
      description: 'Send a text message to users',
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: onAddTextNode,
    },
    // Future node types can be added here:
    // {
    //   id: 'quickReply',
    //   name: 'Quick Reply',
    //   description: 'Provide quick response options',
    //   icon: List,
    //   color: 'text-blue-600',
    //   bgColor: 'bg-blue-50',
    //   onClick: onAddQuickReplyNode,
    // },
  ];

  return (
    <div className="w-80 bg-card border-r border-border shadow-panel overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Nodes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop nodes to build your flow
          </p>
        </div>

        <div className="space-y-4">
          {nodeTypes.map((nodeType) => {
            const Icon = nodeType.icon;
            
            return (
              <Button
                onClick={nodeType.onClick}
                size="sm"
                className="w-full mt-3 h-16 text-xs"
                variant="outline"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add {nodeType.name} Node
              </Button>
            );
          })}
        </div>

        {/* Future expansion area */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
          <p className="text-xs text-muted-foreground text-center">
            More node types coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};