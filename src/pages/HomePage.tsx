import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '@/components/news/ArticleCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BreakingNewsTicker } from '@/components/features/BreakingNewsTicker';
import { WeatherWidget } from '@/components/features/WeatherWidget';
import { NewsletterSignup } from '@/components/features/NewsletterSignup';
import { TagsCloud } from '@/components/features/TagsCloud';
import { BackToTop } from '@/components/features/BackToTop';
import { ArticleCardSkeleton } from '@/components/features/ArticleSkeletons';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize dummy data on first visit
    StorageService.initializeDummyData();
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const articles = StorageService.getArticles();
  const featuredArticles = StorageService.getFeaturedArticles();
  const categories = StorageService.getCategories();
  const latestArticles = articles.slice(0, 6);
  const trendingArticles = articles.slice(2, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BreakingNewsTicker />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Berita Terkini & Terpercaya
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8">
                Dapatkan informasi terbaru dari seluruh dunia dengan akurasi tinggi dan penyajian yang menarik
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.slice(0, 4).map((category) => (
                  <Link key={category.id} to={`/category/${category.slug}`}>
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Breaking News Banner */}
        <section className="bg-news-breaking text-news-breaking-foreground py-3">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm md:text-base font-medium animate-pulse">
                🔥 Portal berita terpercaya dengan fitur terlengkap - Komentar, Bookmark, Share & lebih banyak lagi!
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Featured Articles */}
          {isLoading ? (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Berita Utama</h2>
                <Button variant="outline" disabled>
                  Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            </section>
          ) : featuredArticles.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Berita Utama</h2>
                <Link to="/featured">
                  <Button variant="outline">
                    Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredArticles.slice(0, 2).map((article) => (
                  <ArticleCard key={article.id} article={article} variant="featured" />
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest Articles */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Berita Terbaru</h2>
                <Link to="/latest">
                  <Button variant="ghost" size="sm">
                    Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Weather Widget */}
              <WeatherWidget />
              
              {/* Trending Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    Trending Hari Ini
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trendingArticles.map((article, index) => (
                    <div key={article.id} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link to={`/article/${article.id}`} className="group">
                          <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Kategori Populer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Link key={category.id} to={`/category/${category.slug}`}>
                        <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          {category.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags Cloud */}
              <TagsCloud />

              {/* Newsletter Signup */}
              <NewsletterSignup variant="sidebar" />
            </aside>
          </div>
        </div>

        {/* Full Width Newsletter Section */}
        <section className="mt-16">
          <NewsletterSignup />
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default HomePage;