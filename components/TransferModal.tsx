
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { InventoryContext } from '../App';
import { generateDeliveryNotePDF, printDeliveryNotePDF } from '../services/pdfService';
import type { Technician, Brand } from '../types';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    serialNumbers: string[];
    brand: Brand;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, serialNumbers, brand }) => {
    const { technicians, transferMultipleUnits, inventory, serializedUnits } = useContext(InventoryContext);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
    
    useEffect(() => {
        if (isOpen) {
            if(technicians.length > 0) {
                setSelectedTechnicianId(technicians[0].id);
            }
        }
    }, [technicians, isOpen]);
    
    const itemsToTransfer = useMemo(() => {
        return serialNumbers.map(sn => {
            const unit = serializedUnits.find(u => u.serialNumber === sn);
            const itemInfo = inventory.find(i => i.id === unit?.itemId);
            return {
                serialNumber: sn,
                material: itemInfo?.material || 'Desconocido',
                code: itemInfo?.code || 'N/A',
            };
        });
    }, [serialNumbers, serializedUnits, inventory]);

    const handleSubmit = () => {
        if (selectedTechnicianId && serialNumbers.length > 0) {
            // Fix: The transferMultipleUnits function requires the brand argument as the 3rd parameter.
            transferMultipleUnits(serialNumbers, selectedTechnicianId, brand);
            onClose();
        } else {
            alert('Por favor, seleccione un técnico.');
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Traspasar ${serialNumbers.length} Equipos`}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-gray-800 mb-2">Equipos a traspasar:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside max-h-40 overflow-y-auto bg-gray-50 p-2 rounded">
                        {itemsToTransfer.map(item => <li key={item.serialNumber}><span className="font-semibold">{item.material}</span> - <span className="font-mono">{item.serialNumber}</span></li>)}
                    </ul>
                </div>
                <Select
                    label="Asignar a Técnico"
                    id="technician-transfer"
                    value={selectedTechnicianId}
                    onChange={(e) => setSelectedTechnicianId(e.target.value)}
                >
                    {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                </Select>
                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Confirmar Traspaso</Button>
                </div>
            </div>
        </Modal>
    );
};
