import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden hover:border-amber-500/50 transition-all duration-700 shadow-2xl hover:-translate-y-4">
      <div className="aspect-square bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Abstract shape decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition duration-1000"></div>
        
        <img 
          src={product.image || 'https://via.placeholder.com/600'} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 opacity-60 group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6">
           <Link to={`/product/${product.slug}`} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white hover:bg-white hover:text-slate-950 transition-all duration-300">
             <Eye size={24} />
           </Link>
           <button 
             onClick={() => onAddToCart(product)}
             className="bg-amber-600 p-4 rounded-full text-white hover:bg-amber-500 hover:scale-110 transition-all duration-300 shadow-2xl shadow-amber-900/40"
           >
             <ShoppingCart size={24} />
           </button>
        </div>
      </div>
      
      <div className="p-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none group-hover:text-amber-500 transition-colors">{product.title}</h3>
          <span className="text-amber-500 font-mono font-black text-lg">
            ${product.price}
          </span>
        </div>
        <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 lowercase tracking-wide leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              {product.stock > 0 ? 'Disponible' : 'Sin Stock'}
            </span>
          </div>
          <Link to={`/product/${product.slug}`} className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition">
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
