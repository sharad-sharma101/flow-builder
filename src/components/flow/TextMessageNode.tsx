import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';

/**
 * TextMessageNode Component
 * Represents a message node in the chatbot flow
 */
export const TextMessageNode = memo(({ id, data, selected }: NodeProps) => {
  const isValid = data?.isValid !== false;
  const label = String(data?.label || 'Enter your message here...');
  const rf = useReactFlow();

  return (
    <div className={`
      relative bg-card rounded-xl shadow-node border-2 transition-all duration-200
      ${selected 
        ? 'border-primary shadow-lg scale-105' 
        : 'border-border hover:border-primary/50 hover:shadow-md'
      }
      ${!isValid ? 'border-destructive/50' : ''}
    `}>
      {/* Node Header */}
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-t-xl flex items-center gap-2">
        <Send className="w-4 h-4" />
        <span className="font-medium text-sm">Send Message</span>
        <button
          className="ml-auto rounded-md hover:bg-primary/80 p-1"
          onClick={(e) => {
            e.stopPropagation();
            rf.deleteElements({ nodes: [{ id }] });
          }}
          aria-label="Delete node"
          title="Delete node"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Node Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded-lg flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground break-words leading-relaxed">
              {label}
            </p>
          </div>
        </div>
      </div>

      {/* Validation indicator */}
      {!isValid && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-destructive rounded-full border-2 border-card" />
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-flow-handle border-2 border-card shadow-sm hover:bg-flow-handle-active transition-colors"
        style={{
          background: 'hsl(var(--flow-handle))',
        }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-flow-handle border-2 border-card shadow-sm hover:bg-flow-handle-active transition-colors"
        style={{
          background: 'hsl(var(--flow-handle))',
        }}
      />
    </div>
  );
});