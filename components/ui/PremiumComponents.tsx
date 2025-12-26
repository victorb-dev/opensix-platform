import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1] focus:ring-offset-[#0A0A0B] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)] hover:-translate-y-[1px]",
    secondary: "bg-surface border border-border text-white hover:border-[#6366F1]/50 hover:bg-[#1A1A1D]",
    outline: "border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10",
    ghost: "text-text-secondary hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
}

export const PremiumInput: React.FC<InputProps> = ({ label, tooltip, className = '', ...props }) => {
  return (
    <div className="group space-y-2">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-text-secondary group-focus-within:text-[#6366F1] transition-colors">
          {label}
        </label>
        {tooltip && (
          <div className="group/tooltip relative">
             <span className="text-xs text-text-muted cursor-help border border-border rounded-full w-4 h-4 flex items-center justify-center">i</span>
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface border border-border rounded-lg text-xs text-text-secondary opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
               {tooltip}
             </div>
          </div>
        )}
      </div>
      <input
        className={`w-full bg-[#0A0A0B] border border-[#27272A] rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all duration-300 outline-none ${className}`}
        {...props}
      />
    </div>
  );
};

export const PremiumCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ icon: LucideIcon; label: string; locked?: boolean }> = ({ icon: Icon, label, locked }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${
    locked 
      ? 'border-border bg-transparent text-text-muted opacity-50 grayscale' 
      : 'border-[#6366F1]/30 bg-[#6366F1]/10 text-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.2)]'
  }`}>
    <Icon size={12} />
    <span>{label}</span>
  </div>
);

export const StatCard: React.FC<{ label: string; value: string; trend?: string; trendPositive?: boolean }> = ({ label, value, trend, trendPositive }) => (
    <div className="p-6 rounded-2xl bg-surface border border-border hover:border-[#6366F1]/30 transition-all duration-300 group">
        <p className="text-sm text-text-secondary mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
        {trend && (
            <div className={`flex items-center text-xs font-medium ${trendPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trendPositive ? '↑' : '↓'} {trend}
            </div>
        )}
    </div>
);