interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <div
      role="img"
      aria-label="The Nitmagnaa Weaves"
      className={`inline-flex items-center gap-3 select-none text-on-surface-walnut ${className}`}
    >
      {/* Interlocking Handloom Weave Emblem */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-8 h-8 md:w-9 md:h-9 shrink-0"
      >
        <path
          d="M7 33V7L17.5 17.5V33"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="square"
        />
        <path
          d="M33 7V33L22.5 22.5V7"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="square"
        />
        <path
          d="M7 13.5L26.5 33M13.5 7L33 26.5"
          stroke="#B38A5D"
          strokeWidth="1.9"
          strokeLinecap="square"
        />
        <path
          d="M7 20.5L19.5 33M20.5 7L33 19.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.85"
          strokeLinecap="square"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col items-center leading-none">
        <span className="font-display text-[15px] sm:text-[18px] md:text-[20px] tracking-[0.06em] uppercase text-on-surface-walnut whitespace-nowrap">
          THE NITMAGNAA
        </span>
        <span className="font-label text-[8px] sm:text-[9px] tracking-[0.42em] uppercase text-on-surface-walnut/80 mt-1 pl-[0.42em] whitespace-nowrap">
          WEAVES
        </span>
      </div>
    </div>
  );
}
