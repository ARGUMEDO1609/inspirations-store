import React, { useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Loader2, X } from 'lucide-react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import PaymentResult from './pages/PaymentResult';
import { useAuth } from './context/useAuth';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './context/useToast';
import { NetworkStatusProvider } from './context/NetworkStatusContext';
import useNetworkStatus from './context/useNetworkStatus';
import {
  CartNotificationList,
  CartNotificationProvider
} from './context/CartNotificationContext';
import {
  CartCountProvider,
  useCartCount
} from './context/CartCountContext';
import useActionCable from './api/useActionCable';

const NotificationListener = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  useActionCable('StoreChannel', useMemo(
    () => ({
      PRODUCT_CHANGE: (data) => {
        if (data.action === 'create') {
          toast({
            title: 'Nueva pieza',
            message: `Llegó ${data.product.attributes.title} a la colección.`,
            type: 'info'
          });
        }
      }
    }),
    [toast]
  ));

  const orderHandlers = useMemo(
    () => ({
      ORDER_STATUS_UPDATE: (data) => {
        if (!user) return;
        toast({
          title: 'Pedido actualizado',
          message: `Tu pedido #${data.order_id} ahora está ${data.status.toUpperCase()}.`,
          type: data.status === 'paid' ? 'success' : data.status === 'cancelled' ? 'error' : 'info'
        });
      }
    }),
    [toast, user]
  );

  useActionCable({ channel: 'OrderChannel' }, orderHandlers);

  return children;
};

const NetworkBanner = () => {
  const { isOnline, globalError, clearError } = useNetworkStatus();
  const offlineMessage = 'Sin conexión. Verifica tu red para continuar.';

  if (isOnline && !globalError) {
    return null;
  }

  const statusClasses = isOnline
    ? 'border-b border-amber-300/40 bg-amber-500/10 text-amber-200'
    : 'border-b border-rose-500/40 bg-rose-500/10 text-rose-200';
  const message = isOnline ? globalError : offlineMessage;

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] ${statusClasses} lg:px-6`}
    >
      <span className="flex-1 text-left">
        {message || 'Ocurrió un error inesperado. Reintenta más tarde.'}
      </span>
      {isOnline && globalError && (
        <button
          onClick={clearError}
          className="rounded-full border border-white/30 px-2 py-1 text-[11px] uppercase tracking-[0.28em] transition hover:border-white"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

const CartLink = ({ className = '', ariaLabel = 'Abrir carrito' }) => {
  const { cartCount } = useCartCount();

  return (
    <Link to="/cart" aria-label={ariaLabel} className={`relative inline-flex items-center justify-center ${className}`}>
      <ShoppingCart size={18} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--danger)] text-[var(--ink)] text-[10px] font-semibold">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-strong)] bg-[rgba(251,245,238,0.74)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex flex-col leading-none transition hover:opacity-85">
            <span className="font-display text-[2rem] tracking-[0.18em] text-[var(--text-primary)] sm:text-[2.35rem]">Inspiration</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.42em] text-[var(--text-muted)]">Store</span>
          </Link>

          <CartLink className="h-11 w-11 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] lg:hidden" />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:justify-end">
          <nav className="order-2 flex w-full flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)] sm:gap-3 lg:order-1 lg:w-auto">
            <Link to="/" className="rounded-full px-4 py-2 transition hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]">
              Colección
            </Link>
            {user && (
              <>
                <Link to="/orders" className="rounded-full px-4 py-2 transition hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]">
                  Pedidos
                </Link>
                <Link to="/profile" className="rounded-full px-4 py-2 transition hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]">
                  Perfil
                </Link>
              </>
            )}
          </nav>

          <div className="order-1 flex items-center gap-2 sm:gap-3 lg:order-2">
            <CartLink className="hidden h-11 w-11 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] lg:inline-flex" />

            {user ? (
              <>
                <div className="hidden items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 sm:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--accent)]">
                    <User size={15} />
                  </div>
                  <span className="max-w-[10rem] truncate text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-soft)] bg-transparent text-[var(--text-muted)] transition hover:border-[var(--danger)] hover:text-[var(--danger)]"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] sm:px-5 sm:py-3"
                >
                  Entrar
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:translate-y-[-1px] hover:bg-[var(--accent-strong)] sm:px-5 sm:py-3"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="mt-24 border-t border-[var(--border-strong)] bg-[var(--bg-elevated)] py-14 sm:mt-32 sm:py-20">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.35fr_1fr_1fr] lg:px-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)]">Inspiration Store</p>
        <h2 className="mt-3 max-w-md font-display text-4xl leading-none tracking-[0.04em] text-[var(--text-primary)] sm:text-5xl">
          Una tienda con ritmo más curado que masivo.
        </h2>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Explora</p>
        <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
          <a href="#" className="transition hover:text-[var(--accent)]">Colección</a>
          <a href="#" className="transition hover:text-[var(--accent)]">Selección semanal</a>
          <a href="#" className="transition hover:text-[var(--accent)]">Piezas destacadas</a>
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Soporte</p>
        <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
          <a href="#" className="transition hover:text-[var(--accent)]">Privacidad</a>
          <a href="#" className="transition hover:text-[var(--accent)]">Envíos</a>
          <a href="#" className="transition hover:text-[var(--accent)]">Legal</a>
        </div>
      </div>
    </div>
  </footer>
);

const App = () => {
  const { loading } = useAuth();

  return (
    <NetworkStatusProvider>
      <CartCountProvider>
        <CartNotificationProvider>
          <ToastProvider>
            <NotificationListener>
              <CartNotificationList />
              <div className="min-h-screen bg-[radial-gradient(circle_at_top,var(--glow),transparent_38%),linear-gradient(180deg,#fbf5ee,#f1e7db)] text-[var(--text-primary)] selection:bg-[var(--accent)]/30 selection:text-[var(--text-primary)]">
                <NetworkBanner />
                {loading ? (
                  <div className="flex min-h-[70vh] items-center justify-center py-28">
                    <Loader2 className="h-12 w-12 animate-spin text-[var(--accent)]" />
                  </div>
                ) : (
                  <>
                    <Navbar />
                    <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
                      <Routes>
                        <Route path="/" element={<Gallery />} />
                        <Route path="/product/:slug" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/payment/success" element={<PaymentResult variant="success" />} />
                        <Route path="/payment/failure" element={<PaymentResult variant="failure" />} />
                        <Route path="/payment/pending" element={<PaymentResult variant="pending" />} />
                        <Route path="/payment/result" element={<PaymentResult />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                )}
              </div>
            </NotificationListener>
          </ToastProvider>
        </CartNotificationProvider>
      </CartCountProvider>
    </NetworkStatusProvider>
  );
};

export default App;
