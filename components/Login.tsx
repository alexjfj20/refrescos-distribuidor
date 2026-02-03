
import React, { useState } from 'react';
import { Role } from '../types';

interface LoginProps {
  onLogin: (role: Role, email: string, name: string) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock Authentication Logic
    if (email === 'superadmin@rsantander.com' && password === 'super123') {
      onLogin(Role.SuperAdmin, email, 'Gerente General');
    } else if (email === 'admin@rsantander.com' && password === 'admin123') {
      onLogin(Role.Admin, email, 'Administrador Regional');
    } else {
      setError('Credenciales incorrectas. Intente con admin@rsantander.com / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-sky-600"></div>
        
        <button onClick={onBack} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mx-auto mb-4">
            <i className="fas fa-lock text-3xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Acceso Corporativo</h2>
          <p className="text-slate-500 mt-2">Bienvenido de nuevo a Refrescos Santander</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block ml-1">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-envelope"></i>
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                placeholder="admin@rsantander.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block ml-1">Contraseña</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-key"></i>
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-sky-500 outline-none transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-sky-100 transition-all active:scale-[0.98]">
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>¿Olvidaste tu contraseña? <a href="#" className="text-sky-600 font-bold hover:underline">Contactar Soporte IT</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
