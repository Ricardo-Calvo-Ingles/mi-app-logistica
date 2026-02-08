
import type { InventoryItem, Technician, SerializedUnit } from '../types';

export const initialInventory: InventoryItem[] = [
    // =================================================================
    // ORANGE
    // =================================================================
    { id: 'item-o-1', code: '702452', material: 'ARCADYAN LIVEBOX INFINITY (XGSPON)', family: 'ORANGE - ROUTER', value: 123.09, hasSerialNumber: true, stock: 50, lowStockThreshold: 5, brand: 'ORANGE', category: 'Routers' },
    { id: 'item-o-2', code: '702424', material: 'ARCADYAN LIVEBOX 6', family: 'ORANGE - ROUTER', value: 52.67, hasSerialNumber: true, stock: 50, lowStockThreshold: 5, brand: 'ORANGE', category: 'Routers' },
    { id: 'item-o-3', code: '702441', material: 'ZTE F601 V7', family: 'ORANGE - ONT', value: 12.55, hasSerialNumber: true, stock: 50, lowStockThreshold: 10, brand: 'ORANGE', category: 'ONTs' },
    { id: 'item-o-4', code: '702471', material: 'KAON STB KSTB7259 ATV (2024)', family: 'ORANGE - STB (DECO)', value: 54.3, hasSerialNumber: true, stock: 50, lowStockThreshold: 3, brand: 'ORANGE', category: 'Decos' },
    { id: 'item-o-5', code: '611876', material: 'ACOMETIDA EXTERIOR 3M 030M', family: 'FAMILIA ACOMETIDA', value: 22.62, hasSerialNumber: false, stock: 50, lowStockThreshold: 20, brand: 'ORANGE', category: 'Acometidas' },
    { id: 'item-o-6', code: '702427', material: 'SERCOMM REPETIDOR WIFI 6', family: 'ORANGE - REPETIDOR', value: 39.82, hasSerialNumber: true, stock: 50, lowStockThreshold: 5, brand: 'ORANGE', category: 'Repetidores' },
    { id: 'item-o-7', code: '611895', material: 'CABLEADO NEBA DE 2MM Y 40M', family: 'FAMILIA ACOMETIDA', value: 2.53, hasSerialNumber: false, stock: 50, lowStockThreshold: 10, brand: 'ORANGE', category: 'Acometidas' },
    { id: 'item-o-27', code: '611886', material: 'ROSETA OPTICA FINAL', family: 'ORANGE ROSETA OPTICA', value: 1.41, hasSerialNumber: false, stock: 50, lowStockThreshold: 20, brand: 'ORANGE', category: 'Rosetas' },
    
    // =================================================================
    // MASMOVIL
    // =================================================================
    { id: 'item-m-1', code: 'R075L6SB2', material: 'Router ZTE LiveBox 6s Wifi6', family: 'MASMOVIL - INTREGA', value: 113.55, hasSerialNumber: true, stock: 50, lowStockThreshold: 5, brand: 'MASMOVIL', category: 'Routers' },
    { id: 'item-m-2', code: 'R075364W6', material: 'Router ZTE H3640 Wifi 6', family: 'MASMOVIL - NEBA 6', value: 0, hasSerialNumber: true, stock: 50, lowStockThreshold: 5, brand: 'MASMOVIL', category: 'Routers' },
    { id: 'item-m-3', code: 'RM23G01W8', material: 'ONT Nokia G-010G-P', family: 'MASMOVIL - ONT', value: 23.01, hasSerialNumber: true, stock: 50, lowStockThreshold: 5, brand: 'MASMOVIL', category: 'ONTs' },
    { id: 'item-m-4', code: '4910014', material: 'Acometidas int/ext Doble Cubierta 4,6 mm 60m', family: 'FAMILIA ACOMETIDA', value: 0, hasSerialNumber: false, stock: 50, lowStockThreshold: 10, brand: 'MASMOVIL', category: 'Acometidas' },
    { id: 'item-m-6', code: 'G050TVNN2', material: 'Decodificador TV Neutro', family: 'MASMOVIL - DESCO', value: 275.48, hasSerialNumber: true, stock: 50, lowStockThreshold: 4, brand: 'MASMOVIL', category: 'Decos' },
    { id: 'item-m-25', code: '4910049', material: 'Roseta Terminal Óptica', family: 'SIN DEFINIR', value: 83.07, hasSerialNumber: false, stock: 50, lowStockThreshold: 30, brand: 'MASMOVIL', category: 'Rosetas' },
];

