import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrapingControl } from '@/components/mobile/ScrapingControl';
import { PathManager } from '@/components/mobile/PathManager';
import { ImageGallery } from '@/components/mobile/ImageGallery';
import { NewsPreview } from '@/components/mobile/NewsPreview';
import { StatsCard } from '@/components/mobile/StatsCard';
import { ScrapingController } from '@/services/ScrapingController';
import { FilePathManager } from '@/services/FilePathManager';
import { ScrapingSettings, NewsArticle } from '@/types/news';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Zap, 
  Images, 
  Newspaper, 
  BarChart3,
  Clock,
  Database,
  TrendingUp,
  Share
} from 'lucide-react';

const defaultSettings: ScrapingSettings = {
  enabled: true,
  interval: 1,
  maxArticlesPerRun: 10,
  autoGenerate: true,
  sources: [
    { id: '1', name: 'Tech News', url: 'https://example.com/tech', category: 'technology', enabled: true },
    { id: '2', name: 'Business Today', url: 'https://example.com/business', category: 'business', enabled: true },
    { id: '3', name: 'World News', url: 'https://example.com/world', category: 'business', enabled: false },
  ]
};

export default function Index() {
  const [controller] = useState(() => new ScrapingController(defaultSettings));
  const [pathManager] = useState(() => new FilePathManager());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [generatedImages, setGeneratedImages] = useState([
    {
      id: '1',
      title: 'Breaking: AI Revolution in Tech Industry',
      url: '/images/sample1.jpg',
      createdAt: new Date(),
      status: 'completed' as const,
      source: 'Tech News'
    },
    {
      id: '2', 
      title: 'Market Analysis: Stock Trends This Week',
      url: '/images/sample2.jpg',
      createdAt: new Date(),
      status: 'processing' as const,
      source: 'Business Today'
    }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    // Set up article processed callback
    controller.setArticleProcessedCallback((article: NewsArticle) => {
      setArticles(prev => {
        const index = prev.findIndex(a => a.id === article.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = article;
          return updated;
        }
        return [...prev, article];
      });
    });

    // Initialize path manager
    pathManager.initialize();
  }, [controller, pathManager]);

  const handleShare = (item: any) => {
    toast({
      title: "Shared Successfully",
      description: "Content has been shared to your social media",
    });
  };

  const handleDownload = (image: any) => {
    toast({
      title: "Download Started",
      description: "Image is being saved to your device",
    });
  };

  const handleView = (item: any) => {
    toast({
      title: "Opening Preview",
      description: "Loading full content view",
    });
  };

  const handleGenerateImage = (article: NewsArticle) => {
    toast({
      title: "Generating Image",
      description: "AI is creating a visual representation of the article",
    });
  };

  const handleViewFull = (article: NewsArticle) => {
    window.open(article.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-4 space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 animate-float" />
              NewsGen Pro
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              AI-Powered News Image Generation Platform
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Images Generated"
            value="1,247"
            icon={Images}
            trend={{ value: 12, isPositive: true }}
            color="primary"
          />
          <StatsCard
            title="Active Sources"
            value={defaultSettings.sources.filter(s => s.enabled).length}
            icon={Database}
            color="success"
          />
          <StatsCard
            title="Processing Time"
            value="2.3s"
            icon={Clock}
            trend={{ value: 8, isPositive: false }}
          />
          <StatsCard
            title="Success Rate"
            value="98.7%"
            icon={TrendingUp}
            color="success"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="control" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Control
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-4">
            <ScrapingControl
              controller={controller}
              settings={defaultSettings}
              onSettingsClick={() => setIsSettingsOpen(true)}
            />
            <PathManager pathManager={pathManager} />
          </TabsContent>

          <TabsContent value="news">
            <NewsPreview
              articles={articles}
              onGenerateImage={handleGenerateImage}
              onShare={handleShare}
              onViewFull={handleViewFull}
            />
          </TabsContent>

          <TabsContent value="gallery">
            <ImageGallery
              images={generatedImages}
              onShare={handleShare}
              onDownload={handleDownload}
              onView={handleView}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Track your news generation performance and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Generation Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Today</span>
                        <span className="font-medium">47 images</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">This week</span>
                        <span className="font-medium">312 images</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">This month</span>
                        <span className="font-medium">1,247 images</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Popular Categories</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Technology</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Business</span>
                        <span className="font-medium">32%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">World News</span>
                        <span className="font-medium">23%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Advanced settings will be available in the next update" })}
              >
                <Settings className="h-4 w-4 mr-2" />
                News Sources
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Template customization will be available soon" })}
              >
                <Images className="h-4 w-4 mr-2" />
                Image Templates
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Feature Coming Soon", description: "Sharing options will be expanded soon" })}
              >
                <Share className="h-4 w-4 mr-2" />
                Sharing Options
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}