import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import useActionCable from '../api/useActionCable';
import { useToast } from '../context/useToast';
import useApiError from '../hooks/useApiError';
import { useCartNotification } from '../context/CartNotificationContext';
import { useCartCount } from '../context/CartCountContext';

const HeroSection = styled(motion.section)`
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border-radius: 2.25rem;
  border: 1px solid rgba(116, 88, 54, 0.14);
  background: var(--bg-elevated);
  isolation: isolate;
  @media (min-width: 640px) {
    min-height: 640px;
  }
  @media (min-width: 1024px) {
    min-height: 720px;
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
  background: linear-gradient(180deg, rgba(255, 250, 244, 0.04), rgba(41, 29, 20, 0.18) 42%, rgba(41, 29, 20, 0.34));
  pointer-events: none;
`;

const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(215, 161, 74, 0.18), transparent 38%);
  mix-blend-mode: screen;
  pointer-events: none;
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

const Hero = ({ filter, setFilter, sort, setSort, categories, productCount }) => {
  return (
    <HeroSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={heroSectionVariants}
    >
      <HeroImage src="/portada.png" alt="Portada de Inspiration Store" />
      <HeroGradient />
      <HeroGlow />

      <div className="relative flex min-h-[560px] flex-col justify-end p-4 sm:min-h-[640px] sm:p-6 lg:min-h-[720px] lg:p-8 xl:p-10">
        <motion.div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr] xl:items-end" variants={heroColumnVariants}>
          <motion.div
            className="glass-panel rounded-[1.7rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-4 sm:p-5 lg:p-6"
            variants={heroCardVariants}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => {
                  setFilter('all');
                  setSort('recent');
                }}
                className={`rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${filter === 'all' && sort !== 'popular' ? 'bg-[var(--accent)] text-[var(--ink)] shadow-[0_14px_30px_rgba(215,161,74,0.2)]' : 'border border-[rgba(116,88,54,0.14)] bg-[rgba(255,255,255,0.38)] text-[var(--text-primary)] hover:border-[var(--accent)]'}`}
              >
                Todas las piezas
              </button>
              <div className="relative min-w-[220px] flex-1 sm:flex-none">
                <select
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter === 'all' ? 'all' : filter}
                  className="w-full appearance-none rounded-full border border-[rgba(116,88,54,0.14)] bg-[rgba(255,255,255,0.38)] px-5 py-3 pr-12 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)] outline-none transition hover:border-[var(--accent)]"
                >
                  <option value="all">Curaduría por categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.attributes.name} className="text-black">
                      {cat.attributes.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">▼</span>
              </div>
              <button
                onClick={() => setSort('popular')}
                className={`rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${sort === 'popular' ? 'bg-[var(--accent)] text-[var(--ink)] shadow-[0_14px_30px_rgba(215,161,74,0.2)]' : 'border border-[rgba(116,88,54,0.14)] bg-[rgba(255,255,255,0.38)] text-[var(--text-primary)] hover:border-[var(--accent)]'}`}
              >
                Más buscadas
              </button>
            </div>
          </motion.div>

          <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1" variants={heroColumnVariants}>
            <motion.div
              className="glass-panel rounded-[1.65rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-5"
              variants={heroCardVariants}
            >
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--text-secondary)]">Estado de la tienda</p>
              <p className="mt-3 font-display text-5xl leading-none text-[var(--text-primary)]">{productCount}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">Piezas activas en la colección actual.</p>
            </motion.div>
            <motion.div
              className="glass-panel flex flex-col justify-between rounded-[1.65rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-5"
              variants={heroCardVariants}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--text-secondary)]">Dirección visual</p>
                <h2 className="mt-3 font-display text-[2.2rem] leading-none text-[var(--text-primary)]">Boutique de colección</h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--text-primary)] text-balance">
                  Menos marketplace. Más selección de piezas con carácter propio.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                Explorar selección
                <ArrowRight size={15} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </HeroSection>
  );
};

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [productsError, setProductsError] = useState(null);
  const { toast } = useToast();
  const { handleError } = useApiError();
  const { notifyCart } = useCartNotification();
  const { refreshCartCount } = useCartCount();

  useActionCable('StoreChannel', {
    PRODUCT_CHANGE: () => {
      fetchProducts();
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filter, sort]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const categoriesData = response.data.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      handleError(error, 'Error cargando categorías');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setProductsError(null);
      const response = await api.get('/products', {
        params: {
          category: filter,
          sort: sort
        }
      });
      const productsData = response.data.data;
      setProducts(Array.isArray(productsData) ? productsData : productsData?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      const message = handleError(error, 'Error cargando productos');
      setProductsError(message);
    } finally {
      setLoading(false);
    }
  };

   const handleAddToCart = async (product) => {
    try {
      setProcessingId(product.id);
      await api.post('/cart_items', {
        product_id: product.id,
        quantity: 1
      });
        toast({
          type: 'success',
          title: 'Pieza añadida',
          message: `${product.attributes.title} fue enviada a tu selección.`
        });
        notifyCart(`${product.attributes.title} se agregó al carrito.`, 'success');
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
    return (
      <div className="flex items-center justify-center py-32 sm:py-40">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  const showEmptyState = !loading && products.length === 0;
  const emptyMessage =
    productsError || 'La colección no pudo cargarse. Reintenta en unos segundos.';

  return (
    <div className="space-y-10 py-8 sm:space-y-12 sm:py-10 lg:space-y-14 lg:py-14">
      <Hero
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        categories={categories}
        productCount={products.length}
      />

      {showEmptyState ? (
        <motion.section
          className="glass-panel rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.32)] p-10 text-center text-sm text-[var(--text-secondary)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-base font-semibold text-[var(--text-primary)]">{emptyMessage}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Revisa tu conexión o intenta cargar la colección en unos segundos.
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
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-15% 0px -25% 0px' }}
          variants={gridVariants}
        >
          {products.map((item, index) => (
            <ProductCard
              key={item.id}
              product={item.attributes}
              isProcessing={processingId === item.id}
              onAddToCart={() => handleAddToCart(item)}
              index={index}
            />
          ))}
        </motion.section>
      )}
    </div>
  );
};

export default Gallery;
