import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import useActionCable from '../api/useActionCable';
import { useToast } from '../context/ToastContext';

const Hero = ({ filter, setFilter, sort, setSort, categories, productCount }) => {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,161,74,0.22),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-[var(--text-muted)]">
            <Sparkles size={14} className="text-[var(--accent)]" />
            Curated Storefront
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--text-muted)]">Colección viva 2026</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.88] tracking-[0.08em] text-[var(--text-primary)] sm:text-6xl lg:text-7xl xl:text-[6.4rem]">
              Objetos con presencia editorial.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Inspiration Store presenta piezas con lenguaje de galería: volúmenes limpios, materiales visuales y una compra que se siente más curada que comercial.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <button
              onClick={() => {
                setFilter('all');
                setSort('recent');
              }}
              className={`rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${filter === 'all' && sort !== 'popular' ? 'bg-[var(--accent)] text-[var(--ink)]' : 'border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:border-[var(--accent)]'}`}
            >
              Todas las piezas
            </button>
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <select
                onChange={(e) => setFilter(e.target.value)}
                value={filter === 'all' ? 'all' : filter}
                className="w-full appearance-none rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-5 py-3 pr-12 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)] outline-none transition hover:border-[var(--accent)]"
              >
                <option value="all">Curaduría por categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.attributes.name}>
                    {cat.attributes.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">▼</span>
            </div>
            <button
              onClick={() => setSort('popular')}
              className={`rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${sort === 'popular' ? 'bg-[var(--accent)] text-[var(--ink)]' : 'border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:border-[var(--accent)]'}`}
            >
              Más buscadas
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[1.75rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.04)] p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--text-muted)]">Estado de la tienda</p>
            <p className="mt-4 text-4xl font-semibold text-[var(--text-primary)]">{productCount}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Piezas activas en la colección actual.</p>
          </div>
          <div className="flex flex-col justify-between rounded-[1.75rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 sm:p-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--text-muted)]">Dirección visual</p>
              <h2 className="mt-4 text-2xl font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)]">Boutique de colección</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Menos marketplace. Más selección de piezas con identidad propia.
              </p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
              Explorar selección
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { toast } = useToast();

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
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', {
        params: {
          category: filter,
          sort: sort
        }
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setProcessingId(product.id);
      await api.post('/cart_items', {
        product_id: product.id.toString(),
        quantity: 1
      });
      toast({
        type: 'success',
        title: 'Pieza añadida',
        message: `${product.attributes.title} fue enviada a tu selección.`
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

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={item.attributes}
            isProcessing={processingId === item.id}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </section>
    </div>
  );
};

export default Gallery;
