import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ShoppingCart, ArrowLeft, Loader2, ShieldCheck, Zap, Globe } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products`);
        // Since we are using slugs and the API might not have a find_by_slug endpoint yet,
        // we'll filter from the list or assume the ID is expected.
        // Looking at the console error, it's trying "/product/caos-estelar".
        // Let's check if the API supports show by ID or slug.
        // For now, let's try to find it in the index or assume a show endpoint.
        const allProducts = response.data.data;
        const found = allProducts.find(p => p.attributes.slug === slug);
        if (found) {
          setProduct(found.attributes);
        } else {
          // If not found in index, maybe try literal show?
          // But show usually expects ID.
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await api.post('/cart_items', { 
        product_id: product.id,
        quantity: 1 
      });
      alert('Añadido al carrito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Inicia sesión para comprar');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
    </div>
  );

  if (!product) return (
    <div className="py-40 text-center">
      <h2 className="text-3xl font-black text-white italic mb-8 uppercase tracking-tighter">Producto no encontrado</h2>
      <button 
        onClick={() => navigate('/')}
        className="text-amber-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 mx-auto"
      >
        <ArrowLeft size={16} /> Volver a la galería
      </button>
    </div>
  );

  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <button 
        onClick={() => navigate('/')}
        className="text-slate-500 hover:text-white mb-12 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition"
      >
        <ArrowLeft size={14} /> Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Visual Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-900 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative aspect-square bg-slate-900 rounded-[40px] overflow-hidden border border-slate-800">
            <img 
              src={product.image_url || 'https://via.placeholder.com/800'} 
              alt={product.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute top-8 left-8">
              <span className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                Inspo Edition
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col">
          <div className="mb-8 font-mono text-amber-500 text-sm font-black flex items-center gap-4">
             <span>REF: {product.slug?.toUpperCase()}</span>
             <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
             <span>STOCK: {product.stock}</span>
          </div>
          
          <h1 className="text-7xl font-black text-white italic tracking-tighter leading-[0.8] mb-8 uppercase">
            {product.title}
          </h1>
          
          <p className="text-2xl text-slate-400 font-medium leading-relaxed mb-12 lowercase italic tracking-tight">
            {product.description}
          </p>

          <div className="flex items-center gap-8 mb-12">
            <span className="text-6xl font-black text-white italic tracking-tighter">
              ${product.price}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Pagos Seguros</span>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-slate-900 rounded-sm border border-slate-800"></div>
                <div className="w-8 h-5 bg-slate-900 rounded-sm border border-slate-800"></div>
                <div className="w-8 h-5 bg-slate-900 rounded-sm border border-slate-800"></div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="w-full bg-white text-slate-950 h-20 rounded-[20px] font-black text-sm uppercase tracking-[0.3em] hover:bg-amber-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50 disabled:hover:bg-white"
          >
            {adding ? (
              <Loader2 className="animate-spin" />
            ) : product.stock > 0 ? (
              <>
                <ShoppingCart size={20} />
                Añadir al Carrito
              </>
            ) : (
              'Agotado'
            )}
          </button>

          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { icon: ShieldCheck, label: 'Protección' },
              { icon: Zap, label: 'Express' },
              { icon: Globe, label: 'Global' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col items-center gap-3">
                <item.icon className="text-amber-500" size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
