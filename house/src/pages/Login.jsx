import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({
        type: 'success',
        title: 'Bienvenido',
        message: 'Has iniciado sesión correctamente.'
      });
      navigate('/');
    } catch (err) {
      toast({
        type: 'error',
        title: 'Error de acceso',
        message: 'Credenciales inválidas. Por favor intenta de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10 sm:min-h-[80vh] sm:py-20">
      <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-3xl sm:rounded-[40px] sm:p-10 lg:p-12">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="mb-2 text-3xl font-black tracking-tighter text-white sm:text-4xl">Bienvenido de nuevo</h2>
          <p className="text-sm font-medium text-slate-500 sm:text-base">Accede a tu colección privada.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Contraseña</label>
            <input
              type="password"
              required
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-amber-600 py-4 text-base font-black uppercase tracking-tight text-white transition hover:bg-amber-500"
          >
            {loading ? <Loader2 className="animate-spin text-white" size={24} /> : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-500 sm:mt-8">
          ¿No tienes cuenta? <Link to="/signup" className="ml-1 font-bold text-amber-500 hover:text-amber-400">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
