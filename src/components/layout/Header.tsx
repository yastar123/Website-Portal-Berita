import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Newspaper, Menu, X } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { SearchBox } from '@/components/features/SearchBox';
import { ThemeToggle } from '@/components/features/ThemeToggle';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const categories = StorageService.getCategories();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background shadow-soft border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Breaking News</span>
              <span className="hidden md:block">Stay updated with the latest news</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:block">Admin Portal:</span>
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-hover">
                  Login
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Newspaper className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">NewsForge</h1>
              <p className="text-xs text-muted-foreground">Portal Berita Terpercaya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground'}`}>
              Beranda
            </Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(`/category/${category.slug}`) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <SearchBox className="hidden md:block w-80" />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link
                to="/"
                className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className={`text-sm font-medium ${
                    isActive(`/category/${category.slug}`) ? 'text-primary' : 'text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search */}
            <SearchBox className="mt-4" />
          </div>
        )}
      </div>
    </header>
  );
};