
import React, { useContext, useMemo } from 'react';
import type { SerializedUnit } from '../types';
import { InventoryContext } from '../App';
import { Button } from './ui/Button';

interface InventoryTableProps {
    units: SerializedUnit[];
    showCheckboxes?: boolean;
    selectedUnits?: string[];
    onSelectionChange?: (serialNumber: string) => void;
    onAssign?: (unit: SerializedUnit) => void;
    onInstall?: (serialNumber: string) => void;
    onReturn?: (serialNumber: string) => void;
    onTransfer?: (unit: SerializedUnit) => void;
    onReportDefective?: (serialNumber: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ 
    units, 
    showCheckboxes = false,
    selectedUnits = [],
    onSelectionChange,
    onAssign, 
    onInstall, 
    onReturn,
    onTransfer,
    onReportDefective
}) => {
    const { inventory } = useContext(InventoryContext);

    const detailedUnits = useMemo(() => {
        return units.map(unit => {
            const item = inventory.find(i => i.id === unit.itemId);
            return {
                ...unit,
                code: item?.code || 'N/A',
                material: item?.material || 'N/A',
                family: item?.family || 'N/A',
                stockValue: item?.stock || 0,
            };
        });
    }, [units, inventory]);

    const getStatusClass = (val: number) => {
        if (val <= 5) return 'status-red';
        if (val <= 15) return 'status-amber';
        return 'status-green';
    };

    if (detailedUnits.length === 0) {
        return <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-center py-12 border-2 border-dashed border-white/5 rounded-3xl text-[12px]">EMPTY_SET: No hay datos en este segmento.</p>;
    }

    return (
        <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-white/10 shadow-2xl">
            <table className="cyber-table">
                <thead>
                    <tr>
                        {showCheckboxes && <th className="w-10 text-center"></th>}
                        <th className="text-left font-black tracking-widest px-6">N.º SERIE</th>
                        <th className="text-left font-black tracking-widest px-6">MATERIAL_COMMAND</th>
                        <th className="text-left font-black tracking-widest px-6">SAP_IDENT</th>
                        <th className="text-left font-black tracking-widest px-6">STATUS_LOG</th>
                        <th className="text-center font-black tracking-widest px-6">STOCK_LVL</th>
                        <th className="text-right font-black tracking-widest px-6">COMANDOS</th>
                    </tr>
                </thead>
                <tbody>
                    {detailedUnits.map((unit) => (
                        <tr key={unit.serialNumber} className="hover:bg-white/[0.04] transition-all border-b border-white/5 last:border-0 group">
                            {showCheckboxes && (
                                <td className="text-center">
                                    {unit.status === 'Almacén Central' && onSelectionChange && (
                                         <input 
                                            type="checkbox"
                                            className="h-5 w-5 accent-altri-blue bg-black border-white/20 rounded cursor-pointer"
                                            checked={selectedUnits.includes(unit.serialNumber)}
                                            onChange={() => onSelectionChange(unit.serialNumber)}
                                         />
                                    )}
                                </td>
                            )}
                            <td className="font-black font-mono text-altri-orange text-[11px] px-6 group-hover:glow-text transition-all">{unit.serialNumber}</td>
                            <td className="text-white text-[11px] font-black px-6 uppercase tracking-tight">{unit.material}</td>
                            <td className="text-altri-blue font-black font-mono text-[10px] px-6">{unit.code}</td>
                            <td className="px-6">
                                <span className="uppercase text-[9px] font-black text-gray-300 px-3 py-1 bg-white/10 rounded-lg border border-white/10">
                                    {unit.status}
                                </span>
                            </td>
                            <td className={`text-center font-black text-[12px] px-6 ${getStatusClass(unit.stockValue)} rounded-lg border-2 border-white/5`}>
                                {unit.stockValue.toString().padStart(2, '0')}
                            </td>
                            <td className="text-right space-x-2 px-6">
                                {onAssign && unit.status === 'Almacén Central' && (
                                    <Button size="sm" variant="primary" onClick={() => onAssign(unit)} className="text-[9px] py-1.5 px-3">Asignar</Button>
                                )}
                                {onInstall && unit.status === 'En Técnico' && (
                                    <Button size="sm" variant="primary" onClick={() => onInstall(unit.serialNumber)} className="text-[9px] py-1.5 px-3">Instalar</Button>
                                )}
                                {onReturn && unit.status === 'En Técnico' && (
                                    <Button size="sm" variant="secondary" onClick={() => onReturn(unit.serialNumber)} className="text-[9px] py-1.5 px-3">Devolver</Button>
                                )}
                                 {onReportDefective && unit.status === 'En Técnico' && (
                                    <Button size="sm" variant="danger" onClick={() => onReportDefective(unit.serialNumber)} className="text-[9px] py-1.5 px-3">Baja</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
