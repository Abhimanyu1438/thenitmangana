import { useEffect, useRef, useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  rootMargin?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  rootMargin = '300px',
}: ResilientImageProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
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
        className={`min-w-[1px] min-h-[1px] ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
