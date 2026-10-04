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
      className="group relative flex h-full flex-col overflow-hidden border-b border-[var(--border-strong)] bg-transparent transition-colors duration-300 hover:border-[var(--accent)]"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, margin: '-25% 0px -25% 0px' }}
      custom={index}
    >
      <Motion.div className="relative aspect-[4/4.3] overflow-hidden bg-[var(--bg-elevated)]">
        <img
          src={product.image_url || PLACEHOLDER}
          alt={product.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </Motion.div>

      <div className="flex flex-1 flex-col px-1 pb-4 pt-4 sm:pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-tight text-[var(--text-primary)] sm:text-[1.8rem]">{product.title}</h3>
          <span className="pt-1 text-sm font-semibold text-[var(--text-primary)]">{formatCOP(product.price)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--border-soft)] pt-3 text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${availableStock > 0 ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}></span>
            {availableStock > 0 ? 'Disponible' : 'Sin stock'}
          </span>
          <span>{availableStock} piezas</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center gap-1.5 border border-[var(--border-soft)] px-2.5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Ver producto
            <ArrowUpRight size={13} />
          </Link>
          <button
            onClick={onAddToCart}
            disabled={isProcessing || availableStock <= 0}
            className="inline-flex items-center justify-center gap-1.5 bg-[var(--text-primary)] px-2.5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)] transition hover:bg-[var(--accent)] disabled:opacity-70"
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
