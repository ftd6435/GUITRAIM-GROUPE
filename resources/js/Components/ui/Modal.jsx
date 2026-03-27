import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/utils';

const Modal = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A3A5C]/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={cn(
          "w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E0E6ED] overflow-hidden scale-up",
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E0E6ED] bg-[hsla(210,25%,98%,1)]/50">
          <h2 className="text-xl font-bold text-[hsla(210,30%,20%,1)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[hsla(210,15%,55%,1)] hover:bg-[#D64545]/10 hover:text-[#D64545] transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>,
    document.body
  );
};

export default Modal;
