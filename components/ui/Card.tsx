
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`glass-card rounded-2xl p-4 transition-all duration-300 hover:border-white/20 ${className}`}>
            {children}
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
    <Card className="flex items-center group overflow-hidden relative border-l-2 border-l-altri-orange !p-3">
        <div className={`absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity`}>
            {icon}
        </div>
        <div className={`rounded-lg p-2 flex items-center justify-center text-white ${color} shadow-lg`}>
            {/* Fix: Casting icon to React.ReactElement<any> to allow passing className in cloneElement as icon's props type may be inferred as unknown */}
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'h-4 w-4' })}
        </div>
        <div className="ml-3 relative z-10">
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em]">{title}</p>
            <p className="text-xl font-black text-white tracking-tighter font-mono">{value}</p>
        </div>
    </Card>
);
