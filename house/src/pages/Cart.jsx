import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, Loader2, MapPin, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/useToast';
import { useAuth } from '../context/useAuth';
import useApiError from '../hooks/useApiError';
import { useCartNotification } from '../context/CartNotificationContext';
import { useCartCount } from '../context/CartCountContext';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f0e8' width='200' height='200'/%3E%3Ctext fill='%23a99' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E%3C/text%3E%3C/svg%3E";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { toast } = useToast();
  const { handleError } = useApiError();
  const { notifyCart } = useCartNotification();
  const { setCartCount } = useCartCount();
  const safeTotal = Number(cart.total ?? 0);

  useEffect(() => {
    if (user && user.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const fetchCart = useCallback(async () => {
    try {
      const response = await api.get('/cart_items');
      const cartData = response.data.data;
      const items = cartData?.items || [];
      const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCart(cartData || { items: [], total: 0 });
      setCartCount(totalQuantity);
    } catch (error) {
      console.error('Error fetching cart:', error);
      handleError(error, 'Error cargando carrito');
    } finally {
      setLoading(false);
    }
  }, [handleError, setCartCount]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setProcessingId(id);
    try {
      await api.put(`/cart_items/${id}`, { quantity: newQuantity });
      await fetchCart();
      notifyCart('Cantidad actualizada en el carrito.', 'info');
    } catch (error) {
      console.error('Error updating quantity:', error);
      handleError(error, 'Cantidad no válida');
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
        title: 'Pieza removida',
        message: 'La pieza fue retirada de tu selección.'
      });
      await fetchCart();
      notifyCart('Pieza removida del carrito.', 'info');
    } catch (error) {
      console.error('Error removing item:', error);
      handleError(error, 'Error removing item');
    } finally {
      setProcessingId(null);
    }
  };

   const handleCheckout = async () => {
     // Trim and check if shipping address is empty after trimming
     const trimmedAddress = shippingAddress.trim();
     if (!trimmedAddress) {
       toast({
         type: 'error',
         title: 'Dirección requerida',
         message: 'Ingresa una dirección de envío antes de continuar.'
       });
       return;
     }

     // Check if we have items in cart before proceeding
     if (cart.items.length === 0) {
       toast({
         type: 'error',
         title: 'Carrito vacío',
         message: 'Añade productos antes de continuar.'
       });
       return;
     }

     setLoading(true);
     try {
       const orderResponse = await api.post('/orders', {
         order: { 
           shipping_address: trimmedAddress, // Send trimmed address
           payment_method: paymentMethod
         }
       });

       if (paymentMethod === 'cash_on_delivery') {
        toast({
          type: 'success',
          title: 'Pedido confirmado',
          message: 'El pago se realizará contra entrega.'
        });
        setCart({ items: [], total: 0 });
        navigate('/orders');
        notifyCart('Pedido confirmado. Revisá tu historial para el seguimiento.', 'success');
        return;
       }

       const orderId = orderResponse.data.data.id;
       
       let paymentResponse;
       try {
         paymentResponse = await api.get(`/orders/${orderId}/pay`);
         
         // Validate that we got a proper checkout URL
         if (!paymentResponse.data || !paymentResponse.data.data || !paymentResponse.data.data.checkout_url) {
           throw new Error('Respuesta de pago inválida');
         }
         
         const checkoutUrl = paymentResponse.data.data.checkout_url;
         if (!checkoutUrl || typeof checkoutUrl !== 'string' || checkoutUrl.trim() === '') {
           throw new Error('URL de pago no válida o vacía');
         }
         
         // Redirect to Mercado Pago payment page
         window.location.href = checkoutUrl;
       } catch (payError) {
         console.error('Error getting payment URL:', payError);
         const errorData = payError.response?.data;
         if (errorData?.error?.includes('not available for payment')) {
           toast({
             type: 'warning',
             title: 'Pedido existente',
             message: 'Ya tienes un pedido en proceso. Contacta al administrador.'
           });
         } else {
           handleError(payError, 'Error al procesar el pago');
           // Show specific error for payment URL issues
           toast({
             type: 'error',
             title: 'Error de pago',
             message: 'No pudimos preparar el pago. Por favor intenta de nuevo o selecciona otro método de pago.'
           });
         }
       }
     } catch (error) {
       console.error('Error initiating checkout:', error);
       const errorData = error.response?.data;
       
       // Log the full error for debugging
       console.error('Full error response:', errorData);
       
       // Show specific validation errors from backend
       if (errorData?.errors) {
         const errorMessages = Object.values(errorData.errors).flat();
         errorMessages.forEach(msg => {
           toast({
             type: 'error',
             title: 'Error de validación',
             message: msg
           });
         });
       } 
       // Handle specific known errors
       else if (errorData?.error?.includes('Insufficient stock')) {
         toast({
           type: 'error',
           title: 'Stock insuficiente',
           message: errorData.error
         });
       } else if (errorData?.error?.includes('Cart is empty')) {
         toast({
           type: 'error',
           title: 'Carrito vacío',
           message: 'Añade productos antes de continuar.'
         });
       } else if (errorData?.error?.includes('shipping_address')) {
         toast({
           type: 'error',
           title: 'Dirección inválida',
             message: errorData.error || 'La dirección de envío no es válida'
         });
       } else if (errorData?.error?.includes('blank')) {
         toast({
           type: 'error',
           title: 'Campo requerido',
           message: 'Por favor completa todos los campos requeridos'
         });
       } else if (errorData?.error) {
         toast({
           type: 'error',
           title: 'Error de creación de orden',
           message: errorData.error
         });
       } else {
         handleError(error, 'Pago no iniciado');
       }
     } finally {
       setLoading(false);
     }
   };

  if (loading && cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center py-32 sm:py-40">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="py-24 text-center sm:py-32 lg:py-40">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.34)] text-[var(--text-muted)]">
          <ShoppingBag size={36} />
        </div>
        <h2 className="mt-8 font-display text-4xl leading-none text-[var(--text-primary)] sm:text-5xl">
          Tu selección está vacía.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
          Cuando añadas piezas desde la colección, aparecerán aquí listas para pasar al checkout.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)]"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:space-y-12 lg:py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Selección privada</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-[var(--text-primary)] sm:text-6xl">
            {isCheckingOut ? 'Checkout' : 'Tu selección'}
          </h1>
        </div>
        {isCheckingOut && (
          <button
            onClick={() => setIsCheckingOut(false)}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
          >
            <ArrowLeft size={15} /> Volver al carrito
          </button>
        )}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          {!isCheckingOut ? (
            cart.items.map((item, index) => (
              <article
                key={item.id}
                className={`glass-panel animate-fade-up overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.74),rgba(255,248,236,0.52))] transition ${processingId === item.id ? 'opacity-60' : ''}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-[1.55rem] border border-[var(--border-soft)] bg-[var(--bg-elevated)] sm:h-28 sm:w-28">
                    <img src={item.product.image_url || PLACEHOLDER} alt={item.product.title} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-[2rem] leading-none text-[var(--text-primary)] sm:text-[2.2rem]">
                      {item.product.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">${item.product.price} por pieza</p>
                    <div className="mt-5 inline-flex items-center gap-4 rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-4 py-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={processingId === item.id} className="text-[var(--text-muted)] transition hover:text-[var(--accent)] disabled:opacity-40">
                        <Minus size={16} />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-[var(--text-primary)]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={processingId === item.id} className="text-[var(--text-muted)] transition hover:text-[var(--accent)] disabled:opacity-40">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                    <p className="font-display text-4xl leading-none text-[var(--text-primary)]">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} disabled={processingId === item.id} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] text-[var(--danger)] transition hover:border-[var(--danger)] disabled:opacity-40">
                      {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <section className="glass-panel animate-fade-up overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.74),rgba(255,248,236,0.52))] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3 text-[var(--text-primary)]">
                <MapPin size={18} className="text-[var(--accent)]" />
                <h2 className="font-display text-3xl leading-none text-[var(--text-primary)]">Datos de entrega</h2>
              </div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Dirección completa</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="5"
                className="w-full rounded-[1.6rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-5 py-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                placeholder="Calle, número, ciudad, referencia..."
              />

              <div className="mt-8 border-t border-[var(--border-soft)] pt-6">
                <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Método de pago</label>
                <div className="grid gap-3">
                 <label className={`flex cursor-pointer items-center gap-3 rounded-[1.4rem] border p-4 transition ${paymentMethod === 'card' ? 'border-[var(--accent)] bg-[rgba(215,161,74,0.1)]' : 'border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)]'}`}>
                   <input
                     type="radio"
                     name="paymentMethod"
                     value="card"
                     checked={paymentMethod === 'card'}
                     onChange={(e) => setPaymentMethod(e.target.value)}
                     className="hidden"
                   />
                   <CreditCard size={20} className={paymentMethod === 'card' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
                   <div className="flex-1">
                     <p className="text-sm font-semibold text-[var(--text-primary)]">Tarjeta de crédito/débito</p>
                     <p className="text-xs text-[var(--text-secondary)]">Serás redirigido a Mercado Pago para ingresar tus datos de tarjeta</p>
                   </div>
                 </label>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-[1.4rem] border p-4 transition ${paymentMethod === 'cash_on_delivery' ? 'border-[var(--accent)] bg-[rgba(215,161,74,0.1)]' : 'border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)]'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <DollarSign size={20} className={paymentMethod === 'cash_on_delivery' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Contra entrega</p>
                      <p className="text-xs text-[var(--text-secondary)]">Pagas cuando recibes el pedido</p>
                    </div>
                  </label>
                </div>

                <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Resumen del pedido</h3>
                <div className="mt-4 space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 text-sm text-[var(--text-secondary)]">
                      <span>{item.product.title} x {item.quantity}</span>
                      <span className="shrink-0 font-semibold text-[var(--text-primary)]">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="glass-panel animate-fade-up-delay h-fit overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[radial-gradient(circle_at_top_right,rgba(215,161,74,0.18),transparent_32%),linear-gradient(180deg,rgba(255,250,244,0.78),rgba(255,248,236,0.58))] p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--text-muted)]">Resumen</p>
          <h2 className="mt-4 font-display text-4xl leading-none text-[var(--text-primary)]">Totales</h2>

          <div className="mt-8 space-y-5 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[var(--text-primary)]">${safeTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-5">
              <span>Envío</span>
              <span className="text-[var(--success)]">Gratis</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)]">Total</span>
              <span className="font-display text-5xl leading-none text-[var(--text-primary)]">${safeTotal.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={() => (isCheckingOut ? handleCheckout() : setIsCheckingOut(true))} disabled={loading} className="mt-8 inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
            {isCheckingOut ? 'Confirmar y pagar' : 'Ir al checkout'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
