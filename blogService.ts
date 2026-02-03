
import { BlogPost } from './types';

// Mock storage using localStorage to simulate Firestore
const STORAGE_KEY = 'rs_blog_posts';

const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Tendencias en Distribución 2024',
    slug: 'tendencias-distribucion-2024',
    content: '<p>La logística automatizada está cambiando la forma en que los distribuidores de bebidas gestionan su stock...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seoTitle: 'Tendencias Logística 2024',
    seoDescription: 'Descubre el futuro de la distribución de bebidas.'
  },
  {
    id: '2',
    title: 'Importancia de la Hidratación en el Trabajo',
    slug: 'importancia-hidratacion-trabajo',
    content: '<p>Mantener a tu equipo hidratado no solo es una cuestión de salud, sino de productividad neta...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1523362628242-4a7458ef346f?q=80&w=800',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class BlogService {
  static getPosts(): BlogPost[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialPosts;
  }

  static getActivePosts(): BlogPost[] {
    return this.getPosts().filter(p => p.isActive);
  }

  static getPostBySlug(slug: string): BlogPost | undefined {
    return this.getPosts().find(p => p.slug === slug);
  }

  static getPostById(id: string): BlogPost | undefined {
    return this.getPosts().find(p => p.id === id);
  }

  static savePost(post: Partial<BlogPost> & { title: string }): { success: boolean; post?: BlogPost; error?: string } {
    const posts = this.getPosts();
    const slug = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    const newPost: BlogPost = {
      id: post.id || Math.random().toString(36).substr(2, 9),
      title: post.title,
      slug: slug,
      content: post.content || '',
      imageUrl: post.imageUrl || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800',
      isActive: post.isActive ?? true,
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      businessId: post.businessId,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords
    };

    const index = posts.findIndex(p => p.id === newPost.id);
    if (index >= 0) {
      posts[index] = newPost;
    } else {
      posts.push(newPost);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return { success: true, post: newPost };
  }

  static deletePost(id: string): boolean {
    const posts = this.getPosts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  }
}
