
import { GoogleGenAI } from "@google/genai";
import type { InventoryItem, SerializedUnit, Technician } from "../types";

// Always initialize GoogleGenAI with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = "gemini-3-flash-preview";

interface InventoryContext {
    items: InventoryItem[];
    units: SerializedUnit[];
    technicians: Technician[];
}

export async function queryGemini(
    userQuery: string,
    context: InventoryContext
): Promise<string> {
    const systemInstruction = `
Eres el sistema inteligente de gestión de inventario de ALTRITELECOM. Tu función es responder preguntas sobre el estado del inventario basándote en los datos JSON proporcionados.

Reglas de operación:
1.  Tu conocimiento se basa EXCLUSIVAMENTE en los datos JSON del inventario actual. No inventes información.
2.  Responde de forma concisa y directa a la pregunta del usuario.
3.  Utiliza los nombres de los materiales y técnicos de los datos.
4.  Si te preguntan por el stock de un material, diferencia entre el stock total y el que está en el "Almacén Central" (status: 'Almacén Central').
5.  Calcula totales, cuentas o encuentra información específica según se te pida.
6.  Responde siempre en español.

Ejemplo de pregunta: "¿Cuántos routers Livebox 6 nos quedan?"
Ejemplo de respuesta: "Actualmente hay un total de 5 unidades de 'Router ZTE Livebox 6s Wifi6'. De esas, 2 están en el Almacén Central, 2 están asignadas a técnicos y 1 ya ha sido instalada."
`;

    const prompt = `
Contexto de inventario (JSON):
${JSON.stringify(context, null, 2)}

Pregunta del usuario:
"${userQuery}"
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2,
            }
        });

        // The .text property is a getter, not a method. Access it directly as per guidelines.
        const text = response.text;
        if (text) {
            return text;
        } else {
             return "No he podido generar una respuesta. Por favor, intenta reformular tu pregunta.";
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "Hubo un error al contactar con el servicio de IA. Por favor, revisa la consola para más detalles.";
    }
}
