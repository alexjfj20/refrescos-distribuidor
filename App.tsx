
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import DistributorBenefits from './components/DistributorBenefits';
import AIChatbot from './components/AIChatbot';
import LiveAgent from './components/LiveAgent';
import LeadForm from './components/LeadForm';
import Footer from './components/Footer';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import BlogPublic from './components/BlogPublic';
import BlogDetail from './components/BlogDetail';
import CatalogPublicView from './components/CatalogPublicView';
import { BlogService } from './blogService';
import { AppSection, Role, AuthSession, BlogPost, Product, LandingHeaderConfigData } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.Home);
  const [session, setSession] = useState<AuthSession>({ user: null });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Mock initial data for Public Catalog
  const mockProducts: Product[] = [
    { id: '1', name: 'Agua Purificada 500ml', category: 'Water', price: 0.45, description: 'La pureza que necesitas en cada gota. Pack de 24 botellas.', image: 'https://images.unsplash.com/photo-1523362628242-4a7458ef346f?q=80&w=800', isPublic: true },
    { id: '2', name: 'Energética Volt X', category: 'Energy', price: 1.20, description: 'Máxima energía para tu día a día. Sabor original.', image: 'https://images.unsplash.com/photo-1622484210811-30ad33939632?q=80&w=800', isPublic: true },
    { id: '4', name: 'Jugo Naranja 1L', category: 'Juice', price: 1.10, description: '100% natural, sin conservantes. El sabor de la fruta fresca.', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800', isPublic: true },
  ];

  const mockCatalogConfig: LandingHeaderConfigData = {
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
  };

  const handleLogin = (role: Role, email: string, name: string) => {
    const id = role === Role.SuperAdmin ? 'sa_1' : 'biz_88';
    setSession({ user: { role, email, name, id } });
    setActiveSection(AppSection.Dashboard);
  };

  const handleLogout = () => {
    setSession({ user: null });
    setActiveSection(AppSection.Home);
  };

  const navigateToBlogDetail = (slug: string) => {
    const post = BlogService.getPostBySlug(slug);
    if (post) {
      setSelectedPost(post);
      setActiveSection(AppSection.BlogDetail);
    }
  };

  if (session.user && activeSection === AppSection.Dashboard) {
    return session.user.role === Role.SuperAdmin ? (
      <SuperAdminDashboard onLogout={handleLogout} user={session.user} />
    ) : (
      <AdminDashboard onLogout={handleLogout} user={session.user} />
    );
  }

  if (activeSection === AppSection.Login) {
    return <Login onLogin={handleLogin} onBack={() => setActiveSection(AppSection.Home)} />;
  }

  if (activeSection === AppSection.Catalog) {
    return <CatalogPublicView businessId="biz_88" config={mockCatalogConfig} products={mockProducts} onBack={() => setActiveSection(AppSection.Home)} />;
  }

  if (activeSection === AppSection.BlogDetail && selectedPost) {
    return (
      <>
        <Navbar 
          activeSection={activeSection} 
          onNavigate={setActiveSection} 
          isLoggedIn={!!session.user}
          onLogout={handleLogout}
        />
        <main className="pt-20">
          <BlogDetail post={selectedPost} onBack={() => setActiveSection(AppSection.Blog)} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        isLoggedIn={!!session.user}
        onLogout={handleLogout}
      />
      
      <main className="pt-20">
        <section id="home" className={activeSection === AppSection.Home ? 'block' : 'hidden'}>
          <Hero onQuoteClick={() => setActiveSection(AppSection.Contact)} />
        </section>

        <section id="products" className={activeSection === AppSection.Home || activeSection === AppSection.Products ? 'py-20 bg-white/50' : 'hidden'}>
          <ProductSection />
        </section>

        <section id="blog" className={activeSection === AppSection.Blog ? 'py-20' : 'hidden'}>
          <BlogPublic onNavigatePost={navigateToBlogDetail} />
        </section>

        <section id="distributors" className={activeSection === AppSection.Home || activeSection === AppSection.Distributors ? 'py-20' : 'hidden'}>
          <DistributorBenefits />
        </section>

        <section id="ai-tools" className={activeSection === AppSection.Home || activeSection === AppSection.AITools ? 'py-20 bg-sky-900 text-white overflow-hidden relative' : 'hidden'}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-400 via-transparent to-transparent blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Herramientas de Marketing con IA</h2>
              <p className="text-sky-200 max-w-2xl mx-auto">
                Potenciamos tu negocio con tecnología de vanguardia. Consulta con nuestro asistente inteligente y utiliza nuestro agente de voz para optimizar tus ventas.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <AIChatbot />
              <LiveAgent />
            </div>
          </div>
        </section>

        <section id="contact" className={activeSection === AppSection.Home || activeSection === AppSection.Contact ? 'py-20' : 'hidden'}>
          <LeadForm />
        </section>
      </main>

      <Footer />

      <button 
        onClick={() => setActiveSection(AppSection.Catalog)}
        className="fixed bottom-8 left-8 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center gap-2 font-bold"
      >
        <i className="fas fa-qrcode text-xl"></i> Ver Catálogo QR
      </button>

      <button 
        onClick={() => {
          const aiTools = document.getElementById('ai-tools');
          aiTools?.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(AppSection.AITools);
        }}
        className="fixed bottom-8 right-8 bg-sky-600 hover:bg-sky-500 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center justify-center"
      >
        <i className="fas fa-robot text-2xl"></i>
      </button>
    </div>
  );
};

export default App;
