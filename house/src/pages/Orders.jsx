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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 sm:py-40">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-24 text-center sm:py-32 lg:py-40">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-slate-800 bg-slate-900 sm:mb-10 sm:h-32 sm:w-32">
          <Package className="text-slate-800" size={40} />
        </div>
        <h2 className="mb-4 text-3xl font-black tracking-tighter text-white sm:mb-6 sm:text-4xl lg:text-5xl">Sin historial aún.</h2>
        <p className="mb-8 text-base font-medium text-slate-500 sm:mb-12 sm:text-xl">Tus adquisiciones aparecerán aquí una vez procesadas.</p>
        <Link to="/" className="inline-block rounded-2xl bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-950 transition-all duration-500 hover:bg-amber-500 sm:px-12 sm:py-5">
          Explorar galería
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 py-10 duration-700 sm:py-14 lg:py-20">
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-3 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl xl:text-7xl">Adquisiciones</h1>
          <p className="text-base font-medium text-slate-500 sm:text-xl">Historial de tu colección personal.</p>
        </div>
        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 sm:px-6">
          <Clock className="text-amber-500" size={18} />
          <span className="text-xs font-black uppercase tracking-widest text-white">{orders.length} pedidos</span>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6 lg:space-y-8">
        {orders.map((order) => {
          const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
          const statusLabel = STATUS_LABELS[order.status] || order.status;

          return (
            <div key={order.id} className="group overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/40 transition-all duration-500 hover:border-amber-500/30 sm:rounded-[40px]">
              <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
                <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                      <Package size={12} /> ID pedido
                    </div>
                    <div className="font-mono font-black text-white">#{order.id.toString().padStart(6, '0')}</div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                      <Calendar size={12} /> Fecha
                    </div>
                    <div className="font-bold text-white">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                      <CreditCard size={12} /> Total
                    </div>
                    <div className="text-xl font-black tracking-tighter text-amber-500 sm:text-2xl">${order.total}</div>
                  </div>

                  <div>
                    <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-600">Estado</div>
                    <span className={`inline-flex rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:gap-6 lg:w-auto lg:justify-end">
                  <div className="min-w-0 sm:text-right">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">Pago</div>
                    <div className="truncate text-sm text-slate-300">{order.payment_status || 'sin confirmar'}</div>
                  </div>

                  <button className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-slate-500 transition-all duration-500 group-hover:bg-amber-500 group-hover:text-black sm:p-4">
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
