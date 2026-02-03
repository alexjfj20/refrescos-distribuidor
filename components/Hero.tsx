
import React from 'react';

interface HeroProps {
  onQuoteClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onQuoteClick }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-16 pb-20 overflow-hidden">
      {/* Background decorations for a refreshing feel */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-sky-50 -z-10 rounded-b-[100px] opacity-70"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-sky-300/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-6 text-center z-10">
        <div className="max-w-4xl mx-auto space-y-8 mb-12 animate-fade-in">
          <div className="inline-block bg-sky-100 text-sky-700 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            Calidad Superior al por Mayor
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-none tracking-tight">
            Refrescando tu <br />
            <span className="text-gradient">Éxito Comercial</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tu aliado estratégico en la distribución masiva de aguas, refrescos y bebidas energéticas. Calidad Santander directo a tu negocio.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <button
              onClick={onQuoteClick}
              className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-2xl hover:shadow-sky-200 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              <i className="fas fa-rocket"></i> Iniciar Distribución
            </button>
            <div className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black hover:border-sky-300 transition-all cursor-pointer shadow-lg hover:shadow-xl group">
               <i className="fas fa-file-pdf text-red-500 group-hover:scale-110 transition-transform"></i> Ver Catálogo PDF
            </div>
          </div>
        </div>

        {/* Horizontal Hero Image - Fixed to 1360 x 558 proportions */}
        <div className="relative mx-auto group" style={{ maxWidth: '1360px' }}>
          <div className="overflow-hidden rounded-[50px] shadow-[0_30px_60px_-15px_rgba(2,132,199,0.3)] border-[12px] border-white bg-slate-100 transition-all duration-700">
            <img 
              id="hero-image"
              src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2000&auto=format&fit=crop" 
              alt="Refrescos y cócteles coloridos de Refrescos Santander" 
              className="w-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              style={{ height: '558px' }} // Forced original horizontal height
            />
          </div>
          
          {/* Floating Badges */}
          <div className="absolute -bottom-10 -left-6 bg-white p-8 rounded-[32px] shadow-2xl flex items-center gap-5 border border-slate-50 z-20 animate-bounce-slow">
            <div className="w-16 h-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-truck-fast text-3xl"></i>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Entrega Logística</p>
              <p className="text-2xl font-black text-slate-900">24 Horas Garantizadas</p>
            </div>
          </div>
          
          <div className="absolute -top-10 -right-6 glass-morphism p-6 rounded-[32px] shadow-2xl hidden lg:block border border-white/50 z-20">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-certificate text-xl"></i>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Garantía</p>
                <p className="text-lg font-black text-slate-800">ISO 9001 Certificado</p>
              </div>
            </div>
          </div>

          {/* Refreshing bubbles overlay effect */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute bottom-10 left-20 w-4 h-4 bg-white rounded-full animate-bubble-1"></div>
            <div className="absolute bottom-40 right-40 w-6 h-6 bg-white rounded-full animate-bubble-2"></div>
            <div className="absolute bottom-20 left-1/2 w-3 h-3 bg-white rounded-full animate-bubble-3"></div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
        .animate-bubble-1 { animation: bubble 3s infinite ease-in; }
        .animate-bubble-2 { animation: bubble 4s infinite ease-in 1s; }
        .animate-bubble-3 { animation: bubble 5s infinite ease-in 2s; }
        .animate-bounce-slow { animation: bounce 4s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Hero;
