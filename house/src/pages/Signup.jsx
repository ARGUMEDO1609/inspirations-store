import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Loader2 } from 'lucide-react';

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
        title: 'Bienvenido',
        message: 'Tu cuenta ha sido creada con éxito.'
      });
      navigate('/');
    } catch (err) {
      toast({
        type: 'error',
        title: 'Error de registro',
        message: 'Hubo un problema al crear tu cuenta. Intenta con otro email.'
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
    <div className="flex min-h-[80vh] items-center justify-center py-10 sm:min-h-[90vh] sm:py-20">
      <div className="w-full max-w-4xl rounded-[28px] border border-slate-800 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-3xl sm:rounded-[40px] sm:p-8 lg:rounded-[50px] lg:p-12">
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <h2 className="mb-2 text-3xl font-black tracking-tighter text-white sm:text-4xl">Comienza tu viaje</h2>
          <p className="text-sm font-medium text-slate-500 sm:text-base">Únete a la comunidad de coleccionistas de Inspiration.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Nombre completo</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6" placeholder="Juan Pérez" />
            </div>
            <div className="space-y-2">
              <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Email</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6" placeholder="juan@email.com" />
            </div>
            <div className="space-y-2">
              <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Contraseña</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6" placeholder="••••••••" />
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Teléfono</label>
              <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6" placeholder="+57 300..." />
            </div>
            <div className="space-y-2">
              <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Dirección de envío</label>
              <input name="address" type="text" value={formData.address} onChange={handleChange} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6" placeholder="Av. Principal 123..." />
            </div>
            <div className="space-y-2">
              <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Confirmar contraseña</label>
              <input name="password_confirmation" type="password" required value={formData.password_confirmation} onChange={handleChange} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:px-6" placeholder="••••••••" />
            </div>
          </div>

          <div className="pt-2 text-center md:col-span-2 md:pt-4 lg:pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[64px] w-full items-center justify-center rounded-2xl bg-slate-100 px-5 py-4 text-sm font-black uppercase tracking-tight text-slate-950 transition duration-500 hover:bg-amber-500 sm:text-base lg:min-h-[72px]"
            >
              {loading ? <Loader2 className="animate-spin text-slate-950" size={28} /> : 'Crear colección de usuario'}
            </button>
            <p className="mt-6 text-center text-sm font-medium text-slate-500 sm:mt-8">
              ¿Ya eres miembro? <Link to="/login" className="ml-1 font-bold text-amber-500 hover:text-amber-400">Inicia sesión</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
