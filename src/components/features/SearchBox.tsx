import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StorageService } from '@/lib/storage';
import { Article } from '@/types';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SearchBoxProps {
  className?: string;
}

export const SearchBox = ({ className }: SearchBoxProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Article[]>([]);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('search_history', []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = StorageService.getCategories();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const articles = StorageService.getArticles();
      const filtered = articles.filter(article => {
        const matchesQuery = 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        
        return matchesQuery && matchesCategory;
      });
      
      setResults(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(query.length === 0 && searchHistory.length > 0);
    }
  }, [query, selectedCategory, searchHistory]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      
      // Here you would typically navigate to search results page
      console.log('Searching for:', searchQuery);
      setIsOpen(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Cari berita, topik, atau penulis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setSelectedCategory(selectedCategory === 'all' ? categories[0]?.name || 'all' : 'all')}
          >
            <Filter className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {isOpen && (
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory('all')}
          >
            Semua
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-strong max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {query.length >= 2 ? (
              <div>
                {results.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                      Hasil Pencarian ({results.length})
                    </div>
                    {results.map((article) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        onClick={() => {
                          handleSearch(query);
                          setIsOpen(false);
                        }}
                        className="flex items-start space-x-3 px-3 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
                      >
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{article.category}</Badge>
                            <span className="text-xs text-muted-foreground">{article.author}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Tidak ada hasil untuk "{query}"</p>
                  </div>
                )}
              </div>
            ) : (
              searchHistory.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b flex items-center justify-between">
                    <span>Pencarian Terakhir</span>
                    <Button variant="ghost" size="sm" onClick={clearHistory} className="h-6 text-xs">
                      Hapus
                    </Button>
                  </div>
                  {searchHistory.map((historyItem, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(historyItem);
                        handleSearch(historyItem);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 hover:bg-muted transition-colors w-full text-left border-b last:border-b-0"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{historyItem}</span>
                    </button>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};