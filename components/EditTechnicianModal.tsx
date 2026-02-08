import React, { useState, useContext, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { Technician } from '../types';
import { InventoryContext } from '../App';

interface EditTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    technician: Technician;
}

export const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({ isOpen, onClose, technician }) => {
    const { updateTechnician } = useContext(InventoryContext);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (technician) {
            setName(technician.name);
            setUsername(technician.username);
            setPassword('');
        }
    }, [technician, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && username.trim()) {
            updateTechnician(technician.id, name.trim(), username.trim(), password);
            onClose();
        } else {
            alert('El nombre y el usuario no pueden estar vacíos.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Técnico">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nombre Completo"
                    id="edit-tech-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <Input
                    label="Usuario"
                    id="edit-tech-username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <Input
                    label="Nueva Contraseña (dejar en blanco para no cambiar)"
                    id="edit-tech-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Guardar Cambios</Button>
                </div>
            </form>
        </Modal>
    );
};