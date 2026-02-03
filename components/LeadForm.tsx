
import React, { useState } from 'react';
import { GeminiService } from '../geminiService';

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', volume: 'Bajo' });
  const [mapInfo, setMapInfo] = useState<{ text: string; sources: any[] } | null>(null);
  const [locating, setLocating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Gracias! Un ejecutivo de Refrescos Santander se pondrá en contacto pronto.");
  };

  const handleFindNearby = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const info = await GeminiService.findNearbyDistributors(pos.coords.latitude, pos.coords.longitude);
        setMapInfo(info);
      } catch (e) {
        alert("Error al buscar centros cercanos.");
      } finally {
        setLocating(false);
      }
    }, () => {
      alert("Necesitamos tu ubicación para buscar centros cercanos.");
      setLocating(false);
    });
  };

  return (
    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-slate-900">Solicita tu Cotización Personalizada</h2>
        <p className="text-slate-600">Completa el formulario y uno de nuestros asesores comerciales diseñará un plan de abastecimiento a tu medida.</p>
        
        <div className="p-8 bg-sky-50 rounded-[32px] border border-sky-100">
          <h3 className="text-xl font-bold text-sky-900 mb-4 flex items-center gap-2">
            <i className="fas fa-location-dot"></i> Centros de Distribución Cercanos
          </h3>
          <p className="text-sm text-slate-600 mb-6">Usa Google Maps Grounding para encontrar nuestras naves de almacenamiento más próximas a tu ubicación.</p>
          <button 
            onClick={handleFindNearby}
            disabled={locating}
            className="bg-white text-sky-600 border border-sky-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-sky-100 transition-all disabled:opacity-50"
          >
            {locating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-search"></i>}
            Localizar mi zona
          </button>

          {mapInfo && (
            <div className="mt-6 p-4 bg-white rounded-2xl border border-sky-100 shadow-sm animate-fade-in">
              <p className="text-sm text-slate-700 mb-4 whitespace-pre-wrap">{mapInfo.text}</p>
              {mapInfo.sources.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Puntos en Google Maps:</p>
                  {mapInfo.sources.map((s, idx) => (
                    s.maps && (
                      <a key={idx} href={s.maps.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-sky-600 hover:underline">
                        <i className="fas fa-map-pin mr-2"></i> {s.maps.title || 'Ver ubicación'}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nombre Completo</label>
            <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Juan Pérez" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Empresa / Negocio</label>
            <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Supermercado El Valle" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Correo Electrónico</label>
          <input type="email" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="juan@empresa.com" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Teléfono</label>
            <input type="tel" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="+54 9 123 4567" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Volumen Mensual Estimado</label>
            <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none">
              <option>Bajo (100 - 500 packs)</option>
              <option>Medio (500 - 2000 packs)</option>
              <option>Alto (2000+ packs)</option>
              <option>Distribuidor Regional</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Mensaje Adicional</label>
          <textarea className="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none resize-none" placeholder="Cuéntanos más sobre tus necesidades..."></textarea>
        </div>
        <button type="submit" className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-sky-100 transition-all active:scale-[0.98]">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
