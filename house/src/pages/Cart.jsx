import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, Plus, Minus, CreditCard, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart_items');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put(`/cart_items/${id}`, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart_items/${id}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderResponse = await api.post('/orders', { 
        shipping_address: 'Dirección de prueba' // En una app real esto vendría de un form
      });
      const orderId = orderResponse.data.id;
      
      const paymentResponse = await api.get(`/orders/${orderId}/pay`);
      window.location.href = paymentResponse.data.checkout_url;
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('Error al procesar el pago.');
    }
  };

  if (loading) return <div className="flex justify-center items-center py-40"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>;

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
      <h1 className="text-6xl font-black text-white italic tracking-tighter mb-16">Tu Selección</h1>
      
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-grow space-y-8">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-amber-500/30 transition-all duration-500">
              <div className="flex items-center gap-10 w-full">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                   <img src={item.product.image || 'https://via.placeholder.com/200'} alt={item.product.title} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2 leading-none">{item.product.title}</h3>
                  <div className="text-amber-500 font-mono font-black mb-6 text-sm">${item.product.price} / pieza</div>
                  
                  <div className="flex items-center gap-6 bg-slate-950 w-fit px-4 py-2 rounded-2xl ring-1 ring-slate-800">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-500 hover:text-white transition"><Minus size={18} /></button>
                    <span className="text-white font-black w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-500 hover:text-white transition"><Plus size={18} /></button>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-8">
                <span className="text-3xl font-mono font-black text-white leading-none">${(item.product.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-4 rounded-2xl bg-slate-950 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-300 border border-slate-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
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
               onClick={handleCheckout}
               className="w-full bg-amber-600 hover:bg-amber-500 text-white py-6 rounded-3xl font-black text-xl uppercase tracking-tight flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(217,119,6,0.2)] transition-all duration-500 group"
             >
               <CreditCard size={24} className="group-hover:rotate-12 transition-transform" />
               Proceder al Pago
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
