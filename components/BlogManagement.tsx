
import React, { useState } from 'react';
import { BlogService } from '../blogService';
import { BlogPost, Role } from '../types';

interface BlogManagementProps {
  role: Role;
  businessId?: string;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ role, businessId }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const all = BlogService.getPosts();
    if (role === Role.SuperAdmin) return all;
    return all.filter(p => p.businessId === businessId);
  });

  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title) return;

    const result = BlogService.savePost({
      ...editingPost,
      title: editingPost.title,
      businessId: role === Role.SuperAdmin ? editingPost.businessId : businessId
    });

    if (result.success) {
      setEditingPost(null);
      // Actualizar lista local
      const all = BlogService.getPosts();
      setPosts(role === Role.SuperAdmin ? all : all.filter(p => p.businessId === businessId));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este post?')) {
      BlogService.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Gestión de Publicaciones</h3>
          <p className="text-sm text-slate-500">Crea y edita contenido para el blog corporativo.</p>
        </div>
        <button 
          onClick={() => setEditingPost({ title: '', content: '', isActive: true })}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-sky-100"
        >
          <i className="fas fa-plus"></i> Nuevo Post
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
              {role === Role.SuperAdmin && <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Negocio</th>}
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img src={post.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{post.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{post.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${post.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {post.isActive ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-slate-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                {role === Role.SuperAdmin && (
                  <td className="px-8 py-5 text-xs font-bold text-sky-600">
                    {post.businessId ? `ID: ${post.businessId}` : 'Global'}
                  </td>
                )}
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingPost(post)}
                      className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="w-8 h-8 bg-slate-100 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-4xl p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setEditingPost(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900">{editingPost.id ? 'Editar Post' : 'Crear Nuevo Post'}</h3>
              <p className="text-slate-500 text-sm">Gestiona el contenido editorial del blog.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título del Artículo</label>
                  <input 
                    type="text" 
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
                    placeholder="Título llamativo..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">URL Imagen Destacada</label>
                  <input 
                    type="text" 
                    value={editingPost.imageUrl}
                    onChange={(e) => setEditingPost({...editingPost, imageUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contenido (HTML Soportado)</label>
                <textarea 
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-sky-500 transition-all h-48 font-mono text-sm" 
                  placeholder="<p>Escribe aquí tu artículo...</p>"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</label>
                  <select 
                    value={editingPost.isActive ? 'true' : 'false'}
                    onChange={(e) => setEditingPost({...editingPost, isActive: e.target.value === 'true'})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="true">Publicado</option>
                    <option value="false">Borrador</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título SEO</label>
                  <input 
                    type="text" 
                    value={editingPost.seoTitle || ''}
                    onChange={(e) => setEditingPost({...editingPost, seoTitle: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-sky-500" 
                    placeholder="Meta Title..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button"
                  onClick={() => setEditingPost(null)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-500 transition-all shadow-lg shadow-sky-100"
                >
                  Guardar Publicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
