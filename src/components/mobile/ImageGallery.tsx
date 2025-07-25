import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share, Download, Eye, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GeneratedImage {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  status: 'completed' | 'processing' | 'failed';
  source: string;
}

interface ImageGalleryProps {
  images: GeneratedImage[];
  onShare: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onView: (image: GeneratedImage) => void;
}

export const ImageGallery = ({ images, onShare, onDownload, onView }: ImageGalleryProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredImages = images.filter(image => 
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Generated Images</CardTitle>
            <CardDescription>
              {filteredImages.length} images in your gallery
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredImages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No images found</p>
            <p className="text-sm">Start scraping to generate your first images</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 gap-4' 
            : 'space-y-3'
          }>
            {filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className={`group animate-fade-in hover:scale-105 transition-all duration-300 ${
                  viewMode === 'grid' ? 'aspect-square' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {viewMode === 'grid' ? (
                  <Card className="h-full overflow-hidden hover:shadow-card transition-all duration-300">
                    <div className="relative h-2/3 bg-gradient-subtle">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Badge 
                        className={`absolute top-2 right-2 ${getStatusColor(image.status)}`}
                        variant="secondary"
                      >
                        {image.status}
                      </Badge>
                    </div>
                    <CardContent className="p-3 h-1/3">
                      <h4 className="font-medium text-sm line-clamp-2 mb-2">{image.title}</h4>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => onView(image)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onShare(image)}>
                          <Share className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onDownload(image)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="hover:shadow-card transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-subtle rounded-lg flex items-center justify-center flex-shrink-0">
                          <Eye className="h-6 w-6 text-muted-foreground" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-1">{image.title}</h4>
                          <p className="text-sm text-muted-foreground">{image.source}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(image.status)} variant="secondary">
                              {image.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {image.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => onView(image)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onShare(image)}>
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onDownload(image)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};