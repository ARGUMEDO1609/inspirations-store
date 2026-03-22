import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import { useAuth } from './context/AuthContext';
import { ShoppingCart, User, LogOut, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToastProvider, useToast } from './context/ToastContext';
import useActionCable from './api/useActionCable';

const NotificationListener = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Escuchar cambios globales (productos)
  useActionCable("StoreChannel", {
    PRODUCT_CHANGE: (data) => {
      if (data.action === "create") {
        toast({
          title: "¡Novedad!",
          message: `Nuevo producto: ${data.product.attributes.title}`,
          type: "info"
        });
      }
    }
  });

  // Escuchar cambios personales (pedidos)
  if (user) {
    useActionCable({ channel: "OrderChannel" }, {
      ORDER_STATUS_UPDATE: (data) => {
        toast({
          title: "Pedido Actualizado",
          message: `Tu pedido #${data.order_id} ahora está: ${data.status.toUpperCase()}`,
          type: "success"
        });
      }
    });
  }

  return children;
};


const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-slate-950 border-b border-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-3xl font-black tracking-tighter bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent group hover:scale-105 transition duration-500">
          INSPIRATION
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/cart" className="relative group p-2 text-slate-400 hover:text-amber-500 transition duration-300">
            <ShoppingCart size={24} />
          </Link>
          
          <div className="h-6 w-px bg-slate-900 mx-2 hidden sm:block"></div>

          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/orders" className="text-slate-400 hover:text-amber-500 font-bold text-sm tracking-widest uppercase">
                Pedidos
              </Link>
              <Link to="/profile" className="text-slate-400 hover:text-white flex items-center gap-3 font-bold text-sm tracking-widest uppercase">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500">
                  <User size={16} />
                </div>
                <span className="hidden lg:inline">{user.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="text-slate-500 hover:text-rose-500 transition p-2 hover:scale-110 duration-300"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-slate-900 rounded-full transition duration-300">
                Entrar
              </Link>
              <Link to="/signup" className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition transition-all duration-500">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <NotificationListener>
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 pb-40">
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          
          <footer className="border-t border-slate-900 bg-slate-950 py-20 mt-40">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
              <span className="text-3xl font-black text-slate-800 tracking-tighter mb-8">INSPIRATION</span>
              <div className="flex gap-12 text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-12">
                <a href="#" className="hover:text-amber-500 transition">Colección</a>
                <a href="#" className="hover:text-amber-500 transition">Estudio</a>
                <a href="#" className="hover:text-amber-500 transition">Privacidad</a>
                <a href="#" className="hover:text-amber-500 transition">Legal</a>
              </div>
              <p className="text-slate-700 text-[10px] font-bold tracking-widest uppercase border-t border-slate-900 pt-12">
                &copy; 2024 Inspiration Group SA. Protegido bajo cifrado militar.
              </p>
            </div>
          </footer>
        </div>
      </NotificationListener>
    </ToastProvider>

  );
};
export default App;
