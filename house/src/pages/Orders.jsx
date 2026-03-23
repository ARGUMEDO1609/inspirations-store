import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Clock, CreditCard, Loader2, Package } from 'lucide-react';
import api from '../api/axios';

const STATUS_STYLES = {
  paid: 'bg-[rgba(104,194,142,0.12)] border-[rgba(104,194,142,0.35)] text-[var(--success)]',
  completed: 'bg-[rgba(104,194,142,0.12)] border-[rgba(104,194,142,0.35)] text-[var(--success)]',
  shipped: 'bg-[rgba(126,188,255,0.12)] border-[rgba(126,188,255,0.35)] text-[#8bc5ff]',
  pending: 'bg-[rgba(215,161,74,0.12)] border-[rgba(215,161,74,0.35)] text-[var(--accent)]',
  cancelled: 'bg-[rgba(221,125,116,0.12)] border-[rgba(221,125,116,0.35)] text-[var(--danger)]'
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
        <Loader2 className="h-12 w-12 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-24 text-center sm:py-32 lg:py-40">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text-muted)]">
          <Package size={36} />
        </div>
        <h2 className="mt-8 text-3xl font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)] sm:text-4xl">
          Aún no tienes pedidos.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
          Cuando completes una compra, tu historial aparecerá aquí con su estado y seguimiento.
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)]">
          Explorar colección
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:space-y-12 lg:py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--text-muted)]">Order Archive</p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.08em] text-[var(--text-primary)] sm:text-6xl">
            Tus pedidos
          </h1>
        </div>
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
          <Clock size={15} className="text-[var(--accent)]" />
          {orders.length} registros
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((order) => {
          const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
          const statusLabel = STATUS_LABELS[order.status] || order.status;

          return (
            <article key={order.id} className="overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      <Package size={12} /> Pedido
                    </p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">#{order.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      <Calendar size={12} /> Fecha
                    </p>
                    <p className="text-[var(--text-primary)]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      <CreditCard size={12} /> Total
                    </p>
                    <p className="text-2xl font-semibold text-[var(--accent)]">${order.total}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Estado</p>
                    <span className={`inline-flex rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.24em] ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 lg:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Pago</p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{order.payment_status || 'sin confirmar'}</p>
                  </div>
                  <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
