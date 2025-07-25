import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FilePathManager } from '@/services/FilePathManager';
import { StorageSettings } from '@/types/news';
import { Folder, CheckCircle, XCircle, HardDrive, RefreshCw } from 'lucide-react';

interface PathManagerProps {
  pathManager: FilePathManager;
}

export const PathManager = ({ pathManager }: PathManagerProps) => {
  const [storageSettings, setStorageSettings] = useState<StorageSettings>({
    path: '',
    isValid: false,
    availableSpace: 0,
    totalSpace: 0
  });
  const [customPath, setCustomPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeStorage();
  }, []);

  const initializeStorage = async () => {
    setIsLoading(true);
    try {
      const settings = await pathManager.initialize();
      setStorageSettings(settings);
      setCustomPath(settings.path);
      
      if (!settings.isValid) {
        toast({
          title: "Storage Path Issue",
          description: "Default storage path is not accessible. Please set a custom path.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      toast({
        title: "Initialization Failed",
        description: "Could not initialize storage system",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetCustomPath = async () => {
    if (!customPath.trim()) {
      toast({
        title: "Invalid Path",
        description: "Please enter a valid storage path",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const settings = await pathManager.setCustomPath(customPath.trim());
      setStorageSettings(settings);
      
      if (settings.isValid) {
        toast({
          title: "Path Updated",
          description: "Storage path has been successfully updated",
        });
      } else {
        toast({
          title: "Path Invalid",
          description: "The specified path is not writable or accessible",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to set custom path:', error);
      toast({
        title: "Failed to Set Path",
        description: "Could not access the specified directory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usedSpacePercentage = storageSettings.totalSpace > 0 
    ? ((storageSettings.totalSpace - storageSettings.availableSpace) / storageSettings.totalSpace) * 100 
    : 0;

  return (
    <Card className="transition-smooth hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Storage Settings</CardTitle>
            <CardDescription>
              Manage where generated images are saved
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Path Status */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            {storageSettings.isValid ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium">
              {storageSettings.isValid ? 'Path Valid' : 'Path Not Defined'}
            </span>
          </div>
          
          {storageSettings.path ? (
            <div className="text-sm text-muted-foreground font-mono bg-background p-2 rounded border">
              {storageSettings.path}
            </div>
          ) : (
            <div className="text-sm text-destructive">
              No valid storage path configured
            </div>
          )}
        </div>

        {/* Storage Usage */}
        {storageSettings.isValid && storageSettings.totalSpace > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Storage Usage</span>
            </div>
            
            <Progress value={usedSpacePercentage} className="h-2" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatBytes(storageSettings.totalSpace - storageSettings.availableSpace)} used</span>
              <span>{formatBytes(storageSettings.availableSpace)} available</span>
            </div>
          </div>
        )}

        {/* Custom Path Input */}
        <div className="space-y-2">
          <Label htmlFor="custom-path">Custom Storage Path</Label>
          <div className="flex gap-2">
            <Input
              id="custom-path"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="Enter custom storage path..."
              className="flex-1"
            />
            <Button 
              onClick={handleSetCustomPath}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Set'
              )}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {!storageSettings.isValid && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="text-sm text-destructive-foreground">
              <strong>Storage Issue:</strong> Images cannot be saved until a valid storage path is configured.
              Please set a custom path or check your device permissions.
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground">
          Images will be saved to the configured directory. Make sure the app has proper write permissions.
        </div>
      </CardContent>
    </Card>
  );
};