
import React from 'react';
import { AppSection } from '../types';

interface NavbarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, isLoggedIn, onLogout }) => {
  const sections = [
    { id: AppSection.Home, label: 'Inicio' },
    { id: AppSection.Products, label: 'Productos' },
    { id: AppSection.Blog, label: 'Blog' },
    { id: AppSection.Distributors, label: 'Distribuidores' },
    { id: AppSection.AITools, label: 'IA Tools' },
    { id: AppSection.Contact, label: 'Contacto' },
  ];

  const handleClick = (id: AppSection) => {
    onNavigate(id);
    // Smooth scroll only if on Home and target is an anchor on Home
    if (id !== AppSection.Login && id !== AppSection.Dashboard && id !== AppSection.Blog && id !== AppSection.BlogDetail) {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-morphism px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <span className="text-xl font-bold text-sky-900 cursor-pointer" onClick={() => onNavigate(AppSection.Home)}>Refrescos Santander</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            className={`font-medium transition-colors ${
              activeSection === section.id ? 'text-sky-600' : 'text-slate-600 hover:text-sky-500'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => onNavigate(AppSection.Dashboard)}
              className="text-sky-600 font-bold hover:text-sky-700"
            >
              Panel
            </button>
            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </>
        ) : (
          <button
            onClick={() => onNavigate(AppSection.Login)}
            className="text-slate-600 font-medium hover:text-sky-600 transition-colors"
          >
            Acceso
          </button>
        )}
        
        <button
          onClick={() => handleClick(AppSection.Contact)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-md active:scale-95"
        >
          Cotizar Ahora
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
