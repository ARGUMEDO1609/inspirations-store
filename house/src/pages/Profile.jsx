import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, MapPin, Phone, Shield, Save, Loader2 } from 'lucide-react';
import api from '../api/axios';

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
        message: 'Tus datos han sido guardados correctamente.'
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
    <div className="animate-in fade-in slide-in-from-bottom-5 py-10 duration-700 sm:py-14 lg:py-20">
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-3 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">Tu perfil</h1>
          <p className="text-base font-medium text-slate-500 sm:text-xl">Gestiona tu identidad en Inspiration Store.</p>
        </div>
        <div className="flex w-fit items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 sm:px-6">
          <Shield className="text-amber-500" size={20} />
          <span className="text-xs font-black uppercase tracking-widest text-amber-500">Cuenta protegida</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10 xl:gap-12">
        <div className="space-y-6 sm:space-y-8 lg:col-span-1">
          <div className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 p-6 text-center sm:rounded-[40px] sm:p-10 lg:rounded-[50px] lg:p-12">
            <div className="absolute -left-20 -top-20 h-40 w-40 bg-amber-500/5 blur-[80px]"></div>
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-800 bg-slate-950 text-amber-500 shadow-2xl sm:mb-8 sm:h-32 sm:w-32">
              <User size={54} strokeWidth={1.5} />
              <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full border-4 border-slate-900 bg-emerald-500 animate-pulse"></div>
            </div>
            <h2 className="mb-2 break-words text-2xl font-black tracking-tighter text-white sm:text-3xl">{user?.name}</h2>
            <p className="mb-6 break-all text-sm text-slate-500 sm:mb-8">{user?.email}</p>
            <div className="border-t border-slate-800 pt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 sm:pt-8">
              Miembro desde {new Date().getFullYear()}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl sm:rounded-[40px] sm:p-8">
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-white">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Colecciones</span>
                <span className="text-xl font-black text-white">04</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Reseñas</span>
                <span className="text-xl font-black text-white">12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="relative space-y-8 overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:rounded-[40px] sm:p-8 lg:rounded-[50px] lg:p-12">
            <div className="absolute -bottom-20 -right-20 h-60 w-60 bg-amber-500/5 blur-[100px]"></div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-center gap-3 px-2 text-xs font-black uppercase tracking-widest text-slate-500">
                  <User size={14} className="text-amber-500" /> Nombre completo
                </label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4 text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:px-8 sm:py-5" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-center gap-3 px-2 text-xs font-black uppercase tracking-widest text-slate-500">
                  <Mail size={14} className="text-amber-500" /> Email
                </label>
                <input type="email" value={formData.email} readOnly className="w-full rounded-3xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-slate-500 sm:px-8 sm:py-5" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-center gap-3 px-2 text-xs font-black uppercase tracking-widest text-slate-500">
                  <Phone size={14} className="text-amber-500" /> Teléfono
                </label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4 text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:px-8 sm:py-5" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-center gap-3 px-2 text-xs font-black uppercase tracking-widest text-slate-500">
                  <MapPin size={14} className="text-amber-500" /> Dirección principal
                </label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4 text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:px-8 sm:py-5" />
              </div>
            </div>

            <div className="flex justify-stretch border-t border-slate-800 pt-6 sm:justify-end sm:pt-8">
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-600 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-amber-500 disabled:opacity-50 sm:w-auto sm:px-10 sm:py-5">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
