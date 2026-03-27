import React from 'react';
import { cn } from '../../utils/utils';

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizes[size], className)}>
      {/* Outer rotating circle */}
      <div className="absolute inset-0 rounded-full border-4 border-[hsla(210,18%,96%,1)] border-t-[#1A3A5C] animate-spin"></div>

      {/* Favicon in the middle */}
      <div className={cn("relative z-10 flex items-center justify-center bg-white rounded-full p-1 shadow-sm", iconSizes[size])}>
        <img src="/img/favicon.png" alt="Loading..." className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
