import { useCallback, useEffect, useRef, useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  rootMargin?: string;
  revealOnLoad?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  rootMargin = '300px',
  revealOnLoad = true,
}: ResilientImageProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const hasCustomOpacity = /\bopacity-0\b/.test(className);
  const isLogoOrContain = /\bobject-contain\b/.test(className);
  const useFadeReveal = revealOnLoad && !hasCustomOpacity;

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (isNearViewport) return;
    const node = placeholderRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isNearViewport, rootMargin]);

  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-surface-sand via-surface to-outline-variant text-on-surface-muted p-6 text-center ${className}`}
      >
        <span className="font-display text-lg text-on-surface/80">The Nitmagnaa Weaves</span>
        <span className="font-label text-xs mt-1 text-on-surface-muted max-w-[22ch] line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  if (!isNearViewport) {
    return (
      <div
        ref={placeholderRef}
        role="img"
        aria-label={alt}
        data-lazy-status="pending"
        className={`min-w-[1px] min-h-[1px] ${isLogoOrContain ? '' : 'atelier-shimmer'} ${className}`}
      />
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${useFadeReveal ? (loaded ? 'opacity-100' : 'opacity-0') : ''} ${className} ${
        useFadeReveal ? 'transition-[opacity,transform] duration-500 ease-out' : ''
      }`}
    />
  );
}
