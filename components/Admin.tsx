
import React, { useContext, useState, useMemo } from 'react';
import { InventoryContext } from '../App';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SearchIcon, HistoryIcon, BoxIcon, UsersIcon, ChevronDownIcon, AltriLogo, PlusCircleIcon } from './icons';
import type { Technician, SerializedUnit, Albaran, InventoryItem, Category } from '../types';

type AdminTab = 'assets' | 'albaranes' | 'technicians';

const CategoryGroup: React.FC<{ 
    category: string; 
    items: InventoryItem[]; 
    units: SerializedUnit[];
}> = ({ category, items, units }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isOpen ? 'bg-altri-orange text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
                        <BoxIcon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">{category}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{items.length} MODELOS ACTIVOS</p>
                    </div>
                </div>
                <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 bg-white space-y-3 animate-slide-in">
                    {items.map(item => (
                        <ModelGroup key={item.id} item={item} units={units.filter(u => u.itemId === item.id)} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ModelGroup: React.FC<{ 
    item: InventoryItem; 
    units: SerializedUnit[];
}> = ({ item, units }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/30 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3.5 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-altri-dark uppercase tracking-tight">{item.material}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-altri-blue/10 text-altri-blue rounded-md border border-altri-blue/10">SAP: {item.code}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase">{units.length} UNIDADES</span>
                    <ChevronDownIcon className={`h-4 w-4 text-slate-300 transition-transform ${isOpen ? 'rotate-180 text-altri-orange' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                        {units.map(u => (
                            <div key={u.serialNumber} className="flex flex-col p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-altri-orange/30 transition-all">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[11px] font-mono font-bold text-altri-orange">{u.serialNumber}</span>
                                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${u.status === 'Instalado' ? 'bg-emerald-100 text-emerald-700' : u.status === 'En Técnico' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {u.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <UsersIcon className="h-3 w-3 text-slate-300" />
                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight truncate">Ubicación: {u.location}</span>
                                </div>
                            </div>
                        ))}
                        {units.length === 0 && <p className="col-span-full text-[10px] text-slate-400 italic py-2">Sin stock serializado registrado.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Admin: React.FC = () => {
    const { technicians, addTechnician, deleteTechnician, serializedUnits, inventory, albaranes } = useContext(InventoryContext);
    const [activeTab, setActiveTab] = useState<AdminTab>('assets');
    const [assetSearch, setAssetSearch] = useState('');

    const itemsByCategory = useMemo(() => {
        return inventory.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {} as Record<string, InventoryItem[]>);
    }, [inventory]);

    const filteredCategories = useMemo(() => {
        if (!assetSearch) return itemsByCategory;
        
        const filtered: Record<string, InventoryItem[]> = {};
        Object.entries(itemsByCategory).forEach(([cat, items]) => {
            const matchingItems = items.filter(item => 
                item.material.toLowerCase().includes(assetSearch.toLowerCase()) ||
                item.code.toLowerCase().includes(assetSearch.toLowerCase()) ||
                serializedUnits.some(u => u.itemId === item.id && u.serialNumber.toLowerCase().includes(assetSearch.toLowerCase()))
            );
            if (matchingItems.length > 0) filtered[cat] = matchingItems;
        });
        return filtered;
    }, [itemsByCategory, assetSearch, serializedUnits]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-4">
            {/* Header del Admin */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                        <AltriLogo size={60} hideText />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-altri-dark uppercase tracking-tighter leading-none">Terminal Maestro</h1>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Administración de Flota y Activos</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                     <button onClick={() => setActiveTab('assets')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'assets' ? 'bg-white text-altri-dark shadow-md border border-slate-200' : 'text-slate-500 hover:text-altri-dark'}`}>Seguimiento</button>
                     <button onClick={() => setActiveTab('albaranes')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'albaranes' ? 'bg-white text-altri-dark shadow-md border border-slate-200' : 'text-slate-500 hover:text-altri-dark'}`}>Albaranes</button>
                     <button onClick={() => setActiveTab('technicians')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'technicians' ? 'bg-white text-altri-dark shadow-md border border-slate-200' : 'text-slate-500 hover:text-altri-dark'}`}>Técnicos</button>
                </div>
            </div>

            {activeTab === 'assets' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center gap-4">
                        <div className="relative flex-1 max-w-lg">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-altri-dark focus:outline-none focus:ring-2 focus:ring-altri-orange/20 focus:border-altri-orange transition-all placeholder:text-slate-400"
                                placeholder="BUSCAR MATERIAL, CÓDIGO SAP O NÚMERO DE SERIE..."
                                value={assetSearch}
                                onChange={e => setAssetSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(filteredCategories).map(([cat, items]) => (
                            <CategoryGroup 
                                key={cat} 
                                category={cat} 
                                items={items} 
                                units={serializedUnits} 
                            />
                        ))}
                        {Object.keys(filteredCategories).length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">No se encontraron activos con esos criterios.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'albaranes' && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="cyber-table w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">REFERENCIA</th>
                                    <th className="text-left">FECHA</th>
                                    <th className="text-left">DESTINATARIO</th>
                                    <th className="text-left">CANTIDAD</th>
                                    <th className="text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {albaranes.map(alb => (
                                    <tr key={alb.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="font-mono text-altri-dark text-xs font-bold">{alb.id}</td>
                                        <td className="text-slate-500 text-[11px] font-medium">{alb.date.toLocaleString()}</td>
                                        <td className="text-slate-900 font-bold text-[11px] uppercase tracking-tight">{alb.technicianName}</td>
                                        <td className="text-altri-orange font-black text-[11px]">{alb.itemCount} EQUIPOS</td>
                                        <td className="text-right">
                                            <Button size="sm" variant="secondary" className="text-[10px] px-4 py-1.5 border-slate-200 bg-white hover:bg-slate-50">VER PDF</Button>
                                        </td>
                                    </tr>
                                ))}
                                {albaranes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center text-slate-400 font-medium uppercase text-[10px] tracking-widest">Historial de albaranes vacío.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'technicians' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <Card className="lg:col-span-4 border border-slate-200 !p-8 h-fit">
                        <h2 className="text-lg font-black text-altri-dark uppercase tracking-tighter mb-6 flex items-center gap-2">
                            {/* Fix: PlusCircleIcon was missing from imports, added above. */}
                            <PlusCircleIcon className="h-5 w-5 text-altri-orange" /> REGISTRO TÉCNICO
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Nombre Completo</label>
                                <input className="w-full border border-slate-200 rounded-xl py-3 px-4 text-xs text-altri-dark focus:ring-2 focus:ring-altri-orange/20 focus:border-altri-orange outline-none" placeholder="EJ: PEDRO MARTINEZ" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">ID Usuario</label>
                                <input className="w-full border border-slate-200 rounded-xl py-3 px-4 text-xs text-altri-dark focus:ring-2 focus:ring-altri-orange/20 focus:border-altri-orange outline-none" placeholder="PMARTINEZ" />
                            </div>
                            <Button className="w-full py-4 shadow-md mt-2">ALTA EN SISTEMA</Button>
                        </div>
                    </Card>
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden h-fit">
                        <table className="cyber-table w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">TÉCNICO</th>
                                    <th className="text-left">ID_USUARIO</th>
                                    <th className="text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {technicians.map(tech => (
                                    <tr key={tech.id} className="hover:bg-slate-50/50">
                                        <td className="text-altri-dark font-bold text-xs uppercase">{tech.name}</td>
                                        <td className="text-slate-500 font-mono text-[11px]">{tech.username}</td>
                                        <td className="text-right space-x-4">
                                            <button className="text-altri-blue text-[10px] font-bold uppercase hover:underline">Editar</button>
                                            <button className="text-altri-red text-[10px] font-bold uppercase hover:underline">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
