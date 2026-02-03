import React, { useState } from 'react';

interface SystemService {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  limit: number;
  lastUpdate: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  limit?: number;
}

interface Integration {
  id: string;
  name: string;
  fields: string;
  status: 'active' | 'inactive';
}

interface SuperAdminDashboardProps {
  onLogout: () => void;
  user: { email: string; name: string; id: string };
}

type AdminTab = 'global' | 'services' | 'modules' | 'integrations';

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('global');
  
  const [services, setServices] = useState<SystemService[]>([
    { id: 'envios-express', name: 'Envíos Express', status: 'active', limit: 500, lastUpdate: new Date().toISOString() },
    { id: 'notificaciones-sms', name: 'Notificaciones SMS', status: 'inactive', limit: 100, lastUpdate: new Date().toISOString() }
  ]);

  const [modules, setModules] = useState<Module[]>([
    { id: 'inventario-pro', name: 'Inventario Pro', description: 'Gestión avanzada de stock y alertas.', status: 'active', createdAt: new Date().toISOString(), limit: 1000 },
    { id: 'cloudinary', name: 'Cloudinary', description: 'Optimización de imágenes en la nube.', status: 'active', createdAt: new Date().toISOString() },
    { id: 'chatbot-ia', name: 'Chatbot IA WhatsApp', description: 'Soporte automatizado con Gemini.', status: 'inactive', createdAt: new Date().toISOString() }
  ]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'cloudinary', name: 'Cloudinary', fields: '{"apiKey": "", "cloudName": ""}', status: 'inactive' },
    { id: 'chatbot-ia', name: 'Chatbot IA WhatsApp', fields: '{"token": "", "instance": ""}', status: 'inactive' }
  ]);

  const [showNewModuleModal, setShowNewModuleModal] = useState(false);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false);
  
  const [newModule, setNewModule] = useState({ name: '', description: '', limit: 0 });
  const [newService, setNewService] = useState({ name: '', limit: 0 });
  const [newIntegration, setNewIntegration] = useState({ name: '', fields: '{}' });

  const updateServiceStatus = (id: string, status: 'active' | 'inactive') => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status, lastUpdate: new Date().toISOString() } : s));
  };

  const toggleModuleStatus = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m));
  };

  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i));
  };

  const handleCreateModule = () => {
    if (!newModule.name || !newModule.description) return;
    const id = newModule.name.toLowerCase().replace(/\s+/g, '-');
    const moduleToAdd: Module = {
      id,
      name: newModule.name,
      description: newModule.description,
      status: 'active',
      createdAt: new Date().toISOString(),
      limit: newModule.limit > 0 ? newModule.limit : undefined
    };
    setModules(prev => [...prev, moduleToAdd]);
    setShowNewModuleModal(false);
    setNewModule({ name: '', description: '', limit: 0 });
  };

  const handleCreateService = () => {
    if (!newService.name) return;
    const id = newService.name.toLowerCase().replace(/\s+/g, '-');
    const serviceToAdd: SystemService = {
      id,
      name: newService.name,
      status: 'inactive',
      limit: newService.limit,
      lastUpdate: new Date().toISOString()
    };
    setServices(prev => [...prev, serviceToAdd]);
    setShowNewServiceModal(false);
    setNewService({ name: '', limit: 0 });
  };

  const handleCreateIntegration = () => {
    if (!newIntegration.name) return;
    const id = newIntegration.name.toLowerCase().replace(/\s+/g, '-');
    const integrationToAdd: Integration = {
      id,
      name: newIntegration.name,
      fields: newIntegration.fields,
      status: 'inactive'
    };
    setIntegrations(prev => [...prev, integrationToAdd]);
    setShowNewIntegrationModal(false);
    setNewIntegration({ name: '', fields: '{}' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 z-30">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center font-bold text-white">S</div>
          <span className="font-bold text-lg">Super Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('global')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${activeTab === 'global' ? 'bg-sky-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <i className="fas fa-chart-line"></i> Dashboard Global
          </button>
          <button onClick={() => setActiveTab('services')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${activeTab === 'services' ? 'bg-sky-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <i className="fas fa-concierge-bell"></i> Servicios
          </button>
          <button onClick={() => setActiveTab('modules')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${activeTab === 'modules' ? 'bg-sky-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <i className="fas fa-th-large"></i> Módulos
          </button>
          <button onClick={() => setActiveTab('integrations')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${activeTab === 'integrations' ? 'bg-sky-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <i className="fas fa-plug"></i> Integraciones
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-950/30 rounded-xl transition-all">
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-10 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeTab === 'global' ? `Dashboard de Control` : 
               activeTab === 'services' ? 'Servicios' : 
               activeTab === 'modules' ? 'Módulos' : 'Integraciones'}
            </h1>
            <p className="text-slate-500">Refrescos Santander S.A.</p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'modules' && (
              <button onClick={() => setShowNewModuleModal(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-100">
                <i className="fas fa-plus"></i> Crear Módulo
              </button>
            )}
            {activeTab === 'services' && (
              <button onClick={() => setShowNewServiceModal(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-100">
                <i className="fas fa-plus"></i> Crear Servicio
              </button>
            )}
            {activeTab === 'integrations' && (
              <button onClick={() => setShowNewIntegrationModal(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-100">
                <i className="fas fa-plus"></i> Crear Integración
              </button>
            )}
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">Sesión Activa</p>
              <p className="text-xs text-green-500 font-bold uppercase tracking-widest">En Línea</p>
            </div>
            <img src="https://ui-avatars.com/api/?name=Super+Admin&background=0284c7&color=fff" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
          </div>
        </header>

        {activeTab === 'global' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Ingresos Totales', val: '$24.5M', inc: '+12%', icon: 'fa-money-bill-wave', color: 'text-green-600', bg: 'bg-green-100' },
              { label: 'Admins Activos', val: '42', inc: 'Estable', icon: 'fa-user-shield', color: 'text-sky-600', bg: 'bg-sky-100' },
              { label: 'Alertas de Stock', val: '08', inc: '-25%', icon: 'fa-exclamation-triangle', color: 'text-amber-600', bg: 'bg-amber-100' },
              { label: 'KPI Logística', val: '98.2%', inc: '+2%', icon: 'fa-truck', color: 'text-purple-600', bg: 'bg-purple-100' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-slate-900">{s.name}</h4>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${s.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {s.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs text-slate-400">Control de Estado</span>
                  <button 
                    onClick={() => updateServiceStatus(s.id, s.status === 'active' ? 'inactive' : 'active')}
                    className={`w-10 h-5 rounded-full relative transition-all ${s.status === 'active' ? 'bg-sky-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${s.status === 'active' ? 'left-5.5' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map(m => (
              <div key={m.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{m.name}</h4>
                <p className="text-slate-500 text-sm mb-6">{m.description}</p>
                <div className="flex gap-2">
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Configurar</button>
                  <button 
                    onClick={() => toggleModuleStatus(m.id)}
                    className={`${m.status === 'active' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'} px-4 py-2 rounded-xl text-xs font-bold transition-colors`}
                  >
                    {m.status === 'active' ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map(i => (
              <div key={i.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{i.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {i.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${i.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {i.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-6">
                  <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold">Ajustes</button>
                  <button 
                    onClick={() => toggleIntegrationStatus(i.id)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${i.status === 'active' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'}`}
                  >
                    {i.status === 'active' ? 'Detener' : 'Conectar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modales simplificados */}
        {showNewModuleModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-fade-in relative">
              <button onClick={() => setShowNewModuleModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Crear Nuevo Módulo</h3>
                <p className="text-slate-500 text-sm">Define las capacidades de la plataforma.</p>
              </div>
              <div className="space-y-6">
                <input type="text" value={newModule.name} onChange={(e) => setNewModule({...newModule, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none" placeholder="Nombre" />
                <textarea value={newModule.description} onChange={(e) => setNewModule({...newModule, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none h-24" placeholder="Descripción" />
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowNewModuleModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
                <button onClick={handleCreateModule} className="flex-1 py-4 bg-sky-600 text-white rounded-2xl font-bold">Crear</button>
              </div>
            </div>
          </div>
        )}

        {showNewServiceModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative">
              <button onClick={() => setShowNewServiceModal(false)} className="absolute top-8 right-8 text-slate-400">
                <i className="fas fa-times text-xl"></i>
              </button>
              <h3 className="text-2xl font-bold mb-8">Crear Servicio</h3>
              <input type="text" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 mb-6" placeholder="Nombre del Servicio" />
              <button onClick={handleCreateService} className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold">Guardar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;