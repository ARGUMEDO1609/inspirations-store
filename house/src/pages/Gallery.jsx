import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.post('/cart_items', { 
        product_id: product.id,
        quantity: 1 
      });
      alert('Añadido al carrito con éxito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Debes iniciar sesión para añadir productos al carrito.');
    }
  };

  if (loading) return <div className="flex justify-center items-center py-40"><Loader2 className="animate-spin text-amber-500 w-12 h-12" /></div>;

  return (
    <div className="py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4">Colección 2024</h2>
          <p className="text-slate-500 font-medium">Piezas seleccionadas por curadores internacionales.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-900 border border-slate-800 text-white px-8 py-3 rounded-2xl hover:bg-slate-800 font-bold transition">Todo</button>
          <button className="text-slate-500 px-8 py-3 rounded-2xl hover:text-white font-bold transition">Digital</button>
          <button className="text-slate-500 px-8 py-3 rounded-2xl hover:text-white font-bold transition">Físico</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map(item => (
          <ProductCard 
            key={item.id} 
            product={item.attributes} 
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
