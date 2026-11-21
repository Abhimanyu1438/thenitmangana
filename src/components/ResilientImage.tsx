import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ResilientImage({ src, alt, className = '' }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

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

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
