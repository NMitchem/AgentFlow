import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { ComponentProps, forwardRef } from 'react';

const Button = forwardRef<HTMLButtonElement, 
  ComponentProps<'button'> & { asChild?: boolean }
>(({ className = '', asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : motion.button;
  
  return (
    <Comp
      ref={ref}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    />
  );
});

Button.displayName = 'Button';
export default Button;
