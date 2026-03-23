import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import useActionCable from '../api/useActionCable';
import { useToast } from '../context/ToastContext';

const Hero = ({ filter, setFilter, sort, setSort, categories, productCount }) => {
  return (
    <section className="relative min-h-[560px] overflow-hidden rounded-[2.25rem] border border-[var(--border-soft)] bg-[var(--bg-elevated)] sm:min-h-[640px] lg:min-h-[720px]">
      <img
        src="/portada.png"
        alt="Portada de Inspiration Store"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.04),rgba(41,29,20,0.18)_42%,rgba(41,29,20,0.34))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,161,74,0.18),transparent_38%)]" />

      <div className="relative flex min-h-[560px] flex-col justify-end p-4 sm:min-h-[640px] sm:p-6 lg:min-h-[720px] lg:p-8 xl:p-10">
        <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div className="glass-panel animate-fade-up rounded-[1.7rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-4 sm:p-5 lg:p-6">
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="glass-panel animate-fade-up-delay rounded-[1.65rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-5">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--text-secondary)]">Estado de la tienda</p>
              <p className="mt-3 font-display text-5xl leading-none text-[var(--text-primary)]">{productCount}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]">Piezas activas en la colección actual.</p>
            </div>
            <div className="glass-panel animate-fade-up-slow flex flex-col justify-between rounded-[1.65rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-5">
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
