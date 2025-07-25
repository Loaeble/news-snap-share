import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Newspaper, Image as ImageIcon, Share, ExternalLink, Clock, Eye } from 'lucide-react';
import { NewsArticle } from '@/types/news';

interface NewsPreviewProps {
  articles: NewsArticle[];
  onGenerateImage: (article: NewsArticle) => void;
  onShare: (article: NewsArticle) => void;
  onViewFull: (article: NewsArticle) => void;
}

export const NewsPreview = ({ articles, onGenerateImage, onShare, onViewFull }: NewsPreviewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...new Set(articles.map(article => article.category))];
  
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <ImageIcon className="h-4 w-4 text-success" />;
      case 'processing': return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'failed': return <ImageIcon className="h-4 w-4 text-destructive" />;
      default: return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Latest News</CardTitle>
            <CardDescription>
              {filteredArticles.length} articles ready for processing
            </CardDescription>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No articles found</p>
            <p className="text-sm">Start scraping to see the latest news</p>
          </div>
        ) : (
          filteredArticles.map((article, index) => (
            <Card 
              key={article.id} 
              className="animate-fade-in hover:shadow-card transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2 text-sm leading-snug">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {article.source}
                        </Badge>
                        <Badge className={getStatusColor(article.status)} variant="secondary">
                          {getStatusIcon(article.status)}
                          <span className="ml-1 text-xs">{article.status}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onViewFull(article)}
                      className="flex-shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.content}
                  </p>
                  
                  {/* Processing Progress */}
                  {article.status === 'processing' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Generating image...</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-1" />
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => onGenerateImage(article)}
                      disabled={article.status === 'processing'}
                      className="flex-1"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {article.status === 'completed' ? 'Regenerate' : 'Generate'}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onShare(article)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewFull(article)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.publishedAt.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};