import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.password_confirmation) {
        toast({
          type: 'error',
          title: 'Validación',
          message: 'Las contraseñas no coinciden.'
        });
        return;
      }

      setLoading(true);
      try {
        await signup(formData);
        toast({
          type: 'success',
          title: 'Cuenta creada',
          message: 'Tu espacio en Inspiration ya está listo.'
        });
        navigate('/');
      } catch {
        toast({
          type: 'error',
          title: 'Registro no completado',
          message: 'No pudimos crear tu cuenta. Intenta con otro correo.'
        });
      } finally {
        setLoading(false);
      }
    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-10 sm:py-12 lg:py-16">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2.35rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,250,244,0.78),rgba(255,248,236,0.56))]">
        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="glass-panel border-b border-[var(--border-soft)] bg-[radial-gradient(circle_at_top_left,rgba(215,161,74,0.2),transparent_42%),var(--bg-elevated)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10 xl:p-12">
            <div className="animate-fade-up">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Creación de miembro</p>
              <h1 className="mt-5 max-w-sm font-display text-6xl leading-[0.92] text-[var(--text-primary)] text-balance sm:text-7xl">
                Crea tu acceso privado.
              </h1>
              <p className="mt-6 max-w-sm text-base leading-8 text-[var(--text-secondary)]">
                Guarda tus direcciones, sigue pedidos y convierte la tienda en una experiencia más personal.
              </p>
            </div>
            <div className="mt-8 animate-fade-up-delay rounded-[1.7rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.36)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Tu área estará lista para</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                completar compras más rápido, revisar pagos y mantener tus datos de contacto actualizados.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 lg:p-10 xl:p-12">
            <div className="mb-8 animate-fade-up">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Registro</p>
              <h2 className="mt-4 font-display text-5xl leading-none text-[var(--text-primary)] sm:text-6xl">
                Abrir cuenta
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2 animate-fade-up-delay">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Nombre</label>
                <input name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Juan Pérez" className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Correo</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="juan@email.com" className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Teléfono</label>
                <input name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="+57 300..." className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Dirección</label>
                <input name="address" type="text" value={formData.address} onChange={handleChange} placeholder="Av. Principal 123..." className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Contraseña</label>
                <input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Confirmar contraseña</label>
                <input name="password_confirmation" type="password" required value={formData.password_confirmation} onChange={handleChange} placeholder="••••••••" className="w-full rounded-[1.45rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]" />
              </div>

              <div className="md:col-span-2">
                <button type="submit" disabled={loading} className="inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Crear cuenta'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-[var(--text-secondary)] animate-fade-up-slow">
              ¿Ya tienes acceso?{' '}
              <Link to="/login" className="inline-flex items-center gap-2 text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
                Entrar ahora
                <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
