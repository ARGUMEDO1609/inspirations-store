import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
        title: 'Ingreso exitoso',
        message: 'Tu sesión quedó activa.'
      });
      navigate('/');
    } catch (err) {
      toast({
        type: 'error',
        title: 'Acceso denegado',
        message: 'Credenciales inválidas. Revisa tu correo y contraseña.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-12 lg:py-16">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.25rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden border-r border-[var(--border-soft)] bg-[radial-gradient(circle_at_top_left,rgba(215,161,74,0.18),transparent_40%),var(--bg-elevated)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--text-muted)]">Private Access</p>
            <h1 className="mt-6 font-display text-5xl uppercase leading-[0.9] tracking-[0.08em] text-[var(--text-primary)]">
              Vuelve a tu colección.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-8 text-[var(--text-secondary)]">
              Revisa pedidos, estados de pago y tu historial desde un espacio privado con la misma identidad visual de la tienda.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Inspiration Members Area</p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--text-muted)]">Login</p>
            <h2 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)] sm:text-4xl">
              Entrar a tu cuenta
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--text-secondary)]">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/signup" className="text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
              Crear acceso
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
