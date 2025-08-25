import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/news/ArticleCard';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <div>Category not found</div>;
  }

  const categories = StorageService.getCategories();
  const category = categories.find(cat => cat.slug === slug);
  const articles = StorageService.getArticlesByCategory(category?.name || '');

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Kategori Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Maaf, kategori yang Anda cari tidak dapat ditemukan.
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

  return (
    <div className="min-h-screen bg-background">
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

        {/* Category Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {category.description}
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            {articles.length} artikel ditemukan
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-4">Belum Ada Artikel</h2>
            <p className="text-muted-foreground mb-8">
              Belum ada artikel yang tersedia untuk kategori {category.name}.
            </p>
            <Link to="/">
              <Button>Jelajahi Kategori Lain</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;