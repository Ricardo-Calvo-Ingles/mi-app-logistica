
import React from 'react';
import { XIcon } from '../icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex justify-center items-center p-4 sm:p-6"
            onClick={onClose}
        >
            <div 
                className="glass-card rounded-3xl shadow-2xl w-full max-w-lg mx-auto transform transition-all flex flex-col max-h-[90vh] overflow-hidden border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 flex-shrink-0 bg-white/5">
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-altri-orange transition-colors bg-white/5 rounded-xl border border-white/10">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-black/20">
                    {children}
                </div>
            </div>
        </div>
    );
};
