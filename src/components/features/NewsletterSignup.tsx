import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Check, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'sidebar';
  className?: string;
}

export const NewsletterSignup = ({ variant = 'default', className }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribers, setSubscribers] = useLocalStorage<string[]>('newsletter_subscribers', []);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: 'Email Diperlukan',
        description: 'Harap masukkan alamat email yang valid',
        variant: 'destructive'
      });
      return;
    }

    if (subscribers.includes(email)) {
      toast({
        title: 'Email Sudah Terdaftar',
        description: 'Email ini sudah berlangganan newsletter',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubscribers([...subscribers, email]);
      setEmail('');
      setIsLoading(false);
      
      toast({
        title: 'Berhasil Berlangganan!',
        description: 'Terima kasih telah berlangganan newsletter kami',
      });
    }, 1500);
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Newsletter</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="email"
            placeholder="Email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? '...' : 'Daftar'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Dapatkan berita terbaru langsung di email Anda
        </p>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className={`bg-gradient-card ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Mail className="h-4 w-4 text-primary" />
            <span>Newsletter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Dapatkan berita terbaru langsung di email Anda setiap hari.
          </p>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="email"
              placeholder="Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Mendaftar...</span>
                </div>
              ) : (
                'Berlangganan'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-primary text-primary-foreground ${className}`}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-primary-foreground/10 rounded-full">
                <Mail className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Berlangganan Newsletter</h2>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              Jangan lewatkan berita terbaru dan terpenting. Dapatkan ringkasan harian 
              langsung di email Anda setiap pagi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex space-x-3">
              <Input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-primary-foreground text-foreground"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                variant="secondary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Daftar'
                )}
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center space-x-4 text-sm text-primary-foreground/70">
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4" />
              <span>Gratis selamanya</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4" />
              <span>Batal kapan saja</span>
            </div>
            <div className="flex items-center space-x-1">
              <X className="h-4 w-4" />
              <span>Tanpa spam</span>
            </div>
          </div>

          <p className="text-xs text-primary-foreground/60">
            Dengan mendaftar, Anda setuju dengan Syarat & Ketentuan dan Kebijakan Privasi kami.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};