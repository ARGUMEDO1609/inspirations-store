import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CreditCard, Loader2, MapPin, Package } from 'lucide-react';
import api from '../api/axios';
import useApiError from '../hooks/useApiError';

const STATUS_STYLES = {
  paid: 'bg-[rgba(104,194,142,0.12)] border-[rgba(104,194,142,0.35)] text-[var(--success)]',
  completed: 'bg-[rgba(104,194,142,0.12)] border-[rgba(104,194,142,0.35)] text-[var(--success)]',
  shipped: 'bg-[rgba(126,188,255,0.12)] border-[rgba(126,188,255,0.35)] text-[#6296ca]',
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
  const { handleError } = useApiError();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        const ordersData = response.data.data;
        setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        handleError(error, 'Error cargando pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [handleError]);

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
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.34)] text-[var(--text-muted)]">
          <Package size={36} />
        </div>
        <h2 className="mt-8 font-display text-4xl leading-none text-[var(--text-primary)] sm:text-5xl">
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Archivo de pedidos</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-[var(--text-primary)] sm:text-6xl">
            Tus pedidos
          </h1>
        </div>
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
          <Clock size={15} className="text-[var(--accent)]" />
          {orders.length} registros
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((order, index) => {
          const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
          const statusLabel = STATUS_LABELS[order.status] || order.status;

          return (
            <article
              key={order.id}
              className="glass-panel animate-fade-up overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.74),rgba(255,248,236,0.52))]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      <Package size={12} /> Pedido
                    </p>
                    <p className="font-display text-3xl leading-none text-[var(--text-primary)]">#{order.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      <Calendar size={12} /> Fecha
                    </p>
                    <p className="text-[var(--text-primary)]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      <CreditCard size={12} /> Total
                    </p>
                    <p className="font-display text-4xl leading-none text-[var(--text-primary)]">${order.total}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Estado</p>
                    <span className={`inline-flex rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                      <MapPin size={12} /> Entrega
                    </p>
                    <p className="line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{order.shipping_address || 'Sin dirección registrada'}</p>
                  </div>
                </div>

                <div className="min-w-[180px] rounded-[1.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Pago</p>
                  <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{order.payment_status || 'sin confirmar'}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    El historial se mantiene sincronizado con los cambios del pedido.
                  </p>
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
