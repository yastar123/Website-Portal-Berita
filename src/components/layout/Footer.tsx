import { Link } from 'react-router-dom';
import { Newspaper, Mail, Phone, MapPin } from 'lucide-react';
import { StorageService } from '@/lib/storage';

export const Footer = () => {
  const categories = StorageService.getCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">NewsForge</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Portal berita terpercaya yang menyajikan informasi terkini dan akurat 
              untuk masyarakat Indonesia dan dunia.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-1" />
                info@newsforge.com
              </div>
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Kategori</h3>
            <div className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Halaman */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Halaman</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Beranda
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Tentang Kami
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Kontak
              </Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                +62 21 123-4567
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                redaksi@newsforge.com
              </div>
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <span>
                  Jl. Sudirman No. 123<br />
                  Jakarta Pusat 10220<br />
                  Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} NewsForge. Hak cipta dilindungi undang-undang.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};