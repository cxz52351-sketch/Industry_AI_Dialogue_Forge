import { useState, useRef, useCallback } from "react";
import { Send, Mic, MicOff, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "请输入内容..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [charCount, setCharCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const MAX_CHARS = 5000;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'xlsx', 'xls', 'pptx', 'ppt'];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!message.trim() && files.length === 0) || disabled) return;
    
    onSendMessage(message.trim(), files);
    setMessage("");
    setFiles([]);
    setCharCount(0);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "文件过大",
        description: `文件 "${file.name}" 超过 50MB 限制`,
        variant: "destructive",
      });
      return false;
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      toast({
        title: "文件格式不支持",
        description: `不支持 .${extension} 格式文件`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    Array.from(selectedFiles).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
        setFiles(prev => [...prev, audioFile]);
        setMessage("语音输入的内容会在这里显示...");
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "开始录音",
        description: "正在录制语音消息...",
      });
    } catch (error) {
      toast({
        title: "录音失败",
        description: "无法访问麦克风，请检查权限设置",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "录音完成",
        description: "语音消息已准备发送",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t border-border bg-background p-4">
      {/* File Upload Area */}
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 mb-4 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          files.length > 0 ? "bg-secondary/30" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {files.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">已选择文件:</p>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-background p-2 rounded border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-2"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm">
            拖拽文件到此处或点击上传按钮选择文件
          </p>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-32 resize-none pr-16"
            style={{ height: 'auto' }}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {charCount}/{MAX_CHARS}
          </div>
        </div>

        <div className="flex gap-1">
          {/* File Upload Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="h-11 w-11 p-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Voice Recording Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className={cn(
              "h-11 w-11 p-0",
              isRecording && "bg-destructive text-destructive-foreground"
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && files.length === 0)}
            className="h-11 w-11 p-0 bg-primary hover:bg-primary-light"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
}