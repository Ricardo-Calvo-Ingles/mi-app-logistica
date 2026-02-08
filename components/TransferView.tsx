
import React, { useContext, useState, useMemo } from 'react';
import { InventoryContext } from '../App';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ChevronDownIcon, SearchIcon, XIcon, PlusCircleIcon, BoxIcon } from './icons';
import type { Brand, SerializedUnit, InventoryItem, CartItem } from '../types';
import { generateDeliveryNotePDF, printDeliveryNotePDF } from '../services/pdfService';
import { ConfirmTransferModal } from './ConfirmTransferModal';

interface TransferViewProps {
    brand: Brand;
}

export const TransferView: React.FC<TransferViewProps> = ({ brand }) => {
    const { inventory, serializedUnits, technicians, transferMultipleUnits } = useContext(InventoryContext);
    const [selectedTechId, setSelectedTechId] = useState('');
    const [selectedSerials, setSelectedSerials] = useState<string[]>([]);
    const [unitQuantities, setUnitQuantities] = useState<Record<string, number>>({});
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [manualItems, setManualItems] = useState<CartItem[]>([]);
    const [manualCode, setManualCode] = useState('');
    const [manualMaterial, setManualMaterial] = useState('');
    const [manualDetail, setManualDetail] = useState('');

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [transferAction, setTransferAction] = useState<'download' | 'print' | null>(null);

    const brandItems = useMemo(() => inventory.filter(i => i.brand === brand), [inventory, brand]);
    const warehouseUnits = useMemo(() => serializedUnits.filter(u => u.status === 'Almacén Central'), [serializedUnits]);

    const itemsByCategory = useMemo(() => {
        return brandItems.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {} as Record<string, InventoryItem[]>);
    }, [brandItems]);

    const handleSerialToggle = (sn: string) => {
        setSelectedSerials(prev => prev.includes(sn) ? prev.filter(s => s !== sn) : [...prev, sn]);
    };

    const handleQuantityChange = (itemId: string, qty: number, max: number) => {
        const val = Math.max(0, Math.min(qty, max));
        setUnitQuantities(prev => ({ ...prev, [itemId]: val }));
    };

    const handleAddManualItem = () => {
        if (!manualMaterial.trim() || !manualDetail.trim()) {
            alert('Datos manuales incompletos.');
            return;
        }

        const newItem: CartItem = {
            code: manualCode.trim() || 'MANUAL',
            material: manualMaterial.trim(),
        };

        const detailLower = manualDetail.trim().toLowerCase();
        if (detailLower.startsWith('x') && !isNaN(Number(detailLower.substring(1)))) {
            newItem.quantity = parseInt(detailLower.substring(1), 10);
        } else {
            newItem.serialNumber = manualDetail.trim();
        }

        setManualItems(prev => [...prev, newItem]);
        setManualCode('');
        setManualMaterial('');
        setManualDetail('');
    };

    const cart: CartItem[] = useMemo(() => {
        const items: CartItem[] = [];
        selectedSerials.forEach(sn => {
            const unit = serializedUnits.find(u => u.serialNumber === sn);
            const item = inventory.find(i => i.id === unit?.itemId);
            if (item) items.push({ code: item.code, material: item.material, serialNumber: sn, itemId: item.id });
        });
        (Object.entries(unitQuantities) as [string, number][]).forEach(([itemId, qty]) => {
            if (qty > 0) {
                const item = inventory.find(i => i.id === itemId);
                if (item) items.push({ code: item.code, material: item.material, quantity: qty, itemId: item.id });
            }
        });
        items.push(...manualItems);
        return items;
    }, [selectedSerials, unitQuantities, inventory, serializedUnits, manualItems]);

    const handleConfirmTransfer = () => {
        if (!selectedTechId || !transferAction) return;
        const tech = technicians.find(t => t.id === selectedTechId);
        if (!tech) return;

        const nonSerializedToTransfer: {itemId: string, quantity: number}[] = [];
        (Object.entries(unitQuantities) as [string, number][]).forEach(([itemId, qty]) => {
            if (qty > 0) nonSerializedToTransfer.push({ itemId, quantity: qty });
        });
        
        transferMultipleUnits(selectedSerials, selectedTechId, brand, nonSerializedToTransfer);
        const docItems = cart.map(c => ({ code: c.code, material: c.material, serialNumber: c.serialNumber, quantity: c.quantity }));
        
        if (transferAction === 'download') generateDeliveryNotePDF(tech, docItems);
        else printDeliveryNotePDF(tech, docItems);

        setSelectedSerials([]);
        setUnitQuantities({});
        setManualItems([]);
        setIsConfirmModalOpen(false);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">PROTOCOL_TRANSFER</h1>
                    <p className="text-[8px] text-altri-orange font-bold uppercase tracking-[0.3em] mt-1">Módulo Logístico - {brand}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                    {/* Buscador y Manual */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border border-white/5 !p-4">
                             <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-[10px] font-mono text-white focus:outline-none focus:border-altri-orange"
                                    value={searchQuery} 
                                    onChange={e => setSearchQuery(e.target.value)} 
                                    placeholder="SCAN_N/S..."
                                />
                                <Button size="sm" onClick={() => {}} className="px-3"><SearchIcon className="h-4 w-4"/></Button>
                            </div>
                        </Card>
                        <Card className="border border-white/5 !p-4">
                             <div className="grid grid-cols-3 gap-2">
                                <input className="bg-white/5 border border-white/10 rounded-lg py-2 px-2 text-[9px] text-white" value={manualMaterial} onChange={e => setManualMaterial(e.target.value)} placeholder="DESC"/>
                                <input className="bg-white/5 border border-white/10 rounded-lg py-2 px-2 text-[9px] text-white" value={manualDetail} onChange={e => setManualDetail(e.target.value)} placeholder="N/S o QTY"/>
                                <Button size="sm" onClick={handleAddManualItem} variant="secondary" className="px-2 text-[8px]"><PlusCircleIcon className="h-3.5 w-3.5"/></Button>
                            </div>
                        </Card>
                    </div>

                    {/* Inventory Explorer */}
                    <div className="space-y-2">
                        {Object.entries(itemsByCategory).map(([category, items]) => (
                            <div key={category} className="glass-card rounded-xl overflow-hidden border border-white/5">
                                <button 
                                    onClick={() => setExpandedCategory(expandedCategory === category ? null : category)} 
                                    className="w-full flex justify-between items-center p-3 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <BoxIcon className={`h-4 w-4 ${expandedCategory === category ? 'text-altri-orange' : 'text-gray-600'}`} />
                                        <span className="font-black text-white uppercase text-[9px] tracking-widest">{category}</span>
                                    </div>
                                    <ChevronDownIcon className={`h-4 w-4 text-gray-600 transform transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedCategory === category && (
                                    <div className="px-3 pb-3 pt-1 space-y-2">
                                        {(items as InventoryItem[]).map(item => (
                                            <div key={item.id} className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="font-bold text-gray-200 text-[9px] uppercase">{item.material}</p>
                                                    <span className="text-[8px] text-gray-500 font-mono">{item.code}</span>
                                                </div>
                                                {item.hasSerialNumber ? (
                                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                                                        {warehouseUnits.filter(u => u.itemId === item.id).map(u => (
                                                            <button 
                                                                key={u.serialNumber} 
                                                                onClick={() => handleSerialToggle(u.serialNumber)}
                                                                className={`p-1 rounded-md border text-center transition-all ${
                                                                    selectedSerials.includes(u.serialNumber) 
                                                                        ? 'bg-altri-orange text-white border-altri-orange' 
                                                                        : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'
                                                                }`}
                                                            >
                                                                <p className="text-[7px] font-mono truncate">{u.serialNumber.slice(-6)}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[8px] text-gray-500 uppercase">Stock: {item.stock}</span>
                                                        <input 
                                                            type="number" 
                                                            className="w-16 bg-black/40 border border-white/10 rounded-md py-1 px-2 text-[9px] text-white text-center"
                                                            value={unitQuantities[item.id] || 0} 
                                                            onChange={e => handleQuantityChange(item.id, parseInt(e.target.value), item.stock)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Sidebar - Compacto */}
                <aside className="lg:col-span-5 lg:sticky lg:top-10">
                    <Card className="border-t-2 border-t-altri-orange flex flex-col max-h-[80vh] shadow-2xl !p-0 overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-sm font-black text-white uppercase tracking-tighter">COLA_PROCESO</h2>
                            <span className="text-[9px] font-mono text-altri-orange">[{cart.length}]</span>
                        </div>
                        
                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[8px] text-altri-orange uppercase font-bold tracking-widest block">DESTINATARIO_LOGIN</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-[10px] font-bold text-white focus:outline-none focus:border-altri-orange"
                                    value={selectedTechId} 
                                    onChange={e => setSelectedTechId(e.target.value)}
                                >
                                    <option value="" className="bg-altri-dark">-- BUSCAR TÉCNICO --</option>
                                    {technicians.map(t => <option key={t.id} value={t.id} className="bg-altri-dark">{t.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                {cart.length === 0 ? (
                                    <p className="text-[8px] font-bold text-gray-600 uppercase text-center py-6">Cola de activos vacía</p>
                                ) : (
                                    cart.map((c, i) => (
                                        <div key={i} className="text-[9px] p-2 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center">
                                            <span className="font-bold text-gray-200 truncate pr-2 uppercase">{c.material}</span>
                                            <span className="text-altri-orange font-mono text-[8px] whitespace-nowrap">{c.serialNumber || `QTY: ${c.quantity}`}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border-t border-white/5 grid grid-cols-2 gap-2">
                            <Button size="sm" onClick={() => { setTransferAction('download'); setIsConfirmModalOpen(true); }} disabled={!selectedTechId || cart.length === 0}>DIGITAL_PDF</Button>
                            <Button size="sm" onClick={() => { setTransferAction('print'); setIsConfirmModalOpen(true); }} variant="secondary" disabled={!selectedTechId || cart.length === 0}>OUTPUT_PRINT</Button>
                        </div>
                    </Card>
                </aside>
            </div>

            {isConfirmModalOpen && (
                <ConfirmTransferModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmTransfer}
                    technician={technicians.find(t => t.id === selectedTechId)}
                    items={cart}
                    action={transferAction}
                />
            )}
        </div>
    );
};
