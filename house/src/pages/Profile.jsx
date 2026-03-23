import React, { useState } from 'react';
import { Loader2, Mail, MapPin, Phone, Save, Shield, User } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.patch('/current_user', {
        user: {
          name: formData.name,
          address: formData.address,
          phone: formData.phone
        }
      });
      updateUser(response.data.data);
      toast({
        type: 'success',
        title: 'Perfil actualizado',
        message: 'Tus datos quedaron guardados.'
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'No se pudo actualizar el perfil.';
      toast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:space-y-12 lg:py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Perfil privado</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-[var(--text-primary)] sm:text-6xl">
            Tu perfil
          </h1>
        </div>
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
          <Shield size={15} className="text-[var(--accent)]" />
          Cuenta protegida
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <section className="glass-panel animate-fade-up overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[radial-gradient(circle_at_top_left,rgba(215,161,74,0.18),transparent_35%),linear-gradient(180deg,rgba(255,250,244,0.78),rgba(255,248,236,0.58))] p-6 sm:p-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] text-[var(--accent)]">
            <User size={42} />
          </div>
          <h2 className="mt-6 font-display text-4xl leading-none text-[var(--text-primary)]">
            {user?.name}
          </h2>
          <p className="mt-3 break-all text-sm text-[var(--text-secondary)]">{user?.email}</p>
          <div className="mt-8 rounded-[1.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.34)] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
              Miembro desde {new Date().getFullYear()}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Aquí puedes mantener actualizados tus datos para checkout, pedidos y contacto.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="glass-panel animate-fade-up-delay overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.74),rgba(255,248,236,0.52))] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
                <User size={12} className="text-[var(--accent)]" /> Nombre
              </label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
                <Mail size={12} className="text-[var(--accent)]" /> Correo
              </label>
              <input type="email" value={formData.email} readOnly className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.24)] px-5 py-4 text-[var(--text-muted)]" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
                <Phone size={12} className="text-[var(--accent)]" /> Teléfono
              </label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
                <MapPin size={12} className="text-[var(--accent)]" /> Dirección
              </label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-[1.4rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]" />
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-[var(--border-soft)] pt-6">
            <button type="submit" disabled={loading} className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
