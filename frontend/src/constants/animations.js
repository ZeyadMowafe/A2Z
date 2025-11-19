// pageTransitions.js

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20, // بدل x خليها y بسيطة لتدي إحساس ارتفاع ناعم
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -15,
    scale: 1.02,
  },
};

export const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2,
};
