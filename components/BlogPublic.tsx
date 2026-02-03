
import React from 'react';
import { BlogService } from '../blogService';
import { AppSection } from '../types';

interface BlogPublicProps {
  onNavigatePost: (slug: string) => void;
}

const BlogPublic: React.FC<BlogPublicProps> = ({ onNavigatePost }) => {
  const posts = BlogService.getActivePosts();

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Blog Santander</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Noticias, tendencias y consejos para potenciar tu negocio de bebidas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-100"
            onClick={() => onNavigatePost(post.slug)}
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-sky-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                Artículo
              </div>
            </div>
            <div className="p-8">
              <p className="text-xs text-slate-400 font-medium mb-3">
                {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-sky-600 transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                {post.content.replace(/<[^>]*>/g, '')}
              </p>
              <div className="flex items-center gap-2 text-sky-600 font-bold text-sm">
                Leer más <i className="fas fa-arrow-right text-xs group-hover:translate-x-2 transition-transform"></i>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPublic;
