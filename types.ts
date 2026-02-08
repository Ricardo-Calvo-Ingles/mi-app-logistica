
export type Brand = 'ORANGE' | 'MASMOVIL';
export type Category = string;

export interface InventoryItem {
    id: string;
    code: string;
    material: string;
    family: string;
    value: number;
    hasSerialNumber: boolean;
    stock: number;
    lowStockThreshold: number;
    brand: Brand;
    category: Category;
}

export type UnitStatus = 'Almacén Central' | 'En Técnico' | 'Instalado' | 'Pendiente de Revisión' | 'En Reparación / RMA' | 'Defectuoso (De Baja)';

export interface SerializedUnit {
    serialNumber: string;
    itemId: string;
    status: UnitStatus;
    location: string;
}

export interface Albaran {
    id: string;
    technicianId: string;
    technicianName: string;
    date: Date;
    itemCount: number;
    brand: Brand;
}

export interface Technician {
    id: string;
    name: string;
    username: string;
    password?: string;
}

export type TransactionType = 'Entrada' | 'Asignación' | 'Instalación' | 'Devolución' | 'Traspaso' | 'Reporte Defectuoso' | 'Revisión Aprobada' | 'Enviado a RMA' | 'Dado de Baja';

export interface Transaction {
    id: string;
    type: TransactionType;
    itemId: string;
    serialNumber?: string;
    quantity?: number;
    from: string;
    to: string;
    date: Date;
}

export type View = 'dashboard' | 'transfer' | 'technicians' | 'audit' | 'returns' | 'admin';

export interface User {
    username: string;
    role: 'admin' | 'user';
}

export interface CartItem {
    code: string;
    material: string;
    serialNumber?: string;
    quantity?: number;
    itemId?: string;
}
