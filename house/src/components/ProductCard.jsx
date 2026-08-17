import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { formatCOP } from '../utils/formatCurrency';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect fill='%23f5f0e8' width='600' height='600'/%3E%3Ctext fill='%23a99' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
    filter: 'blur(1.5px)'
  },
  visible: (idx) => ({
    opacity: 1,
    y: 0,
    scale: 0.95,
    filter: 'blur(0px)',
    transition: {
      opacity: { duration: 0.5, ease: 'easeOut' },
      y: { type: 'spring', stiffness: 150, damping: 25 },
      delay: idx * 0.05
    }
  })
};

const imageVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 }
};

const ProductCard = ({ product, onAddToCart, isProcessing, index = 0 }) => {
  const availableStock = product.has_variants
    ? (product.variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0)
    : Number(product.stock || 0);

  return (
    <Motion.article
      className="glass-panel hover-lift group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.72),rgba(255,248,236,0.52))] transition duration-500 hover:border-[var(--accent)]/60 hover:shadow-[0_16px_32px_rgba(38,24,12,0.1)]"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-25% 0px -25% 0px' }}
      custom={index}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[var(--glow)] blur-3xl transition duration-700 group-hover:scale-125" />

      <Motion.div className="relative aspect-[4/4.3] overflow-hidden border-b border-[var(--border-soft)] bg-[var(--bg-elevated)]">
        <Motion.img
          src={product.image_url || PLACEHOLDER}
          alt={product.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          variants={imageVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(46,31,19,0.78)] via-[rgba(46,31,19,0.22)] to-transparent p-3 sm:p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.32em] text-[#f1dfc7]">Pieza curada</p>
              <h3 className="mt-1.5 font-display text-[1.6rem] leading-none text-[#fff7eb] sm:text-[1.85rem]">
                {product.title}
              </h3>
            </div>
            <span className="rounded-full border border-[rgba(255,248,236,0.24)] bg-[rgba(255,248,236,0.18)] px-2.5 py-1.5 text-[0.82rem] font-semibold text-[#fff7eb] sm:text-sm">
              {formatCOP(product.price)}
            </span>
          </div>
        </div>
      </Motion.div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="line-clamp-2 text-[0.85rem] leading-6 text-[var(--text-secondary)]">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--border-soft)] pt-3 text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${availableStock > 0 ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}></span>
            {availableStock > 0 ? 'Disponible' : 'Sin stock'}
          </span>
          <span>{availableStock} piezas</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Ver producto
            <ArrowUpRight size={13} />
          </Link>
          <button
            onClick={onAddToCart}
            disabled={isProcessing || availableStock <= 0}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)] disabled:opacity-70"
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
