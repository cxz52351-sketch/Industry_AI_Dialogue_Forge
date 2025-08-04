import { useState } from "react";
import { Copy, Check, Download, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isError?: boolean;
  onRetry?: () => void;
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

export function ChatMessage({ 
  type, 
  content, 
  timestamp, 
  isError = false, 
  onRetry,
  attachments = []
}: ChatMessageProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const copyToClipboard = async (text: string, blockIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks(prev => new Set(prev).add(blockIndex));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(blockIndex);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderContent = () => {
    if (isError) {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>⚠️ 调用失败</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-2"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              重试
            </Button>
          )}
        </div>
      );
    }

    // Simple markdown-like rendering
    const lines = content.split('\n');
    let codeBlockIndex = 0;

    return lines.map((line, index) => {
      // Code block detection
      if (line.startsWith('```')) {
        const nextEnd = lines.slice(index + 1).findIndex(l => l.startsWith('```'));
        if (nextEnd !== -1) {
          const language = line.slice(3).trim() || 'text';
          const codeContent = lines.slice(index + 1, index + 1 + nextEnd).join('\n');
          const currentBlockIndex = codeBlockIndex++;
          
          return (
            <div key={index} className="my-4">
              <div className="relative">
                <div className="flex items-center justify-between bg-code-background text-gray-300 px-4 py-2 rounded-t-lg text-sm">
                  <span>{language}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                    onClick={() => copyToClipboard(codeContent, currentBlockIndex)}
                  >
                    {copiedBlocks.has(currentBlockIndex) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <pre className="bg-code-background text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                  <code>{codeContent}</code>
                </pre>
              </div>
            </div>
          );
        }
      }

      // Skip lines that are part of code blocks
      if (lines.slice(0, index).some((l, i) => {
        const isCodeStart = l.startsWith('```');
        if (isCodeStart) {
          const nextEnd = lines.slice(i + 1).findIndex(l => l.startsWith('```'));
          return nextEnd !== -1 && index > i && index <= i + nextEnd;
        }
        return false;
      })) {
        return null;
      }

      // Inline code
      if (line.includes('`')) {
        const parts = line.split('`');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 0 ? part : (
                <code key={i} className="bg-muted px-1 py-0.5 rounded text-sm">
                  {part}
                </code>
              )
            )}
          </p>
        );
      }

      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 0 ? part : <strong key={i}>{part}</strong>
            )}
          </p>
        );
      }

      // Regular line
      return line.trim() ? (
        <p key={index} className="mb-2">{line}</p>
      ) : (
        <br key={index} />
      );
    });
  };

  return (
    <div className={cn(
      "flex gap-4 p-4 max-w-none",
      type === "user" ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-4 shadow-sm",
        type === "user" 
          ? "bg-user-message text-user-message-foreground ml-auto" 
          : "bg-ai-message text-foreground"
      )}>
        <div className="prose prose-sm max-w-none">
          {renderContent()}
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-background/50 rounded border">
                <span className="text-sm truncate flex-1">{attachment.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-3 opacity-70">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}