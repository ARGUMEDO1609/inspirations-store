import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import useActionCable from '../api/useActionCable';
import { useToast } from '../context/ToastContext';

const Hero = ({ filter, setFilter, sort, setSort, categories }) => (
  <div className="group relative mb-16 w-full overflow-hidden rounded-[28px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] sm:mb-24 sm:rounded-[40px] lg:mb-32 lg:rounded-[60px]">
    <div className="relative min-h-[420px] sm:min-h-[520px] lg:h-[90vh] lg:min-h-[700px]">
      <img
        src="/portada.png"
        alt="Inspiration Store Hero"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[3000ms] group-hover:scale-105 lg:scale-105 lg:group-hover:scale-110"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/10 p-5 sm:p-8 lg:p-16 xl:p-24">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-3xl backdrop-blur-3xl sm:rounded-[32px] sm:p-5 lg:rounded-[40px] lg:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-4">
            <button
              onClick={() => {
                setFilter('all');
                setSort('recent');
              }}
              className={`${filter === 'all' && sort !== 'popular' ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'} rounded-[20px] px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 sm:px-8 lg:px-12 lg:py-4 lg:rounded-[24px]`}
            >
              Todo
            </button>

            <div className="relative w-full md:w-auto group/select">
              <select
                onChange={(e) => setFilter(e.target.value)}
                value={filter === 'all' ? 'all' : filter}
                className={`${filter !== 'all' ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'} w-full cursor-pointer appearance-none rounded-[20px] border-none px-5 py-3 pr-12 text-[11px] font-black uppercase tracking-[0.2em] outline-none transition-all duration-500 sm:px-8 lg:px-12 lg:py-4 lg:pr-16 lg:rounded-[24px] md:min-w-[220px]`}
              >
                <option value="all" disabled={filter !== 'all'}>Categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.attributes.name} className="bg-slate-950 text-white">
                    {cat.attributes.name}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 transition duration-500 lg:right-6 ${filter !== 'all' ? 'text-black' : 'text-slate-500 group-hover/select:text-white'}`}>
                ▼
              </div>
            </div>

            <button
              onClick={() => setSort('popular')}
              className={`${sort === 'popular' ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'} whitespace-nowrap rounded-[20px] px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 sm:px-8 lg:px-12 lg:py-4 lg:rounded-[24px]`}
            >
              Mas frecuentes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
        title: 'Listo',
        message: `${product.attributes.title} ha sido añadido al carrito.`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.error || 'Debes iniciar sesión para añadir productos al carrito.';
      toast({
        type: 'error',
        title: 'Atención',
        message: errorMessage
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-32 sm:py-40">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14 lg:py-20">
      <Hero
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        categories={categories}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 xl:gap-12">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={item.attributes}
            isProcessing={processingId === item.id}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
