// pageTransitions.js
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.02,
  },
};

export const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier للسلاسة
  duration: 0.3,
};
