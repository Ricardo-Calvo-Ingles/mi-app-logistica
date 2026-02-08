
import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { Technician, CartItem } from '../types';

interface ConfirmTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    technician: Technician | undefined;
    items: CartItem[];
    onConfirm: () => void;
    action: 'download' | 'print' | null;
}

export const ConfirmTransferModal: React.FC<ConfirmTransferModalProps> = ({ isOpen, onClose, technician, items, onConfirm, action }) => {
    if (!technician || !action) return null;

    const title = action === 'download' ? 'Confirmar Descarga de Albarán' : 'Confirmar Impresión de Albarán';
    const confirmButtonText = action === 'download' ? 'Confirmar y Descargar' : 'Confirmar e Imprimir';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <div>
                    <p className="text-sm text-gray-500">Técnico Destinatario</p>
                    <p className="font-bold text-lg text-gray-800">{technician.name}</p>
                </div>

                <div>
                    <h4 className="font-medium text-gray-800 mb-2">Resumen de Material ({items.length} ítems):</h4>
                    <div className="max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-lg border">
                        <ul className="space-y-2">
                            {items.map((item, index) => (
                                <li key={index} className="text-sm">
                                    <p className="font-semibold text-gray-700">{item.material} {item.itemId === undefined && <span className="text-blue-600 font-normal">(Manual)</span>}</p>
                                    <p className="font-mono text-gray-500">
                                        {item.serialNumber ? item.serialNumber : `Cantidad: ${item.quantity}`}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={onConfirm}>
                        {confirmButtonText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
