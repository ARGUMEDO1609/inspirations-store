import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, Loader2, XCircle } from 'lucide-react';
import api from '../api/axios';
import useApiError from '../hooks/useApiError';

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle2,
    title: 'Pago aprobado',
    message: 'Tu pago fue aprobado y el pedido se está actualizando.',
    accent: 'text-[var(--success)]',
    surface: 'bg-[rgba(104,194,142,0.1)] border-[rgba(104,194,142,0.25)]',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(104,194,142,0.22),transparent_42%),linear-gradient(180deg,rgba(255,250,244,0.78),rgba(255,248,236,0.56))]'
  },
  pending: {
    icon: Clock3,
    title: 'Pago pendiente',
    message: 'Wompi aún no confirma la transacción.',
    accent: 'text-[var(--accent)]',
    surface: 'bg-[rgba(215,161,74,0.1)] border-[rgba(215,161,74,0.25)]',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(215,161,74,0.22),transparent_42%),linear-gradient(180deg,rgba(255,250,244,0.78),rgba(255,248,236,0.56))]'
  },
  failure: {
    icon: XCircle,
    title: 'Pago no completado',
    message: 'Wompi no pudo procesar la transacción. Puedes revisar el pedido e intentarlo de nuevo.',
    accent: 'text-[var(--danger)]',
    surface: 'bg-[rgba(221,125,116,0.1)] border-[rgba(221,125,116,0.25)]',
    glow: 'bg-[radial-gradient(circle_at_top_left,rgba(221,125,116,0.2),transparent_42%),linear-gradient(180deg,rgba(255,250,244,0.78),rgba(255,248,236,0.56))]'
  }
};

const ORDER_STATUS_LABELS = {
  paid: 'Pagado',
  pending: 'Pendiente',
  cancelled: 'Cancelado',
  shipped: 'Enviado',
  completed: 'Completado'
};

const deriveVariantFromStatus = (value) => {
  const normalized = value?.toString().toLowerCase();
  if (!normalized) return null;
  if (normalized.includes('acept') || normalized === 'approved') return 'success';
  if (normalized.includes('pend')) return 'pending';
  if (
    normalized.includes('rechaz') ||
    normalized.includes('fall') ||
    normalized.includes('declin') ||
    ['rejected', 'declined', 'cancelled', 'terminated', 'voided', 'error'].includes(normalized)
  ) return 'failure';
  return null;
};

const PaymentResult = ({ variant }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
const paymentId = params.get('id') || params.get('payment_id') || params.get('collection_id') || params.get('x_ref_payco');
const externalReference = params.get('reference') || params.get('external_reference') || params.get('x_id_invoice');
const statusParam = params.get('status') || params.get('collection_status') || params.get('x_response') || params.get('x_cod_response');
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const { handleError } = useApiError();

  useEffect(() => {
    if (!externalReference) return;

    const fetchOrder = async () => {
      setLoadingOrder(true);
      try {
        const response = await api.get(`/orders/${externalReference}`);
        setOrder(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching order after payment:', error);
        handleError(error, 'Error cargando pedido');
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [externalReference, handleError]);

  const variantFromStatus = deriveVariantFromStatus(statusParam);
  const currentVariant = variant || variantFromStatus || 'pending';
  const config = STATUS_CONFIG[currentVariant] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  const resolvedOrderStatus = order?.status ? ORDER_STATUS_LABELS[order.status] || order.status : 'Pendiente de actualización';
  const resolvedPaymentStatus = order?.payment_status || statusParam || variant;

  return (
    <div className="py-10 sm:py-12 lg:py-16">
      <section className={`mx-auto max-w-4xl overflow-hidden rounded-[2.35rem] border ${config.surface}`}>
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`glass-panel border-b border-[var(--border-soft)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10 xl:p-12 ${config.glow}`}>
            <div className="animate-fade-up">
              <div className={`inline-flex h-18 w-18 items-center justify-center rounded-full border border-[var(--border-soft)] ${config.surface}`}>
                <Icon size={34} className={config.accent} />
              </div>
              <h1 className="mt-6 font-display text-5xl leading-none text-[var(--text-primary)] sm:text-6xl">
                {config.title}
              </h1>
              <p className="mt-4 max-w-md text-base leading-8 text-[var(--text-secondary)]">
                {config.message}
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 lg:p-10 xl:p-12">
            {loadingOrder && (
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] px-4 py-3 text-sm text-[var(--text-secondary)] animate-fade-up">
                <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                Consultando estado actualizado...
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 animate-fade-up-delay">
              <div className="glass-panel rounded-[1.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Pedido</p>
                <p className="mt-3 break-all text-lg font-semibold text-[var(--text-primary)]">{externalReference || 'No disponible'}</p>
              </div>
              <div className="glass-panel rounded-[1.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Pago</p>
                <p className="mt-3 break-all text-lg font-semibold text-[var(--text-primary)]">{resolvedPaymentStatus}</p>
              </div>
              <div className="glass-panel rounded-[1.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] p-5 sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Estado del pedido</p>
                <p className="mt-3 break-all text-lg font-semibold text-[var(--text-primary)]">{resolvedOrderStatus}</p>
              </div>
              {paymentId && (
                <div className="glass-panel rounded-[1.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] p-5 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Referencia de pago</p>
                  <p className="mt-3 break-all text-sm leading-7 text-[var(--text-secondary)]">{paymentId}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-up-slow">
              <Link to="/orders" className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)]">
                Ver pedidos
                <ArrowRight size={16} />
              </Link>
              <Link to="/" className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.34)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
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
