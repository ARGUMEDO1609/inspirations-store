import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock3, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axios';

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle2,
    title: 'Pago aprobado',
    message: 'Tu pago fue aprobado. Estamos actualizando el estado de tu pedido.',
    accent: 'text-emerald-400',
    ring: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10'
  },
  pending: {
    icon: Clock3,
    title: 'Pago pendiente',
    message: 'Tu pago quedó pendiente de confirmación. Te avisaremos cuando cambie de estado.',
    accent: 'text-amber-400',
    ring: 'border-amber-500/30',
    bg: 'bg-amber-500/10'
  },
  failure: {
    icon: XCircle,
    title: 'Pago no completado',
    message: 'No pudimos confirmar tu pago. Puedes revisar tu pedido o volver a intentarlo.',
    accent: 'text-rose-400',
    ring: 'border-rose-500/30',
    bg: 'bg-rose-500/10'
  }
};

const PAYMENT_STATUS_LABELS = {
  approved: 'approved',
  pending: 'pending',
  in_process: 'in_process',
  cancelled: 'cancelled',
  rejected: 'rejected'
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
  const reportedStatus = status || variant;
  const resolvedOrderStatus = order?.status ? ORDER_STATUS_LABELS[order.status] || order.status : null;
  const resolvedPaymentStatus = order?.payment_status ? PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status : reportedStatus;

  return (
    <div className="animate-in fade-in py-10 duration-700 sm:py-16 lg:py-24">
      <div className={`mx-auto max-w-3xl rounded-[28px] border p-6 shadow-2xl backdrop-blur-3xl sm:rounded-[40px] sm:p-10 lg:p-14 ${config.ring} ${config.bg}`}>
        <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full border sm:mb-8 sm:h-20 sm:w-20 ${config.bg} ${config.ring}`}>
          <Icon className={config.accent} size={34} />
        </div>

        <h1 className="mb-4 text-3xl font-black tracking-tighter text-white sm:mb-6 sm:text-5xl lg:text-6xl">
          {config.title}
        </h1>

        <p className="mb-8 max-w-2xl text-base leading-7 text-slate-300 sm:mb-10 sm:text-lg sm:leading-8">
          {config.message}
        </p>

        {loadingOrder && (
          <div className="mb-8 flex items-start gap-3 text-slate-300">
            <Loader2 className="mt-0.5 text-amber-400 animate-spin" size={18} />
            <span className="text-sm font-medium">Consultando estado actualizado del pedido...</span>
          </div>
        )}

        <div className="mb-10 grid gap-4 md:grid-cols-2 sm:mb-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Referencia del pedido</div>
            <div className="break-all font-mono text-base text-white sm:text-lg">{externalReference || 'No disponible aún'}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Estado de pago</div>
            <div className="break-all font-mono text-base text-white sm:text-lg">{resolvedPaymentStatus}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:col-span-2 sm:p-6">
            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Estado del pedido</div>
            <div className="break-all font-mono text-base text-white sm:text-lg">{resolvedOrderStatus || 'Pendiente de actualización'}</div>
          </div>
          {paymentId && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:col-span-2 sm:p-6">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Pago</div>
              <div className="break-all font-mono text-base text-white sm:text-lg">{paymentId}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link to="/orders" className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-center text-sm font-black uppercase tracking-widest text-slate-950 transition-all duration-500 hover:bg-amber-500 sm:px-8">
            Ver mis pedidos
            <ArrowRight size={18} />
          </Link>
          <Link to="/" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-700 px-6 py-4 text-center text-sm font-black uppercase tracking-widest text-slate-200 transition-all duration-500 hover:border-amber-500 hover:text-amber-400 sm:px-8">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
