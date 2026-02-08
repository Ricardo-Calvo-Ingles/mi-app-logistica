
import React, { useState, useContext, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import type { SerializedUnit } from '../types';
import { InventoryContext } from '../App';

interface AssignItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: SerializedUnit;
}

export const AssignItemModal: React.FC<AssignItemModalProps> = ({ isOpen, onClose, unit }) => {
    const { technicians, assignUnit, inventory } = useContext(InventoryContext);
    const [selectedTechnician, setSelectedTechnician] = useState<string>('');
    
    const item = inventory.find(i => i.id === unit.itemId);

    useEffect(() => {
        if(technicians.length > 0) {
            setSelectedTechnician(technicians[0].id);
        }
    }, [technicians]);
    
    const handleSubmit = () => {
        if (selectedTechnician) {
            assignUnit(unit.serialNumber, selectedTechnician);
            onClose();
        } else {
            alert('Por favor, seleccione un técnico.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Asignar Material a Técnico">
            <div className="space-y-4">
                <div>
                    <p className="font-medium text-gray-800">{item?.material}</p>
                    <p className="text-sm text-gray-500">N.º Serie: <span className="font-mono">{unit.serialNumber}</span></p>
                </div>
                <Select
                    label="Seleccionar Técnico"
                    id="technician"
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                >
                    {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                </Select>
                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Asignar Material</Button>
                </div>
            </div>
        </Modal>
    );
};
