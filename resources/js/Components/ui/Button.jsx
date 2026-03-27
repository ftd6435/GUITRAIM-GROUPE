import React from 'react';
import { cn } from '../../utils/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-[#1A3A5C] text-white hover:bg-[#2B5280] shadow-sm',
    secondary: 'bg-white text-[hsla(210,30%,20%,1)] border border-[#E0E6ED] hover:bg-[hsla(210,25%,98%,1)]',
    outline: 'bg-transparent border border-[#1A3A5C] text-[#1A3A5C] hover:bg-[#1A3A5C]/5',
    ghost: 'bg-transparent text-[hsla(210,20%,40%,1)] hover:bg-[hsla(210,25%,98%,1)]',
    danger: 'bg-[#D64545] text-white hover:bg-[#D64545]/90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl',
    lg: 'px-6 py-3 text-base font-bold rounded-2xl',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A5C] disabled:pointer-events-none disabled:opacity-50 active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

export default Button;
