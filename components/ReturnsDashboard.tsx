import React, { useContext, useMemo } from 'react';
import { InventoryContext } from '../App';
import { Card } from './ui/Card';
import type { SerializedUnit, UnitStatus } from '../types';
import { Button } from './ui/Button';

interface StatusSectionProps {
    title: string;
    units: SerializedUnit[];
    inventory: any[];
    actions?: (unit: SerializedUnit) => React.ReactNode;
}

const StatusSection: React.FC<StatusSectionProps> = ({ title, units, inventory, actions }) => {
    const detailedUnits = useMemo(() => {
        return units.map(unit => {
            const item = inventory.find(i => i.id === unit.itemId);
            return {
                ...unit,
                material: item?.material || 'N/A',
                code: item?.code || 'N/A',
            };
        }).sort((a,b) => a.material.localeCompare(b.material));
    }, [units, inventory]);

    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4">{title} ({detailedUnits.length})</h2>
            <div className="overflow-x-auto">
                {detailedUnits.length > 0 ? (
                    <table className="min-w-full bg-white responsive-table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N.º Serie</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación Actual</th>
                                {actions && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {detailedUnits.map(unit => (
                                <tr key={unit.serialNumber}>
                                    <td data-label="N.º Serie" className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{unit.serialNumber}</td>
                                    <td data-label="Material" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{unit.material}</td>
                                    <td data-label="Código" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.code}</td>
                                    <td data-label="Ubicación" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.location}</td>
                                    {actions && <td data-label="Acciones" className="px-6 py-4 whitespace-nowrap text-right actions-cell"><div className="space-x-2">{actions(unit)}</div></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 py-8">No hay equipos en este estado.</p>
                )}
            </div>
        </Card>
    );
};

export const ReturnsDashboard: React.FC = () => {
    const { serializedUnits, inventory, manageReviewedUnit } = useContext(InventoryContext);

    const unitsByStatus = useMemo(() => {
        const statuses: UnitStatus[] = ['Pendiente de Revisión', 'En Reparación / RMA', 'Defectuoso (De Baja)'];
        const grouped = new Map<UnitStatus, SerializedUnit[]>();
        statuses.forEach(s => grouped.set(s, []));

        serializedUnits.forEach(unit => {
            if (grouped.has(unit.status)) {
                grouped.get(unit.status)?.push(unit);
            }
        });
        return grouped;
    }, [serializedUnits]);
    
    const handleManageUnit = (serialNumber: string, newStatus: UnitStatus) => {
        const actionText = {
            'Almacén Central': 'aprobar y devolver al stock',
            'En Reparación / RMA': 'enviar a RMA',
            'Defectuoso (De Baja)': 'dar de baja permanentemente'
        };

        if (window.confirm(`¿Seguro que quiere ${actionText[newStatus]} el equipo ${serialNumber}?`)) {
            manageReviewedUnit(serialNumber, newStatus);
        }
    };

    const reviewActions = (unit: SerializedUnit) => (
        <>
            <Button size="sm" variant="primary" onClick={() => handleManageUnit(unit.serialNumber, 'Almacén Central')}>Aprobar</Button>
            <Button size="sm" variant="secondary" onClick={() => handleManageUnit(unit.serialNumber, 'En Reparación / RMA')}>Enviar a RMA</Button>
            <Button size="sm" variant="danger" onClick={() => handleManageUnit(unit.serialNumber, 'Defectuoso (De Baja)')}>Dar de Baja</Button>
        </>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Devoluciones y RMA</h1>
            
            <StatusSection 
                title="Pendiente de Revisión"
                units={unitsByStatus.get('Pendiente de Revisión') || []}
                inventory={inventory}
                actions={reviewActions}
            />

            <StatusSection 
                title="En Reparación / RMA"
                units={unitsByStatus.get('En Reparación / RMA') || []}
                inventory={inventory}
            />

            <StatusSection 
                title="Defectuoso (De Baja)"
                units={unitsByStatus.get('Defectuoso (De Baja)') || []}
                inventory={inventory}
            />
        </div>
    );
};