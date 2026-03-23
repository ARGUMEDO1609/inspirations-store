import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Trash2, Plus, Minus, CreditCard, Loader2, ShoppingBag, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const fetchCart = useCallback(async () => {
    try {
      const response = await api.get('/cart_items');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setProcessingId(id);
    try {
      await api.put(`/cart_items/${id}`, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      const errorMessage = error.response?.data?.error || 'No se pudo actualizar la cantidad.';
      toast({
        type: 'error',
        title: 'Límite alcanzado',
        message: errorMessage
      });
    } finally {
      setProcessingId(null);
    }
  };

  const removeItem = async (id) => {
    setProcessingId(id);
    try {
      await api.delete(`/cart_items/${id}`);
      toast({
        type: 'info',
        title: 'Eliminado',
        message: 'El producto ha sido removido de tu selección.'
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress) {
      toast({
        type: 'error',
        title: 'Dirección requerida',
        message: 'Por favor ingresa una dirección de envío.'
      });
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await api.post('/orders', {
        order: { shipping_address: shippingAddress }
      });
      const orderId = orderResponse.data.id;

      const paymentResponse = await api.get(`/orders/${orderId}/pay`);
      window.location.href = paymentResponse.data.checkout_url;
    } catch (error) {
      console.error('Error initiating checkout:', error);
      const errorMessage = error.response?.data?.error || 'No pudimos iniciar la transacción con Mercado Pago.';
      toast({
        type: 'error',
        title: 'Error de pago',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-32 sm:py-40">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="py-24 text-center sm:py-32 lg:py-40">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-slate-800 bg-slate-900 sm:mb-10 sm:h-32 sm:w-32">
          <ShoppingBag className="text-slate-800" size={40} />
        </div>
        <h2 className="mb-4 text-3xl font-black tracking-tighter text-white sm:mb-6 sm:text-4xl lg:text-5xl">Tu bolsa está vacía.</h2>
        <p className="mb-8 text-base font-medium text-slate-500 sm:mb-12 sm:text-xl">Aún no has curado piezas para tu colección.</p>
        <Link to="/" className="inline-block rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-950 transition-all duration-500 hover:bg-amber-500 sm:px-12 sm:py-5">
          Explorar galería
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 py-10 duration-700 sm:py-14 lg:py-20">
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
          {isCheckingOut ? 'Finalizar adquisición' : 'Tu selección'}
        </h1>
        {isCheckingOut && (
          <button
            onClick={() => setIsCheckingOut(false)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Volver al carrito
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-20">
        <div className="min-w-0 flex-1 space-y-6 sm:space-y-8">
          {!isCheckingOut ? (
            cart.items.map((item) => (
              <div key={item.id} className={`rounded-[28px] border border-slate-800 bg-slate-900/50 p-5 transition-all duration-500 hover:border-amber-500/30 sm:rounded-[36px] sm:p-6 lg:rounded-[40px] lg:p-8 ${processingId === item.id ? 'opacity-50' : ''}`}>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
                    <div className="h-24 w-24 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                      <img src={item.product.image_url || 'https://via.placeholder.com/200'} alt={item.product.title} className="h-full w-full object-cover opacity-80" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-xl font-black leading-tight tracking-tighter text-white sm:text-2xl">{item.product.title}</h3>
                      <div className="mb-4 text-sm font-black text-amber-500">${item.product.price} / pieza</div>

                      <div className="flex w-fit items-center gap-4 rounded-2xl bg-slate-950 px-4 py-2 ring-1 ring-slate-800 sm:gap-6">
                        <button disabled={processingId === item.id} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-500 transition hover:text-white disabled:opacity-30">
                          <Minus size={18} />
                        </button>
                        <span className="w-8 text-center font-black text-white">{item.quantity}</span>
                        <button disabled={processingId === item.id} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-500 transition hover:text-white disabled:opacity-30">
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:gap-8 lg:w-auto lg:flex-col lg:items-end">
                    <span className="text-2xl font-black leading-none text-white sm:text-3xl">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      disabled={processingId === item.id}
                      onClick={() => removeItem(item.id)}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-rose-500/50 transition-all duration-300 hover:bg-rose-500/5 hover:text-rose-500 disabled:opacity-30 sm:p-4"
                    >
                      {processingId === item.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-8 rounded-[28px] border border-slate-800 bg-slate-900/50 p-6 sm:rounded-[40px] sm:p-8 lg:rounded-[50px] lg:p-12">
              <div>
                <h3 className="mb-6 flex items-center gap-3 text-xl font-black uppercase tracking-tight text-white sm:mb-8 sm:text-2xl">
                  <MapPin className="text-amber-500" /> Datos de entrega
                </h3>
                <div className="space-y-4">
                  <label className="px-2 text-xs font-black uppercase tracking-widest text-slate-500">Dirección de envío completa</label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows="4"
                    className="w-full resize-none rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4 text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:px-8 sm:py-5"
                    placeholder="Calle, número, ciudad, CP..."
                  />
                  <p className="text-[10px] italic text-slate-500">Usaremos esta dirección para el envío asegurado.</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6 sm:pt-8">
                <h3 className="mb-5 text-lg font-black uppercase tracking-tight text-white sm:mb-6 sm:text-xl">Resumen de objetos</h3>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 text-sm font-medium">
                      <span className="text-slate-400">{item.product.title} x {item.quantity}</span>
                      <span className="shrink-0 text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[360px] xl:w-[400px]">
          <div className="relative overflow-hidden rounded-[28px] border-2 border-slate-800 bg-slate-900 p-6 shadow-2xl sm:rounded-[40px] sm:p-8 lg:sticky lg:top-32 lg:rounded-[50px] lg:p-10 xl:p-12">
            <div className="absolute -right-20 -top-20 h-60 w-60 bg-amber-500/5 blur-[100px]"></div>

            <h2 className="mb-8 text-2xl font-black leading-none tracking-tighter text-white sm:mb-10 sm:text-3xl">Resumen de inversión</h2>

            <div className="mb-10 space-y-5 sm:mb-12 sm:space-y-6">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-200">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 sm:pb-6">
                <span>Envío</span>
                <span className="text-emerald-500">Gratis</span>
              </div>
              <div className="flex items-end justify-between gap-4 pt-4 sm:pt-6">
                <span className="text-2xl font-black tracking-tighter text-white sm:text-3xl">Total</span>
                <span className="text-2xl font-black text-amber-500 sm:text-3xl">${cart.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => (isCheckingOut ? handleCheckout() : setIsCheckingOut(true))}
              disabled={loading}
              className="group flex min-h-[64px] w-full items-center justify-center gap-3 rounded-3xl bg-amber-600 px-5 py-4 text-base font-black text-white transition-all duration-500 hover:bg-amber-500 disabled:opacity-50 sm:text-lg"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <CreditCard size={22} className="transition-transform group-hover:rotate-12" />
                  {isCheckingOut ? 'Confirmar y pagar' : 'Proceder al checkout'}
                </>
              )}
            </button>

            <p className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-700 sm:mt-8">
              Transacción protegida por cifrado SSL 256
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
