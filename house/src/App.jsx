import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import PaymentResult from './pages/PaymentResult';
import { useAuth } from './context/AuthContext';
import { ShoppingCart, User, LogOut, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToastProvider, useToast } from './context/ToastContext';
import useActionCable from './api/useActionCable';

const NotificationListener = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  useActionCable('StoreChannel', {
    PRODUCT_CHANGE: (data) => {
      if (data.action === 'create') {
        toast({
          title: '¡Novedad!',
          message: `Nuevo producto: ${data.product.attributes.title}`,
          type: 'info'
        });
      }
    }
  });

  if (user) {
    useActionCable({ channel: 'OrderChannel' }, {
      ORDER_STATUS_UPDATE: (data) => {
        toast({
          title: 'Pedido Actualizado',
          message: `Tu pedido #${data.order_id} ahora está: ${data.status.toUpperCase()}`,
          type: data.status === 'paid' ? 'success' : data.status === 'cancelled' ? 'error' : 'info'
        });
      }
    });
  }

  return children;
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-transparent transition duration-500 hover:scale-[1.02] sm:text-3xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text"
          >
            INSPIRATION
          </Link>

          <Link
            to="/cart"
            className="relative rounded-full p-2 text-slate-400 transition duration-300 hover:text-amber-500 lg:hidden"
            aria-label="Ver carrito"
          >
            <ShoppingCart size={22} />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:justify-end">
          <Link
            to="/cart"
            className="relative hidden rounded-full p-2 text-slate-400 transition duration-300 hover:text-amber-500 lg:inline-flex"
            aria-label="Ver carrito"
          >
            <ShoppingCart size={24} />
          </Link>

          <div className="hidden h-6 w-px bg-slate-900 lg:block"></div>

          {user ? (
            <div className="flex w-full flex-wrap items-center gap-3 sm:gap-4 lg:w-auto lg:justify-end lg:gap-5">
              <Link
                to="/orders"
                className="rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 transition duration-300 hover:bg-slate-900 hover:text-amber-500 sm:text-xs"
              >
                Pedidos
              </Link>
              <Link
                to="/profile"
                className="flex min-w-0 items-center gap-3 rounded-full px-3 py-2 text-slate-400 transition duration-300 hover:bg-slate-900 hover:text-white"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-amber-500">
                  <User size={16} />
                </div>
                <span className="truncate text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="rounded-full p-2 text-slate-500 transition duration-300 hover:scale-105 hover:text-rose-500"
                aria-label="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
              <Link
                to="/login"
                className="rounded-full px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 transition duration-300 hover:bg-slate-900 hover:text-white sm:px-5 sm:py-2.5"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-white px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.18em] text-slate-950 transition-all duration-500 hover:bg-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] sm:px-6 sm:py-2.5"
              >
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <NotificationListener>
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-40">
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/payment/success" element={<PaymentResult variant="success" />} />
              <Route path="/payment/failure" element={<PaymentResult variant="failure" />} />
              <Route path="/payment/pending" element={<PaymentResult variant="pending" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>

          <footer className="mt-24 border-t border-slate-900 bg-slate-950 py-14 sm:mt-32 sm:py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
              <span className="mb-6 text-2xl font-black tracking-tighter text-slate-800 sm:mb-8 sm:text-3xl">INSPIRATION</span>
              <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                <a href="#" className="transition hover:text-amber-500">Colección</a>
                <a href="#" className="transition hover:text-amber-500">Estudio</a>
                <a href="#" className="transition hover:text-amber-500">Privacidad</a>
                <a href="#" className="transition hover:text-amber-500">Legal</a>
              </div>
              <p className="border-t border-slate-900 pt-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-700 sm:pt-12">
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
