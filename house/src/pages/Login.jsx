import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
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
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2.35rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,250,244,0.78),rgba(255,248,236,0.56))] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel hidden border-r border-[var(--border-soft)] bg-[radial-gradient(circle_at_top_left,rgba(215,161,74,0.2),transparent_40%),var(--bg-elevated)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="animate-fade-up">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Acceso privado</p>
            <h1 className="mt-6 max-w-sm font-display text-6xl leading-[0.92] text-[var(--text-primary)] text-balance">
              Vuelve a tu colección.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-8 text-[var(--text-secondary)]">
              Revisa pedidos, estados de pago y tu historial desde un espacio privado con la misma identidad visual de la tienda.
            </p>
          </div>
          <div className="animate-fade-up-delay rounded-[1.7rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.36)] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Área de miembros</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              Desde aquí puedes continuar compras pendientes y seguir cada actualización del pedido.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="mb-8 animate-fade-up">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Login</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-[var(--text-primary)] sm:text-6xl">
              Entrar a tu cuenta
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
              Accede para retomar tu selección, actualizar tus datos y consultar tus pedidos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up-delay">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
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

          <p className="mt-6 text-sm text-[var(--text-secondary)] animate-fade-up-slow">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/signup" className="inline-flex items-center gap-2 text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
              Crear acceso
              <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
