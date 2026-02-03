
import React, { useState } from 'react';
import { Product, LandingHeaderConfigData } from '../types';

interface CatalogPublicViewProps {
  businessId: string;
  config: LandingHeaderConfigData;
  products: Product[];
  onBack?: () => void;
}

const CatalogPublicView: React.FC<CatalogPublicViewProps> = ({ config, products, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', 'Water', 'Soft Drink', 'Energy', 'Juice'];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleOrderWhatsApp = (product: Product) => {
    const message = `Hola, vengo de tu catálogo online. Me gustaría pedir: ${product.name} (Precio: $${product.price.toFixed(2)}). ¿Tienen stock disponible?`;
    const url = `https://wa.me/${config.socialLinks.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Banner */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={config.bannerUrl} className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-0 w-full text-center px-6">
          <img src={config.logoUrl} className="w-24 h-24 rounded-full border-4 border-white shadow-2xl mx-auto mb-4 bg-white" alt="Logo" />
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{config.businessName}</h1>
          <p className="text-sky-300 font-bold uppercase tracking-widest text-sm">{config.address}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Categories Navbar */}
        <div className="flex overflow-x-auto gap-3 pb-8 scrollbar-hide mb-10 border-b border-slate-200">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat 
                ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-100' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300'
              }`}
            >
              {cat === 'All' ? 'Todos los Productos' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.filter(p => p.isPublic).map(product => (
            <div 
              key={product.id} 
              className="group bg-white rounded-[40px] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden rounded-[32px] mb-6">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-900 shadow-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="px-2 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-black text-slate-900 leading-tight">{product.name}</h3>
                   <div className="flex items-center gap-1 text-amber-500">
                      <i className="fas fa-star text-xs"></i>
                      <span className="text-xs font-bold">4.5</span>
                   </div>
                </div>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{product.description}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6 pb-2">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Precio Unitario</p>
                      <p className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</p>
                   </div>
                   <button 
                    onClick={() => handleOrderWhatsApp(product)}
                    className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-2xl shadow-lg shadow-green-100 flex items-center justify-center transition-all active:scale-95"
                   >
                     <i className="fab fa-whatsapp text-2xl"></i>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.filter(p => p.isPublic).length === 0 && (
          <div className="py-40 text-center">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <i className="fas fa-box-open text-3xl"></i>
             </div>
             <h3 className="text-2xl font-bold text-slate-900">Sin existencias por ahora</h3>
             <p className="text-slate-500">Vuelve pronto para ver nuestras novedades en {activeCategory}.</p>
          </div>
        )}
      </div>

      {/* Footer Público */}
      <footer className="bg-slate-900 text-white py-20 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">{config.businessName}</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">{config.address}</p>
          <div className="flex justify-center gap-6">
             <a href={`https://instagram.com/${config.socialLinks.instagram}`} className="text-2xl hover:text-sky-400 transition-all"><i className="fab fa-instagram"></i></a>
             <a href={`https://facebook.com/${config.socialLinks.facebook}`} className="text-2xl hover:text-sky-400 transition-all"><i className="fab fa-facebook"></i></a>
             <a href={`https://tiktok.com/${config.socialLinks.tiktok}`} className="text-2xl hover:text-sky-400 transition-all"><i className="fab fa-tiktok"></i></a>
          </div>
          <div className="mt-20 pt-10 border-t border-slate-800 text-slate-500 text-sm">
             <p>Catálogo Digital impulsado por Refrescos Santander B2B Suite</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogPublicView;
