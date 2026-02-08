import React, { useState, useContext, useMemo } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { InventoryContext } from '../App';
import type { InventoryItem, Brand, Category } from '../types';
import { modelData } from '../data/initialData';

const NEW_ENTRY_VALUE = '--- CREAR NUEVO ---';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
    const { addStock, inventory } = useContext(InventoryContext);
    const [isSerialized, setIsSerialized] = useState(true);
    const [serials, setSerials] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [selectedBrand, setSelectedBrand] = useState<Brand>('ORANGE');
    const [selectedCategory, setSelectedCategory] = useState<Category>('Routers');
    const [newCategory, setNewCategory] = useState('');
    const [newMaterial, setNewMaterial] = useState('');
    const [newCode, setNewCode] = useState('');

    const existingCategories = useMemo(() => {
        return [...new Set(inventory.filter(i => i.brand === selectedBrand).map(i => i.category))];
    }, [inventory, selectedBrand]);

    const materialOptions = useMemo(() => {
        if (selectedCategory === NEW_ENTRY_VALUE) return [];
        return [...new Set(inventory.filter(i => i.brand === selectedBrand && i.category === selectedCategory).map(i => `${i.code} - ${i.material}`))]
    }, [inventory, selectedBrand, selectedCategory]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const finalCategory = selectedCategory === NEW_ENTRY_VALUE ? newCategory : selectedCategory;
        const finalCode = materialOptions.length > 0 ? (e.currentTarget.material as any).value.split(' - ')[0] : newCode;
        const finalMaterial = materialOptions.length > 0 ? (e.currentTarget.material as any).value.split(' - ')[1] : newMaterial;

        if (!finalCategory || !finalCode || !finalMaterial) {
            alert("Por favor, complete todos los campos para el nuevo material.");
            return;
        }

        const lowStockThreshold = parseInt((e.currentTarget.lowStockThreshold as any).value);

        const newItem: Omit<InventoryItem, 'id' | 'stock'> = {
            code: finalCode,
            material: finalMaterial,
            family: `${selectedBrand} - ${finalCategory}`,
            value: 0,
            lowStockThreshold,
            hasSerialNumber: isSerialized,
            brand: selectedBrand,
            category: finalCategory,
        };

        const serialsArray = isSerialized ? serials.split('\n').filter(s => s.trim() !== '') : [];
        const finalQuantity = isSerialized ? serialsArray.length : parseInt(quantity, 10);
        
        if (finalQuantity > 0) {
            addStock(newItem, finalQuantity, serialsArray);
            onClose();
        } else {
            alert("La cantidad o los números de serie no pueden estar vacíos.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Entrada de Stock">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="Operadora" name="brand" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value as Brand)}>
                    <option value="ORANGE">ORANGE</option>
                    <option value="MASMOVIL">MASMOVIL</option>
                </Select>

                <Select label="Categoría" name="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as Category)}>
                    {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value={NEW_ENTRY_VALUE}>{NEW_ENTRY_VALUE}</option>
                </Select>
                {selectedCategory === NEW_ENTRY_VALUE && <Input label="Nombre Nueva Categoría" value={newCategory} onChange={e => setNewCategory(e.target.value)} required />}

                {materialOptions.length > 0 && selectedCategory !== NEW_ENTRY_VALUE ? (
                    <Select label="Material / Modelo" name="material" id="material" required>
                         {materialOptions.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                    </Select>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                         <Input label="Nuevo Código" value={newCode} onChange={e => setNewCode(e.target.value)} required/>
                         <Input label="Nuevo Material" value={newMaterial} onChange={e => setNewMaterial(e.target.value)} required/>
                    </div>
                )}
                
                <Input label="Umbral Stock Bajo" name="lowStockThreshold" id="lowStockThreshold" type="number" defaultValue={5} required />
                
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input type="radio" name="stockType" checked={isSerialized} onChange={() => setIsSerialized(true)} className="form-radio text-orange-600" />
                        <span className="ml-2">Con N.º Serie</span>
                    </label>
                     <label className="flex items-center">
                        <input type="radio" name="stockType" checked={!isSerialized} onChange={() => setIsSerialized(false)} className="form-radio text-orange-600" />
                        <span className="ml-2">Sin N.º Serie (Cantidad)</span>
                    </label>
                </div>

                {isSerialized ? (
                    <div>
                        <label htmlFor="serials" className="block text-sm font-medium text-gray-700 mb-1">Nuevos Números de Serie</label>
                        <p className="text-xs text-gray-500 mb-2">Introduzca cada número de serie en una nueva línea. La cantidad se calculará automáticamente.</p>
                        <textarea 
                            id="serials" 
                            name="serials" 
                            rows={4} 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            value={serials} 
                            onChange={(e) => setSerials(e.target.value)} 
                            placeholder="SN-XXXX-001&#10;SN-XXXX-002&#10;SN-XXXX-003" 
                        />
                    </div>
                ) : (
                    <Input label="Cantidad" name="quantity" id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" required/>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Añadir Stock</Button>
                </div>
            </form>
        </Modal>
    );
};