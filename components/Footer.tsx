
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-xl font-bold">Refrescos Santander</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Líderes en distribución mayorista de bebidas. Calidad y servicio que impulsan tu rentabilidad desde hace más de 25 años.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Navegación</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#home" className="hover:text-sky-400 transition-colors">Inicio</a></li>
            <li><a href="#products" className="hover:text-sky-400 transition-colors">Productos</a></li>
            <li><a href="#distributors" className="hover:text-sky-400 transition-colors">Distribuidores</a></li>
            <li><a href="#ai-tools" className="hover:text-sky-400 transition-colors">Herramientas AI</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Contacto Directo</h4>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-center gap-3">
              <i className="fas fa-phone text-sky-500"></i> +54 (011) 4567-8900
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-envelope text-sky-500"></i> ventas@rsantander.com
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-map-marker-alt text-sky-500"></i> Parque Industrial Norte, GBA
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Newsletter B2B</h4>
          <p className="text-slate-400 text-sm mb-4">Recibe ofertas exclusivas y novedades de stock directamente en tu correo.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email corporativo" className="bg-slate-800 border-none rounded-lg px-4 py-2 w-full focus:ring-1 focus:ring-sky-500 outline-none" />
            <button className="bg-sky-600 p-2 rounded-lg hover:bg-sky-500 transition-colors">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Refrescos Santander S.A. - Todos los derechos reservados. Desarrollado con IA avanzada.</p>
      </div>
    </footer>
  );
};

export default Footer;
