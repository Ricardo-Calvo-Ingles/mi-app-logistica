
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseClasses = "font-black rounded-lg focus:outline-none transition-all duration-300 inline-flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-95 uppercase tracking-widest text-[9px] border-2";

    const variantClasses = {
        primary: 'bg-altri-blue text-white border-altri-blue hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        secondary: 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40',
        danger: 'bg-altri-red text-white border-altri-red hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]',
        ghost: 'bg-transparent text-gray-400 border-transparent hover:text-white',
    };

    const sizeClasses = {
        sm: 'py-1.5 px-4',
        md: 'py-2.5 px-6',
        lg: 'py-4 px-10 text-xs',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
