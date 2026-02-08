
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { InventoryContext } from '../App';
import type { SerializedUnit, Technician } from '../types';

interface InterTechnicianTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: SerializedUnit;
}

export const InterTechnicianTransferModal: React.FC<InterTechnicianTransferModalProps> = ({ isOpen, onClose, unit }) => {
    const { technicians, transferUnitBetweenTechnicians, inventory } = useContext(InventoryContext);
    const [selectedTechnician, setSelectedTechnician] = useState<string>('');
    
    const item = inventory.find(i => i.id === unit.itemId);
    
    const availableTechnicians = useMemo(() => {
        return technicians.filter(t => t.name !== unit.location);
    }, [technicians, unit.location]);

    useEffect(() => {
        if(availableTechnicians.length > 0) {
            setSelectedTechnician(availableTechnicians[0].id);
        }
    }, [availableTechnicians, isOpen]);
    
    const handleSubmit = () => {
        if (selectedTechnician) {
            transferUnitBetweenTechnicians(unit.serialNumber, selectedTechnician);
            onClose();
        } else {
            alert('Por favor, seleccione un técnico de destino.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Traspasar Material entre Técnicos">
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium text-gray-800">{item?.material}</p>
                    <p className="text-sm text-gray-500 mt-2">N.º Serie</p>
                    <p className="font-mono">{unit.serialNumber}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500">Desde</p>
                    <p className="font-medium text-gray-800">{unit.location}</p>
                </div>
                <Select
                    label="Traspasar a"
                    id="technician-inter-transfer"
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                >
                    {availableTechnicians.map((tech) => (
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
