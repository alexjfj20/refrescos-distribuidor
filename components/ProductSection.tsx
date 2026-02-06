
import React from 'react';

const ProductSection: React.FC = () => {
  const categories = [
    {
      name: 'Agua Embotellada',
      desc: 'Pureza Santander en diversos formatos desde 330ml hasta 20L.',
      icon: 'fa-droplet',
      img: 'refresco05.png',
      color: 'bg-blue-500'
    },
    {
      name: 'Bebidas Energéticas',
      desc: 'Máximo rendimiento y energía para consumidores activos.',
      icon: 'fa-bolt',
      img: 'refresco08.png',
      color: 'bg-yellow-500'
    },
    {
      name: 'Refrescos con Gas',
      desc: 'Sabor tradicional y refrescante para todo tipo de eventos.',
      icon: 'fa-bottle-water',
      img: 'refresco07.png',
      color: 'bg-red-500'
    },
    {
      name: 'Jugos Naturales',
      desc: 'Selección premium de néctares y jugos 100% fruta.',
      icon: 'fa-apple-whole',
      img: 'refresco13.png',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Nuestro Catálogo Mayorista</h2>
          <p className="text-slate-600">Disponemos de stock permanente y precios competitivos escalables según volumen.</p>
        </div>
        <button className="text-sky-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
          Descargar Lista de Precios PDF <i className="fas fa-arrow-right"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col h-full">
            <div className="relative h-64 overflow-hidden rounded-2xl mb-6">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className={`absolute top-4 left-4 ${cat.color} text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg`}>
                <i className={`fas ${cat.icon}`}></i>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">{cat.desc}</p>
              <button className="w-full py-3 bg-slate-50 group-hover:bg-sky-600 group-hover:text-white rounded-xl font-bold text-slate-600 transition-colors">
                Ver Formatos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
