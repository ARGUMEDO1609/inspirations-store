import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, MapPin, Phone, Shield, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
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
      toast({
        type: 'success',
        title: 'Perfil Actualizado',
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
    <div className="py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-black text-white italic tracking-tighter mb-4">Tu Perfil</h1>
          <p className="text-slate-500 font-medium text-xl">Gestiona tu identidad en Inspiration Store.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
          <Shield className="text-amber-500" size={20} />
          <span className="text-amber-500 font-black text-xs uppercase tracking-widest">Cuenta Protegida</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[50px] text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/5 blur-[80px]"></div>
            <div className="w-32 h-32 bg-slate-950 border-4 border-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-500 shadow-2xl relative">
              <User size={64} strokeWidth={1.5} />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">{user?.name}</h2>
            <p className="text-slate-500 font-mono text-sm tracking-tighter lowercase mb-8">{user?.email}</p>
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] border-t border-slate-800 pt-8">
              Miembro desde {new Date().getFullYear()}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[40px] space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">Estadísticas</h3>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Colecciones</span>
              <span className="text-white font-mono font-black text-xl">04</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Reseñas</span>
              <span className="text-white font-mono font-black text-xl">12</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-12 rounded-[50px] space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-amber-500/5 blur-[100px]"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                  <User size={14} className="text-amber-500" /> Nombre Completo
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                  <Mail size={14} className="text-amber-500" /> Email
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  readOnly
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl px-8 py-5 text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                  <Phone size={14} className="text-amber-500" /> Teléfono
                </label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                  <MapPin size={14} className="text-amber-500" /> Dirección Principal
                </label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-500 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-xl shadow-amber-900/20 flex items-center gap-4 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
