import React from 'react';

const shimmer = 'animate-pulse bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface-3)] to-[var(--surface-2)]';

export function SkeletonBlock({ className = '' }) {
  return <div className={`${shimmer} rounded-xl ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${shimmer} h-3 rounded-full`}
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-panel overflow-hidden rounded-[1.5rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.72),rgba(255,248,236,0.52))]">
      <div className="aspect-[4/4.3] bg-[var(--surface-2)]" />
      <div className="p-3 sm:p-4">
        <SkeletonText lines={2} />
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border-soft)] pt-3">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SkeletonBlock className="h-9 rounded-full" />
          <SkeletonBlock className="h-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-7 py-7 sm:space-y-9 sm:py-9 lg:space-y-10 lg:py-12">
      <SkeletonBlock className="h-4 w-40 rounded-full" />

      <div className="grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-9 xl:gap-10">
        <SkeletonBlock className="aspect-[4/4.55] rounded-[2.1rem]" />

        <div className="glass-panel flex flex-col justify-between gap-7 rounded-[2.1rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,250,244,0.74),rgba(255,248,236,0.56))] p-5 sm:p-7 lg:p-8">
          <div>
            <SkeletonBlock className="h-3 w-32 rounded-full" />
            <SkeletonBlock className="mt-4 h-10 w-3/4 rounded-xl" />
            <SkeletonBlock className="mt-2 h-10 w-1/2 rounded-xl" />
            <SkeletonText lines={3} className="mt-5" />

            <div className="mt-5 flex gap-2">
              <SkeletonBlock className="h-9 w-14 rounded-full" />
              <SkeletonBlock className="h-9 w-14 rounded-full" />
              <SkeletonBlock className="h-9 w-14 rounded-full" />
            </div>

            <div className="mt-7 rounded-[1.6rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] p-4 sm:p-5">
              <SkeletonBlock className="h-3 w-36 rounded-full" />
              <SkeletonBlock className="mt-3 h-10 w-48 rounded-xl" />
            </div>
          </div>

          <div>
            <SkeletonBlock className="h-[58px] w-full rounded-full" />
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <SkeletonBlock className="h-24 rounded-[1.35rem]" />
              <SkeletonBlock className="h-24 rounded-[1.35rem]" />
              <SkeletonBlock className="h-24 rounded-[1.35rem]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-[2.25rem] border border-[rgba(116,88,54,0.14)] bg-[var(--bg-elevated)] sm:min-h-[640px] lg:min-h-[720px]">
      <div className="absolute inset-0 bg-[var(--surface-2)]" />
      <div className="relative flex min-h-[560px] flex-col justify-end p-4 sm:min-h-[640px] sm:p-6 lg:min-h-[720px] lg:p-8 xl:p-10">
        <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div className="glass-panel rounded-[1.7rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-4 sm:p-5 lg:p-6">
            <SkeletonBlock className="h-12 w-full rounded-full" />
            <div className="mt-4 flex gap-3">
              <SkeletonBlock className="h-10 w-32 rounded-full" />
              <SkeletonBlock className="h-10 w-40 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-full" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="glass-panel rounded-[1.65rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-5">
              <SkeletonBlock className="h-3 w-28 rounded-full" />
              <SkeletonBlock className="mt-3 h-12 w-16 rounded-xl" />
              <SkeletonBlock className="mt-2 h-4 w-32 rounded-full" />
            </div>
            <div className="glass-panel rounded-[1.65rem] border border-[rgba(116,88,54,0.14)] bg-[rgba(255,250,244,0.66)] p-5">
              <SkeletonBlock className="h-3 w-32 rounded-full" />
              <SkeletonBlock className="mt-3 h-8 w-48 rounded-xl" />
              <SkeletonText lines={2} className="mt-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="space-y-10 py-8 sm:space-y-12 sm:py-10 lg:space-y-14 lg:py-14">
      <HeroSkeleton />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-3 xl:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
