import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[40px] shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">Bienvenido de Nuevo</h2>
          <p className="text-slate-500 font-medium">Accede a tu colección privada.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl mb-8 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-5 rounded-2xl transition duration-300 shadow-xl shadow-amber-900/20 text-lg uppercase tracking-tight"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium text-sm">
          ¿No tienes cuenta? <Link to="/signup" className="text-amber-500 hover:text-amber-400 font-bold ml-1">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
