import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/news/ArticleCard';
import { SocialShare } from '@/components/features/SocialShare';
import { BookmarkButton } from '@/components/features/BookmarkButton';
import { ReadingProgress } from '@/components/features/ReadingProgress';
import { CommentSystem } from '@/components/features/CommentSystem';
import { BackToTop } from '@/components/features/BackToTop';
import { formatDistanceToNow, format } from 'date-fns';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Article not found</div>;
  }

  const article = StorageService.getArticleById(id);
  const relatedArticles = StorageService.getArticlesByCategory(article?.category || '')
    .filter(a => a.id !== id)
    .slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Maaf, artikel yang Anda cari tidak dapat ditemukan.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true
  });

  const publishedDate = format(new Date(article.publishedAt), 'dd MMMM yyyy, HH:mm');

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-2 space-y-6">
            {/* Article Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary text-primary-foreground">
                  {article.category}
                </Badge>
                {article.featured && (
                  <Badge className="bg-news-breaking text-news-breaking-foreground">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {article.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{publishedDate}</span>
                </div>
                <div className="flex items-center">
                  <span>({timeAgo})</span>
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-4">
                  <BookmarkButton 
                    articleId={article.id} 
                    articleTitle={article.title}
                    variant="outline"
                  />
                  <SocialShare 
                    title={article.title}
                    url={`/article/${article.id}`}
                    description={article.excerpt}
                    variant="compact"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Featured Image */}
            <div className="relative">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-medium"
              />
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-hover"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info & Comment System */}
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{article.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      Jurnalis berpengalaman yang fokus pada berita {article.category.toLowerCase()}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comment System */}
            <CommentSystem articleId={article.id} />
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Berita Terkait</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <ArticleCard 
                        key={relatedArticle.id} 
                        article={relatedArticle} 
                        variant="compact" 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Most Popular */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Paling Populer</h3>
                <div className="space-y-4">
                  {StorageService.getArticles().slice(0, 3).map((popularArticle, index) => (
                    <div key={popularArticle.id} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <Link to={`/article/${popularArticle.id}`}>
                          <h4 className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
                            {popularArticle.title}
                          </h4>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Berlangganan Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Dapatkan berita terbaru langsung di email Anda.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <Button className="w-full" size="sm">
                    Berlangganan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ArticleDetailPage;