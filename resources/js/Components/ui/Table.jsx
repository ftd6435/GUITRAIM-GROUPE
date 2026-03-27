import React from 'react';
import { cn } from '../../utils/utils';

const Table = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-[#E0E6ED] bg-white shadow-sm">
    <table className={cn('w-full text-sm text-left', className)} {...props}>
      {children}
    </table>
  </div>
);

const THead = ({ className, children, ...props }) => (
  <thead className={cn('bg-[hsla(210,25%,98%,1)] border-b border-[#E0E6ED]', className)} {...props}>
    {children}
  </thead>
);

const TBody = ({ className, children, ...props }) => (
  <tbody className={cn('divide-y divide-[#E0E6ED]', className)} {...props}>
    {children}
  </tbody>
);

const TR = ({ className, children, hover = true, ...props }) => (
  <tr className={cn('transition-colors', hover && 'hover:bg-[hsla(210,25%,98%,1)]/50', className)} {...props}>
    {children}
  </tr>
);

const TH = ({ className, children, ...props }) => (
  <th className={cn('px-6 py-4 font-bold text-[hsla(210,30%,20%,1)] uppercase tracking-wider text-xs', className)} {...props}>
    {children}
  </th>
);

const TD = ({ className, children, ...props }) => (
  <td className={cn('px-6 py-4 text-[hsla(210,20%,40%,1)] whitespace-nowrap', className)} {...props}>
    {children}
  </td>
);

export { Table, THead, TBody, TR, TH, TD };
