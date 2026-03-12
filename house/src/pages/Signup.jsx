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
        title: '¡Bienvenido!',
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
    <div className="min-h-[90vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[50px] shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">Comienza tu Viaje</h2>
          <p className="text-slate-500 font-medium">Únete a la comunidad de coleccionistas de Inspiration.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Nombre Completo</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Juan Pérez" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Email</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="juan@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Contraseña</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="••••••••" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Teléfono</label>
              <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="+54 11..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Dirección de Envío</label>
              <input name="address" type="text" value={formData.address} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Av. Principal 123..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Confirmar Contraseña</label>
              <input name="password_confirmation" type="password" required value={formData.password_confirmation} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="••••••••" />
            </div>
          </div>

          <div className="md:col-span-2 pt-6 text-center">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-amber-500 text-slate-950 font-black py-6 rounded-2xl transition duration-500 text-lg uppercase tracking-tight shadow-2xl flex items-center justify-center min-h-[72px]"
            >
              {loading ? <Loader2 className="animate-spin text-slate-950" size={28} /> : "Crear Colección de Usuario"}
            </button>
            <p className="mt-8 text-center text-slate-500 font-medium text-sm">
              ¿Ya eres miembro? <Link to="/login" className="text-amber-500 hover:text-amber-400 font-bold ml-1">Inicia sesión</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
