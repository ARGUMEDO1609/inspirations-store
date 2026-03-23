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
  const resolvedOrderStatus = order?.status ? (ORDER_STATUS_LABELS[order.status] || order.status) : null;
  const resolvedPaymentStatus = order?.payment_status ? (PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status) : reportedStatus;

  return (
    <div className="py-24 animate-in fade-in duration-700">
      <div className={`max-w-3xl mx-auto rounded-[40px] border ${config.ring} ${config.bg} p-10 md:p-14 shadow-2xl backdrop-blur-3xl`}>
        <div className={`w-20 h-20 rounded-full ${config.bg} border ${config.ring} flex items-center justify-center mb-8`}>
          <Icon className={config.accent} size={38} />
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter mb-6">
          {config.title}
        </h1>

        <p className="text-slate-300 text-lg leading-8 max-w-2xl mb-10">
          {config.message}
        </p>

        {loadingOrder && (
          <div className="flex items-center gap-3 text-slate-300 mb-8">
            <Loader2 className="animate-spin text-amber-400" size={18} />
            <span className="text-sm font-medium">Consultando estado actualizado del pedido...</span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 mb-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Referencia del pedido</div>
            <div className="text-white font-mono text-lg">{externalReference || 'No disponible aún'}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Estado de pago</div>
            <div className="text-white font-mono text-lg">{resolvedPaymentStatus}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 md:col-span-2">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Estado del pedido</div>
            <div className="text-white font-mono text-lg">{resolvedOrderStatus || 'Pendiente de actualización'}</div>
          </div>
          {paymentId && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 md:col-span-2">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Pago</div>
              <div className="text-white font-mono text-lg break-all">{paymentId}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-amber-500 transition-all duration-500"
          >
            Ver mis pedidos
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 border border-slate-700 text-slate-200 px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:border-amber-500 hover:text-amber-400 transition-all duration-500"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
