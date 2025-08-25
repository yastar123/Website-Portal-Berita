import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export const ArticleCard = ({ article, variant = 'default' }: ArticleCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true
  });

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 h-full">
        <div className="relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          {article.featured && (
            <Badge className="absolute top-4 left-4 bg-news-breaking text-news-breaking-foreground">
              Featured
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Badge variant="secondary" className="mb-2">
              {article.category}
            </Badge>
            <Link to={`/article/${article.id}`} className="group">
              <h2 className="text-xl font-bold leading-tight group-hover:text-primary-foreground transition-colors">
                {article.title}
              </h2>
            </Link>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
        <div className="flex">
          <div className="w-24 h-20 flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <CardContent className="flex-1 p-4">
            <Badge variant="outline" className="text-xs mb-2">
              {article.category}
            </Badge>
            <Link to={`/article/${article.id}`} className="group">
              <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
            </Link>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timeAgo}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 h-full">
      <div className="relative">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <Badge className="absolute top-3 left-3" variant="secondary">
          {article.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <Link to={`/article/${article.id}`} className="group">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};