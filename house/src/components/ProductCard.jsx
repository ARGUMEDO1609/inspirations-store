import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowUpRight, Loader2 } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, isProcessing }) => {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] transition duration-500 hover:border-[var(--accent)]/60 hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[var(--glow)] blur-3xl transition duration-700 group-hover:scale-125" />

      <div className="relative aspect-[4/4.8] overflow-hidden border-b border-[var(--border-soft)] bg-[var(--bg-elevated)]">
        <img
          src={product.image_url || 'https://via.placeholder.com/600'}
          alt={product.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(10,10,10,0.92)] to-transparent p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--text-muted)]">Selected Object</p>
              <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)] sm:text-[1.9rem]">
                {product.title}
              </h3>
            </div>
            <span className="rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm font-medium text-[var(--accent)] sm:text-base">
              ${product.price}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="line-clamp-3 text-sm leading-7 text-[var(--text-secondary)]">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--border-soft)] pt-5 text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}></span>
            {product.stock > 0 ? 'Disponible' : 'Sin stock'}
          </span>
          <span>{product.stock} piezas</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            to={`/product/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Ver pieza
            <ArrowUpRight size={15} />
          </Link>
          <button
            onClick={onAddToCart}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-70"
          >
            {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <ShoppingCart size={15} />}
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