export const initialTechnicians: Technician[] = [
    // Existing
    { id: 'tech-1', name: 'JUAN JOSE NAVAS', username: 'jnavas', password: 'password123' },
    { id: 'tech-2', name: 'SERGIO PICAZO DOMINGEZ', username: 'spicazo', password: 'password123' },
    { id: 'tech-3', name: 'BERNARDO RODRIGUEZ RODRIGUEZ', username: 'brodriguez', password: 'password123' },
    { id: 'tech-4', name: 'LUIS ALVAREZ RAMIREZ', username: 'lalvarez', password: 'password123' },
    { id: 'tech-5', name: 'ISMAEL ROA', username: 'iroa', password: 'password123' },
    // New from image
    { id: 'tech-6', name: 'ALVARO GARCIA', username: 'agarcia', password: 'password123' },
    { id: 'tech-7', name: 'FRANKELY JUNIOR FABIAN', username: 'ffabian', password: 'password123' },
    { id: 'tech-8', name: 'JUAN FELIPE JARA', username: 'fjara', password: 'password123' },
    { id: 'tech-9', name: 'ORLANDO HINOSTROZA', username: 'ohinostroza', password: 'password123' },
    { id: 'tech-10', name: 'RICARDO CALVO INGLES', username: 'ringles', password: 'password123' },
    { id: 'tech-11', name: 'JOHN EDWIN PARRA', username: 'jparra', password: 'password123' },
    { id: 'tech-12', name: 'ARNOLD VLADIMIR DIAZ', username: 'adiaz', password: 'password123' },
    { id: 'tech-13', name: 'EDWARD JIMENEZ', username: 'ejimenez', password: 'password123' },
    { id: 'tech-14', name: 'FRANCISCO JAVIER GALVEZ', username: 'fgalvez', password: 'password123' },
    { id: 'tech-15', name: 'CRISTIAN GOMEZ JURADO', username: 'cjurado', password: 'password123' },
    { id: 'tech-16', name: 'JOHN FREDY SORIA', username: 'jsoria', password: 'password123' },
];


// Generador de 50 unidades para cada item que tenga número de serie
const generateUnits = (inventory: InventoryItem[]): SerializedUnit[] => {
    const units: SerializedUnit[] = [];
    inventory.forEach(item => {
        if (item.hasSerialNumber) {
            for (let i = 1; i <= 50; i++) {
                units.push({
                    serialNumber: `${item.code}SN${String(i).padStart(4, '0')}`,
                    itemId: item.id,
                    status: 'Almacén Central',
                    location: 'Almacén Central'
                });
            }
        }
    });
    return units;
};

export const initialSerializedUnits: SerializedUnit[] = generateUnits(initialInventory);

export const modelData = {
  ORANGE: {
    'Routers': ["702424 - ARCADYAN LIVEBOX 6", "702478 - ARCADYAN LIVEBOX 7"],
    'Decos': ["702471 - KAON STB KSTB7259 ATV"],
    'ONTs': ["702441 - ZTE F601 V7"],
    'Acometidas': ["Acometida Exterior 30m", "Acometida Exterior 50m"]
  },
  MASMOVIL: {
    'Routers': ["R075L6SB2 - Router ZTE Livebox 6s Wifi6", "R075364W6 - Router ZTE H3640 Wifi 6"],
    'ONTs': ["RM23G01W8 - ONT Nokia G-010G-P"],
    'Decos': ["G050TVNN2 - Decodificador TV Neutro"],
    'Acometidas': ["4910014 - Acometida MasMovil 60m"]
  }
};
