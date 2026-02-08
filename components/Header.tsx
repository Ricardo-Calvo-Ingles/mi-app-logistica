
import React from 'react';
import { PlusCircleIcon, SearchIcon, LogOutIcon, MenuIcon } from './icons';
import { Button } from './ui/Button';
import type { Brand } from '../types';

interface HeaderProps {
    onAddStock: () => void;
    onLogout: () => void;
    selectedBrand: Brand | null;
    onSelectBrand: (brand: Brand) => void;
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddStock, onLogout, selectedBrand, onSelectBrand, onToggleSidebar }) => {
    return (
        <header className="h-24 px-8 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="flex items-center gap-6">
                <button onClick={onToggleSidebar} className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                    <MenuIcon className="h-6 w-6"/>
                </button>
                
                {selectedBrand && (
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => onSelectBrand('ORANGE')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${selectedBrand === 'ORANGE' ? 'bg-altri-orange text-white shadow-md' : 'text-slate-500 hover:text-altri-dark'}`}
                        >ORANGE</button>
                        <button
                            onClick={() => onSelectBrand('MASMOVIL')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${selectedBrand === 'MASMOVIL' ? 'bg-[#FFEB3B] text-slate-900 shadow-md' : 'text-slate-500 hover:text-altri-dark'}`}
                        >MASMOVIL</button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-5">
                 <div className="relative hidden md:block w-72">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Escanear material..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-altri-dark focus:ring-2 focus:ring-altri-orange/10 focus:border-altri-orange transition-all placeholder:text-slate-400"
                    />
                </div>
                <Button onClick={onAddStock} variant="primary" className="shadow-md">
                    <PlusCircleIcon className="h-4 w-4 mr-2"/>
                    Entrada Stock
                </Button>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <button onClick={onLogout} className="p-2.5 bg-slate-50 text-slate-400 hover:text-altri-red transition-all border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-100">
                    <LogOutIcon className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};
