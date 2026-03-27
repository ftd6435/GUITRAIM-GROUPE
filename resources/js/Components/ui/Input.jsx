import React from 'react';
import { cn } from '../../utils/utils';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-xl border border-[#E0E6ED] bg-white px-4 py-2 text-sm text-[hsla(210,30%,20%,1)] ring-offset-white transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsla(210,15%,55%,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A5C]/20 focus-visible:border-[#1A3A5C] disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-[#D64545] focus-visible:ring-[#D64545]/10 focus-visible:border-[#D64545]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-[#D64545] ml-1">{error}</p>}
    </div>
  );
});

const Textarea = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[100px] w-full rounded-xl border border-[#E0E6ED] bg-white px-4 py-3 text-sm text-[hsla(210,30%,20%,1)] ring-offset-white transition-all placeholder:text-[hsla(210,15%,55%,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A5C]/20 focus-visible:border-[#1A3A5C] disabled:cursor-not-allowed disabled:opacity-50 resize-none',
          error && 'border-[#D64545] focus-visible:ring-[#D64545]/10 focus-visible:border-[#D64545]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-[#D64545] ml-1">{error}</p>}
    </div>
  );
});

const Select = React.forwardRef(({ className, label, error, options = [], ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-xl border border-[#E0E6ED] bg-white px-4 py-2 text-sm text-[hsla(210,30%,20%,1)] ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A5C]/20 focus-visible:border-[#1A3A5C] disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat',
          error && 'border-[#D64545] focus-visible:ring-[#D64545]/10 focus-visible:border-[#D64545]',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-medium text-[#D64545] ml-1">{error}</p>}
    </div>
  );
});

export { Input, Textarea, Select };
