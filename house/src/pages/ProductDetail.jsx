import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ShoppingCart, ArrowLeft, Loader2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get('/products');
        const allProducts = response.data.data;
        const found = allProducts.find((p) => p.attributes.slug === slug);
        if (found) {
          setProduct({ ...found.attributes, id: found.id });
        } else {
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
        product_id: product.id.toString(),
        quantity: 1
      });
      toast({
        type: 'success',
        title: 'Excelente elección',
        message: `${product.title} se ha añadido a tu selección.`
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
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 sm:py-40">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center sm:py-32 lg:py-40">
        <h2 className="mb-6 text-3xl font-black tracking-tighter text-white sm:text-4xl lg:text-5xl">Producto no encontrado</h2>
        <button
          onClick={() => navigate('/')}
          className="mx-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-500"
        >
          <ArrowLeft size={16} /> Volver a la galería
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 py-10 duration-1000 sm:py-14 lg:py-20">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:text-white sm:mb-12 sm:text-xs"
      >
        <ArrowLeft size={14} /> Volver
      </button>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-amber-500 to-amber-900 opacity-25 blur transition duration-1000 group-hover:opacity-50 sm:rounded-[40px]"></div>
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 sm:rounded-[40px]">
            <img
              src={product.image_url || 'https://via.placeholder.com/800'}
              alt={product.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
              <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 backdrop-blur-md sm:px-4">
                Inspo Edition
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-black text-amber-500 sm:mb-8 sm:text-sm">
            <span>REF: {product.slug?.toUpperCase()}</span>
            <span className="h-1 w-1 rounded-full bg-slate-800"></span>
            <span>STOCK: {product.stock}</span>
          </div>

          <h1 className="mb-6 text-4xl font-black leading-none tracking-tighter text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {product.title}
          </h1>

          <p className="mb-8 text-lg leading-relaxed text-slate-400 sm:mb-10 sm:text-xl lg:mb-12 lg:text-2xl">
            {product.description}
          </p>

          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
            <span className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">${product.price}</span>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Pagos seguros</span>
              <div className="flex gap-2">
                <div className="h-5 w-8 rounded-sm border border-slate-800 bg-slate-900"></div>
                <div className="h-5 w-8 rounded-sm border border-slate-800 bg-slate-900"></div>
                <div className="h-5 w-8 rounded-sm border border-slate-800 bg-slate-900"></div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="flex min-h-[64px] w-full items-center justify-center gap-3 rounded-[18px] bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition-all duration-300 hover:scale-[1.01] hover:bg-amber-500 active:scale-95 disabled:opacity-50 disabled:hover:bg-white sm:min-h-[72px] sm:text-base lg:h-20 lg:rounded-[20px]"
          >
            {adding ? (
              <Loader2 className="animate-spin" />
            ) : product.stock > 0 ? (
              <>
                <ShoppingCart size={20} />
                Añadir al carrito
              </>
            ) : (
              'Agotado'
            )}
          </button>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 lg:mt-12">
            {[
              { icon: ShieldCheck, label: 'Protección' },
              { icon: Zap, label: 'Express' },
              { icon: Globe, label: 'Global' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-col sm:justify-center sm:gap-3 sm:p-6">
                <item.icon className="text-amber-500" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
