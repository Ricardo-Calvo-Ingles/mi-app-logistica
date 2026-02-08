import React, { useContext, useMemo, useState, useEffect } from 'react';
import { InventoryContext } from '../App';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import type { SerializedUnit, Transaction } from '../types';

const CurrentStatusCard: React.FC<{ unit: SerializedUnit, lastTransaction?: Transaction }> = ({ unit, lastTransaction }) => {
    
    const getStatusColor = () => {
        switch(unit.status) {
            case 'Almacén Central': return 'border-blue-500';
            case 'En Técnico': return 'border-yellow-500';
            case 'Instalado': return 'border-green-500';
            case 'Pendiente de Revisión': return 'border-orange-500';
            case 'En Reparación / RMA': return 'border-purple-500';
            case 'Defectuoso (De Baja)': return 'border-red-500';
            default: return 'border-gray-500';
        }
    };
    
    return (
        <Card className={`border-l-4 ${getStatusColor()} mb-6`}>
            <h3 className="text-lg font-bold text-gray-800">Estado Actual: {unit.serialNumber}</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="font-semibold text-gray-600">Estado</p>
                    <p className="text-gray-900">{unit.status}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Ubicación</p>
                    <p className="text-gray-900">{unit.location}</p>
                </div>
                 <div>
                    <p className="font-semibold text-gray-600">Último Movimiento</p>
                    <p className="text-gray-900">{lastTransaction ? lastTransaction.date.toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </Card>
    );
};

export const Audit: React.FC = () => {
    const { transactions, inventory, serializedUnits } = useContext(InventoryContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedUnit, setSearchedUnit] = useState<SerializedUnit | null>(null);

    const getItemName = (itemId: string) => {
        return inventory.find(i => i.id === itemId)?.material || 'N/A';
    };

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => !searchTerm || (t.serialNumber && t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())))
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map(t => ({
                ...t,
                materialName: getItemName(t.itemId),
            }));
    }, [transactions, searchTerm, inventory]);
    
    useEffect(() => {
        if (searchTerm.trim()) {
            const unit = serializedUnits.find(u => u.serialNumber.toLowerCase() === searchTerm.toLowerCase().trim());
            setSearchedUnit(unit || null);
        } else {
            setSearchedUnit(null);
        }
    }, [searchTerm, serializedUnits]);
    
    const handleDownloadExcel = () => {
        const headers = ["Fecha", "Tipo", "Material", "N.º Serie / Cant.", "Desde", "Hasta"];
        
        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                `"${t.date.toLocaleString()}"`,
                t.type,
                `"${t.materialName}"`,
                t.serialNumber || `x${t.quantity}`,
                `"${t.from}"`,
                `"${t.to}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_auditoria_${new Date().toISOString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Auditoría de Movimientos</h1>
                <Button onClick={handleDownloadExcel}>Descargar Excel</Button>
            </div>
            
            <Card>
                <div className="mb-4 max-w-sm">
                    <Input 
                        label="Buscar por Número de Serie" 
                        id="audit-search" 
                        placeholder="Introduzca N/S para ver estado actual..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {searchedUnit && <CurrentStatusCard unit={searchedUnit} lastTransaction={filteredTransactions[0]} />}

                <h3 className="text-xl font-semibold mb-4">{searchTerm ? `Historial de ${searchTerm}` : 'Historial de Movimientos Recientes'}</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white responsive-table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N.º Serie / Cant.</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desde</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id}>
                                    <td data-label="Fecha" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date.toLocaleString()}</td>
                                    <td data-label="Tipo" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.type}</td>
                                    <td data-label="Material" className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.materialName}</td>
                                    <td data-label="N.º Serie / Cant." className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{t.serialNumber || `x${t.quantity}`}</td>
                                    <td data-label="Desde" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.from}</td>
                                    <td data-label="Hasta" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.to}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};