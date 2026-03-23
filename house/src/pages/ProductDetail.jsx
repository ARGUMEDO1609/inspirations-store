import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Globe, Loader2, ShieldCheck, ShoppingCart, Zap } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get('/products');
        const allProducts = response.data.data;
        const found = allProducts.find((p) => p.attributes.slug === slug);
        if (found) {
          setProduct({ ...found.attributes, id: found.id });
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await api.post('/cart_items', {
        product_id: product.id.toString(),
        quantity: 1
      });
      toast({
        type: 'success',
        title: 'Pieza añadida',
        message: `${product.title} se agregó a tu selección.`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.error || 'Debes iniciar sesión para añadir productos al carrito.';
      toast({
        type: 'error',
        title: 'Acción no disponible',
        message: errorMessage
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 sm:py-40">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center sm:py-32 lg:py-40">
        <h2 className="text-3xl font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)] sm:text-4xl">Pieza no encontrada</h2>
        <button onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[var(--accent)]">
          <ArrowLeft size={16} /> Volver a la colección
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:space-y-12 lg:py-14">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
      >
        <ArrowLeft size={15} /> Volver a la colección
      </button>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 xl:gap-12">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border-soft)] bg-[var(--bg-elevated)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,161,74,0.2),transparent_28%)]" />
          <img
            src={product.image_url || 'https://via.placeholder.com/800'}
            alt={product.title}
            className="relative aspect-[4/4.7] w-full object-cover"
          />
          <div className="absolute left-5 top-5 rounded-full border border-[var(--border-soft)] bg-[rgba(10,10,10,0.75)] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] backdrop-blur-md sm:left-6 sm:top-6">
            Archive Selection
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 rounded-[2.25rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
              <span>REF {product.slug?.toUpperCase()}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]"></span>
              <span>{product.stock} piezas</span>
            </div>

            <h1 className="mt-5 max-w-xl font-display text-5xl uppercase leading-[0.9] tracking-[0.08em] text-[var(--text-primary)] sm:text-6xl xl:text-7xl">
              {product.title}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-4 rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">Precio curado</p>
                <p className="mt-3 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">${product.price}</p>
              </div>
              <div className="text-sm leading-7 text-[var(--text-secondary)]">
                Pago seguro, actualización por webhook y seguimiento desde tu área privada.
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock <= 0}
              className="inline-flex min-h-[64px] w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              {adding ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
              {product.stock > 0 ? 'Añadir a selección' : 'Sin disponibilidad'}
            </button>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: 'Protección' },
                { icon: Zap, label: 'Respuesta rápida' },
                { icon: Globe, label: 'Entrega amplia' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4 sm:flex-col sm:items-start sm:gap-4">
                  <item.icon size={18} className="text-[var(--accent)]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
