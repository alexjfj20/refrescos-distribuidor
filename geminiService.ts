import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Interface for a cleaner return type
export interface ChatResponse {
  text: string;
  sources: any[]; // Keeping sources for future use, though currently empty
}

export class GeminiService {
  private static getGenAIInstance(apiKey: string): GoogleGenerativeAI {
    return new GoogleGenerativeAI(apiKey);
  }

  static async chatWithBusinessAI(message: string, history: any[] = []): Promise<ChatResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      console.error('❌ API Key de Gemini no encontrada en las variables de entorno.');
      return {
        text: '⚠️ El servicio de IA no está configurado. El administrador debe proveer una API key.',
        sources: []
      };
    }

    const modelsToTry: string[] = [
      "gemini-1.5-flash-latest",
      "gemini-pro",
      "gemini-1.5-pro-latest",
      "gemini-1.0-pro"
    ];

    try {
      const genAI = this.getGenAIInstance(apiKey);

      for (const modelName of modelsToTry) {
        try {
          console.log(`🔷 Intentando conectar con el modelo: ${modelName}...`);
          const model = genAI.getGenerativeModel({
            model: modelName,
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
          });

          const result = await model.generateContent(message);
          const response = result.response;
          const text = response.text();

          if (text) {
            console.log(`✅ Respuesta exitosa con modelo: ${modelName}`);
            return {
              text: text,
              sources: []
            };
          }
          console.warn(`⚠️ Modelo ${modelName} devolvió una respuesta vacía.`);
        } catch (error: any) {
          console.warn(`❌ Falló el modelo ${modelName}. Razón: ${error.message || 'Error desconocido'}. Intentando siguiente...`);
        }
      }

      console.error('🚫 Todos los modelos de IA fallaron. La API key podría ser inválida o no tener los permisos necesarios.');
      return {
        text: '⚠️ El servicio de IA está temporalmente no disponible. Verifique que su API key sea válida y tenga la API "Generative Language" habilitada en su proyecto de Google Cloud.',
        sources: []
      };

    } catch (error: any) {
      console.error('❌ Error fatal en el servicio de Gemini:', error);
      return {
        text: '❌ Error crítico al conectar con el servicio de IA. Por favor, revise la consola para más detalles.',
        sources: []
      };
    }
  }

  static async quickFaq(question: string): Promise<string> {
    const response = await this.chatWithBusinessAI(question);
    return response.text;
  }

  static async generateMarketingImage(prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<any> {
    throw new Error('La generación de imágenes requiere un modelo diferente');
  }

  static async editProductImage(base64Image: string, prompt: string): Promise<string> {
     const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
     if (!apiKey) { return 'Error: API Key no configurada.'; }
     
     try {
       const genAI = this.getGenAIInstance(apiKey);
       const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
       
       const imagePart = {
         inlineData: {
           data: base64Image.split(',')[1],
           mimeType: 'image/png'
         }
       };
       
       const result = await model.generateContent([prompt, imagePart]);
       return result.response.text();
       
     } catch (error: any) {
        console.error('❌ Error en editProductImage:', error);
        return 'No se pudo analizar la imagen. Verifique que el modelo "gemini-pro-vision" esté disponible.';
     }
  }

  static async animatePoster(base64Image: string, prompt: string): Promise<any> {
    throw new Error('La generación de videos requiere Veo API');
  }

  static async findNearbyDistributors(lat: number, lng: number): Promise<ChatResponse> {
    const prompt = `Basándote en las coordenadas ${lat}, ${lng}, sugiere tipos de lugares donde podría encontrar distribuidores de bebidas mayoristas.`;
    return this.chatWithBusinessAI(prompt);
  }
}

// Audio Utils for Live API
export function decodeBase64Audio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeAudio(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
