import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ScrapingController } from '@/services/ScrapingController';
import { ScrapingSettings } from '@/types/news';
import { Play, Pause, Clock, Database, Settings } from 'lucide-react';

interface ScrapingControlProps {
  controller: ScrapingController;
  settings: ScrapingSettings;
  onSettingsClick: () => void;
}

export const ScrapingControl = ({ controller, settings, onSettingsClick }: ScrapingControlProps) => {
  const [status, setStatus] = useState<'running' | 'stopped' | 'processing'>('stopped');
  const [queueSize, setQueueSize] = useState(0);
  const [lastProcessed, setLastProcessed] = useState<string>('Never');
  const { toast } = useToast();

  useEffect(() => {
    // Set up status monitoring
    const statusCallback = (newStatus: 'started' | 'stopped' | 'processing' | 'idle') => {
      switch (newStatus) {
        case 'started':
          setStatus('running');
          break;
        case 'stopped':
          setStatus('stopped');
          break;
        case 'processing':
          setStatus('processing');
          break;
        case 'idle':
          setStatus('running');
          break;
      }
    };

    controller.setStatusChangeCallback(statusCallback);

    // Set up article processed callback
    const articleCallback = () => {
      setLastProcessed(new Date().toLocaleTimeString());
      setQueueSize(controller.getQueueSize());
    };

    controller.setArticleProcessedCallback(articleCallback);

    // Update queue size periodically
    const interval = setInterval(() => {
      setQueueSize(controller.getQueueSize());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [controller]);

  const handleStart = async () => {
    try {
      await controller.startScraping();
      toast({
        title: "Scraping Started",
        description: `News scraping active with ${settings.interval} minute intervals`,
      });
    } catch (error) {
      toast({
        title: "Failed to Start",
        description: "Could not start news scraping",
        variant: "destructive",
      });
    }
  };

  const handleStop = () => {
    controller.stopScraping();
    toast({
      title: "Scraping Stopped",
      description: "News scraping has been disabled",
    });
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-success';
      case 'processing': return 'bg-warning';
      case 'stopped': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running': return 'Active';
      case 'processing': return 'Processing';
      case 'stopped': return 'Stopped';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="transition-smooth hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">News Scraping</CardTitle>
            <CardDescription>
              Continuous background news collection
            </CardDescription>
          </div>
          <Badge variant="secondary" className={`${getStatusColor()} text-white`}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{settings.interval}m</div>
            <div className="text-xs text-muted-foreground">Interval</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <Database className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{queueSize}</div>
            <div className="text-xs text-muted-foreground">In Queue</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <Settings className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{settings.sources.filter(s => s.enabled).length}</div>
            <div className="text-xs text-muted-foreground">Sources</div>
          </div>
        </div>

        {/* Progress Bar for Processing */}
        {status === 'processing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing articles...</span>
              <span>{queueSize} remaining</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}

        {/* Last Processed Info */}
        <div className="text-sm text-muted-foreground">
          Last processed: {lastProcessed}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          {status === 'stopped' ? (
            <Button 
              onClick={handleStart} 
              variant="default" 
              className="flex-1"
              disabled={!settings.enabled}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Scraping
            </Button>
          ) : (
            <Button 
              onClick={handleStop} 
              variant="destructive" 
              className="flex-1"
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop Scraping
            </Button>
          )}
          
          <Button 
            onClick={onSettingsClick} 
            variant="outline" 
            size="icon"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {!settings.enabled && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="text-sm text-warning-foreground">
              Scraping is disabled in settings. Enable it to start collecting news.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};