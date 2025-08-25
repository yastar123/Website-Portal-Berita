import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AlertTriangle, X } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const BreakingNewsTicker = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const breakingNews = StorageService.getFeaturedArticles().slice(0, 3);

  useEffect(() => {
    if (breakingNews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [breakingNews.length]);

  if (!isVisible || breakingNews.length === 0) {
    return null;
  }

  const currentNews = breakingNews[currentIndex];

  return (
    <Card className="bg-news-urgent text-news-urgent-foreground border-0 rounded-none shadow-none">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              <Badge className="bg-white text-news-urgent font-bold text-xs">
                BREAKING
              </Badge>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="overflow-hidden">
                <Link 
                  to={`/article/${currentNews.id}`}
                  className="block hover:opacity-80 transition-opacity"
                >
                  <div className="animate-slide-left whitespace-nowrap">
                    <span className="text-sm font-medium">
                      {currentNews.title}
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* News indicators */}
            {breakingNews.length > 1 && (
              <div className="flex space-x-1 flex-shrink-0">
                {breakingNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-news-urgent-foreground hover:bg-white/10 h-6 w-6 p-0 flex-shrink-0 ml-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};