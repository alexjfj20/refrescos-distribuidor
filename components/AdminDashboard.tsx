
import React, { useState } from 'react';
import BlogManagement from './BlogManagement';
import { Role, InventoryItem, Order, LandingHeaderConfigData } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  user: { email: string; name: string; id: string };
}

type AdminTab = 'overview' | 'inventory' | 'catalog' | 'orders' | 'blog';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);

  const [catalogConfig, setCatalogConfig] = useState<LandingHeaderConfigData>({
    bannerUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2000',
    logoUrl: 'https://ui-avatars.com/api/?name=RS&background=0284c7&color=fff',
    businessName: 'Refrescos Santander - Sucursal Regional',
    address: 'Av. Industrial 450, Sector Norte',
    phone: '+54 9 11 1234-5678',
    email: 'ventas.regional@rsantander.com',
    deliveryFee: 15.00,
    socialLinks: {
      instagram: '@rsantander_oficial',
      facebook: 'RefrescosSantander',
      whatsapp: '5491112345678',
      tiktok: '@santander_refrescos'
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Agua Purificada 500ml', category: 'Water', stock: 1250, price: 0.45, sku: 'AG-500-S', description: 'Pack de 24 botellas', image: 'https://images.unsplash.com/photo-1523362628242-4a7458ef346f?q=80&w=200', isPublic: true },
    { id: '2', name: 'Energética Volt X', category: 'Energy', stock: 45, price: 1.20, sku: 'EN-VLT-X', description: 'Lata individual 330ml', image: 'https://images.unsplash.com/photo-1622484210811-30ad33939632?q=80&w=200', isPublic: true },
    { id: '3', name: 'Cola Clásica 2L', category: 'Soft Drink', stock: 800, price: 1.85, sku: 'RS-COL-2L', description: 'Pack de 6 unidades', image: 'https://images.unsplash.com/photo-1625772290748-39126d797247?q=80&w=200', isPublic: false },
    { id: '4', name: 'Jugo Naranja 1L', category: 'Juice', stock: 320, price: 1.10, sku: 'JG-OR-1L', description: 'Tetra pack familiar', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=200', isPublic: true },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-4401', clientName: 'Mercado Central', date: '2024-03-15', total: 4200.50, status: 'Shipped', paymentStatus: 'Paid', itemsCount: 150 },
    { id: 'ORD-4402', clientName: 'Híper Chino Express', date: '2024-03-14', total: 1850.00, status: 'Preparing', paymentStatus: 'Paid', itemsCount: 45 },
    { id: 'ORD-4403', clientName: 'Minimarket Los Pinos', date: '2024-03-14', total: 940.25, status: 'Delivered', paymentStatus: 'Paid', itemsCount: 22 },
  ]);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name) return;

    const newItem: InventoryItem = {
      id: editingItem.id || Math.random().toString(36).substr(2, 9),
      name: editingItem.name,
      category: (editingItem.category as any) || 'Water',
      stock: editingItem.stock || 0,
      price: editingItem.price || 0,
      sku: editingItem.sku || 'N/A',
      description: editingItem.description || '',
      image: editingItem.image || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=200',
      isPublic: editingItem.isPublic ?? false
    };

    if (editingItem.id) {
      setInventory(inventory.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setInventory([...inventory, newItem]);
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const togglePublic = (id: string) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, isPublic: !item.isPublic } : item));
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
    order.clientName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const lowStockCount = inventory.filter(item => item.stock < 100).length;
  const totalInventoryValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      Pending: 'bg-slate-100 text-slate-600',
      Preparing: 'bg-amber-100 text-amber-600',
      Shipped: 'bg-blue-100 text-blue-600',
      Delivered: 'bg-green-100 text-green-600',
      Canceled: 'bg-red-100 text-red-600',
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-40">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center font-bold text-white">A</div>
          <span className="font-bold text-lg text-slate-900">Admin Regional</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fas fa-home"></i> Resumen
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'inventory' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fas fa-boxes"></i> Inventario
          </button>
          <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'catalog' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fas fa-store"></i> Catálogo QR
          </button>
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'blog' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fas fa-edit"></i> Mi Blog
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}>
            <i className="fas fa-shopping-cart"></i> Pedidos
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-red-500 rounded-xl transition-all">
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-10 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
              {activeTab === 'overview' && `Escritorio`}
              {activeTab === 'inventory' && 'Inventario Real'}
              {activeTab === 'catalog' && 'Escaparate Público'}
              {activeTab === 'blog' && 'Contenido de Marca'}
              {activeTab === 'orders' && 'Logística de Pedidos'}
            </h1>
            <p className="text-slate-500 font-medium">Panel de Control Regional - Santander</p>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=e0f2fe&color=0369a1`} className="w-12 h-12 rounded-full shadow-sm" alt="Admin" />
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4"><i className="fas fa-triangle-exclamation text-xl"></i></div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">Stock Crítico</p>
              <p className="text-3xl font-extrabold text-slate-900">{lowStockCount}</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div className="bg-sky-100 text-sky-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4"><i className="fas fa-vault text-xl"></i></div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">Valor Activo</p>
              <p className="text-3xl font-extrabold text-slate-900">${totalInventoryValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4"><i className="fas fa-check-double text-xl"></i></div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">Sincronizados</p>
              <p className="text-3xl font-extrabold text-slate-900">{inventory.filter(i => i.isPublic).length}</p>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* QR Section */}
                <div className="lg:col-span-1 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 text-center">
                   <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-widest">Tu Enlace Público</h3>
                   <div className="w-48 h-48 bg-slate-50 mx-auto rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 mb-6 relative">
                      <i className="fas fa-qrcode text-6xl text-slate-300"></i>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
                        <button className="bg-sky-600 text-white p-3 rounded-full shadow-lg"><i className="fas fa-download"></i></button>
                      </div>
                   </div>
                   <p className="text-xs text-slate-400 mb-4 font-mono break-all">rsantander.com/catalog/{user.id}</p>
                   <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                      <i className="fas fa-external-link-alt"></i> Ver Mi Catálogo
                   </button>
                </div>

                {/* Identity Config */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Identidad Visual y Contacto</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre Comercial</label>
                        <input type="text" value={catalogConfig.businessName} onChange={(e) => setCatalogConfig({...catalogConfig, businessName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp (Ventas)</label>
                        <input type="text" value={catalogConfig.phone} onChange={(e) => setCatalogConfig({...catalogConfig, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Tarifa de Envío ($)</label>
                        <input type="number" value={catalogConfig.deliveryFee} onChange={(e) => setCatalogConfig({...catalogConfig, deliveryFee: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Banner URL</label>
                        <input type="text" value={catalogConfig.bannerUrl} onChange={(e) => setCatalogConfig({...catalogConfig, bannerUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sky-500" />
                      </div>
                   </div>
                   <button className="mt-8 px-10 py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-500 transition-all">Guardar Configuración</button>
                </div>
             </div>

             <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Sincronización de Productos Públicos</h3>
                  <div className="flex gap-4 items-center">
                    <div className="relative w-64">
                      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filtrar por nombre..." 
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-500" 
                      />
                    </div>
                    <button 
                      onClick={() => { setEditingItem({ name: '', category: 'Water', stock: 0, price: 0, sku: '', isPublic: true }); setShowItemModal(true); }}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                    >
                      <i className="fas fa-plus"></i> Nuevo Producto
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                  {filteredInventory.map(item => (
                    <div key={item.id} className="group relative bg-white border border-slate-100 rounded-[32px] p-4 hover:shadow-xl transition-all">
                      <div className="relative h-40 overflow-hidden rounded-2xl mb-4">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <button 
                          onClick={() => togglePublic(item.id)}
                          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${item.isPublic ? 'bg-green-500 text-white' : 'bg-white/80 text-slate-400 backdrop-blur-sm'}`}
                        >
                          <i className={`fas ${item.isPublic ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{item.category}</p>
                      <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                        <span className="text-lg font-black text-slate-900">${item.price.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold ${item.isPublic ? 'text-green-500' : 'text-slate-300'}`}>
                          {item.isPublic ? 'Visible en Catálogo' : 'Oculto'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" placeholder="Buscar en bodega..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none" />
              </div>
              <button onClick={() => { setEditingItem({ name: '', category: 'Water', stock: 0, price: 0, sku: '' }); setShowItemModal(true); }} className="bg-sky-600 text-white px-8 py-3 rounded-2xl font-bold">Nuevo Producto</button>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">Item</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">SKU</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">Stock</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">Precio</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </td>
                      <td className="px-8 py-5 text-sm font-mono text-slate-400">{item.sku}</td>
                      <td className="px-8 py-5 font-bold">{item.stock} uds.</td>
                      <td className="px-8 py-5 font-bold text-slate-900">${item.price.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right flex justify-end gap-2">
                         <button onClick={() => togglePublic(item.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.isPublic ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`} title="Público"><i className="fas fa-eye"></i></button>
                         <button onClick={() => { setEditingItem(item); setShowItemModal(true); }} className="w-8 h-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center hover:bg-sky-600 hover:text-white"><i className="fas fa-edit"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blog' && <BlogManagement role={Role.Admin} businessId={user.id} />}
        
        {activeTab === 'orders' && (
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between">
               <h3 className="font-bold uppercase text-xs tracking-widest text-slate-500">Logística de Despacho</h3>
               <span className="text-xs font-bold text-sky-600">{filteredOrders.length} Pedidos Hoy</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase">ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase">Cliente</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase">Total</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase">Estado</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs text-sky-600">{order.id}</td>
                    <td className="px-8 py-5 font-bold">{order.clientName}</td>
                    <td className="px-8 py-5 font-extrabold text-slate-900">${order.total.toLocaleString()}</td>
                    <td className="px-8 py-5">{getStatusBadge(order.status)}</td>
                    <td className="px-8 py-5 text-right"><button className="text-[10px] font-bold uppercase text-slate-400 hover:text-sky-600">Detalles</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showItemModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] w-full max-w-xl p-10 shadow-2xl relative">
              <button onClick={() => setShowItemModal(false)} className="absolute top-8 right-8 text-slate-400"><i className="fas fa-times text-xl"></i></button>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">{editingItem?.id ? 'Ajustar Inventario' : 'Nuevo Producto'}</h3>
              <form onSubmit={handleSaveItem} className="space-y-6">
                <input type="text" value={editingItem?.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} placeholder="Nombre" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" value={editingItem?.stock} onChange={(e) => setEditingItem({...editingItem, stock: parseInt(e.target.value)})} placeholder="Stock" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none" />
                  <input type="number" step="0.01" value={editingItem?.price} onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} placeholder="Precio" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none" />
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <input 
                    type="checkbox" 
                    checked={editingItem?.isPublic} 
                    onChange={(e) => setEditingItem({...editingItem, isPublic: e.target.checked})}
                    className="w-5 h-5 accent-sky-600"
                  />
                  <label className="text-sm font-bold text-slate-600">Mostrar en Catálogo Público</label>
                </div>
                <button type="submit" className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-xl shadow-sky-100">Guardar</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
