import { useState, useEffect } from 'react';
import { ScrapingController } from '@/services/ScrapingController';
import { FilePathManager } from '@/services/FilePathManager';
import { ScrapingControl } from '@/components/mobile/ScrapingControl';
import { PathManager } from '@/components/mobile/PathManager';
import { ScrapingSettings, NewsSource } from '@/types/news';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Newspaper, Image, Settings, Activity } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  
  // Initialize services
  const [pathManager] = useState(() => new FilePathManager());
  const [scrapingController, setScrapingController] = useState<ScrapingController | null>(null);
  
  // Default settings
  const [settings, setSettings] = useState<ScrapingSettings>({
    enabled: true,
    interval: 1, // 1 minute for demo
    sources: [
      {
        id: 'tech-news',
        name: 'Tech News',
        url: 'https://example.com/tech',
        enabled: true,
        category: 'technology'
      },
      {
        id: 'business-news',
        name: 'Business News',
        url: 'https://example.com/business',
        enabled: true,
        category: 'business'
      }
    ] as NewsSource[],
    categories: ['technology', 'business'],
    maxArticlesPerRun: 5,
    autoGenerate: true
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize path manager first
      await pathManager.initialize();
      
      // Initialize scraping controller
      const controller = new ScrapingController(settings);
      setScrapingController(controller);
      
      setIsInitialized(true);
      
      toast({
        title: "NewsGen Ready",
        description: "Mobile news scraping app is initialized and ready to use",
      });
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize the app. Please check your settings.",
        variant: "destructive",
      });
    }
  };

  const handleSettingsClick = () => {
    // TODO: Open settings modal/page
    toast({
      title: "Settings",
      description: "Settings panel coming soon!",
    });
  };

  if (!isInitialized || !scrapingController) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Initializing NewsGen</h2>
          <p className="text-muted-foreground">Setting up your mobile news scraping app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">NewsGen</h1>
              <p className="text-primary-foreground/80 text-sm">AI-Powered Content Creator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="scraping" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Scraping</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{settings.sources.filter(s => s.enabled).length}</div>
                  <p className="text-xs text-muted-foreground">
                    of {settings.sources.length} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scan Interval</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{settings.interval}m</div>
                  <p className="text-xs text-muted-foreground">
                    Auto-scan frequency
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scrapingController.getQueueSize()}</div>
                  <p className="text-xs text-muted-foreground">
                    Articles pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Badge variant={scrapingController.getStatus() === 'running' ? 'default' : 'secondary'}>
                      {scrapingController.getStatus()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    System status
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ScrapingControl 
                controller={scrapingController}
                settings={settings}
                onSettingsClick={handleSettingsClick}
              />
              
              <PathManager pathManager={pathManager} />
            </div>
          </TabsContent>

          <TabsContent value="scraping">
            <ScrapingControl 
              controller={scrapingController}
              settings={settings}
              onSettingsClick={handleSettingsClick}
            />
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Generated Images</CardTitle>
                <CardDescription>View and manage your generated content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Image gallery coming soon!</p>
                  <p className="text-sm">Generated images will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <PathManager pathManager={pathManager} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
