import { Article, Category, User } from '@/types';

const STORAGE_KEYS = {
  ARTICLES: 'newsportal_articles',
  CATEGORIES: 'newsportal_categories',
  USER: 'newsportal_user',
  ADMIN_SESSION: 'newsportal_admin_session'
};

// Default admin credentials
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export class StorageService {
  // Articles
  static getArticles(): Article[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return stored ? JSON.parse(stored) : [];
  }

  static saveArticles(articles: Article[]): void {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }

  static addArticle(article: Article): void {
    const articles = this.getArticles();
    articles.unshift(article);
    this.saveArticles(articles);
  }

  static updateArticle(id: string, updatedArticle: Partial<Article>): void {
    const articles = this.getArticles();
    const index = articles.findIndex(article => article.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...updatedArticle };
      this.saveArticles(articles);
    }
  }

  static deleteArticle(id: string): void {
    const articles = this.getArticles();
    const filtered = articles.filter(article => article.id !== id);
    this.saveArticles(filtered);
  }

  static getArticleById(id: string): Article | undefined {
    const articles = this.getArticles();
    return articles.find(article => article.id === id);
  }

  static getArticlesByCategory(category: string): Article[] {
    const articles = this.getArticles();
    return articles.filter(article => article.category.toLowerCase() === category.toLowerCase());
  }

  static getFeaturedArticles(): Article[] {
    const articles = this.getArticles();
    return articles.filter(article => article.featured);
  }

  // Categories
  static getCategories(): Category[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : [];
  }

  static saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // Authentication
  static isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  }

  static loginAdmin(username: string, password: string): boolean {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      return true;
    }
    return false;
  }

  static logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }

  // Initialize with dummy data
  static initializeDummyData(): void {
    if (this.getArticles().length === 0) {
      const dummyArticles: Article[] = [
        {
          id: '1',
          title: 'Breaking: Technology Advances Transform Global Economy',
          content: `<p>In a groundbreaking development that's reshaping the global economic landscape, new technological advances are creating unprecedented opportunities across multiple industries. The integration of artificial intelligence, blockchain technology, and sustainable energy solutions has sparked a revolution that economists are calling "the fourth industrial revolution."</p>
          
          <p>Leading experts from major universities and research institutions worldwide have noted that these technological shifts are not only changing how businesses operate but also creating entirely new economic sectors. Dr. Sarah Chen, an economic analyst at MIT, explains that "we're witnessing a fundamental transformation in the way value is created and distributed globally."</p>
          
          <p>The implications extend far beyond traditional tech companies, with manufacturing, healthcare, finance, and even agriculture experiencing dramatic shifts in operational efficiency and capability. Small businesses are particularly benefiting from increased access to sophisticated tools that were previously available only to large corporations.</p>
          
          <p>This technological wave is also driving significant job market changes, with new roles emerging while others become obsolete. Educational institutions are rapidly adapting their curricula to prepare students for this new economic reality, emphasizing digital literacy and adaptability as core skills for the future workforce.</p>`,
          excerpt: 'New technological advances are reshaping the global economy, creating unprecedented opportunities across multiple industries and sparking what experts call the fourth industrial revolution.',
          category: 'Technology',
          author: 'Michael Rodriguez',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
          featured: true,
          tags: ['technology', 'economy', 'AI', 'innovation']
        },
        {
          id: '2',
          title: 'Climate Summit Reaches Historic Agreement on Carbon Reduction',
          content: `<p>World leaders at the International Climate Summit have achieved what many thought impossible: a unanimous agreement on aggressive carbon reduction targets that go beyond previous commitments. The agreement, signed by representatives from 195 countries, establishes binding commitments for carbon neutrality by 2040.</p>
          
          <p>The breakthrough came after weeks of intense negotiations, with developing nations securing significant financial support for green transition programs. The agreement includes a revolutionary carbon trading system that allows for flexible implementation while ensuring overall global targets are met.</p>
          
          <p>Environmental scientists are calling this a turning point in the fight against climate change. Dr. Elena Petrov, lead climate researcher at the Global Environmental Institute, stated that "this agreement provides the framework we need to limit global warming to 1.5 degrees Celsius."</p>
          
          <p>The implementation phase begins immediately, with quarterly progress reports and an independent monitoring system to ensure accountability. Major corporations have already begun announcing new sustainability initiatives in response to the agreement.</p>`,
          excerpt: 'World leaders reach unanimous agreement on aggressive carbon reduction targets, establishing binding commitments for carbon neutrality by 2040.',
          category: 'Environment',
          author: 'Emma Thompson',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop',
          featured: true,
          tags: ['climate', 'environment', 'politics', 'sustainability']
        },
        {
          id: '3',
          title: 'Medical Breakthrough: New Treatment Shows Promise for Alzheimer\'s',
          content: `<p>Researchers at Johns Hopkins University have announced promising results from clinical trials of a new treatment for Alzheimer's disease. The innovative therapy, which combines gene therapy with targeted medication, has shown significant improvement in cognitive function among trial participants.</p>
          
          <p>The Phase III trial involved 1,200 patients across multiple medical centers, with results showing a 40% reduction in cognitive decline over an 18-month period. This represents the most significant advancement in Alzheimer's treatment in over two decades.</p>
          
          <p>Dr. James Patterson, lead researcher on the project, explains that the treatment targets the root causes of the disease rather than just managing symptoms. "We're not just slowing progression; we're actually seeing cognitive improvement in many patients," he noted during the press conference.</p>
          
          <p>The FDA has granted fast-track designation for the treatment, potentially bringing it to market within the next two years. Patient advocacy groups are cautiously optimistic, emphasizing the need for continued research and accessible treatment options.</p>`,
          excerpt: 'Johns Hopkins researchers announce breakthrough Alzheimer\'s treatment showing 40% reduction in cognitive decline in clinical trials.',
          category: 'Health',
          author: 'Dr. Lisa Wang',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
          featured: false,
          tags: ['health', 'medical', 'research', 'alzheimers']
        },
        {
          id: '4',
          title: 'Sports: Championship Final Draws Record-Breaking Viewership',
          content: `<p>Last night's championship final between the Phoenix Eagles and the Detroit Lions broke all previous viewership records, with over 150 million people tuning in globally. The thrilling match, which went into double overtime, showcased the highest level of athletic competition and sportsmanship.</p>
          
          <p>The game featured remarkable individual performances, with Eagles quarterback Jake Morrison throwing for 450 yards and Lions running back Marcus Johnson rushing for 200 yards. The back-and-forth nature of the game kept viewers on the edge of their seats until the final moments.</p>
          
          <p>Broadcasting networks reported that streaming platforms experienced unprecedented traffic, with many services temporarily slowing due to the massive simultaneous viewership. Social media engagement reached new peaks, with over 50 million posts related to the game.</p>
          
          <p>The economic impact of the game is expected to be significant, with host city businesses reporting record sales and tourism officials estimating millions in additional revenue. Plans are already underway for next year's championship, with several cities competing to host the event.</p>`,
          excerpt: 'Championship final breaks viewership records with 150 million viewers worldwide, featuring thrilling double-overtime competition.',
          category: 'Sports',
          author: 'Carlos Martinez',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
          featured: false,
          tags: ['sports', 'championship', 'viewership', 'competition']
        },
        {
          id: '5',
          title: 'Business: Major Tech Company Announces Largest Acquisition in History',
          content: `<p>TechGlobal Corp announced today its acquisition of CloudInnovate Systems for $85 billion, marking the largest technology acquisition in corporate history. The deal, which has been in negotiations for eight months, is expected to reshape the cloud computing landscape.</p>
          
          <p>CloudInnovate's cutting-edge infrastructure and AI capabilities will be integrated with TechGlobal's existing platform, creating what analysts believe will be the most comprehensive technology ecosystem in the market. The combined company will serve over 500 million users worldwide.</p>
          
          <p>CEO Alexandra Chen of TechGlobal stated that the acquisition represents "a strategic investment in the future of digital transformation." The deal includes CloudInnovate's 12,000 employees, who will retain their positions and receive enhanced benefits packages.</p>
          
          <p>Market analysts predict the acquisition will intensify competition in the cloud services sector, potentially leading to innovation acceleration and more competitive pricing for enterprise customers. Regulatory approval is expected within six months.</p>`,
          excerpt: 'TechGlobal Corp acquires CloudInnovate Systems for $85 billion in the largest technology acquisition in corporate history.',
          category: 'Business',
          author: 'Jennifer Adams',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
          featured: false,
          tags: ['business', 'acquisition', 'technology', 'corporate']
        },
        {
          id: '6',
          title: 'Entertainment: Film Festival Celebrates Independent Cinema',
          content: `<p>The Annual Independent Film Festival concluded this weekend with a celebration of diverse storytelling and innovative filmmaking. Over 200 films from 45 countries were showcased, highlighting the creativity and passion of independent filmmakers worldwide.</p>
          
          <p>This year's Best Picture winner, "Echoes of Tomorrow," a thought-provoking drama about climate change, impressed both critics and audiences. Director Maria Santos dedicated her award to "all the filmmakers who dare to tell important stories despite limited resources."</p>
          
          <p>The festival also featured virtual reality experiences and interactive installations, pushing the boundaries of traditional cinema. Industry professionals noted the increasing quality and sophistication of independent productions, with several films securing distribution deals during the event.</p>
          
          <p>Attendance reached record numbers, with over 50,000 visitors participating in screenings, workshops, and networking events. The festival's success demonstrates the growing appetite for authentic, diverse storytelling in an increasingly connected world.</p>`,
          excerpt: 'Independent Film Festival showcases 200 films from 45 countries, celebrating diverse storytelling and innovative filmmaking.',
          category: 'Entertainment',
          author: 'Roberto Silva',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1489599589421-b34edc98b0e7?w=800&h=400&fit=crop',
          featured: false,
          tags: ['entertainment', 'film', 'festival', 'cinema']
        }
      ];

      const dummyCategories: Category[] = [
        { id: '1', name: 'Technology', slug: 'technology', description: 'Latest tech news and innovations' },
        { id: '2', name: 'Politics', slug: 'politics', description: 'Political news and analysis' },
        { id: '3', name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
        { id: '4', name: 'Health', slug: 'health', description: 'Health and medical news' },
        { id: '5', name: 'Business', slug: 'business', description: 'Business and finance news' },
        { id: '6', name: 'Environment', slug: 'environment', description: 'Environmental and climate news' },
        { id: '7', name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and lifestyle news' }
      ];

      this.saveArticles(dummyArticles);
      this.saveCategories(dummyCategories);
    }
  }
}