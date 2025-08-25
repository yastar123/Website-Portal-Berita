import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { Link } from 'react-router-dom';

interface TagsCloudProps {
  maxTags?: number;
  variant?: 'default' | 'compact';
}

export const TagsCloud = ({ maxTags = 15, variant = 'default' }: TagsCloudProps) => {
  const [tags, setTags] = useState<{ name: string; count: number; size: number }[]>([]);

  useEffect(() => {
    const articles = StorageService.getArticles();
    const tagCounts: { [key: string]: number } = {};

    // Count tag frequencies
    articles.forEach(article => {
      article.tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase().trim();
        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
      });
    });

    // Convert to array and sort by frequency
    const sortedTags = Object.entries(tagCounts)
      .map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count,
        size: Math.min(Math.max(count / Math.max(...Object.values(tagCounts)) * 3 + 1, 1), 4)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxTags);

    setTags(sortedTags);
  }, [maxTags]);

  const getSizeClass = (size: number) => {
    if (size >= 3.5) return 'text-lg font-bold';
    if (size >= 2.5) return 'text-base font-semibold';
    if (size >= 1.5) return 'text-sm font-medium';
    return 'text-xs font-normal';
  };

  const getColorVariant = (index: number) => {
    const variants = ['default', 'secondary', 'outline'];
    return variants[index % variants.length] as 'default' | 'secondary' | 'outline';
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Tags Populer</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 8).map((tag, index) => (
            <Badge
              key={tag.name}
              variant={getColorVariant(index)}
              className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-primary" />
          <span>Tags Populer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada tags tersedia</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map((tag, index) => (
              <Link
                key={tag.name}
                to={`/search?tag=${encodeURIComponent(tag.name.toLowerCase())}`}
                className="transition-transform hover:scale-105"
              >
                <Badge
                  variant={getColorVariant(index)}
                  className={`cursor-pointer transition-all hover:shadow-sm ${getSizeClass(tag.size)}`}
                  style={{ 
                    opacity: 0.6 + (tag.size / 4) * 0.4,
                  }}
                >
                  {tag.name}
                  {tag.count > 1 && (
                    <span className="ml-1 text-xs opacity-70">
                      ({tag.count})
                    </span>
                  )}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};