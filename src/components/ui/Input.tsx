import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D6A56D] text-[20px] pointer-events-none z-10">
          {icon}
        </span>
      )}
      <input 
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-[#1E1E1E] text-white font-medium text-sm border border-white/20 focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/40 focus:outline-none transition-all placeholder:text-slate-500 ${className}`}
        {...props}
      />
    </div>
  );
}
