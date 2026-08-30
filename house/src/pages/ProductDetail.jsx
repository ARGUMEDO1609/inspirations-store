import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Globe, Loader2, ShieldCheck, ShoppingCart, Zap, Box } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import useApiError from '../hooks/useApiError';
import { formatCOP } from '../utils/formatCurrency';
import { ProductDetailSkeleton } from '../components/Skeleton';

const Product3DViewer = lazy(() => import('../components/Product3DViewer').then(m => ({ default: m.default })));

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

const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.08 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.06 }
  }
};

const panelVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' }
  }
};

const assuranceCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' }
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { handleError } = useApiError();
  const selectedVariant = product?.variants?.find((variant) => variant.id === selectedSize);
  const availableStock = product?.has_variants
    ? (selectedVariant?.stock ?? (product.variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0))
    : Number(product?.stock || 0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data.attributes);
      } catch (error) {
        handleError(error, 'Error cargando producto');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, handleError]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      toast({
        type: 'error',
        title: 'Acción no disponible',
        message: 'Debes iniciar sesión para añadir productos al carrito.'
      });
      navigate('/login');
      return;
    }

    if (product.has_variants && !selectedSize) {
      toast({ type: 'error', title: 'Selecciona una talla', message: 'Elige tu talla antes de añadir.' });
      return;
    }

    if (availableStock <= 0) {
      toast({ type: 'error', title: 'Sin disponibilidad', message: 'Esta opción está agotada.' });
      return;
    }

    setAdding(true);
    try {
      await api.post('/cart_items', {
        product_id: product.id.toString(),
        quantity: 1,
        variant_id: selectedSize || null
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
    return <ProductDetailSkeleton />;
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
    <Motion.div className="space-y-7 py-7 sm:space-y-9 sm:py-9 lg:space-y-10 lg:py-12" initial="hidden" animate="visible" variants={pageVariants}>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
      >
        <ArrowLeft size={15} /> Volver a la colección
      </button>

      <Motion.section className="grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-9 xl:gap-10" variants={sectionVariants}>
        <Motion.div className="glass-panel relative overflow-hidden rounded-[2.1rem] border border-[var(--border-soft)] bg-[var(--bg-elevated)]" variants={panelVariants}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,161,74,0.22),transparent_28%)]" />
          
          {show3D && product?.model_url ? (
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center glass-panel"><Loader2 className="h-12 w-12 animate-spin text-[var(--accent)]" /></div>}>
              <Product3DViewer 
                modelUrl={product.model_url}
                fallbackImage={product.image_url}
                className="w-full h-full min-h-[500px]"
                rotation={[0, -0.3, 0]}
                scale={1.2}
              />
            </Suspense>
          ) : (
            <>
              <Motion.img
                src={product.image_url || PLACEHOLDER}
                alt={product.title}
                className="relative aspect-[4/4.55] w-full object-cover"
                initial={{ scale: 1.02 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                onError={(event) => { event.currentTarget.src = PLACEHOLDER; }}
              />
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => setShow3D(!show3D)}
                  className="glass-panel rounded-full p-2 shadow-lg hover:bg-[rgba(255,255,255,0.5)] transition"
                  aria-label={show3D ? 'Ver imagen' : 'Ver en 3D'}
                >
                  <Box size={20} className="text-[var(--accent)]" />
                </button>
              </div>
            </>
          )}
          <div className="absolute left-4 top-4 rounded-full border border-[rgba(255,248,236,0.24)] bg-[rgba(46,31,19,0.52)] px-3 py-1.5 text-[9px] uppercase tracking-[0.28em] text-[#fff1da] backdrop-blur-md sm:left-5 sm:top-5 sm:text-[10px]">
            Selección actual
          </div>
        </Motion.div>

        <Motion.div
          className="glass-panel flex flex-col justify-between gap-7 rounded-[2.1rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.74),rgba(255,248,236,0.56))] p-5 sm:p-7 lg:p-8"
          variants={panelVariants}
        >
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
              <span>REF {product.id}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]"></span>
              <span>{availableStock} piezas</span>
            </div>

            <h1 className="mt-4 max-w-xl font-display text-[2.8rem] leading-[0.94] text-[var(--text-primary)] text-balance sm:text-5xl xl:text-[4.25rem]">
              {product.title}
            </h1>

            <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-[var(--text-secondary)] sm:text-base">
              {product.description}
            </p>

            {product.variants?.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)] mb-3">Selecciona talla</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const variantStock = Number(variant.stock || 0);
                    const isSoldOut = variantStock <= 0;

                    return (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedSize(variant.id);
                      }}
                      disabled={isSoldOut}
                      className={`rounded-full border px-4 py-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.16em] transition ${
                        selectedSize === variant.id
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]'
                          : 'border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] text-[var(--text-primary)] hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-45'
                      }`}
                    >
                      {isSoldOut ? `${variant.name} agotada` : variant.name}
                    </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-7 rounded-[1.6rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">Precio de colección</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <p className="font-display text-[2.65rem] leading-none text-[var(--text-primary)] sm:text-5xl">{formatCOP(product.price)}</p>
                <p className="max-w-xs text-[0.9rem] leading-6 text-[var(--text-secondary)]">
                  Pago seguro, confirmación por webhook y seguimiento desde tu cuenta.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <button
              onClick={handleAddToCart}
              disabled={adding || availableStock <= 0 || (product.has_variants && !selectedSize)}
              className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              {adding ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
              {availableStock > 0 ? 'Añadir a selección' : 'Sin disponibilidad'}
            </button>

            <Motion.div className="grid gap-2.5 sm:grid-cols-3" variants={sectionVariants}>
              {assuranceItems.map((item) => (
                <Motion.div
                  key={item.label}
                  className="glass-panel rounded-[1.35rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.34)] p-3.5"
                  variants={assuranceCardVariants}
                >
                  <item.icon size={17} className="text-[var(--accent)]" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">{item.label}</p>
                  <p className="mt-1.5 text-[0.88rem] leading-6 text-[var(--text-secondary)]">{item.description}</p>
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </Motion.div>
      </Motion.section>
    </Motion.div>
  );
};

export default ProductDetail;
