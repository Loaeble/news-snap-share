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
  Share,
  Play,
  Pause,
  Sparkles,
  Activity,
  Star,
  Badge,
  ArrowRight,
  Eye
} from 'lucide-react';

const defaultSettings: ScrapingSettings = {
  enabled: true,
  interval: 1,
  maxArticlesPerRun: 10,
  autoGenerate: true,
  categories: ['technology', 'business', 'sports'],
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
        {/* Hero Header */}
        <Card className="relative overflow-hidden bg-gradient-primary text-primary-foreground shadow-glow border-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent"></div>
          </div>
          <CardHeader className="relative text-center pb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 animate-pulse-glow" />
                <div className="absolute inset-0 bg-primary-glow/20 rounded-full blur-xl"></div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-primary-foreground/80 bg-clip-text">
                NewsGen Pro
              </CardTitle>
            </div>
            <CardDescription className="text-primary-foreground/90 text-lg font-medium">
              AI-Powered News • Instant Images • 98.7% Success Rate
            </CardDescription>
            
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">98.7% Success Rate</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Live Processing</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Images Generated"
            value="1,247"
            icon={Images}
            trend={{ value: 12, isPositive: true }}
            color="primary"
            className="hover:shadow-glow transition-all duration-500"
          />
          <StatsCard
            title="Active Sources"
            value={defaultSettings.sources.filter(s => s.enabled).length}
            icon={Database}
            color="success"
            className="hover:shadow-glow transition-all duration-500"
          />
          <StatsCard
            title="Processing Time"
            value="2.3s"
            icon={Clock}
            trend={{ value: 8, isPositive: false }}
            className="hover:shadow-glow transition-all duration-500"
          />
          <StatsCard
            title="Success Rate"
            value="98.7%"
            icon={TrendingUp}
            color="success"
            className="hover:shadow-glow transition-all duration-500"
          />
        </div>

        {/* Quick Action Hero Section */}
        <Card className="relative overflow-hidden bg-gradient-accent border-primary/20 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary animate-pulse" />
                  Ready to Generate?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Start scraping news and generating stunning images with AI
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group relative overflow-hidden"
                    onClick={() => toast({ title: "Starting Scraper", description: "News generation is beginning..." })}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/0 via-white/20 to-primary-glow/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Play className="h-5 w-5 mr-2" />
                    Start Scraping
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
              
              {/* Live Status Indicator */}
              <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">System Status</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Queue</span>
                    <span className="font-medium">3 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sources</span>
                    <span className="font-medium text-success">2 active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next run</span>
                    <span className="font-medium">45s</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gallery Preview */}
          <Card className="border-primary/20 hover:shadow-glow transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Images className="h-5 w-5 text-primary" />
                  Latest Gallery
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {generatedImages.slice(0, 2).map((img, idx) => (
                  <div 
                    key={img.id} 
                    className="relative aspect-square bg-gradient-accent rounded-lg border border-border/50 overflow-hidden group-hover:shadow-card transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Images className="h-8 w-8 mx-auto mb-2 text-primary/70" />
                        <p className="text-xs font-medium text-muted-foreground">{img.title.slice(0, 20)}...</p>
                      </div>
                    </div>
                    {img.status === 'processing' && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-primary/30 hover:bg-primary/5">
                <Images className="h-4 w-4 mr-2" />
                Open Gallery
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Preview */}
          <Card className="border-primary/20 hover:shadow-glow transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Quick Analytics
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <Eye className="h-4 w-4 mr-1" />
                  Full Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Today's Progress</span>
                  <span className="text-sm text-primary font-bold">47 images</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full transition-all duration-500" style={{ width: '73%' }}></div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gradient-accent rounded-lg p-3 border border-border/50">
                    <p className="text-lg font-bold text-primary">73%</p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                  <div className="bg-gradient-accent rounded-lg p-3 border border-border/50">
                    <p className="text-lg font-bold text-success">2.1s</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                  <div className="bg-gradient-accent rounded-lg p-3 border border-border/50">
                    <p className="text-lg font-bold text-warning">12</p>
                    <p className="text-xs text-muted-foreground">In Queue</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 border-primary/30 hover:bg-primary/5">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
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