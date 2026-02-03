
import React, { useEffect } from 'react';
import { BlogPost } from '../types';

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[60vh] flex items-center justify-center">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <button 
            onClick={onBack}
            className="mb-8 text-sky-400 hover:text-sky-300 font-bold flex items-center gap-2 mx-auto"
          >
            <i className="fas fa-arrow-left"></i> Volver al Blog
          </button>
          <h1 className="text-4xl md:text-6xl font-extrabold max-w-4xl mx-auto leading-tight">
            {post.title}
          </h1>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm font-medium text-slate-300">
            <span>Refrescos Santander</span>
            <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-lg prose-sky max-w-none text-slate-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                <i className="fas fa-share-alt text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-slate-900">Comparte este artículo</p>
                <p className="text-xs text-slate-500">Ayuda a otros negocios a crecer</p>
              </div>
            </div>
            <div className="flex gap-3">
              {['facebook', 'twitter', 'linkedin', 'whatsapp'].map(social => (
                <button key={social} className="w-10 h-10 bg-slate-50 hover:bg-sky-600 hover:text-white rounded-xl flex items-center justify-center text-slate-400 transition-all">
                  <i className={`fab fa-${social}`}></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
