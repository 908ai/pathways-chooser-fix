import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Code, Sparkles } from 'lucide-react';
import AICodeEditor from './AICodeEditor';

interface CodePreviewModalProps {
  triggerText?: string;
  projectId?: string;
  initialCode?: string;
  onCodeSaved?: (code: string) => void;
  children?: React.ReactNode;
}

const CodePreviewModal: React.FC<CodePreviewModalProps> = ({
  triggerText = "Open AI Editor",
  projectId,
  initialCode,
  onCodeSaved,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCodeSaved = (code: string) => {
    if (onCodeSaved) {
      onCodeSaved(code);
    }
    // Optionally close modal after save
    // setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <Code className="h-4 w-4" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Code Editor
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 mt-4">
          <AICodeEditor
            projectId={projectId}
            initialCode={initialCode}
            onCodeSaved={handleCodeSaved}
            className="h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodePreviewModal;