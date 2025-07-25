import { LocalNotifications } from '@capacitor/local-notifications';
import { NewsArticle, ScrapingSettings, NewsSource } from '@/types/news';

export class ScrapingQueue {
  private queue: NewsArticle[] = [];
  private processing: boolean = false;

  enqueue(article: NewsArticle): void {
    this.queue.push(article);
    console.log(`Article queued: ${article.title}`);
  }

  dequeue(): NewsArticle | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }

  isProcessing(): boolean {
    return this.processing;
  }

  setProcessing(status: boolean): void {
    this.processing = status;
  }
}

export class ScrapingController {
  private shouldRun: boolean = false;
  private scrapingQueue: ScrapingQueue = new ScrapingQueue();
  private intervalId: NodeJS.Timeout | null = null;
  private settings: ScrapingSettings;
  private onArticleProcessed?: (article: NewsArticle) => void;
  private onStatusChange?: (status: 'started' | 'stopped' | 'processing' | 'idle') => void;

  constructor(settings: ScrapingSettings) {
    this.settings = settings;
    this.initializeNotifications();
  }

  private async initializeNotifications(): Promise<void> {
    try {
      await LocalNotifications.requestPermissions();
      console.log('Notification permissions granted');
    } catch (error) {
      console.error('Failed to get notification permissions:', error);
    }
  }

  setSettings(settings: ScrapingSettings): void {
    this.settings = settings;
    
    // Restart scraping with new settings if currently running
    if (this.shouldRun) {
      this.stopScraping();
      this.startScraping();
    }
  }

  setArticleProcessedCallback(callback: (article: NewsArticle) => void): void {
    this.onArticleProcessed = callback;
  }

  setStatusChangeCallback(callback: (status: 'started' | 'stopped' | 'processing' | 'idle') => void): void {
    this.onStatusChange = callback;
  }

  async startScraping(): Promise<void> {
    if (this.shouldRun) {
      console.log('Scraping already running');
      return;
    }

    if (!this.settings.enabled) {
      console.log('Scraping is disabled in settings');
      return;
    }

    this.shouldRun = true;
    this.onStatusChange?.('started');

    // Send notification about starting
    await this.sendNotification('NewsGen Started', 'Background news scraping has started');

    // Start the continuous scraping process
    this.intervalId = setInterval(() => {
      this.performScrapingCycle();
    }, this.settings.interval * 60 * 1000); // Convert minutes to milliseconds

    // Perform initial scraping
    await this.performScrapingCycle();

    console.log(`Scraping started with ${this.settings.interval} minute interval`);
  }

  stopScraping(): void {
    if (!this.shouldRun) {
      console.log('Scraping already stopped');
      return;
    }

    this.shouldRun = false;
    this.onStatusChange?.('stopped');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Clear the queue
    this.scrapingQueue.clear();

    console.log('Scraping stopped');
    this.sendNotification('NewsGen Stopped', 'Background news scraping has been stopped');
  }

  private async performScrapingCycle(): Promise<void> {
    if (!this.shouldRun) return;

    this.onStatusChange?.('processing');
    console.log('Starting scraping cycle...');

    try {
      const enabledSources = this.settings.sources.filter(source => source.enabled);
      let articlesScraped = 0;

      for (const source of enabledSources) {
        if (!this.shouldRun || articlesScraped >= this.settings.maxArticlesPerRun) break;

        try {
          const articles = await this.scrapeNewsSource(source);
          
          for (const article of articles) {
            if (articlesScraped >= this.settings.maxArticlesPerRun) break;
            
            this.scrapingQueue.enqueue(article);
            articlesScraped++;
          }
        } catch (error) {
          console.error(`Failed to scrape ${source.name}:`, error);
        }
      }

      // Process queued articles
      await this.processQueue();

      if (articlesScraped > 0) {
        await this.sendNotification(
          'New Articles Found',
          `Found ${articlesScraped} new articles from ${enabledSources.length} sources`
        );
      }

      console.log(`Scraping cycle completed. Processed ${articlesScraped} articles`);
    } catch (error) {
      console.error('Error during scraping cycle:', error);
    } finally {
      this.onStatusChange?.('idle');
    }
  }

  private async scrapeNewsSource(source: NewsSource): Promise<NewsArticle[]> {
    // Mock implementation - replace with actual RSS/API scraping
    console.log(`Scraping ${source.name}...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock articles
    const mockArticles: NewsArticle[] = [
      {
        id: `${source.id}-${Date.now()}-1`,
        title: `Breaking: ${source.name} News Update`,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        url: `${source.url}/article-${Date.now()}`,
        source: source.name,
        publishedAt: new Date(),
        category: source.category,
        status: 'pending'
      }
    ];

    return mockArticles;
  }

  private async processQueue(): Promise<void> {
    this.scrapingQueue.setProcessing(true);

    while (this.scrapingQueue.size() > 0 && this.shouldRun) {
      const article = this.scrapingQueue.dequeue();
      if (!article) break;

      try {
        // Update article status
        article.status = 'processing';
        
        // Process the article (image generation would happen here)
        await this.processArticle(article);
        
        article.status = 'completed';
        this.onArticleProcessed?.(article);
        
        console.log(`Processed article: ${article.title}`);
      } catch (error) {
        console.error(`Failed to process article ${article.title}:`, error);
        article.status = 'failed';
        this.onArticleProcessed?.(article);
      }

      // Small delay between processing articles
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.scrapingQueue.setProcessing(false);
  }

  private async processArticle(article: NewsArticle): Promise<void> {
    // Mock image generation process
    console.log(`Generating image for: ${article.title}`);
    
    // Simulate image generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // If auto-generate is enabled, generate image here
    if (this.settings.autoGenerate) {
      // TODO: Integrate with image generation service
      console.log(`Auto-generated image for: ${article.title}`);
    }
  }

  private async sendNotification(title: string, body: string): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title,
            body,
            schedule: { at: new Date(Date.now() + 1000) }, // 1 second delay
            sound: 'default',
            attachments: [],
            actionTypeId: 'newsgen',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Getters for status monitoring
  getStatus(): 'running' | 'stopped' | 'processing' {
    if (!this.shouldRun) return 'stopped';
    if (this.scrapingQueue.isProcessing()) return 'processing';
    return 'running';
  }

  getQueueSize(): number {
    return this.scrapingQueue.size();
  }

  getSettings(): ScrapingSettings {
    return { ...this.settings };
  }
}