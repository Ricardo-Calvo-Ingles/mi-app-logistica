
import React from 'react';
import type { Brand } from '../types';
import { BoxIcon, SendIcon } from './icons';

interface BrandSelectionProps {
    onSelectBrand: (brand: Brand) => void;
}

const BrandCard: React.FC<{ brand: Brand; onClick: () => void; bgColor: string; borderColor: string; textColor: string; subText: string }> = ({ brand, onClick, bgColor, borderColor, textColor, subText }) => (
    <button 
        onClick={onClick}
        className={`group relative overflow-hidden bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-100 border-4 border-transparent hover:${borderColor} transition-all duration-500 flex flex-col items-center gap-8 active:scale-95 text-center`}
    >
        <div className={`w-32 h-32 ${bgColor} rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:scale-110`}>
            <BoxIcon className={`h-16 w-16 ${brand === 'MASMOVIL' ? 'text-altri-dark' : 'text-white'}`} />
        </div>
        <div>
            <h2 className={`text-5xl font-black ${textColor} tracking-tighter uppercase mb-2`}>{brand}</h2>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{subText}</p>
        </div>
        <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity duration-500 ${textColor}`}>
            <SendIcon className="h-12 w-12" />
        </div>
    </button>
);

export const BrandSelection: React.FC<BrandSelectionProps> = ({ onSelectBrand }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen bg-altri-light p-8 animate-slide-in">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-altri-dark uppercase tracking-tighter mb-4">¿Con qué operadora vas a trabajar?</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Selecciona una marca para filtrar el inventario</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
                <BrandCard 
                    brand="ORANGE" 
                    onClick={() => onSelectBrand('ORANGE')} 
                    bgColor="bg-altri-orange" 
                    borderColor="border-altri-orange"
                    textColor="text-altri-orange"
                    subText="Acceder al panel de Orange"
                />
                <BrandCard 
                    brand="MASMOVIL" 
                    onClick={() => onSelectBrand('MASMOVIL')} 
                    bgColor="bg-altri-yellow" 
                    borderColor="border-altri-yellow"
                    textColor="text-yellow-500"
                    subText="Acceder al panel de MásMóvil"
                />
            </div>
        </div>
    );
};
