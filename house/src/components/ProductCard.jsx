import React from 'react';
import { ShoppingCart, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, isProcessing }) => {
  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:border-amber-500/50 sm:rounded-[40px] sm:hover:-translate-y-4">
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        <div className="absolute right-0 top-0 h-24 w-24 bg-amber-500/5 blur-3xl transition duration-1000 group-hover:bg-amber-500/10 sm:h-32 sm:w-32"></div>

        <img
          src={product.image_url || 'https://via.placeholder.com/600'}
          alt={product.title}
          className="h-full w-full object-cover opacity-60 transition duration-1000 group-hover:scale-110 group-hover:opacity-100"
        />

        <div className={`absolute inset-0 flex items-center justify-center gap-4 bg-slate-950/40 px-4 transition-opacity duration-500 sm:gap-6 ${isProcessing ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}>
          <Link
            to={`/product/${product.slug}`}
            className={`rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-slate-950 sm:p-4 ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <Eye size={20} className="sm:h-6 sm:w-6" />
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isProcessing}
            className={`flex min-w-[48px] items-center justify-center rounded-full bg-amber-600 p-3 text-white shadow-2xl shadow-amber-900/40 transition-all duration-300 hover:bg-amber-500 hover:scale-105 sm:min-w-[56px] sm:p-4 sm:hover:scale-110 ${isProcessing ? 'scale-95 opacity-80' : ''}`}
          >
            {isProcessing ? <Loader2 size={20} className="animate-spin sm:h-6 sm:w-6" /> : <ShoppingCart size={20} className="sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="min-w-0 text-xl font-black leading-tight tracking-tighter text-white transition-colors group-hover:text-amber-500 sm:text-2xl">
            {product.title}
          </h3>
          <span className="shrink-0 text-base font-black text-amber-500 sm:text-lg">${product.price}</span>
        </div>
        <p className="mb-6 line-clamp-2 text-sm font-medium leading-relaxed tracking-wide text-slate-500 sm:mb-8">
          {product.description}
        </p>

        <div className="flex flex-col gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              {product.stock > 0 ? 'Disponible' : 'Sin Stock'}
            </span>
          </div>
          <Link to={`/product/${product.slug}`} className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:text-white">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
