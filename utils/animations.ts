import { Variants } from 'framer-motion';

export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemFadeInUp: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeOut",
      duration: 0.4,
    },
  },
};

export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContentVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0, y: -50 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
      mass: 0.8
    } 
  },
  exit: { 
    scale: 0.9, 
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    } 
  },
};