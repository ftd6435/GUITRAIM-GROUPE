import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative">
        {/* Animated outer ring */}
        <div className="w-24 h-24 rounded-full border-4 border-[#1A3A5C]/10 border-t-[#1A3A5C] animate-spin"></div>
        
        {/* Favicon Logo in the center */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <img 
            src="/img/favicon.png" 
            alt="GUITRAIM Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="text-sm font-bold text-[#1A3A5C] tracking-[0.2em] uppercase">
          GUITRAIM GROUPE
        </span>
        <div className="flex gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A8BC2] animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A8BC2] animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A8BC2] animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
