
import React, { useContext, useMemo, useState } from 'react';
import { InventoryContext } from '../App';
import type { Brand, Category, SerializedUnit, InventoryItem } from '../types';
import { Card, StatCard } from './ui/Card';
import { BoxIcon, ChevronDownIcon, TrashIcon, SettingsIcon, PlusCircleIcon, XIcon, HistoryIcon, AltriLogo } from './icons';
import { Button } from './ui/Button';
import { EditItemModal } from './EditItemModal';
import { AddItemModal } from './AddItemModal';

interface InventoryDashboardProps {
    brand: Brand;
}

const ModelRow: React.FC<{
    item: InventoryItem;
    units: SerializedUnit[];
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
}> = ({ item, units, onEdit, onDelete }) => {
    const itemUnits = units.filter(u => u.itemId === item.id);
    const isLowStock = itemUnits.length <= item.lowStockThreshold;

    return (
        <div className="border-b border-slate-100 last:border-0 p-4 hover:bg-slate-50 transition-all flex justify-between items-center group">
            <div className="flex flex-col">
                <span className="font-bold text-altri-dark text-sm uppercase tracking-tight">{item.material}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">SAP: {item.code}</span>
            </div>
            <div className="flex items-center gap-6">
                <div className={`px-4 py-1.5 rounded-xl border-2 text-[11px] font-black tracking-tight ${isLowStock ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-altri-orange/5 border-altri-orange/20 text-altri-orange'}`}>
                    {itemUnits.length.toString().padStart(2, '0')} UNIDADES
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-altri-blue rounded-lg transition-colors"><SettingsIcon className="h-4 w-4"/></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><TrashIcon className="h-4 w-4"/></button>
                </div>
            </div>
        </div>
    );
};

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ brand }) => {
    const { inventory, serializedUnits, removeItem } = useContext(InventoryContext);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const brandItems = useMemo(() => inventory.filter(i => i.brand === brand), [inventory, brand]);
    const warehouseUnits = useMemo(() => serializedUnits.filter(u => u.status === 'Almacén Central'), [serializedUnits]);

    const itemsByCategory = useMemo(() => {
        return brandItems.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {} as Record<string, InventoryItem[]>);
    }, [brandItems]);

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-2">
            {/* Header de Sección Refinado - Sin logo gigante */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-altri-dark tracking-tighter uppercase leading-none">
                        STOCK <span className="text-altri-orange">{brand}</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        SISTEMA_LOGÍSTICO_OPERATIVO
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">TOTAL_EQUIPOS</p>
                        <p className="text-xl font-black text-altri-dark leading-none">{warehouseUnits.length}</p>
                    </div>
                    <div className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">FAMILIAS_DATA</p>
                        <p className="text-xl font-black text-altri-blue leading-none">{brandItems.length}</p>
                    </div>
                </div>
            </div>

            {/* Category Explorer */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                    <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Repositorio de Materiales</h2>
                    <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="px-6 py-2 shadow-sm border-slate-200 bg-white text-altri-dark hover:bg-slate-50">
                        <PlusCircleIcon className="h-4 w-4 mr-2" />
                        Nuevo Registro
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    {Object.entries(itemsByCategory).map(([cat, items]) => (
                        <div key={cat} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50/50 p-5 border-b border-slate-100 flex items-center gap-4">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm text-altri-dark border border-slate-100"><BoxIcon className="h-5 w-5"/></div>
                                <h3 className="font-black text-altri-dark text-lg uppercase tracking-tight">{cat}</h3>
                                <span className="ml-auto text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                                    {items.length} MODELOS
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {items.map(item => (
                                    <ModelRow 
                                        key={item.id}
                                        item={item}
                                        units={warehouseUnits}
                                        onEdit={setEditingItem}
                                        onDelete={(id) => window.confirm("¿Seguro que desea eliminar este registro?") && removeItem(id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                    {Object.keys(itemsByCategory).length === 0 && (
                        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <BoxIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay datos para esta operadora.</p>
                        </div>
                    )}
                </div>
            </div>

            {editingItem && (
                <EditItemModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} item={editingItem} />
            )}
            {isAddModalOpen && (
                <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            )}
        </div>
    );
};
