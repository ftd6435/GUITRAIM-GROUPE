import React from 'react';
import { cn } from '../../utils/utils';

const Card = ({ className, children, ...props }) => (
  <div 
    className={cn(
      'bg-white rounded-2xl border border-[#E0E6ED] shadow-sm overflow-hidden transition-all hover:shadow-md',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children, title, subtitle, ...props }) => (
  <div className={cn('p-6 border-b border-[#E0E6ED] bg-[hsla(210,25%,98%,1)]/30', className)} {...props}>
    {title && <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">{title}</h3>}
    {subtitle && <p className="text-sm font-medium text-[hsla(210,20%,40%,1)] mt-1">{subtitle}</p>}
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-bold text-[hsla(210,30%,20%,1)]', className)} {...props}>
    {children}
  </h3>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('px-6 py-4 bg-[hsla(210,25%,98%,1)]/30 border-t border-[#E0E6ED]', className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
