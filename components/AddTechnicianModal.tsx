
import React, { useState, useContext } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { InventoryContext } from '../App';

interface AddTechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddTechnicianModal: React.FC<AddTechnicianModalProps> = ({ isOpen, onClose }) => {
    const { addTechnician } = useContext(InventoryContext);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && username.trim()) {
            addTechnician(name.trim(), username.trim(), password || '1234');
            setName('');
            setUsername('');
            setPassword('');
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nuevo Técnico">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nombre y Apellidos"
                    id="new-tech-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: Pedro Martínez"
                    required
                />
                <Input
                    label="Usuario de Acceso"
                    id="new-tech-username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="pmartinez"
                    required
                />
                <Input
                    label="Contraseña"
                    id="new-tech-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Guardar Registro</Button>
                </div>
            </form>
        </Modal>
    );
};
