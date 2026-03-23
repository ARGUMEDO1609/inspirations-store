import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import useActionCable from '../api/useActionCable';
import { useToast } from '../context/ToastContext';


const Hero = ({ filter, setFilter, sort, setSort, categories, featuredProduct }) => (
  <div className="relative h-[90vh] min-h-[700px] w-full overflow-hidden rounded-[60px] mb-32 group shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
    <img 
      src="/portada.png" 
      alt="Inspiration Store Hero" 
      className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[3000ms]"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/10 flex flex-col justify-end p-8 md:p-24">


      {/* BUTTON BAR INSIDE THE COVER */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-3 md:p-6 rounded-[40px] flex flex-wrap gap-4 items-center justify-center shadow-3xl">
        <button 
          onClick={() => { setFilter('all'); setSort('recent'); }}
          className={`${(filter === 'all' && sort !== 'popular') ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'} px-12 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500`}
        >
          Todo
        </button>
        
        <div className="relative group/select">
          <select 
            onChange={(e) => setFilter(e.target.value)}
            value={filter === 'all' ? 'all' : filter}
            className={`${(filter !== 'all') ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'} border-none px-12 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 outline-none appearance-none cursor-pointer pr-16`}
          >
            <option value="all" disabled={filter !== 'all'}>Categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.attributes.name} className="bg-slate-950 text-white">
                {cat.attributes.name}
              </option>
            ))}
          </select>
          <div className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition duration-500 ${filter !== 'all' ? 'text-black' : 'text-slate-500 group-hover/select:text-white'}`}>
            ▼
          </div>
        </div>

        <button 
          onClick={() => setSort('popular')}
          className={`${sort === 'popular' ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'} px-12 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap`}
        >
          🔥 Más Frecuentes
        </button>
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
    PRODUCT_CHANGE: (data) => {
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
        title: '¡Listo!',
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

  if (loading && products.length === 0) return <div className="flex justify-center items-center py-40"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>;

  return (
    <div className="py-20">
      <Hero 
        filter={filter} 
        setFilter={setFilter} 
        sort={sort} 
        setSort={setSort} 
        categories={categories}
        featuredProduct={products[0]} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map(item => (
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
