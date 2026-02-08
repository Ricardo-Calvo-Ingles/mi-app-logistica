
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { initialInventory, initialTechnicians, initialSerializedUnits } from './data/initialData';
import type { InventoryItem, Technician, SerializedUnit, Transaction, View, Brand, User, UnitStatus, TransactionType, Albaran } from './types';
import { AddItemModal } from './components/AddItemModal';
import { Login } from './components/Login';
import { BrandSelection } from './components/BrandSelection';
import { InventoryDashboard } from './components/InventoryDashboard';
import { TransferView } from './components/TransferView';
import { Technicians as TechniciansView } from './components/Technicians';
import { Audit } from './components/Audit';
import { ReturnsDashboard } from './components/ReturnsDashboard';
import { Admin } from './components/Admin';
import { ToastProvider, useToast } from './components/ToastProvider';
import { AiAssistant } from './components/AiAssistant';

const loadState = <T,>(key: string, fallback: T, reviver?: (key: any, value: any) => any): T => {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) return fallback;
        return JSON.parse(serializedState, reviver);
    } catch (err) {
        return fallback;
    }
};

const saveState = <T,>(key: string, state: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {}
};

const transactionReviver = (key: string, value: any) => {
    if (key === 'date' && typeof value === 'string') return new Date(value);
    return value;
};

const albaranReviver = (key: string, value: any) => {
    if (key === 'date' && typeof value === 'string') return new Date(value);
    return value;
};

export const InventoryContext = React.createContext<{
    inventory: InventoryItem[];
    technicians: Technician[];
    serializedUnits: SerializedUnit[];
    transactions: Transaction[];
    albaranes: Albaran[];
    techStock: Record<string, Record<string, number>>;
    addStock: (item: Omit<InventoryItem, 'id' | 'stock'>, quantity: number, serials: string[]) => void;
    updateItem: (id: string, updates: Partial<InventoryItem>) => void;
    removeItem: (id: string) => void;
    removeUnit: (serialNumber: string) => void;
    assignUnit: (serialNumber: string, technicianId: string) => void;
    installUnit: (serialNumber: string, clientName: string) => void;
    returnUnit: (serialNumber: string) => void;
    reportDefectiveUnit: (serialNumber: string) => void;
    manageReviewedUnit: (serialNumber: string, newStatus: UnitStatus) => void;
    transferMultipleUnits: (serialNumbers: string[], technicianId: string, brand: Brand, nonSerializedItems?: {itemId: string, quantity: number}[]) => void;
    transferUnitBetweenTechnicians: (serialNumber: string, toTechnicianId: string) => void;
    addTechnician: (name: string, username: string, password?: string) => void;
    deleteTechnician: (technicianId: string) => void;
    updateTechnician: (id: string, name: string, username: string, password?: string) => void;
}>({
    inventory: [], technicians: [], serializedUnits: [], transactions: [], albaranes: [], techStock: {},
    addStock: () => {}, updateItem: () => {}, removeItem: () => {}, removeUnit: () => {},
    assignUnit: () => {}, installUnit: () => {}, returnUnit: () => {},
    reportDefectiveUnit: () => {}, manageReviewedUnit: () => {}, transferMultipleUnits: () => {},
    transferUnitBetweenTechnicians: () => {}, addTechnician: () => {}, deleteTechnician: () => {}, updateTechnician: () => {},
});

