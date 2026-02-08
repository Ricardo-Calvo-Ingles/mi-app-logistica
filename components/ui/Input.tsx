
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-[10px] font-black text-altri-dark uppercase tracking-widest mb-1.5 ml-1">
                {label}
            </label>
            <input
                id={id}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-altri-orange focus:border-transparent sm:text-sm transition-all"
                {...props}
            />
        </div>
    );
};
