import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Code, 
  Eye, 
  Save, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  MessageSquare,
  Loader2
} from 'lucide-react';

interface AICodeEditorProps {
  projectId?: string;
  initialCode?: string;
  onCodeSaved?: (code: string) => void;
  className?: string;
}

interface EditorMessage {
  type: 'code_change' | 'save_request' | 'editor_ready' | 'preview_update';
  data?: any;
  code?: string;
  timestamp?: number;
}

const AICodeEditor: React.FC<AICodeEditorProps> = ({
  projectId,
  initialCode = '',
  onCodeSaved,
  className = ''
}) => {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get the current Lovable project URL for iframe embedding
  const getLovableEditorUrl = () => {
    const currentUrl = window.location.origin;
    const projectPath = window.location.pathname.split('/')[1] || '';
    
    // Construct the Lovable editor URL - this would be the actual Lovable editor
    // For now, we'll use a mock editor URL that simulates the Lovable interface
    return `${currentUrl}/editor?embedded=true&project=${projectId || 'current'}`;
  };

  // Handle messages from the iframe editor
  useEffect(() => {
    const handleMessage = (event: MessageEvent<EditorMessage>) => {
      // Security check - only accept messages from trusted origins
      const trustedOrigins = [window.location.origin, 'https://lovable.dev'];
      if (!trustedOrigins.includes(event.origin)) {
        return;
      }

      const { type, data, code } = event.data;

      switch (type) {
        case 'editor_ready':
          console.log('AI Code Editor: Editor iframe is ready');
          setEditorReady(true);
          setIsLoading(false);
          
          // Send initial code to the editor
          if (currentCode && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage({
              type: 'load_code',
              code: currentCode,
              timestamp: Date.now()
            }, '*');
          }
          break;

        case 'code_change':
          console.log('AI Code Editor: Code changed in iframe');
          if (code) {
            setCurrentCode(code);
          }
          break;

        case 'save_request':
          console.log('AI Code Editor: Save request from iframe');
          handleSaveCode(code || currentCode);
          break;

        case 'preview_update':
          console.log('AI Code Editor: Preview updated');
          if (isPreviewMode) {
            // Handle preview updates
            toast({
              title: "Preview Updated",
              description: "The code preview has been refreshed.",
            });
          }
          break;

        default:
          console.log('AI Code Editor: Unknown message type:', type);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [currentCode, isPreviewMode]);

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log('AI Code Editor: Iframe loaded');
    setIsLoading(false);
    
    // Send initialization message to iframe
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({
          type: 'init_editor',
          mode: isPreviewMode ? 'preview' : 'edit',
          code: currentCode,
          timestamp: Date.now()
        }, '*');
      }
    }, 1000);
  };

  // Save code changes
  const handleSaveCode = async (code: string) => {
    try {
      setCurrentCode(code);
      setLastSaved(new Date());
      
      if (onCodeSaved) {
        onCodeSaved(code);
      }

      // Send confirmation back to iframe
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({
          type: 'save_confirmation',
          success: true,
          timestamp: Date.now()
        }, '*');
      }

      toast({
        title: "Code Saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving code:', error);
      
      // Send error back to iframe
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({
          type: 'save_confirmation',
          success: false,
          error: error instanceof Error ? error.message : 'Save failed',
          timestamp: Date.now()
        }, '*');
      }

      toast({
        title: "Save Failed",
        description: "There was an error saving your code changes.",
        variant: "destructive"
      });
    }
  };

  // Toggle between preview and edit modes
  const toggleMode = () => {
    const newMode = !isPreviewMode;
    setIsPreviewMode(newMode);

    // Notify iframe of mode change
    if (iframeRef.current && editorReady) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'mode_change',
        mode: newMode ? 'preview' : 'edit',
        timestamp: Date.now()
      }, '*');
    }

    toast({
      title: `Switched to ${newMode ? 'Preview' : 'Edit'} Mode`,
      description: `You are now in ${newMode ? 'preview' : 'edit'} mode.`,
    });
  };

  // Refresh the editor
  const refreshEditor = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
      setEditorReady(false);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <CardTitle className="text-lg">AI Code Editor</CardTitle>
            <Badge variant={isPreviewMode ? "secondary" : "default"}>
              {isPreviewMode ? 'Preview' : 'Edit'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMode}
              disabled={!editorReady}
            >
              {isPreviewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSaveCode(currentCode)}
              disabled={!editorReady}
            >
              <Save className="h-4 w-4" />
              Save
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={refreshEditor}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading AI Editor...</span>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={getLovableEditorUrl()}
            className={`w-full border-0 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[600px]'}`}
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title="AI Code Editor"
          />
        </div>
      </CardContent>

      {!editorReady && !isLoading && (
        <CardContent className="pt-4">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <p>Establishing connection with AI editor...</p>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshEditor}
              className="mt-2"
            >
              Retry Connection
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AICodeEditor;