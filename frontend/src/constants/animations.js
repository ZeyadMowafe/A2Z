export const pageVariants = {
  initial: { opacity: 0, x: -15 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 15 },
};

export const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],  // cubic-bezier فيها انسيابية طبيعية
  duration: 0.4,               // مش بطيئة ولا سريعة
};
