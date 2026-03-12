import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import useActionCable from '../api/useActionCable';
import { useToast } from '../context/ToastContext';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { toast } = useToast();

  // Manejar cambios en tiempo real desde Rails
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
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4">Colección 2024</h2>
          <p className="text-slate-500 font-medium">Explora el arte por categorías.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => { setFilter('all'); setSort('recent'); }}
            className={`${(filter === 'all' && sort !== 'popular') ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'} border border-slate-800 px-8 py-3 rounded-2xl hover:bg-slate-800 font-bold transition`}
          >
            Todo
          </button>
          
          <div className="relative">
            <select 
              onChange={(e) => setFilter(e.target.value)}
              value={filter === 'all' ? 'all' : filter}
              className={`${(filter !== 'all') ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'} border border-slate-800 px-8 py-3 rounded-2xl font-bold transition outline-none appearance-none cursor-pointer pr-10`}
            >
              <option value="all" disabled={filter !== 'all'}>Categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.attributes.name} className="bg-slate-900 text-white">
                  {cat.attributes.name}
                </option>
              ))}
            </select>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${filter !== 'all' ? 'text-black' : 'text-slate-500'}`}>
              ▼
            </div>
          </div>

          <button 
            onClick={() => setSort('popular')}
            className={`${sort === 'popular' ? 'bg-amber-500 text-black' : 'text-slate-500 border border-slate-800'} px-8 py-3 rounded-2xl hover:text-white font-bold transition whitespace-nowrap`}
          >
            🔥 Más Populares
          </button>
        </div>
      </div>

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
