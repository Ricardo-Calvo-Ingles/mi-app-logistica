
import React from 'react';
import { AltriLogo, DashboardIcon, UsersIcon, HistoryIcon, SettingsIcon, WrenchIcon, XIcon, SendIcon } from './icons';
import type { View, User } from '../types';

interface SidebarProps {
    setView: (view: View) => void;
    currentView: View;
    userRole: User['role'];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li className="px-4">
        <button
            onClick={onClick}
            className={`w-full flex items-center p-3.5 my-1 font-bold rounded-xl transition-all duration-200 group relative ${
                isActive
                    ? 'bg-altri-orange text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </span>
            <span className="ml-4 text-[11px] uppercase tracking-wider">{label}</span>
        </button>
    </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ setView, currentView, userRole, isOpen, setIsOpen }) => {
    return (
        <>
            <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`w-72 bg-altri-dark border-r border-slate-800 flex-shrink-0 transform transition-all duration-300 z-40 lg:transform-none lg:relative ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:static inset-y-0 left-0 shadow-2xl`}>
                <div className="flex flex-col h-full">
                    <div className="h-28 flex items-center px-8 border-b border-slate-800">
                        <AltriLogo className="text-white" hideText={false} />
                    </div>
                    
                    <nav className="flex-1 py-8 custom-scrollbar overflow-y-auto">
                        <ul className="space-y-1">
                            <NavItem icon={<DashboardIcon className="h-5 w-5" />} label="Monitor Stock" isActive={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
                            <NavItem icon={<SendIcon className="h-5 w-5" />} label="Operación Traspaso" isActive={currentView === 'transfer'} onClick={() => setView('transfer')} />
                            <NavItem icon={<UsersIcon className="h-5 w-5" />} label="Terminal Técnicos" isActive={currentView === 'technicians'} onClick={() => setView('technicians')} />
                            <NavItem icon={<WrenchIcon className="h-5 w-5" />} label="RMA / Devoluciones" isActive={currentView === 'returns'} onClick={() => setView('returns')} />
                            <NavItem icon={<HistoryIcon className="h-5 w-5" />} label="Administrador" isActive={currentView === 'admin'} onClick={() => setView('admin')} />
                        </ul>
                    </nav>

                    <div className="p-6 bg-slate-900/50 border-t border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-altri-orange border border-slate-700">AD</div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-white uppercase truncate">Administrador</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Gestión Total</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
