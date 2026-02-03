
import React from 'react';

const DistributorBenefits: React.FC = () => {
  const benefits = [
    {
      title: 'Precios de Fábrica',
      desc: 'Márgenes de ganancia optimizados para que tu negocio crezca con nosotros.',
      icon: 'fa-tags'
    },
    {
      title: 'Logística Propia',
      desc: 'Flota de camiones dedicada para asegurar entregas puntuales y sin daños.',
      icon: 'fa-truck-fast'
    },
    {
      title: 'Crédito Comercial',
      desc: 'Programas de financiamiento flexibles para distribuidores autorizados.',
      icon: 'fa-credit-card'
    },
    {
      title: 'Soporte de Marketing',
      desc: 'Material POP, heladeras y apoyo publicitario para potenciar tu punto de venta.',
      icon: 'fa-bullhorn'
    }
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">¿Por qué ser Distribuidor Santander?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Más que un proveedor, somos tu socio de crecimiento exponencial en el mercado de bebidas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="bg-sky-50 p-8 rounded-[32px] hover:bg-white hover:shadow-2xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-white group-hover:bg-sky-600 rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-colors">
              <i className={`fas ${benefit.icon} text-2xl text-sky-600 group-hover:text-white`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
            <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-sky-900 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <h3 className="text-3xl font-bold mb-4">Únete a nuestra red nacional</h3>
          <p className="text-sky-200">Estamos expandiendo nuestra cobertura. Buscamos socios comprometidos con la excelencia.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-sky-400">15+</p>
            <p className="text-sm uppercase tracking-widest text-sky-200">Provincias</p>
          </div>
          <div className="w-[1px] h-12 bg-sky-800 mx-4"></div>
          <div className="text-center">
            <p className="text-4xl font-bold text-sky-400">2M+</p>
            <p className="text-sm uppercase tracking-widest text-sky-200">Consumidores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorBenefits;
