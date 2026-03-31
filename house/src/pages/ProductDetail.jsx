import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Globe, Loader2, ShieldCheck, ShoppingCart, Zap } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/useToast';
import useApiError from '../hooks/useApiError';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect fill='%23f5f0e8' width='800' height='800'/%3E%3Ctext fill='%23a99' font-family='sans-serif' font-size='32' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

const assuranceItems = [
  {
    icon: ShieldCheck,
    label: 'Compra protegida',
    description: 'Pago validado y estado sincronizado con tu pedido.'
  },
  {
    icon: Zap,
    label: 'Gestión ágil',
    description: 'Actualizaciones rápidas desde tu área privada.'
  },
  {
    icon: Globe,
    label: 'Cobertura amplia',
    description: 'Preparada para envíos con seguimiento claro.'
  }
];

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const { handleError } = useApiError();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get('/products');
        const productsData = response.data.data;
        const allProducts = Array.isArray(productsData) ? productsData : productsData?.data || [];
        const found = allProducts.find((p) => p.attributes.slug === slug);
        if (found) {
          setProduct({ ...found.attributes, id: found.id });
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        handleError(error, 'Error cargando producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, handleError]);

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
        message: `${product.title} fue enviada a tu selección.`
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
        <h2 className="font-display text-4xl leading-none text-[var(--text-primary)] sm:text-5xl">Pieza no encontrada</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[var(--accent)]"
        >
          <ArrowLeft size={16} /> Volver a la colección
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:space-y-12 lg:py-14">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
      >
        <ArrowLeft size={15} /> Volver a la colección
      </button>

      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 xl:gap-12">
        <div className="glass-panel animate-fade-up relative overflow-hidden rounded-[2.35rem] border border-[var(--border-soft)] bg-[var(--bg-elevated)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,161,74,0.22),transparent_28%)]" />
          <img
            src={product.image_url || PLACEHOLDER}
            alt={product.title}
            className="relative aspect-[4/4.7] w-full object-cover"
          />
          <div className="absolute left-5 top-5 rounded-full border border-[rgba(255,248,236,0.24)] bg-[rgba(46,31,19,0.52)] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#fff1da] backdrop-blur-md sm:left-6 sm:top-6">
            Selección actual
          </div>
        </div>

        <div className="glass-panel animate-fade-up-delay flex flex-col justify-between gap-8 rounded-[2.35rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.74),rgba(255,248,236,0.56))] p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
              <span>REF {product.slug?.toUpperCase()}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]"></span>
              <span>{product.stock} piezas</span>
            </div>

            <h1 className="mt-5 max-w-xl font-display text-5xl leading-[0.92] text-[var(--text-primary)] text-balance sm:text-6xl xl:text-7xl">
              {product.title}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              {product.description}
            </p>

            <div className="mt-8 rounded-[1.8rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Precio de colección</p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="font-display text-5xl leading-none text-[var(--text-primary)] sm:text-6xl">${product.price}</p>
                <p className="max-w-xs text-sm leading-7 text-[var(--text-secondary)]">
                  Pago seguro, confirmación por webhook y seguimiento desde tu cuenta.
                </p>
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
              {assuranceItems.map((item) => (
                <div
                  key={item.label}
                  className="glass-panel rounded-[1.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.34)] p-4"
                >
                  <item.icon size={18} className="text-[var(--accent)]" />
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
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
