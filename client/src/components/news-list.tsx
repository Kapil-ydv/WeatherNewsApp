import { useState } from 'react';
import { NewsResponse } from '@shared/schema';
import { getNewsFilterInfo } from '@/utils/weather-filter';
import { useSettings } from '@/contexts/settings-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NewsListProps {
  news?: NewsResponse;
  isLoading: boolean;
  temperature?: number;
  condition?: string;
  onRefresh: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const NewsList = ({ 
  news, 
  isLoading, 
  temperature, 
  condition, 
  onRefresh, 
  onLoadMore,
  hasMore 
}: NewsListProps) => {
  const { settings } = useSettings();
  const { toast } = useToast();
  const [loadingMore, setLoadingMore] = useState(false);

  const filterInfo = getNewsFilterInfo(temperature, condition);

  const handleArticleClick = (url: string, title: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toast({
      title: "Opening Article",
      description: `Opening: ${title}`,
    });
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await onLoadMore();
    setLoadingMore(false);
  };

  const formatTimeAgo = (publishedAt: string) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1h ago';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1d ago';
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <i className="fas fa-newspaper mr-2 text-primary"></i>
            Latest Headlines
          </h3>
          <Skeleton className="h-8 w-20" />
        </div>
        
        {settings.weatherFiltering && (
          <div className="mb-4 p-3 bg-accent text-accent-foreground rounded-lg border border-border">
            <Skeleton className="h-4 w-64" />
          </div>
        )}

        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="bg-card border border-border rounded-lg p-4 mb-3 shadow-sm">
            <div className="flex space-x-3">
              <Skeleton className="w-20 h-16 rounded-md flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4 mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fas fa-newspaper mr-2 text-primary"></i>
          Latest Headlines
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          data-testid="button-refresh-news"
        >
          <i className="fas fa-refresh mr-1"></i>
          Refresh
        </Button>
      </div>

      {settings.weatherFiltering && filterInfo.isActive && (
        <div className="mb-4 p-3 bg-accent text-accent-foreground rounded-lg border border-border" data-testid="news-filter-info">
          <div className="flex items-center space-x-2">
            <i className="fas fa-filter text-sm"></i>
            <span className="text-sm font-medium">News Filter Active:</span>
            <span className="text-sm" data-testid="text-filter-reason">{filterInfo.reason}</span>
          </div>
        </div>
      )}

      <div data-testid="news-articles-list">
        {news?.articles?.length ? (
          news.articles.map((article, index) => (
            <article 
              key={`${article.id}-${index}`}
              className="news-card bg-card border border-border rounded-lg p-4 mb-3 shadow-sm cursor-pointer"
              onClick={() => handleArticleClick(article.url, article.title)}
              data-testid={`news-article-${index}`}
            >
              <div className="flex space-x-3">
                {article.urlToImage && (
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-20 h-16 rounded-md object-cover flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    data-testid={`img-article-${index}`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm leading-5 mb-1" data-testid={`text-title-${index}`}>
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2" data-testid={`text-description-${index}`}>
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span data-testid={`text-source-${index}`}>{article.source}</span>
                    <span data-testid={`text-time-${index}`}>{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="bg-muted p-6 rounded-lg text-center">
            <i className="fas fa-newspaper text-2xl text-muted-foreground mb-2"></i>
            <p className="text-muted-foreground font-medium">No news articles available</p>
            <p className="text-sm text-muted-foreground">Please try refreshing or check your settings</p>
          </div>
        )}
      </div>

      {hasMore && news?.articles?.length && (
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={handleLoadMore}
          disabled={loadingMore}
          data-testid="button-load-more"
        >
          {loadingMore ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Loading...
            </>
          ) : (
            <>
              <i className="fas fa-chevron-down mr-1"></i>
              Load More Articles
            </>
          )}
        </Button>
      )}
    </div>
  );
};