const AppContent: React.FC = () => {
    const { showToast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [inventory, setInventory] = useState<InventoryItem[]>(() => loadState('inventory', initialInventory));
    const [technicians, setTechnicians] = useState<Technician[]>(() => loadState('technicians', initialTechnicians));
    const [serializedUnits, setSerializedUnits] = useState<SerializedUnit[]>(() => loadState('serializedUnits', initialSerializedUnits));
    const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', [], transactionReviver));
    const [albaranes, setAlbaranes] = useState<Albaran[]>(() => loadState('albaranes', [], albaranReviver));
    const [techStock, setTechStock] = useState<Record<string, Record<string, number>>>(() => loadState('techStock', {}));
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);

    useEffect(() => { saveState('inventory', inventory); }, [inventory]);
    useEffect(() => { saveState('technicians', technicians); }, [technicians]);
    useEffect(() => { saveState('serializedUnits', serializedUnits); }, [serializedUnits]);
    useEffect(() => { saveState('transactions', transactions); }, [transactions]);
    useEffect(() => { saveState('albaranes', albaranes); }, [albaranes]);
    useEffect(() => { saveState('techStock', techStock); }, [techStock]);

    const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
        setTransactions(prev => [...prev, { ...transaction, id: `trans-${Date.now()}`, date: new Date() }]);
    }, []);

    const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        showToast("Material actualizado correctamente.");
    }, [showToast]);

    const removeItem = useCallback((id: string) => {
        setInventory(prev => prev.filter(item => item.id !== id));
        setSerializedUnits(prev => prev.filter(unit => unit.itemId !== id));
        showToast("Material y sus unidades eliminados.");
    }, [showToast]);

    const removeUnit = useCallback((serialNumber: string) => {
        setSerializedUnits(prev => {
            const unit = prev.find(u => u.serialNumber === serialNumber);
            if (unit) {
                setInventory(inv => inv.map(item => {
                    if (item.id === unit.itemId) {
                        return { ...item, stock: Math.max(0, item.stock - 1) };
                    }
                    return item;
                }));
            }
            return prev.filter(u => u.serialNumber !== serialNumber);
        });
        showToast(`Unidad ${serialNumber} eliminada.`);
    }, [showToast]);

    const transferMultipleUnits = useCallback((serialNumbers: string[], technicianId: string, brand: Brand, nonSerializedItems: {itemId: string, quantity: number}[] = []) => {
        const technician = technicians.find(t => t.id === technicianId);
        if (!technician) return;

        if (serialNumbers.length > 0) {
            setSerializedUnits(prev => prev.map(u => {
                if (serialNumbers.includes(u.serialNumber)) {
                    addTransaction({ type: 'Traspaso', itemId: u.itemId, serialNumber: u.serialNumber, from: 'Almacén Central', to: technician.name });
                    return { ...u, status: 'En Técnico' as UnitStatus, location: technician.name };
                }
                return u;
            }));
        }

        if (nonSerializedItems.length > 0) {
            setInventory(prev => prev.map(item => {
                const transferInfo = nonSerializedItems.find(ns => ns.itemId === item.id);
                if (transferInfo) {
                    addTransaction({ type: 'Traspaso', itemId: item.id, quantity: transferInfo.quantity, from: 'Almacén Central', to: technician.name });
                    return { ...item, stock: item.stock - transferInfo.quantity };
                }
                return item;
            }));

            setTechStock(prev => {
                const newTechStock = { ...prev };
                if (!newTechStock[technicianId]) newTechStock[technicianId] = {};
                nonSerializedItems.forEach(ns => {
                    const currentQty = newTechStock[technicianId][ns.itemId] || 0;
                    newTechStock[technicianId][ns.itemId] = currentQty + ns.quantity;
                });
                return newTechStock;
            });
        }

        // Registrar Albarán
        const newAlbaran: Albaran = {
            id: `AL-${Date.now()}`,
            technicianId,
            technicianName: technician.name,
            date: new Date(),
            itemCount: serialNumbers.length + nonSerializedItems.length,
            brand
        };
        setAlbaranes(prev => [newAlbaran, ...prev]);

        showToast(`Traspaso a ${technician.name} procesado.`);
    }, [technicians, addTransaction, showToast]);

    const assignUnit = useCallback((serialNumber: string, technicianId: string) => {
        const technician = technicians.find(t => t.id === technicianId);
        if (!technician) return;
        setSerializedUnits(prev => {
            const unit = prev.find(u => u.serialNumber === serialNumber);
            if (!unit) return prev;
            addTransaction({ type: 'Asignación', itemId: unit.itemId, serialNumber, from: 'Almacén Central', to: technician.name });
            return prev.map(u => u.serialNumber === serialNumber ? { ...u, status: 'En Técnico' as UnitStatus, location: technician.name } : u);
        });
    }, [technicians, addTransaction]);

    const installUnit = useCallback((serialNumber: string, clientName: string) => {
        setSerializedUnits(prev => {
            const unit = prev.find(u => u.serialNumber === serialNumber);
            if (!unit) return prev;
            addTransaction({ type: 'Instalación', itemId: unit.itemId, serialNumber, from: unit.location, to: clientName });
            return prev.map(u => u.serialNumber === serialNumber ? { ...u, status: 'Instalado' as UnitStatus, location: clientName } : u);
        });
    }, [addTransaction]);

    const returnUnit = useCallback((serialNumber: string) => {
        setSerializedUnits(prev => {
            const unit = prev.find(u => u.serialNumber === serialNumber);
            if (!unit) return prev;
            addTransaction({ type: 'Devolución', itemId: unit.itemId, serialNumber, from: unit.location, to: 'Almacén Central'});
            return prev.map(u => u.serialNumber === serialNumber ? { ...u, status: 'Almacén Central' as UnitStatus, location: 'Almacén Central' } : u);
        });
    }, [addTransaction]);

    const reportDefectiveUnit = useCallback((serialNumber: string) => {
        setSerializedUnits(prev => {
            const unit = prev.find(u => u.serialNumber === serialNumber);
            if (!unit) return prev;
            addTransaction({ type: 'Reporte Defectuoso', itemId: unit.itemId, serialNumber, from: unit.location, to: 'Pendiente de Revisión'});
            return prev.map(u => u.serialNumber === serialNumber ? { ...u, status: 'Pendiente de Revisión' as UnitStatus, location: 'Almacén Central' } : u);
        });
    }, [addTransaction]);

    const addStock = useCallback((item: any, quantity: number, serials: string[]) => {
        const newItem: InventoryItem = {
            ...item,
            id: `item-${Date.now()}`,
            stock: item.hasSerialNumber ? serials.length : quantity,
        };
        setInventory(prev => [...prev, newItem]);
        if (item.hasSerialNumber) {
            const newUnits: SerializedUnit[] = serials.map(sn => ({
                serialNumber: sn,
                itemId: newItem.id,
                status: 'Almacén Central' as UnitStatus,
                location: 'Almacén Central'
            }));
            setSerializedUnits(prev => [...prev, ...newUnits]);
        }
        addTransaction({ type: 'Entrada', itemId: newItem.id, quantity: newItem.stock, from: 'Proveedor', to: 'Almacén Central' });
        showToast("Stock añadido correctamente.");
    }, [addTransaction, showToast]);

    const manageReviewedUnit = useCallback((serialNumber: string, newStatus: UnitStatus) => {
        setSerializedUnits(prev => {
            const unit = prev.find(u => u.serialNumber === serialNumber);
            if (!unit) return prev;
            addTransaction({ type: 'Revisión Aprobada', itemId: unit.itemId, serialNumber, from: unit.status, to: newStatus });
            return prev.map(u => u.serialNumber === serialNumber ? { ...u, status: newStatus, location: 'Almacén Central' } : u);
        });
    }, [addTransaction]);

    const transferUnitBetweenTechnicians = useCallback((serialNumber: string, toTechnicianId: string) => {
        const toTech = technicians.find(t => t.id === toTechnicianId);
        if (!toTech) return;
        setSerializedUnits(prev => {
            const unit = prev.find(u => u.serialNumber === serialNumber);
            if (!unit) return prev;
            addTransaction({ type: 'Traspaso', itemId: unit.itemId, serialNumber, from: unit.location, to: toTech.name });
            return prev.map(u => u.serialNumber === serialNumber ? { ...u, status: 'En Técnico' as UnitStatus, location: toTech.name } : u);
        });
    }, [technicians, addTransaction]);

    const addTechnician = useCallback((name: string, username: string, password?: string) => {
        const newTech: Technician = { id: `tech-${Date.now()}`, name, username, password: password || '1234' };
        setTechnicians(prev => [...prev, newTech]);
        showToast(`Técnico ${name} registrado.`);
    }, [showToast]);

    const deleteTechnician = useCallback((id: string) => {
        setTechnicians(prev => prev.filter(t => t.id !== id));
        showToast("Técnico eliminado.");
    }, [showToast]);

    const updateTechnician = useCallback((id: string, name: string, username: string, password?: string) => {
        setTechnicians(prev => prev.map(t => t.id === id ? { ...t, name, username, password: password || t.password } : t));
        showToast("Datos actualizados.");
    }, [showToast]);

    const contextValue = useMemo(() => ({
        inventory, technicians, serializedUnits, transactions, albaranes, techStock,
        addStock, updateItem, removeItem, removeUnit, assignUnit, installUnit, returnUnit, reportDefectiveUnit, manageReviewedUnit,
        transferMultipleUnits, transferUnitBetweenTechnicians, addTechnician, deleteTechnician, updateTechnician
    }), [inventory, technicians, serializedUnits, transactions, albaranes, techStock, transferMultipleUnits, addStock, updateItem, removeItem, removeUnit, assignUnit, installUnit, returnUnit, reportDefectiveUnit, manageReviewedUnit, transferUnitBetweenTechnicians, addTechnician, deleteTechnician, updateTechnician]);

    const renderContent = () => {
        if (!selectedBrand) return <BrandSelection onSelectBrand={setSelectedBrand} />;
        switch(view) {
            case 'dashboard': return <InventoryDashboard brand={selectedBrand} />;
            case 'transfer': return <TransferView brand={selectedBrand} />;
            case 'technicians': return <TechniciansView />;
            case 'audit': return <Audit />;
            case 'returns': return <ReturnsDashboard />;
            case 'admin': return <Admin />;
            default: return <InventoryDashboard brand={selectedBrand} />;
        }
    };

    if (!user) return <Login onLogin={setUser} />;

    return (
        <InventoryContext.Provider value={contextValue}>
            <div className="relative flex h-screen bg-altri-dark text-white">
                <Sidebar setView={setView} currentView={view} userRole={user.role} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header onAddStock={() => setAddItemModalOpen(true)} onLogout={() => setUser(null)} selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
                         <div className="app-container p-4 md:p-6 lg:p-8">
                             {renderContent()}
                         </div>
                    </main>
                </div>
                <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setAddItemModalOpen(false)} />
                <AiAssistant />
            </div>
        </InventoryContext.Provider>
    );
};

export default function App() { 
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    ); 
}
