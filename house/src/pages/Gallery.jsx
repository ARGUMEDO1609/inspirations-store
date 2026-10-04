import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { GallerySkeleton } from '../components/Skeleton';
import useActionCable from '../api/useActionCable';
import { useToast } from '../context/ToastContext';
import useApiError from '../hooks/useApiError';
import { useCartNotification } from '../context/CartNotificationContext';
import { useCartCount } from '../context/CartCountContext';
import { useAuth } from '../context/AuthContext';

const HeroSection = styled(motion.section)`
  position: relative;
  min-height: 590px;
  overflow: hidden;
  border-radius: 0.25rem;
  background: #ded3c5;
  isolation: isolate;
  @media (min-width: 640px) {
    min-height: 650px;
  }
  @media (min-width: 1024px) {
    min-height: 700px;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(24, 22, 18, 0.76) 0%, rgba(24, 22, 18, 0.55) 42%, rgba(24, 22, 18, 0.05) 100%);
  pointer-events: none;
`;

const HeroGlow = styled.div`
  display: none;
`;

const heroSectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.12
    }
  }
};

const heroColumnVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const heroCardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' }
  }
};

const gridVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.04,
      delayChildren: 0.2
    }
  }
};

const Hero = ({ filter, setFilter, sort, setSort, categories, productCount, searchTerm, setSearchTerm }) => {
  return (
    <HeroSection
      id="coleccion-semanal"
      className="scroll-mt-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={heroSectionVariants}
    >
      <HeroImage src="/portada.png" alt="Portada de Inspiration Store" />
      <HeroGradient />
      <HeroGlow />

      <div className="relative flex min-h-[590px] flex-col justify-end p-5 text-white sm:min-h-[650px] sm:p-10 lg:min-h-[700px] lg:p-16">
        <motion.div className="grid max-w-2xl gap-8" variants={heroColumnVariants}>
          <motion.div className="max-w-xl" variants={heroCardVariants}>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/75">Objetos para hacer tuyo el espacio</p>
            <h1 className="mt-5 font-display text-6xl leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">Piezas con historia. Espacios con vida.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/80 sm:text-base">Una selección pequeña de objetos que vale la pena conservar.</p>
            <a href="#piezas-destacadas" className="mt-7 inline-flex items-center gap-3 border-b border-white/70 pb-2 text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-white">
              Explorar la colección <ArrowRight size={15} />
            </a>
          </motion.div>

          <motion.div
            className="max-w-2xl border-t border-white/35 pt-5"
            variants={heroCardVariants}
          >
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                <input
                  type="text"
                  placeholder="Buscar piezas exclusivas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-b border-white/50 bg-transparent py-3 pl-12 pr-6 text-sm text-white outline-none placeholder:text-white/65 focus:border-white"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => {
                    setFilter('all');
                    setSort('recent');
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${filter === 'all' && sort !== 'popular' && !searchTerm ? 'bg-white text-[var(--text-primary)]' : 'border border-white/45 bg-transparent text-white hover:bg-white/10'}`}
                >
                  Todas las piezas
                </button>
                <div className="relative min-w-[220px] flex-1 sm:flex-none">
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter === 'all' ? 'all' : filter}
                    className="w-full appearance-none border border-white/45 bg-[#39352f]/75 px-4 py-2.5 pr-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-white outline-none transition hover:border-white"
                  >
                    <option value="all">Vista por categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.attributes.name} className="text-black">
                        {cat.attributes.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white">▼</span>
                </div>
                <button
                  onClick={() => setSort('popular')}
                  className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${sort === 'popular' ? 'bg-white text-[var(--text-primary)]' : 'border border-white/45 bg-transparent text-white hover:bg-white/10'}`}
                >
                  Más buscadas
                </button>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </HeroSection>
  );
};

const Gallery = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [productsError, setProductsError] = useState(null);
  const { toast } = useToast();
  const { handleError } = useApiError();
  const { notifyCart } = useCartNotification();
  const { refreshCartCount } = useCartCount();
  const { user } = useAuth();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      const categoriesData = response.data.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      handleError(error, 'Error cargando categorías');
    }
  }, [handleError]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProductsError(null);
      
      const params = {
        category: filter,
        sort: sort,
        'q[title_cont]': searchTerm
      };

      const response = await api.get('/products', { params });
      const productsData = response.data.data;
      setProducts(Array.isArray(productsData) ? productsData : productsData?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      const message = handleError(error, 'Error cargando productos');
      setProductsError(message);
    } finally {
      setLoading(false);
    }
  }, [filter, sort, searchTerm, handleError]);

  const storeHandlers = useMemo(
    () => ({
      PRODUCT_CHANGE: fetchProducts
    }),
    [fetchProducts]
  );

  // The WebSocket token is issued only to authenticated users. Avoid opening
  // a connection for visitors, which otherwise produces a 401 and could
  // trigger a full-page navigation while Home is loading.
  useActionCable('StoreChannel', storeHandlers, Boolean(user));

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

   const handleAddToCart = async (product) => {
    const productData = product.attributes || product;
    const productId = product.id || productData.id;
    const availableStock = productData.has_variants
      ? (productData.variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0)
      : Number(productData.stock || 0);

    if (!user) {
      toast({
        type: 'error',
        title: 'Acción no disponible',
        message: 'Debes iniciar sesión para añadir productos al carrito.'
      });
      navigate('/login');
      return;
    }

    if (availableStock <= 0) {
      toast({
        type: 'error',
        title: 'Sin disponibilidad',
        message: 'Este producto está agotado.'
      });
      return;
    }

    if (productData.has_variants) {
      toast({
        type: 'info',
        title: 'Selecciona una talla',
        message: 'Este producto requiere elegir una variante antes de añadirlo.'
      });
      navigate(`/product/${productId}`);
      return;
    }

    try {
      setProcessingId(productId);
      await api.post('/cart_items', {
        product_id: productId,
        quantity: 1
      });
        toast({
          type: 'success',
          title: 'Producto añadido',
          message: `${productData.title} fue enviada a tu selección.`
        });
        notifyCart(`${productData.title} se agregó al carrito.`, 'success');
        refreshCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.error || 'Debes iniciar sesión para añadir productos al carrito.';
      toast({
        type: 'error',
        title: 'Acción no disponible',
        message: errorMessage
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && products.length === 0) {
    return <GallerySkeleton />;
  }

  const showEmptyState = !loading && products.length === 0;
  const emptyMessage =
    productsError || 'Los productos no pudieron cargarse. Reintenta en unos segundos.';

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:space-y-12 lg:py-12">
      <Hero
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        categories={categories}
        productCount={products.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {showEmptyState ? (
        <motion.section
          className="glass-panel rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.32)] p-10 text-center text-sm text-[var(--text-secondary)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-base font-semibold text-[var(--text-primary)]">{emptyMessage}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Revisa tu conexión o intenta cargar los productos en unos segundos.
          </p>
          <button
            onClick={fetchProducts}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--accent)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink)] transition hover:bg-[var(--accent)] hover:text-[var(--surface-primary)]"
          >
            Reintentar carga
          </button>
        </motion.section>
      ) : (
        <motion.section
          id="piezas-destacadas"
          className="scroll-mt-28 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-15% 0px -25% 0px' }}
          variants={gridVariants}
        >
          <AnimatePresence mode="popLayout">
            {products.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item.attributes}
                isProcessing={processingId === item.id}
                onAddToCart={() => handleAddToCart(item)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.section>
      )}
    </div>
  );
};

export default Gallery;
