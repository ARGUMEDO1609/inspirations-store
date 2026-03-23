import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Calendar, Clock, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  paid: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  completed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  shipped: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  pending: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  cancelled: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
};

const STATUS_LABELS = {
  paid: 'Pagado',
  completed: 'Completado',
  shipped: 'Enviado',
  pending: 'Pendiente',
  cancelled: 'Cancelado'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center items-center py-40"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>;

  if (orders.length === 0) {
    return (
      <div className="py-40 text-center animate-in fade-in duration-1000">
        <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-800">
          <Package className="text-slate-800" size={48} />
        </div>
        <h2 className="text-5xl font-black text-white italic mb-6 tracking-tighter">Sin historial aún.</h2>
        <p className="text-slate-500 mb-12 text-xl font-medium">Tus adquisiciones aparecerán aquí una vez procesadas.</p>
        <Link to="/" className="inline-block bg-white text-slate-950 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-amber-500 transition-all duration-500">
          Explorar Galería
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
        <div>
          <h1 className="text-7xl font-black text-white italic tracking-tighter mb-4">Adquisiciones</h1>
          <p className="text-slate-500 font-medium text-xl">Historial de tu colección personal.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-2xl">
          <Clock className="text-amber-500" size={18} />
          <span className="text-white font-black text-xs uppercase tracking-widest">{orders.length} Pedidos</span>
        </div>
      </div>

      <div className="space-y-8">
        {orders.map((order) => {
          const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
          const statusLabel = STATUS_LABELS[order.status] || order.status;

          return (
            <div key={order.id} className="group bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[40px] overflow-hidden hover:border-amber-500/30 transition-all duration-500">
              <div className="p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-grow">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
                      <Package size={12} /> ID Pedido
                    </div>
                    <div className="text-white font-mono font-black italic">#{order.id.toString().padStart(6, '0')}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
                      <Calendar size={12} /> Fecha
                    </div>
                    <div className="text-white font-bold">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
                      <CreditCard size={12} /> Total
                    </div>
                    <div className="text-amber-500 font-mono font-black text-2xl tracking-tighter">${order.total}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Estado</div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full lg:w-auto">
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 mb-2">Pago</div>
                    <div className="text-sm font-mono text-slate-300">{order.payment_status || 'sin confirmar'}</div>
                  </div>

                  <button className="p-4 rounded-2xl border border-slate-800 bg-slate-950 text-slate-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
