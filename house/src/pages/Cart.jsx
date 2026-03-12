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
        title: 'Dirección Requerida',
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
        title: 'Error de Pago',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && cart.items.length === 0) return <div className="flex justify-center items-center py-40"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>;

  if (cart.items.length === 0) {
    return (
      <div className="py-40 text-center animate-in fade-in duration-1000">
        <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-800">
          <ShoppingBag className="text-slate-800" size={48} />
        </div>
        <h2 className="text-5xl font-black text-white italic mb-6 tracking-tighter">Tu bolsa está vacía.</h2>
        <p className="text-slate-500 mb-12 text-xl font-medium">Aún no has curado piezas para tu colección.</p>
        <Link to="/" className="inline-block bg-white text-slate-950 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-amber-500 transition-all duration-500">
          Explorar Galería
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-6xl font-black text-white italic tracking-tighter">
          {isCheckingOut ? 'Finalizar Adquisición' : 'Tu Selección'}
        </h1>
        {isCheckingOut && (
          <button 
            onClick={() => setIsCheckingOut(false)}
            className="text-slate-500 hover:text-white flex items-center gap-2 font-black uppercase tracking-widest text-xs transition"
          >
            <ArrowLeft size={16} /> Volver al Carrito
          </button>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-grow space-y-8">
          {!isCheckingOut ? (
            cart.items.map((item) => (
              <div key={item.id} className={`bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-amber-500/30 transition-all duration-500 ${processingId === item.id ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-10 w-full">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                     <img src={item.product.image_url || 'https://via.placeholder.com/200'} alt={item.product.title} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2 leading-none">{item.product.title}</h3>
                    <div className="text-amber-500 font-mono font-black mb-6 text-sm">${item.product.price} / pieza</div>
                    
                    <div className="flex items-center gap-6 bg-slate-950 w-fit px-4 py-2 rounded-2xl ring-1 ring-slate-800">
                      <button 
                        disabled={processingId === item.id}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="text-slate-500 hover:text-white transition disabled:opacity-30"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-white font-black w-8 text-center">{item.quantity}</span>
                      <button 
                        disabled={processingId === item.id}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="text-slate-500 hover:text-white transition disabled:opacity-30"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-8">
                  <span className="text-3xl font-mono font-black text-white leading-none">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button 
                    disabled={processingId === item.id}
                    onClick={() => removeItem(item.id)}
                    className="p-4 rounded-2xl bg-slate-950 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-300 border border-slate-800 disabled:opacity-30"
                  >
                    {processingId === item.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[50px] space-y-10 animate-in fade-in slide-in-from-left-5 duration-500">
              <div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter mb-8 uppercase flex items-center gap-4">
                  <MapPin className="text-amber-500" /> Datos de Entrega
                </h3>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Dirección de Envío Completa</label>
                  <textarea 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows="4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-medium resize-none"
                    placeholder="Calle, Número, Ciudad, CP..."
                  />
                  <p className="text-[10px] text-slate-500 italic mt-2">Usaremos esta dirección para el envío priority asegurado.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800">
                 <h3 className="text-xl font-black text-white italic tracking-tighter mb-6 uppercase">Resumen de Objetos</h3>
                 <div className="space-y-4">
                   {cart.items.map(item => (
                     <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                       <span className="text-slate-400">{item.product.title} x {item.quantity}</span>
                       <span className="text-white font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-[400px]">
          <div className="sticky top-32 bg-slate-900 border-2 border-slate-800 p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
             <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/5 blur-[100px]"></div>
             
             <h2 className="text-3xl font-black text-white italic mb-10 tracking-tighter leading-none">Resumen de <br />Inversión</h2>
             
             <div className="space-y-6 mb-12">
                <div className="flex justify-between text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span className="text-slate-200">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs font-black uppercase tracking-[0.2em] pb-6 border-b border-slate-800">
                  <span>Envío Priority</span>
                  <span className="text-emerald-500 italic">Gratis</span>
                </div>
                <div className="flex justify-between pt-6">
                  <span className="text-3xl font-black text-white italic tracking-tighter">Total</span>
                  <span className="text-3xl font-mono font-black text-amber-500">${cart.total.toFixed(2)}</span>
                </div>
             </div>

             <button 
               onClick={() => isCheckingOut ? handleCheckout() : setIsCheckingOut(true)}
               disabled={loading}
               className="w-full bg-amber-600 hover:bg-amber-500 text-white py-6 rounded-3xl font-black text-xl uppercase tracking-tight flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(217,119,6,0.2)] transition-all duration-500 group disabled:opacity-50"
             >
               {loading ? (
                <Loader2 size={24} className="animate-spin" />
               ) : (
                <>
                  <CreditCard size={24} className="group-hover:rotate-12 transition-transform" />
                  {isCheckingOut ? 'Confirmar y Pagar' : 'Proceder al Checkout'}
                </>
               )}
             </button>
             
             <p className="mt-8 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest">
               Transacción protegida por cifrado SSL 256
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
