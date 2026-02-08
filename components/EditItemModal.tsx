
import React, { useState, useContext, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { InventoryContext } from '../App';
import type { InventoryItem } from '../types';

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item }) => {
    const { updateItem } = useContext(InventoryContext);
    const [material, setMaterial] = useState('');
    const [code, setCode] = useState('');
    const [category, setCategory] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(0);

    useEffect(() => {
        if (item) {
            setMaterial(item.material);
            setCode(item.code);
            setCategory(item.category);
            setLowStockThreshold(item.lowStockThreshold);
        }
    }, [item, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateItem(item.id, {
            material,
            code,
            category,
            lowStockThreshold,
            family: `${item.brand} - ${category}`
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Material">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Descripción Material" value={material} onChange={e => setMaterial(e.target.value)} required />
                <Input label="Código" value={code} onChange={e => setCode(e.target.value)} required />
                <Input label="Categoría" value={category} onChange={e => setCategory(e.target.value)} required />
                <Input label="Umbral Stock Bajo" type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(parseInt(e.target.value))} required />
                
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Guardar Cambios</Button>
                </div>
            </form>
        </Modal>
    );
};
