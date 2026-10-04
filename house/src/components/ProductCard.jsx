import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { formatCOP } from '../utils/formatCurrency';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect fill='%23f5f0e8' width='600' height='600'/%3E%3Ctext fill='%23a99' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: (idx) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.35, ease: 'easeOut' },
      y: { duration: 0.35, ease: 'easeOut' },
      delay: Math.min(idx * 0.035, 0.18)
    }
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.18, ease: 'easeIn' }
  }
};

const ProductCard = ({ product, onAddToCart, isProcessing, index = 0 }) => {
  const availableStock = product.has_variants
    ? (product.variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0)
    : Number(product.stock || 0);

  return (
    <Motion.article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/70 hover:shadow-[0_12px_28px_rgba(38,24,12,0.09)]"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, margin: '-25% 0px -25% 0px' }}
      custom={index}
    >
      <Motion.div className="relative aspect-[5/4] overflow-hidden bg-[var(--bg-elevated)]">
        <img
          src={product.image_url || PLACEHOLDER}
          alt={product.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </Motion.div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-[var(--text-primary)] sm:text-2xl">{product.title}</h3>
          <span className="pt-1 text-xs font-semibold text-[var(--text-primary)] sm:text-sm">{formatCOP(product.price)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)] sm:text-sm">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-[var(--border-soft)] pt-2.5 text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[10px]">
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${availableStock > 0 ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}></span>
            {availableStock > 0 ? 'Disponible' : 'Sin stock'}
          </span>
          <span>{availableStock} piezas</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center gap-1 rounded-md border border-[var(--border-soft)] px-2 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] sm:text-[9px]"
          >
            Ver producto
            <ArrowUpRight size={13} />
          </Link>
          <button
            onClick={onAddToCart}
            disabled={isProcessing || availableStock <= 0}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-[var(--text-primary)] px-2 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:bg-[var(--accent)] disabled:opacity-70 sm:text-[9px]"
          >
            {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <ShoppingCart size={13} />}
            {availableStock > 0 ? 'Añadir' : 'Agotado'}
          </button>
        </div>
      </div>
    </Motion.article>
  );
};

export default ProductCard;
