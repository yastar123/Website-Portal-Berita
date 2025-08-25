import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  FileText, 
  Users, 
  Eye,
  MoreVertical,
  Newspaper
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StorageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Article } from '@/types';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  const loadArticles = () => {
    const allArticles = StorageService.getArticles();
    setArticles(allArticles);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      StorageService.deleteArticle(id);
      loadArticles();
      toast({
        title: 'Artikel Dihapus',
        description: 'Artikel berhasil dihapus dari sistem',
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logout Berhasil',
      description: 'Anda telah keluar dari admin dashboard',
    });
  };

  const totalArticles = articles.length;
  const featuredArticles = articles.filter(article => article.featured).length;
  const categories = StorageService.getCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground shadow-medium">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">NewsForge Admin</h1>
                <p className="text-sm opacity-90">Dashboard Manajemen Berita</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" target="_blank">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-hover">
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Website
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-primary-hover"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticles}</div>
              <p className="text-xs text-muted-foreground">
                Semua artikel yang dipublikasi
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artikel Featured</CardTitle>
              <Badge className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredArticles}</div>
              <p className="text-xs text-muted-foreground">
                Artikel yang ditampilkan di beranda
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategori</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Kategori berita tersedia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Articles Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manajemen Artikel</CardTitle>
              <Link to="/admin/article/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Artikel
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {articles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum Ada Artikel</h3>
                <p className="text-muted-foreground mb-4">
                  Mulai dengan menambahkan artikel pertama Anda.
                </p>
                <Link to="/admin/article/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Artikel Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Penulis</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">
                          <div className="max-w-xs truncate">
                            {article.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{article.category}</Badge>
                        </TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>
                          {format(new Date(article.publishedAt), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell>
                          {article.featured && (
                            <Badge className="bg-news-breaking text-news-breaking-foreground">
                              Featured
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/article/${article.id}`} target="_blank">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Lihat
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/article/edit/${article.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteArticle(article.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;