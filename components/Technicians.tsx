
import React, { useContext, useMemo, useState } from 'react';
import { InventoryContext } from '../App';
import { Card } from './ui/Card';
import { UsersIcon, ChevronDownIcon, PlusCircleIcon, SettingsIcon, TrashIcon, BoxIcon } from './icons';
import { Button } from './ui/Button';
import { InventoryTable } from './InventoryTable';
import type { Technician, SerializedUnit, InventoryItem } from '../types';
import { InterTechnicianTransferModal } from './InterTechnicianTransferModal';
import { EditTechnicianModal } from './EditTechnicianModal';
import { AddTechnicianModal } from './AddTechnicianModal';

const MaterialSubGroup: React.FC<{
    item: InventoryItem;
    units?: SerializedUnit[];
    quantity?: number;
    onTransfer?: (unit: SerializedUnit) => void;
    onInstall?: (serialNumber: string) => void;
    onReturn?: (serialNumber: string) => void;
    onReportDefective?: (serialNumber: string) => void;
}> = ({ item, units, quantity, onTransfer, onInstall, onReturn, onReportDefective }) => {
    const [isGroupOpen, setIsGroupOpen] = useState(false);

    return (
        <div className="border border-gray-100 rounded-lg mb-2 overflow-hidden shadow-sm bg-white">
            <div 
                className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${item.hasSerialNumber ? 'bg-gray-50' : 'bg-white'}`}
                onClick={() => item.hasSerialNumber && setIsGroupOpen(!isGroupOpen)}
            >
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">{item.material}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.hasSerialNumber ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.hasSerialNumber ? units?.length : quantity} {item.hasSerialNumber ? 'equipos' : 'unid.'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono hidden sm:inline">{item.code}</span>
                    {item.hasSerialNumber && (
                        <ChevronDownIcon className={`h-4 w-4 text-gray-400 transform transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                    )}
                </div>
            </div>
            {isGroupOpen && item.hasSerialNumber && units && (
                <div className="p-0 border-t border-gray-100">
                    <InventoryTable 
                        units={units}
                        onInstall={onInstall}
                        onReturn={onReturn}
                        onTransfer={onTransfer}
                        onReportDefective={onReportDefective}
                    />
                </div>
            )}
        </div>
    );
};

const TechnicianCard: React.FC<{
    technician: Technician;
    units: SerializedUnit[];
    nonSerializedStock: Record<string, number>;
    inventory: InventoryItem[];
    onEdit: (tech: Technician) => void;
    onDelete: (id: string) => void;
    onTransfer: (unit: SerializedUnit) => void;
    onInstall: (serialNumber: string, clientName: string) => void;
    onReturn: (serialNumber: string) => void;
    onReportDefective: (serialNumber: string) => void;
}> = ({ technician, units, nonSerializedStock, inventory, onEdit, onDelete, onTransfer, onInstall, onReturn, onReportDefective }) => {
    const [isOpen, setIsOpen] = useState(false);

    const groupedMaterial = useMemo(() => {
        const groups = new Map<string, SerializedUnit[]>();
        units.forEach(unit => {
            const existing = groups.get(unit.itemId) || [];
            groups.set(unit.itemId, [...existing, unit]);
        });
        
        return Array.from(groups.entries()).map(([itemId, units]) => ({
            item: inventory.find(i => i.id === itemId)!,
            units
        })).filter(g => !!g.item);
    }, [units, inventory]);

    // Fix: Casting Object.entries(nonSerializedStock) to [string, number][] to prevent 'unknown' type errors during filter/comparison
    const nonSerializedItems = useMemo(() => {
        return (Object.entries(nonSerializedStock) as [string, number][]).map(([itemId, qty]) => ({
            item: inventory.find(i => i.id === itemId)!,
            quantity: qty
        })).filter(g => !!g.item && g.quantity > 0);
    }, [nonSerializedStock, inventory]);

    const handleInstall = (serialNumber: string) => {
        const clientName = prompt(`Cliente para la instalación del equipo ${serialNumber}:`);
        if (clientName && clientName.trim() !== '') {
            onInstall(serialNumber, clientName);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow border-t-2 border-orange-400">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <div className="bg-orange-50 p-3 rounded-full mr-4 border border-orange-100">
                        <UsersIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{technician.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">
                            {units.length} equipos | {nonSerializedItems.length} tipos de consumibles
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(technician)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><SettingsIcon className="h-5 w-5" /></button>
                    <button onClick={() => onDelete(technician.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg"><TrashIcon className="h-5 w-5" /></button>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400">
                        <ChevronDownIcon className={`h-6 w-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Equipos Serializados</h4>
                            {groupedMaterial.length > 0 ? (
                                <div className="space-y-1">
                                    {groupedMaterial.map(({ item, units }) => (
                                        <MaterialSubGroup 
                                            key={item.id}
                                            item={item}
                                            units={units}
                                            onTransfer={onTransfer}
                                            onInstall={handleInstall}
                                            onReturn={onReturn}
                                            onReportDefective={onReportDefective}
                                        />
                                    ))}
                                </div>
                            ) : <p className="text-sm text-gray-400 italic">Sin equipos.</p>}
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Material Consumible</h4>
                            {nonSerializedItems.length > 0 ? (
                                <div className="space-y-1">
                                    {nonSerializedItems.map(({ item, quantity }) => (
                                        <MaterialSubGroup key={item.id} item={item} quantity={quantity} />
                                    ))}
                                </div>
                            ) : <p className="text-sm text-gray-400 italic">Sin consumibles.</p>}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export const Technicians: React.FC = () => {
    const { technicians, serializedUnits, inventory, techStock, installUnit, returnUnit, reportDefectiveUnit, deleteTechnician } = useContext(InventoryContext);
    
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isTransferModalOpen, setTransferModalOpen] = useState(false);
    const [unitToTransfer, setUnitToTransfer] = useState<SerializedUnit | null>(null);
    const [techToEdit, setTechToEdit] = useState<Technician | null>(null);

    const unitsByTechnician = useMemo(() => {
        const map = new Map<string, SerializedUnit[]>();
        technicians.forEach(tech => map.set(tech.name, []));
        serializedUnits.forEach(unit => {
            if (unit.status === 'En Técnico') {
                map.get(unit.location)?.push(unit);
            }
        });
        return map;
    }, [technicians, serializedUnits]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Personal Técnico</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de plantilla y materiales en campo.</p>
                </div>
                <Button onClick={() => setAddModalOpen(true)} className="shadow-md"><PlusCircleIcon className="h-5 w-5 mr-2" />Nuevo Técnico</Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {technicians.map(tech => (
                    <TechnicianCard
                        key={tech.id}
                        technician={tech}
                        units={unitsByTechnician.get(tech.name) || []}
                        nonSerializedStock={techStock[tech.id] || {}}
                        inventory={inventory}
                        onEdit={(t) => { setTechToEdit(t); setEditModalOpen(true); }}
                        onDelete={(id) => deleteTechnician(id)}
                        onTransfer={(u) => { setUnitToTransfer(u); setTransferModalOpen(true); }}
                        onInstall={installUnit}
                        onReturn={returnUnit}
                        onReportDefective={reportDefectiveUnit}
                    />
                ))}
            </div>

            {unitToTransfer && <InterTechnicianTransferModal isOpen={isTransferModalOpen} onClose={() => setTransferModalOpen(false)} unit={unitToTransfer} />}
            {techToEdit && <EditTechnicianModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} technician={techToEdit} />}
            <AddTechnicianModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
        </div>
    );
};
