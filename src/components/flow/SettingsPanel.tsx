import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface SettingsPanelProps {
  isVisible: boolean;
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
}

/**
 * SettingsPanel Component
 * Displays settings for the currently selected node
 * Replaces the NodesPanel when a node is selected
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isVisible,
  selectedNode,
  onUpdateNode,
  onClose,
}) => {
  const [messageText, setMessageText] = useState('');

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode?.data?.label) {
      setMessageText(String(selectedNode.data.label));
    } else {
      setMessageText('');
    }
  }, [selectedNode]);

  // Handle text change with debounced update
  const handleTextChange = (newText: string) => {
    setMessageText(newText);
    
    if (selectedNode) {
      const isValid = newText.trim().length > 0;
      onUpdateNode(selectedNode.id, {
        label: newText,
        isValid,
      });
    }
  };

  if (!isVisible || !selectedNode) return null;

  // Get node type specific settings
  const renderNodeSettings = () => {
    switch (selectedNode.type) {
      case 'textMessage':
        return (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Message Settings</CardTitle>
                  <CardDescription className="text-xs">
                    Configure your message content
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="message-text" className="text-sm font-medium">
                  Text
                </label>
                
                <textarea
                  id="message-text"
                  placeholder="Enter your message here..."
                  value={messageText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className={`min-h-[120px] resize-none text-sm w-full rounded-md border border-2 border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 ${selectedNode.data?.isValid !== false ? 'border-green-300' : 'border-red-800'}`}
                  maxLength={1000}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Message content for your chatbot</span>
                  <span>{messageText.length}/1000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                No settings available for this node type.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border shadow-panel overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 h-auto hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Message</h2>
            <p className="text-sm text-muted-foreground">
              Node ID: {selectedNode.id}
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-4">
          {renderNodeSettings()}
        </div>

        {/* Node Info */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Node Information</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">Text Message</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position:</span>
              <span className="font-medium">
                ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={`font-medium ${
                selectedNode.data?.isValid !== false ? 'text-green-600' : 'text-destructive'
              }`}>
                {selectedNode.data?.isValid !== false ? 'Valid' : 'Invalid'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
