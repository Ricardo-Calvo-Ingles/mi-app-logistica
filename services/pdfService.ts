import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Technician } from '../types';

interface TransferredItemDetails {
    code: string;
    material: string;
    serialNumber?: string;
    quantity?: number;
}

const getNextAlbaranNumber = (): string => {
    let currentCounter = parseInt(localStorage.getItem('albaranCounter') || '0', 10);
    const newCounterValue = currentCounter + 1;
    localStorage.setItem('albaranCounter', newCounterValue.toString());
    const formattedCounter = newCounterValue.toString().padStart(5, '0');
    return `AL-${formattedCounter}`;
};


const populateDeliveryNote = (doc: jsPDF, technician: Technician, items: TransferredItemDetails[]): string => {
    const albaranId = getNextAlbaranNumber();
    const date = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Altri Telecom', 14, 22);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Logística de Materiales', 14, 28);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ALTRITELECOM S.L.', 140, 15);
    doc.text('Calle de la Innovación, 123', 140, 20);
    doc.text('28080 Madrid, España', 140, 25);
    doc.text('CIF: B12345678', 140, 30);
    
    const titleYPosition = 40;
    doc.setFontSize(16);
    doc.text('Albarán de Entrega', 14, titleYPosition);

    doc.setLineWidth(0.5);
    doc.line(14, titleYPosition + 2, 196, titleYPosition + 2);

    const detailsYPosition = titleYPosition + 12;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Número de Albarán:', 14, detailsYPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(albaranId, 55, detailsYPosition);

    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', 140, detailsYPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(date, 155, detailsYPosition);

    const recipientYPosition = detailsYPosition + 14;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DESTINATARIO (Técnico)', 14, recipientYPosition);
    doc.setLineWidth(0.2);
    doc.line(14, recipientYPosition + 1, 70, recipientYPosition + 1);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${technician.name}`, 14, recipientYPosition + 7);
    doc.text(`ID de Técnico: ${technician.id}`, 14, recipientYPosition + 13);

    const tableStartY = recipientYPosition + 22;
    const tableColumn = ["Código", "Material", "N.º de Serie / Cantidad"];
    const tableRows = items.map(item => {
        const detail = item.serialNumber ?? `x${item.quantity}`;
        return [item.code, item.material, detail];
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: tableStartY,
        theme: 'grid',
        headStyles: { fillColor: [239, 108, 0] }, // Altri Orange
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    
    doc.text('Firma del Técnico:', 14, finalY + 20);
    doc.line(50, finalY + 20, 120, finalY + 20);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('El técnico declara recibir el material descrito en este albarán en perfecto estado y para su uso profesional.', 14, finalY + 30);

    return albaranId;
}

/**
 * Generates and triggers a browser download for a delivery note PDF.
 */
export const generateDeliveryNotePDF = (technician: Technician, items: TransferredItemDetails[]) => {
    const doc = new jsPDF();
    const albaranId = populateDeliveryNote(doc, technician, items);
    const fileName = `Albaran_${albaranId}_${technician.name.replace(/\s/g, '_')}.pdf`;
    doc.save(fileName);
};

/**
 * Generates and opens a delivery note PDF in a new tab for previewing and printing.
 */
export const printDeliveryNotePDF = (technician: Technician, items: TransferredItemDetails[]) => {
    const doc = new jsPDF();
    populateDeliveryNote(doc, technician, items);
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
};