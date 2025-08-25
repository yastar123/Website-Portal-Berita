import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  articleId: string;
  articleTitle: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export const BookmarkButton = ({ 
  articleId, 
  articleTitle, 
  variant = 'ghost', 
  size = 'sm' 
}: BookmarkButtonProps) => {
  const [bookmarkedArticles, setBookmarkedArticles] = useLocalStorage<string[]>('bookmarked_articles', []);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsBookmarked(bookmarkedArticles.includes(articleId));
  }, [bookmarkedArticles, articleId]);

  const toggleBookmark = () => {
    if (isBookmarked) {
      // Remove bookmark
      const newBookmarks = bookmarkedArticles.filter(id => id !== articleId);
      setBookmarkedArticles(newBookmarks);
      toast({
        title: 'Bookmark Dihapus',
        description: 'Artikel dihapus dari daftar bookmark',
      });
    } else {
      // Add bookmark
      const newBookmarks = [...bookmarkedArticles, articleId];
      setBookmarkedArticles(newBookmarks);
      toast({
        title: 'Ditambah ke Bookmark',
        description: 'Artikel disimpan dalam daftar bookmark',
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      className={`transition-colors ${
        isBookmarked 
          ? 'text-primary hover:text-primary/80' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isBookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'}
      </span>
    </Button>
  );
};