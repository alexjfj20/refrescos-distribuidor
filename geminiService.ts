import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private static getAI() {
    let apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
    
    // TEMPORAL: Fallback para desarrollo
    if (!apiKey && import.meta.env.DEV) {
      console.warn('⚠️ Usando API key de desarrollo temporal. Configura VITE_GEMINI_API_KEY en .env');
      apiKey = 'AIzaSyC8your_actual_api_key_here'; // REEMPLAZAR CON TU KEY REAL DE GOOGLE AI STUDIO
    }
    
    if (!apiKey) {
      console.error('❌ API Key no encontrada');
      throw new Error('La API key de Gemini no está configurada. Verifica las variables de entorno.');
    }
    
    console.log('✅ API Key encontrada, inicializando GoogleGenerativeAI...');
    return new GoogleGenerativeAI(apiKey);
  }

  // Basic Text / Business Chat
  static async chatWithBusinessAI(message: string, history: any[] = []) {
    try {
      const genAI = this.getAI();
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      return {
        text: text || 'No se pudo generar una respuesta.',
        sources: []
      };
    } catch (error: any) {
      console.error('❌ Error en chatWithBusinessAI:', error);
      throw new Error(error.message || 'Error al conectar con la IA');
    }
  }

  // Low Latency FAQ
  static async quickFaq(question: string) {
    const genAI = this.getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text();
  }

  // Image Generation - NOTA: Gemini Pro no genera imágenes, solo analiza
  static async generateMarketingImage(prompt: string, size: '1K' | '2K' | '4K' = '1K') {
    throw new Error('La generación de imágenes requiere un modelo diferente (Imagen o DALL-E)');
  }

  // Image Analysis (Gemini Pro Vision)
  static async editProductImage(base64Image: string, prompt: string) {
    const genAI = this.getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const imageParts = [{
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: 'image/png'
      }
    }];
    
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return response.text();
  }

  // Video Generation - Requiere API diferente
  static async animatePoster(base64Image: string, prompt: string) {
    throw new Error('La generación de videos requiere Veo API (diferente SDK)');
  }

  // Map/Location search
  static async findNearbyDistributors(lat: number, lng: number) {
    const genAI = this.getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Basándote en las coordenadas ${lat}, ${lng}, sugiere tipos de lugares donde podría encontrar distribuidores de bebidas mayoristas o almacenes grandes relacionados con Refrescos Santander.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      text: response.text(),
      sources: []
    };
  }
}

// Audio Utils for Live API
export function decodeBase64Audio(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeAudio(bytes: Uint8Array) {
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
