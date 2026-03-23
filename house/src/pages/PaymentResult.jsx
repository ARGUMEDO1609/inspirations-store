import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, Loader2, XCircle } from 'lucide-react';
import api from '../api/axios';

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle2,
    title: 'Pago aprobado',
    message: 'Tu pago fue aprobado y el pedido se está actualizando.',
    accent: 'text-[var(--success)]',
    surface: 'bg-[rgba(104,194,142,0.1)] border-[rgba(104,194,142,0.25)]'
  },
  pending: {
    icon: Clock3,
    title: 'Pago pendiente',
    message: 'Mercado Pago aún no termina la confirmación final.',
    accent: 'text-[var(--accent)]',
    surface: 'bg-[rgba(215,161,74,0.1)] border-[rgba(215,161,74,0.25)]'
  },
  failure: {
    icon: XCircle,
    title: 'Pago no completado',
    message: 'No pudimos confirmar el pago. Puedes revisar el pedido e intentarlo de nuevo.',
    accent: 'text-[var(--danger)]',
    surface: 'bg-[rgba(221,125,116,0.1)] border-[rgba(221,125,116,0.25)]'
  }
};

const ORDER_STATUS_LABELS = {
  paid: 'Pagado',
  pending: 'Pendiente',
  cancelled: 'Cancelado',
  shipped: 'Enviado',
  completed: 'Completado'
};

const PaymentResult = ({ variant }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('payment_id') || params.get('collection_id');
  const externalReference = params.get('external_reference');
  const status = params.get('status') || params.get('collection_status');
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (!externalReference) return;

    const fetchOrder = async () => {
      setLoadingOrder(true);
      try {
        const response = await api.get(`/orders/${externalReference}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order after payment:', error);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [externalReference]);

  const config = STATUS_CONFIG[variant] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  const resolvedOrderStatus = order?.status ? ORDER_STATUS_LABELS[order.status] || order.status : 'Pendiente de actualización';
  const resolvedPaymentStatus = order?.payment_status || status || variant;

  return (
    <div className="py-10 sm:py-12 lg:py-16">
      <section className={`mx-auto max-w-4xl overflow-hidden rounded-[2.25rem] border ${config.surface}`}>
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-[var(--border-soft)] bg-[var(--bg-elevated)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10 xl:p-12">
            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border-soft)] ${config.surface}`}>
              <Icon size={30} className={config.accent} />
            </div>
            <h1 className="mt-6 text-3xl font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)] sm:text-4xl">
              {config.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
              {config.message}
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
            {loadingOrder && (
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                Consultando estado actualizado...
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Pedido</p>
                <p className="mt-3 break-all text-lg text-[var(--text-primary)]">{externalReference || 'No disponible'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Pago</p>
                <p className="mt-3 break-all text-lg text-[var(--text-primary)]">{resolvedPaymentStatus}</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Estado del pedido</p>
                <p className="mt-3 break-all text-lg text-[var(--text-primary)]">{resolvedOrderStatus}</p>
              </div>
              {paymentId && (
                <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Referencia de pago</p>
                  <p className="mt-3 break-all text-sm text-[var(--text-secondary)]">{paymentId}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/orders" className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)]">
                Ver pedidos
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border-soft)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                Volver a la tienda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentResult;
