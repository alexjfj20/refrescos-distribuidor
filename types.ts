
export interface Product {
  id: string;
  name: string;
  category: 'Water' | 'Soft Drink' | 'Energy' | 'Juice';
  description: string;
  image: string;
  secondaryImages?: string[];
  price: number;
  rating?: number;
  ratingCount?: number;
  isPublic?: boolean;
}

export interface InventoryItem extends Product {
  stock: number;
  sku: string;
}

export interface LandingHeaderConfigData {
  bannerUrl: string;
  logoUrl: string;
  businessName: string;
  address: string;
  phone: string;
  email: string;
  deliveryFee: number;
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
    tiktok: string;
  };
}

export interface Order {
  id: string;
  clientName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Preparing' | 'Shipped' | 'Delivered' | 'Canceled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  itemsCount: number;
}

export enum Role {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  User = 'user'
}

export interface AuthSession {
  user: {
    email: string;
    role: Role;
    name: string;
    id: string; 
  } | null;
}

export enum AppSection {
  Home = 'home',
  Products = 'products',
  Distributors = 'distributors',
  AITools = 'ai-tools',
  Contact = 'contact',
  Login = 'login',
  Dashboard = 'dashboard',
  Blog = 'blog',
  BlogDetail = 'blog-detail',
  Catalog = 'catalog'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface LandingSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta';
  content: any;
}

export interface LandingPageConfig {
  id: string;
  title: string;
  slug: string;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    imageUrl: string;
  };
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  businessId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}
