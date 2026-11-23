export const SILK_EASE = [0.22, 1, 0.36, 1] as const;

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.15,
} as const;

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: SILK_EASE },
  },
};

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const cardStaggerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: SILK_EASE },
  },
};

export const PRODUCT_CARD_VIEWPORT = {
  once: true,
  amount: 0.08,
} as const;

export function getProductCardRevealVariants(revealIndex = 0) {
  const columnDelay = Math.min(Math.max(revealIndex, 0), 3) * 0.06;
  return {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: columnDelay,
        ease: SILK_EASE,
      },
    },
  };
}
